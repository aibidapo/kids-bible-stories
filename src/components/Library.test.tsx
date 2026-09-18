// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Library } from "./Library";
import { STORIES, TOTAL_STICKERS } from "../data/stories";
import { markCompleted, recordFound, recordQuiz, resetProgress, setMode } from "../lib/store";

beforeEach(() => {
  resetProgress();
  setMode("little");
});
afterEach(cleanup);

describe("Library", () => {
  it("lists every story as a card and reports sticker progress", () => {
    render(<Library onOpen={() => {}} onStickers={() => {}} onSettings={() => {}} />);
    for (const s of STORIES) expect(screen.getByText(s.title)).toBeTruthy();
    expect(screen.getByText(`of ${TOTAL_STICKERS} stickers found`, { exact: false })).toBeTruthy();
    expect(screen.getByText(/Little mode/)).toBeTruthy();
  });

  it("opens a story and the sticker book and settings from their buttons", () => {
    const onOpen = vi.fn();
    const onStickers = vi.fn();
    const onSettings = vi.fn();
    render(<Library onOpen={onOpen} onStickers={onStickers} onSettings={onSettings} />);
    fireEvent.click(screen.getByText(STORIES[1].title));
    expect(onOpen).toHaveBeenCalledWith(STORIES[1]);
    fireEvent.click(screen.getByRole("button", { name: "My stickers" }));
    expect(onStickers).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Grown-up settings" }));
    fireEvent.click(screen.getByRole("button", { name: "Change" }));
    expect(onSettings).toHaveBeenCalledTimes(2);
  });

  it("shows a done badge, the best quiz stars, and the sticker count from progress", () => {
    markCompleted("daniel");
    recordQuiz("daniel", 2);
    recordFound("daniel", "den", "king", "The King");
    setMode("big");
    render(<Library onOpen={() => {}} onStickers={() => {}} onSettings={() => {}} />);
    expect(screen.getByLabelText("Best quiz score 2").textContent).toBe("★★");
    expect(document.querySelector(".card__badge")).not.toBeNull();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText(/Big mode/)).toBeTruthy();
  });
});
