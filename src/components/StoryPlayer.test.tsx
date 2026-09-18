// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
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
