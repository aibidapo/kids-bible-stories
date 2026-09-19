// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { StoryPlayer } from "./StoryPlayer";
import { daniel } from "../data/stories/daniel";
import {
  recordFound,
  resetProgress,
  setMode,
  setMutedPref,
  setNarrate,
  useProgress,
} from "../lib/store";

function progress() {
  return renderHook(() => useProgress()).result.current;
}

const noop = () => {};

beforeEach(() => {
  resetProgress();
  setMode("little");
  setNarrate(false);
  setMutedPref(true);
});
afterEach(cleanup);

describe("StoryPlayer", () => {
  it("shows the page text at the current level, the page dots and the hunt prompt", () => {
    const den = daniel.scenes.findIndex((s) => s.id === "prays");
    render(<StoryPlayer story={daniel} index={den} onIndex={noop} onQuiz={noop} onHome={noop} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(daniel.title);
    expect(screen.getByLabelText(`Page ${den + 1} of ${daniel.scenes.length}`)).toBeTruthy();
    const words = daniel.scenes[den].text.little.split(/\s+/);
    expect(document.querySelector(".narration")!.textContent!.trim()).toBe(words.join(" "));
    expect(screen.getByText(daniel.scenes[den].find!.prompt)).toBeTruthy();
  });

  it("drops the hunt prompt once every target is found and shows the verse in big mode", () => {
    const den = daniel.scenes.findIndex((s) => s.id === "prays");
    for (const t of daniel.scenes[den].find!.targets) recordFound("daniel", "prays", t);
    setMode("big");
    render(<StoryPlayer story={daniel} index={den} onIndex={noop} onQuiz={noop} onHome={noop} />);
    expect(screen.queryByText(daniel.scenes[den].find!.prompt)).toBeNull();
    expect(screen.getByText(daniel.scenes[den].verse!)).toBeTruthy();
  });

  it("pages with Next, Back, the dots and the arrow keys", () => {
    const onIndex = vi.fn();
    render(<StoryPlayer story={daniel} index={1} onIndex={onIndex} onQuiz={noop} onHome={noop} />);
    fireEvent.click(screen.getByRole("button", { name: "Next →" }));
    expect(onIndex).toHaveBeenLastCalledWith(2);
    fireEvent.click(screen.getByRole("button", { name: "← Back" }));
    expect(onIndex).toHaveBeenLastCalledWith(0);
    fireEvent.click(screen.getByRole("button", { name: "Page 4" }));
    expect(onIndex).toHaveBeenLastCalledWith(3);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(onIndex).toHaveBeenLastCalledWith(2);
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(onIndex).toHaveBeenLastCalledWith(0);
  });

  it("disables Back on the first page and Finish marks the story done and opens the quiz", () => {
    const onQuiz = vi.fn();
    const last = daniel.scenes.length - 1;
    const { unmount } = render(
      <StoryPlayer story={daniel} index={0} onIndex={noop} onQuiz={onQuiz} onHome={noop} />,
    );
    expect((screen.getByRole("button", { name: "← Back" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    unmount();
    render(
      <StoryPlayer story={daniel} index={last} onIndex={noop} onQuiz={onQuiz} onHome={noop} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Finish →" }));
    expect(onQuiz).toHaveBeenCalledTimes(1);
    expect(progress().completed).toContain("daniel");
  });

  it("goes home and disables Read to me when the device cannot speak", () => {
    const onHome = vi.fn();
    render(<StoryPlayer story={daniel} index={0} onIndex={noop} onQuiz={noop} onHome={onHome} />);
    fireEvent.click(screen.getByRole("button", { name: "Back to the stories" }));
    expect(onHome).toHaveBeenCalled();
    expect(
      (screen.getByRole("button", { name: "Read this page to me" }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("pops a sticker banner when a hotspot earns one", () => {
    const den = daniel.scenes.findIndex((s) => s.id === "prays");
    const spot = daniel.scenes[den].hotspots!.find((h) => h.sticker)!;
    render(<StoryPlayer story={daniel} index={den} onIndex={noop} onQuiz={noop} onHome={noop} />);
    fireEvent.click(screen.getByRole("button", { name: `Find ${spot.label}` }));
    expect(document.querySelector(".sticker-pop")!.textContent).toContain(spot.sticker);
  });
});

describe("StoryPlayer, group pilot", () => {
  it("counts a page arrival only while the pilot switch is on", async () => {
    const log = await import("../lib/pilotLog");
    log.clear();
    render(<StoryPlayer story={daniel} index={2} onIndex={noop} onQuiz={noop} onHome={noop} />);
    expect(log.summary()).toEqual([]);
    cleanup();
    log.setEnabled(true);
    render(<StoryPlayer story={daniel} index={2} onIndex={noop} onQuiz={noop} onHome={noop} />);
    expect(log.summary().map((c) => `${c.kind}:${c.key}:${c.count}`)).toEqual(["page:daniel/2:1"]);
    log.clear();
  });
});

function fakeSpeech() {
  const spoken: { text: string; rate: number }[] = [];
  const synth = {
    getVoices: () => [],
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    cancel: vi.fn(),
    speak: vi.fn((u: { text: string; rate: number }) => spoken.push(u)),
  };
  class Utterance {
    text: string;
    rate = 1;
    pitch = 1;
    onstart: unknown = null;
    onend: unknown = null;
    onerror: unknown = null;
    onboundary: unknown = null;
    constructor(text: string) {
      this.text = text;
    }
  }
  Object.assign(window, { speechSynthesis: synth, SpeechSynthesisUtterance: Utterance });
  return { synth, spoken };
}

describe("StoryPlayer narration", () => {
  afterEach(() => {
    // Unmount while the fake engine still exists: the hook removes its listener on teardown.
    cleanup();
    delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
    delete (window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance;
    vi.useRealTimers();
  });

  it("reads a new page aloud after a short pause while narration is on", () => {
    vi.useFakeTimers();
    const { spoken } = fakeSpeech();
    setNarrate(true);
    setMutedPref(false);
    render(<StoryPlayer story={daniel} index={0} onIndex={noop} onQuiz={noop} onHome={noop} />);
    expect(spoken).toHaveLength(0);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(spoken).toHaveLength(1);
    expect(spoken[0].text).toBe(daniel.scenes[0].text.little);
    expect(spoken[0].rate).toBe(0.82);
  });

  it("reads the page on demand from the speaker button", () => {
    const { spoken } = fakeSpeech();
    render(<StoryPlayer story={daniel} index={1} onIndex={noop} onQuiz={noop} onHome={noop} />);
    const read = screen.getByRole("button", { name: "Read this page to me" }) as HTMLButtonElement;
    expect(read.disabled).toBe(false);
    fireEvent.click(read);
    expect(spoken).toHaveLength(1);
    expect(spoken[0].text).toBe(daniel.scenes[1].text.little);
  });
});

describe("story art loading", () => {
  it("shows the not-on-this-device page offline when the story is only partly on the device", async () => {
    const { loadStory } = await import("../scenes");
    const downloads = await import("../lib/downloads");
    await loadStory("daniel");
    downloads.resetDownloads();
    Object.defineProperty(globalThis, "caches", {
      value: {
        open: async () => ({
          match: async (u: string) => (u === "/d1" ? new Response("x") : undefined),
        }),
      },
      configurable: true,
    });
    await act(() =>
      downloads.refresh({ daniel: { files: ["/d1", "/d2"], bytes: 10 } }, "creation"),
    );
    const online = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    render(<StoryPlayer story={daniel} index={0} onIndex={noop} onQuiz={noop} onHome={noop} />);
    expect(screen.getByText("This story is not on this device yet.")).toBeTruthy();
    online.mockReturnValue(true);
    cleanup();
    render(<StoryPlayer story={daniel} index={0} onIndex={noop} onQuiz={noop} onHome={noop} />);
    expect(screen.queryByText("This story is not on this device yet.")).toBeNull();
    online.mockRestore();
    downloads.resetDownloads();
  });

  it("renders the stage once the story's chunk has loaded, and starts ready when the art is already registered", async () => {
    const { loadStory } = await import("../scenes");
    await loadStory("daniel");
    const { unmount } = render(
      <StoryPlayer story={daniel} index={0} onIndex={noop} onQuiz={noop} onHome={noop} />,
    );
    expect(document.querySelector(".stage__svg")).toBeTruthy();
    expect(screen.queryByText("This story is not on this device yet.")).toBeNull();
    unmount();
  });

  it("ignores a load that settles after the player has unmounted", async () => {
    vi.resetModules();
    let settle: () => void = () => {};
    vi.doMock("../scenes", () => ({
      getSceneArt: () => undefined,
      loadStory: () =>
        new Promise<void>((_r, reject) => (settle = () => reject(new Error("late")))),
    }));
    const { StoryPlayer: Player } = await import("./StoryPlayer");
    const { unmount } = render(
      <Player story={daniel} index={0} onIndex={noop} onQuiz={noop} onHome={noop} />,
    );
    unmount();
    await act(async () => {
      settle();
    });
    expect(screen.queryByText("This story is not on this device yet.")).toBeNull();
    vi.doUnmock("../scenes");
  });

  it("shows the not-on-this-device page when the story's chunk cannot be loaded", async () => {
    vi.resetModules();
    vi.doMock("../scenes", () => ({
      getSceneArt: () => undefined,
      loadStory: () => Promise.reject(new Error("offline")),
    }));
    const { StoryPlayer: Player } = await import("./StoryPlayer");
    const onHome = vi.fn();
    render(<Player story={daniel} index={0} onIndex={noop} onQuiz={noop} onHome={onHome} />);
    expect(await screen.findByText("This story is not on this device yet.")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Back to the stories" })[1]);
    expect(onHome).toHaveBeenCalled();
    vi.doUnmock("../scenes");
  });
});
