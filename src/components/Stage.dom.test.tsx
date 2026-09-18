// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Stage } from "./Stage";
import { daniel } from "../data/stories/daniel";
import { foundIn, resetProgress, setMutedPref, useProgress } from "../lib/store";
import { renderHook } from "@testing-library/react";

beforeEach(() => {
  resetProgress();
  setMutedPref(true);
});
afterEach(cleanup);

describe("Stage taps", () => {
  const scene = daniel.scenes.find((s) => s.id === "den")!;
  const withSticker = scene.hotspots!.find((h) => h.sticker)!;

  it("records a tapped hotspot, shows its reward, and hands the sticker up once", () => {
    const onSticker = vi.fn();
    render(<Stage storyId="daniel" scene={scene} onSticker={onSticker} />);
    const button = screen.getByRole("button", { name: `Find ${withSticker.label}` });
    fireEvent.click(button);

    expect(screen.getByText(withSticker.reward)).toBeTruthy();
    expect(onSticker).toHaveBeenCalledWith(withSticker.sticker);
    const p = renderHook(() => useProgress()).result.current;
    expect(foundIn(p, "daniel", scene.id)).toContain(withSticker.id);
    expect(screen.getByRole("button", { name: `${withSticker.label} — found` })).toBeTruthy();

    // A second tap on the same spot still shows the reward but earns nothing new.
    fireEvent.click(screen.getByRole("button", { name: `${withSticker.label} — found` }));
    expect(onSticker).toHaveBeenCalledTimes(1);
  });

  it("describes the picture for screen readers with the little text", () => {
    render(<Stage storyId="daniel" scene={scene} onSticker={() => {}} />);
    expect(screen.getByRole("img", { name: scene.text.little })).toBeTruthy();
  });
});
