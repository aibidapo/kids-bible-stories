// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Quiz } from "./Quiz";
import { daniel } from "../data/stories/daniel";
import { resetProgress, setMode, setMutedPref, useProgress } from "../lib/store";
import { renderHook } from "@testing-library/react";

function progress() {
  return renderHook(() => useProgress()).result.current;
}

/** Finds the right answer for whatever question is on screen, whatever the shuffle did. */
function rightChoice(): HTMLButtonElement {
  const heading = screen.getByRole("heading", { level: 2 }).textContent;
  const q = daniel.quiz.find((x) => x.question === heading)!;
  return screen.getByRole("button", { name: q.choices[q.answerIndex] });
}

function wrongChoice(): HTMLButtonElement {
  const heading = screen.getByRole("heading", { level: 2 }).textContent;
  const q = daniel.quiz.find((x) => x.question === heading)!;
  const wrong = q.choices.find((_, i) => i !== q.answerIndex)!;
  return screen.getByRole("button", { name: wrong });
}

beforeEach(() => {
  resetProgress();
  setMode("little");
  setMutedPref(true);
});
afterEach(cleanup);

describe("Quiz", () => {
  it("asks only the little questions in little mode, and all of them in big mode", () => {
    const little = daniel.quiz.filter((q) => q.level === "little").length;
    render(<Quiz story={daniel} onDone={() => {}} onFamily={() => {}} />);
    expect(screen.getByText(`Question 1 of ${little}`)).toBeTruthy();
    cleanup();
    setMode("big");
    render(<Quiz story={daniel} onDone={() => {}} onFamily={() => {}} />);
    expect(screen.getByText(`Question 1 of ${daniel.quiz.length}`)).toBeTruthy();
  });

  it("greys a wrong tap with a kind nudge and never fails the child", () => {
    render(<Quiz story={daniel} onDone={() => {}} onFamily={() => {}} />);
    const wrong = wrongChoice();
    fireEvent.click(wrong);
    expect(wrong.disabled).toBe(true);
    expect(wrong.className).toContain("is-wrong");
    expect(screen.getByText(/have another go/i)).toBeTruthy();
    expect(screen.getByText(/Question 1 of/)).toBeTruthy();
  });

  it("advances on the right tap, scores first-time-right only, and records the best", () => {
    const onDone = vi.fn();
    const onFamily = vi.fn();
    render(<Quiz story={daniel} onDone={onDone} onFamily={onFamily} />);
    const total = daniel.quiz.filter((q) => q.level === "little").length;
    // First question: miss once, then hit (does not count). The rest: hit first time.
    fireEvent.click(wrongChoice());
    fireEvent.click(rightChoice());
    for (let i = 1; i < total; i++) fireEvent.click(rightChoice());

    expect(screen.getByText("Well done!")).toBeTruthy();
    expect(screen.getByText(`You got ${total - 1} of ${total} right first time.`)).toBeTruthy();
    expect(screen.getByText(daniel.lesson.little)).toBeTruthy();
    expect(progress().quizBest.daniel).toBe(total - 1);
    // Little mode does not show the memory verse on this page.
    expect(document.querySelector(".quiz__verse")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Family time" }));
    expect(onFamily).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Back to the stories" }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("shows the memory verse on the done page in big mode", () => {
    setMode("big");
    render(<Quiz story={daniel} onDone={() => {}} onFamily={() => {}} />);
    for (let i = 0; i < daniel.quiz.length; i++) fireEvent.click(rightChoice());
    const cite = document.querySelector(".quiz__verse cite")!;
    expect(cite.textContent).toContain(daniel.memoryVerse!.reference);
    expect(cite.textContent).toContain("NIV");
    expect(screen.getByLabelText("3 out of 3 stars")).toBeTruthy();
  });

  it("copes with a story that has no questions", () => {
    const empty = { ...daniel, quiz: [] };
    const onDone = vi.fn();
    render(<Quiz story={empty} onDone={onDone} onFamily={() => {}} />);
    expect(screen.getByText(/No questions for this story yet/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Back to the stories" }));
    expect(onDone).toHaveBeenCalled();
  });
});
