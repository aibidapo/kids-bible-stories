import { afterEach, describe, expect, it, vi } from "vitest";

const KEY = "bible-adventures:v1";

/** A tiny in-memory localStorage; `throwOnSet` mimics a full quota. */
function fakeStorage(initial: Record<string, string> = {}, throwOnSet = false) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: vi.fn((k: string, v: string) => {
      if (throwOnSet) throw new Error("QuotaExceededError");
      data.set(k, v);
    }),
    data,
  };
}

/** The store keeps module state, so every test gets a fresh copy of the module. */
async function freshStore() {
  vi.resetModules();
  return import("./store");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loading", () => {
  it("starts blank when there is no localStorage at all", async () => {
    const s = await freshStore();
    const p = await snapshot(s);
    expect(p).toMatchObject({
      mode: "little",
      calm: false,
      muted: false,
      narrate: true,
      found: {},
      stickers: [],
      completed: [],
      quizBest: {},
    });
  });

  it("merges a saved record onto the blank one so old saves still load", async () => {
    vi.stubGlobal("localStorage", fakeStorage({ [KEY]: JSON.stringify({ mode: "big" }) }));
    const s = await freshStore();
    const p = await snapshot(s);
    expect(p.mode).toBe("big");
    expect(p.stickers).toEqual([]);
  });

  it("falls back to blank on corrupt JSON", async () => {
    vi.stubGlobal("localStorage", fakeStorage({ [KEY]: "{not json" }));
    const s = await freshStore();
    expect((await snapshot(s)).mode).toBe("little");
  });

  it("inherits Calm from the OS reduced-motion preference", async () => {
    vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) });
    const s = await freshStore();
    expect((await snapshot(s)).calm).toBe(true);
  });
});

describe("settings persist", () => {
  it("writes every setter to localStorage under the versioned key", async () => {
    const storage = fakeStorage();
    vi.stubGlobal("localStorage", storage);
    const s = await freshStore();
    s.setMode("big");
    s.setCalm(true);
    s.setMutedPref(true);
    s.setNarrate(false);
    const saved = JSON.parse(storage.data.get(KEY)!);
    expect(saved).toMatchObject({ mode: "big", calm: true, muted: true, narrate: false });
    expect(storage.setItem).toHaveBeenCalledTimes(4);
  });

  it("keeps working for the session when the write fails", async () => {
    vi.stubGlobal("localStorage", fakeStorage({}, true));
    const s = await freshStore();
    expect(() => s.setMode("big")).not.toThrow();
    expect((await snapshot(s)).mode).toBe("big");
  });
});

describe("recordFound", () => {
  it("records the tap and hands out the sticker the first time only", async () => {
    const s = await freshStore();
    expect(s.recordFound("noah", "dove", "olive", "Olive Leaf")).toBe("Olive Leaf");
    expect(s.foundIn(await snapshot(s), "noah", "dove")).toEqual(["olive"]);
    expect(s.recordFound("noah", "dove", "olive", "Olive Leaf")).toBeNull();
    expect(s.foundIn(await snapshot(s), "noah", "dove")).toEqual(["olive"]);
  });

  it("records a second hotspot but not a sticker already owned", async () => {
    const s = await freshStore();
    s.recordFound("noah", "dove", "olive", "Olive Leaf");
    expect(s.recordFound("noah", "ark", "window", "Olive Leaf")).toBeNull();
    const p = await snapshot(s);
    expect(s.foundIn(p, "noah", "ark")).toEqual(["window"]);
    expect(p.stickers).toEqual(["Olive Leaf"]);
  });

  it("works for a hotspot without a sticker and an unknown scene", async () => {
    const s = await freshStore();
    expect(s.recordFound("david", "meadow", "sheep")).toBeNull();
    const p = await snapshot(s);
    expect(s.foundIn(p, "david", "meadow")).toEqual(["sheep"]);
    expect(s.foundIn(p, "david", "nowhere")).toEqual([]);
    expect(s.foundIn(p, "jonah", "storm")).toEqual([]);
  });
});

describe("completion and quiz", () => {
  it("marks a story completed once", async () => {
    const storage = fakeStorage();
    vi.stubGlobal("localStorage", storage);
    const s = await freshStore();
    s.markCompleted("daniel");
    s.markCompleted("daniel");
    expect((await snapshot(s)).completed).toEqual(["daniel"]);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("keeps only the best quiz score per story and writes only when it improves", async () => {
    const storage = fakeStorage();
    vi.stubGlobal("localStorage", storage);
    const s = await freshStore();
    s.recordQuiz("daniel", 2);
    s.recordQuiz("daniel", 1);
    expect((await snapshot(s)).quizBest.daniel).toBe(2);
    s.recordQuiz("daniel", 3);
    expect((await snapshot(s)).quizBest.daniel).toBe(3);
    s.recordQuiz("daniel", 3);
    expect((await snapshot(s)).quizBest.daniel).toBe(3);
    // 2 and 3 were improvements; 1 and the repeated 3 must not touch storage.
    expect(storage.setItem).toHaveBeenCalledTimes(2);
  });

  it("resetProgress clears the child's progress but keeps the grown-up settings", async () => {
    const s = await freshStore();
    s.setMode("big");
    s.setCalm(true);
    s.recordFound("noah", "dove", "olive", "Olive Leaf");
    s.markCompleted("noah");
    s.recordQuiz("noah", 2);
    s.resetProgress();
    const p = await snapshot(s);
    expect(p).toMatchObject({ mode: "big", calm: true, found: {}, stickers: [], completed: [] });
    expect(p.quizBest).toEqual({});
  });
});

/** Reads the current state through the same subscription the hook uses. */
async function snapshot(s: typeof import("./store")) {
  // useProgress is a React hook; outside React, render it through react-dom/server.
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createElement } = await import("react");
  let seen: import("./store").Progress | undefined;
  function Probe() {
    seen = s.useProgress();
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  return seen!;
}
