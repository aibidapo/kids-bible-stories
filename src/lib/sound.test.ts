import { afterEach, describe, expect, it, vi } from "vitest";
import type { SoundName } from "../types";

/**
 * A recording stand-in for the Web Audio graph. It keeps every node, edge,
 * parameter automation and start/stop call so tests can check the shape of
 * what each effect builds, and it throws where a real AudioParam would.
 */
type Automation = { param: string; value: number; time: number; ramp: boolean };

class FakeParam {
  value = 0;
  constructor(
    private name: string,
    private log: Automation[],
  ) {}
  setValueAtTime(value: number, time: number) {
    this.log.push({ param: this.name, value, time, ramp: false });
  }
  exponentialRampToValueAtTime(value: number, time: number) {
    // Real browsers throw a RangeError for a non-positive target.
    if (value <= 0) throw new RangeError(`exponential ramp to ${value}`);
    this.log.push({ param: this.name, value, time, ramp: true });
  }
}

class FakeNode {
  type = "";
  buffer: unknown = null;
  frequency: FakeParam;
  gain: FakeParam;
  Q: FakeParam;
  connectedTo: FakeNode[] = [];
  started: number | null = null;
  stopped: number | null = null;
  automation: Automation[] = [];
  constructor(public kind: string) {
    this.frequency = new FakeParam("frequency", this.automation);
    this.gain = new FakeParam("gain", this.automation);
    this.Q = new FakeParam("Q", this.automation);
  }
  connect(next: FakeNode) {
    this.connectedTo.push(next);
    return next;
  }
  start(t: number) {
    this.started = t;
  }
  stop(t: number) {
    this.stopped = t;
  }
}

function fakeContext(state: "running" | "suspended" = "running") {
  const nodes: FakeNode[] = [];
  const make = (kind: string) => {
    const n = new FakeNode(kind);
    nodes.push(n);
    return n;
  };
  const ac = {
    state,
    currentTime: 1,
    sampleRate: 800,
    destination: new FakeNode("destination"),
    resume: vi.fn(async () => {
      ac.state = "running";
    }),
    createOscillator: () => make("osc"),
    createGain: () => make("gain"),
    createBufferSource: () => make("noise"),
    createBiquadFilter: () => make("filter"),
    createBuffer: (_ch: number, frames: number) => ({
      getChannelData: () => new Float32Array(frames),
    }),
    nodes,
    sources: () => nodes.filter((n) => n.kind === "osc" || n.kind === "noise"),
  };
  return ac;
}

/** Installs a window whose AudioContext hands out the given fake. */
function installWindow(ac: ReturnType<typeof fakeContext> | null, key = "AudioContext") {
  const ctor = vi.fn(function () {
    return ac;
  });
  vi.stubGlobal("window", ac ? { [key]: ctor } : {});
  return ctor;
}

async function freshSound() {
  vi.resetModules();
  return import("./sound");
}

/** Follows connect() edges from a node; true if the chain ends at the speakers. */
function reachesDestination(n: FakeNode, dest: FakeNode): boolean {
  if (n === dest) return true;
  return n.connectedTo.some((m) => reachesDestination(m, dest));
}

afterEach(() => vi.unstubAllGlobals());

const ALL: SoundName[] = [
  "chime",
  "sparkle",
  "splash",
  "thunder",
  "roar",
  "sheep",
  "bird",
  "whoosh",
  "cheer",
  "knock",
];

describe("environment guards", () => {
  it("does nothing without a window (server render)", async () => {
    const s = await freshSound();
    expect(() => s.play("chime")).not.toThrow();
  });

  it("does nothing when the browser has no AudioContext", async () => {
    installWindow(null);
    const s = await freshSound();
    expect(() => s.play("chime")).not.toThrow();
  });

  it("falls back to webkitAudioContext", async () => {
    const ac = fakeContext();
    const ctor = installWindow(ac, "webkitAudioContext");
    const s = await freshSound();
    s.play("chime");
    expect(ctor).toHaveBeenCalledTimes(1);
    expect(ac.sources().length).toBeGreaterThan(0);
  });

  it("creates one context and reuses it across calls", async () => {
    const ctor = installWindow(fakeContext());
    const s = await freshSound();
    s.play("chime");
    s.play("bird");
    s.playCorrect();
    expect(ctor).toHaveBeenCalledTimes(1);
  });

  it("resumes a suspended context (iOS) before playing", async () => {
    const ac = fakeContext("suspended");
    installWindow(ac);
    const s = await freshSound();
    s.play("knock");
    expect(ac.resume).toHaveBeenCalledTimes(1);
    expect(ac.sources().length).toBeGreaterThan(0);
  });
});

