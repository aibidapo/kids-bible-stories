// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FamilyTime } from "./FamilyTime";
import { daniel } from "../data/stories/daniel";
import { readAloudScript } from "../lib/devotional";
import { resetProgress, setMode } from "../lib/store";

function fakeSpeech() {
  const spoken: SpeechSynthesisUtterance[] = [];
  const synth = {
    getVoices: () => [],
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    cancel: vi.fn(),
    speak: vi.fn((u: SpeechSynthesisUtterance) => spoken.push(u)),
  };
  class Utterance {
    text: string;
    rate = 1;
    pitch = 1;
    onstart: (() => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onboundary: unknown = null;
    constructor(text: string) {
      this.text = text;
    }
  }
  Object.assign(window, { speechSynthesis: synth, SpeechSynthesisUtterance: Utterance });
  return { synth, spoken };
}

beforeEach(() => {
  resetProgress();
  setMode("little");
});
afterEach(() => {
  cleanup();
  delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
  delete (window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance;
});

describe("FamilyTime, Read to me", () => {
  it("reads the whole card at the little pace, then stops on a second tap", () => {
    const { synth, spoken } = fakeSpeech();
    render(<FamilyTime story={daniel} onDone={() => {}} />);
    const read = screen.getByRole("button", { name: "Read this to me" });
    fireEvent.click(read);
    expect(spoken).toHaveLength(1);
    expect(spoken[0].text).toBe(readAloudScript(daniel, "little"));
    expect(spoken[0].rate).toBe(0.85);

    act(() => spoken[0].onstart?.({} as SpeechSynthesisEvent));
    const stop = screen.getByRole("button", { name: "Stop reading" });
    const cancels = synth.cancel.mock.calls.length;
    fireEvent.click(stop);
    expect(synth.cancel.mock.calls.length).toBeGreaterThan(cancels);
    expect(screen.getByRole("button", { name: "Read this to me" })).toBeTruthy();
  });

  it("uses the big pace in big mode and Done goes home", () => {
    const { spoken } = fakeSpeech();
    setMode("big");
    const onDone = vi.fn();
    render(<FamilyTime story={daniel} onDone={onDone} />);
    fireEvent.click(screen.getByRole("button", { name: "Read this to me" }));
    expect(spoken[0].rate).toBe(0.95);
    expect(spoken[0].text).toContain(daniel.devotional.question.big);
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onDone).toHaveBeenCalled();
  });
});
