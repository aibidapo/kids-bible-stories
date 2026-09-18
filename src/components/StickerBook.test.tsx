// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { StickerBook } from "./StickerBook";
import { TOTAL_STICKERS } from "../data/stories";
import { recordFound, resetProgress } from "../lib/store";
import { daniel } from "../data/stories/daniel";

beforeEach(resetProgress);
afterEach(cleanup);

describe("StickerBook", () => {
  it("shows every sticker as an outline until it is found", () => {
    const first = daniel.scenes.flatMap((s) => s.hotspots ?? []).find((h) => h.sticker)!;
    recordFound("daniel", "x", first.id, first.sticker);
    render(<StickerBook onBack={() => {}} />);
    expect(screen.getByText(`1/${TOTAL_STICKERS}`)).toBeTruthy();
    expect(screen.getByText(first.sticker!)).toBeTruthy();
    expect(screen.getAllByText("Not found yet")).toHaveLength(TOTAL_STICKERS - 1);
    expect(document.querySelectorAll(".sticker.is-got")).toHaveLength(1);
  });

  it("goes back from the header button", () => {
    const onBack = vi.fn();
    render(<StickerBook onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: "Back to the stories" }));
    expect(onBack).toHaveBeenCalled();
  });
});
