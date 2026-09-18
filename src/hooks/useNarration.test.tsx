// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { splitWords, useNarration } from "./useNarration";

/** A fake speech engine that records utterances and lets a test drive their events. */
function fakeSpeech() {
  const spoken: SpeechSynthesisUtterance[] = [];
  const synth = {
    getVoices: () => [
      { lang: "fr-FR", localService: true, name: "Amelie" },
      { lang: "en-GB", localService: false, name: "Cloud" },
      { lang: "en-US", localService: true, name: "Local" },
    ],
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    cancel: vi.fn(),
    speak: vi.fn((u: SpeechSynthesisUtterance) => spoken.push(u)),
  };
  class Utterance {
    text: string;
    rate = 1;
    pitch = 1;
    voice: unknown = null;
    onstart: (() => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onboundary: ((e: { name: string; charIndex: number }) => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
  }
  Object.assign(window, { speechSynthesis: synth, SpeechSynthesisUtterance: Utterance });
  return { synth, spoken };
}

afterEach(() => {
  cleanup();
  // happy-dom's window persists across tests in a file; remove what we added.
  delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
  delete (window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance;
});

describe("splitWords", () => {
  it("returns each word with its character offsets", () => {
    expect(splitWords("Go,  Jonah!")).toEqual([
      { text: "Go,", start: 0, end: 3 },
      { text: "Jonah!", start: 5, end: 11 },
    ]);
    expect(splitWords("")).toEqual([]);
  });
});

describe("useNarration", () => {
  it("reports unsupported and does nothing without speechSynthesis", () => {
    const { result } = renderHook(() => useNarration());
    expect(result.current.supported).toBe(false);
    act(() => result.current.speak("hello"));
    expect(result.current.speaking).toBe(false);
  });

  it("speaks with a local English voice and follows word boundaries", () => {
    const { synth, spoken } = fakeSpeech();
    const { result } = renderHook(() => useNarration());
    expect(result.current.supported).toBe(true);

    act(() => result.current.speak("Daniel loved God.", 0.8));
    expect(synth.cancel).toHaveBeenCalled();
    expect(spoken).toHaveLength(1);
    const u = spoken[0];
    expect(u.rate).toBe(0.8);
    expect((u.voice as { name: string }).name).toBe("Local");

    act(() => u.onstart?.({} as SpeechSynthesisEvent));
    expect(result.current.speaking).toBe(true);
    act(() => u.onboundary?.({ name: "word", charIndex: 7 } as SpeechSynthesisEvent));
    expect(result.current.charIndex).toBe(7);
    act(() => u.onend?.({} as SpeechSynthesisEvent));
    expect(result.current.speaking).toBe(false);
    expect(result.current.charIndex).toBe(-1);
  });

  it("stop cancels the engine and clears state; unmount cancels too", () => {
    const { synth, spoken } = fakeSpeech();
    const { result, unmount } = renderHook(() => useNarration());
    act(() => result.current.speak("x"));
    act(() => spoken[0].onstart?.({} as SpeechSynthesisEvent));
    expect(result.current.speaking).toBe(true);
    act(() => result.current.stop());
    expect(result.current.speaking).toBe(false);
    const calls = synth.cancel.mock.calls.length;
    unmount();
    expect(synth.cancel.mock.calls.length).toBeGreaterThan(calls);
  });

  it("ignores an empty text", () => {
    const { spoken } = fakeSpeech();
    const { result } = renderHook(() => useNarration());
    act(() => result.current.speak(""));
    expect(spoken).toHaveLength(0);
  });
});
