// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { Settings } from "./Settings";
import {
  recordQuiz,
  resetProgress,
  setCalm,
  setMode,
  setMutedPref,
  setNarrate,
  useProgress,
} from "../lib/store";
import { isMuted } from "../lib/sound";

function progress() {
  return renderHook(() => useProgress()).result.current;
}

beforeEach(() => {
  resetProgress();
  setMode("little");
  setNarrate(true);
  setMutedPref(false);
  setCalm(false);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Settings", () => {
  it("switches the reading level", () => {
    render(<Settings onClose={() => {}} />);
    const big = screen.getByRole("button", { name: /^Big/ });
    fireEvent.click(big);
    expect(progress().mode).toBe("big");
    expect(big.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: /^Little/ }));
    expect(progress().mode).toBe("little");
  });

  it("toggles narration, sound effects and Calm mode, and mutes the synth with the sound toggle", () => {
    render(<Settings onClose={() => {}} />);
    fireEvent.click(screen.getByLabelText(/Read pages aloud/));
    expect(progress().narrate).toBe(false);
    fireEvent.click(screen.getByLabelText(/Sound effects/));
    expect(progress().muted).toBe(true);
    expect(isMuted()).toBe(true);
    fireEvent.click(screen.getByLabelText(/Calm mode/));
    expect(progress().calm).toBe(true);
  });

  it("closes on Escape, the close button and the scrim", () => {
    const onClose = vi.fn();
    render(<Settings onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.click(screen.getAllByRole("button", { name: "Close settings" })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: "Close settings" })[1]);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("clears progress only after the grown-up confirms", () => {
    recordQuiz("daniel", 3);
    const confirm = vi.fn(() => false);
    Object.assign(window, { confirm });
    render(<Settings onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear progress" }));
    expect(progress().quizBest.daniel).toBe(3);
    confirm.mockImplementation(() => true);
    fireEvent.click(screen.getByRole("button", { name: "Clear progress" }));
    expect(progress().quizBest.daniel).toBeUndefined();
  });
});
