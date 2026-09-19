import { describe, expect, it } from "vitest";
import { SCENE_ART, getSceneArt, loadAllStories, loadStory } from "./index";

describe("scene registry", () => {
  it("knows no art until a story is loaded, then registers that story's keys", async () => {
    expect(getSceneArt("storm/calm")).toBeUndefined();
    await loadStory("storm");
    expect(getSceneArt("storm/calm")).toBeDefined();
    expect(getSceneArt("noah/dove")).toBeUndefined();
  });

  it("rejects an unknown story and a prototype key", async () => {
    await expect(loadStory("nope")).rejects.toThrow("unknown story: nope");
    await expect(loadStory("constructor")).rejects.toThrow("unknown story");
    expect(getSceneArt("constructor")).toBeUndefined();
  });

  it("loads a story once and shares the promise", async () => {
    const a = loadStory("storm");
    const b = loadStory("storm");
    expect(a).toBe(b);
    await a;
  });

  it("loads every story for scripts", async () => {
    await loadAllStories();
    expect(Object.keys(SCENE_ART)).toHaveLength(38);
  });
});
