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

  it("shows the scripture translation notice", () => {
    render(<Settings onClose={() => {}} />);
    expect(screen.getByText(/New International Version/)).toBeTruthy();
    expect(screen.getByText(/Biblica/)).toBeTruthy();
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

describe("Settings, group pilot", () => {
  it("is off by default, switches on, copies the log and clears it", async () => {
    const { isEnabled, record, summary } = await import("../lib/pilotLog");
    const writeText = vi.fn(async (_text: string) => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<Settings onClose={() => {}} />);
    expect(isEnabled()).toBe(false);
    expect(screen.queryByRole("button", { name: "Copy log" })).toBeNull();

    fireEvent.click(screen.getByLabelText(/Keep a usage count/));
    expect(isEnabled()).toBe(true);
    record("page", "daniel/0");
    expect(summary()).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Copy log" }));
    await screen.findByRole("button", { name: "Copied" });
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toContain("page\tdaniel/0\t1");

    fireEvent.click(screen.getByRole("button", { name: "Clear log" }));
    expect(isEnabled()).toBe(false);
    expect(summary()).toEqual([]);
    expect(screen.queryByRole("button", { name: "Copy log" })).toBeNull();
  });
});

describe("Settings, group pilot without clipboard permission", () => {
  it("falls back to a selectable box and still reports Copied", async () => {
    const { setEnabled } = await import("../lib/pilotLog");
    setEnabled(true);
    const writeText = vi.fn(async (_text: string) => {
      throw new Error("denied");
    });
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const execCommand = vi.fn(() => true);
    Object.defineProperty(document, "execCommand", { value: execCommand, configurable: true });
    render(<Settings onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy log" }));
    await screen.findByRole("button", { name: "Copied" });
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).toBeNull();
    setEnabled(false);
  });
});