describe("mute", () => {
  it("is off by default, toggles, and silences every entry point", async () => {
    const ac = fakeContext();
    installWindow(ac);
    const s = await freshSound();
    expect(s.isMuted()).toBe(false);
    s.setMuted(true);
    expect(s.isMuted()).toBe(true);
    s.play("cheer");
    s.playCorrect();
    s.playTryAgain();
    expect(ac.nodes).toEqual([]);
    s.setMuted(false);
    s.play("cheer");
    expect(ac.nodes.length).toBeGreaterThan(0);
  });
});

describe("every effect builds a valid graph", () => {
  for (const name of ALL) {
    it(name, async () => {
      const ac = fakeContext();
      installWindow(ac);
      const s = await freshSound();
      s.play(name);
      const sources = ac.sources();
      expect(sources.length).toBeGreaterThan(0);
      for (const src of sources) {
        expect(src.started).not.toBeNull();
        expect(src.stopped).toBeGreaterThan(src.started!);
        expect(src.started).toBeGreaterThanOrEqual(ac.currentTime);
        expect(reachesDestination(src, ac.destination)).toBe(true);
      }
      // Every gain node has an attack ramp and a decay ramp, both above zero
      // (the fake throws on a zero target, as a browser would).
      for (const g of ac.nodes.filter((n) => n.kind === "gain")) {
        const ramps = g.automation.filter((a) => a.ramp);
        expect(ramps.length).toBe(2);
        expect(ramps[0].time).toBeLessThan(ramps[1].time);
        expect(ramps[0].value).toBeGreaterThan(ramps[1].value);
      }
      // Frequencies are audible, never zero or negative.
      for (const a of ac.nodes
        .flatMap((n) => n.automation)
        .filter((a) => a.param === "frequency")) {
        expect(a.value).toBeGreaterThan(0);
      }
    });
  }

  it("sparkle plays the five pentatonic notes an octave up, staggered", async () => {
    const ac = fakeContext();
    installWindow(ac);
    const s = await freshSound();
    s.play("sparkle");
    const oscs = ac.sources();
    expect(oscs).toHaveLength(5);
    const freqs = oscs.map((o) => o.automation.find((a) => a.param === "frequency")!.value);
    expect(freqs).toEqual([523.25, 587.33, 659.25, 783.99, 880.0].map((f) => f * 2));
    const starts = oscs.map((o) => o.started!);
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
    expect(new Set(starts).size).toBe(5);
  });

  it("thunder and roar are noise-based; chime is pure tones", async () => {
    for (const [name, kinds] of [
      ["thunder", ["noise", "osc"]],
      ["roar", ["osc", "noise"]],
      ["chime", ["osc", "osc"]],
    ] as const) {
      const ac = fakeContext();
      installWindow(ac);
      const s = await freshSound();
      s.play(name);
      expect(ac.sources().map((n) => n.kind)).toEqual(kinds);
    }
  });
});

describe("quiz feedback", () => {
  it("playCorrect rises through three notes", async () => {
    const ac = fakeContext();
    installWindow(ac);
    const s = await freshSound();
    s.playCorrect();
    const freqs = ac.sources().map((o) => o.automation.find((a) => a.param === "frequency")!.value);
    expect(freqs).toHaveLength(3);
    expect(freqs[0]).toBeLessThan(freqs[1]);
    expect(freqs[1]).toBeLessThan(freqs[2]);
  });

  it("playTryAgain dips gently: two notes, the second lower and quieter", async () => {
    const ac = fakeContext();
    installWindow(ac);
    const s = await freshSound();
    s.playTryAgain();
    const oscs = ac.sources();
    expect(oscs).toHaveLength(2);
    const freq = (o: FakeNode) => o.automation.find((a) => a.param === "frequency")!.value;
    expect(freq(oscs[1])).toBeLessThan(freq(oscs[0]));
    const gains = ac.nodes.filter((n) => n.kind === "gain");
    const peak = (g: FakeNode) => g.automation.find((a) => a.ramp)!.value;
    expect(peak(gains[1])).toBeLessThan(peak(gains[0]));
    // Quiet, never a buzzer: peaks well under full scale.
    expect(peak(gains[0])).toBeLessThan(0.25);
  });
});
