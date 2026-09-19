import { beforeAll, describe, expect, it } from "vitest";
import { STORIES, getStory } from "./stories";
import { getSceneArt, loadAllStories } from "../scenes";

/**
 * Invariants the app relies on but TypeScript cannot express. A broken one
 * shows up as a blank stage, an untappable hotspot or an unanswerable quiz.
 */
describe("story library", () => {
  beforeAll(() => loadAllStories());

  it("keeps Creation first: it is the story precached with the shell (FIRST_STORY in vite.config.ts)", () => {
    expect(STORIES[0].id).toBe("creation");
  });

  it("has unique story ids and getStory finds each one", () => {
    const ids = STORIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(getStory(id)?.id).toBe(id);
    expect(getStory("not-a-story")).toBeUndefined();
  });

  it("uses plain punctuation: no em-dashes anywhere in story prose", () => {
    const seen: string[] = [];
    const walk = (v: unknown, path: string) => {
      if (typeof v === "string") {
        if (v.includes("—")) seen.push(path);
      } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === "object")
        for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
    };
    for (const story of STORIES) walk(story, story.id);
    expect(seen).toEqual([]);
  });

  for (const story of STORIES) {
    describe(story.id, () => {
      it("registers its cover and every scene's art", () => {
        expect(getSceneArt(story.cover), `cover ${story.cover}`).toBeDefined();
        for (const scene of story.scenes) {
          expect(getSceneArt(scene.art), `scene ${scene.id} art ${scene.art}`).toBeDefined();
        }
      });

      it("has unique scene ids and text at both reading levels", () => {
        const ids = story.scenes.map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const scene of story.scenes) {
          expect(scene.text.little.trim(), `${scene.id} little`).not.toBe("");
          expect(scene.text.big.trim(), `${scene.id} big`).not.toBe("");
        }
        expect(story.lesson.little.trim()).not.toBe("");
        expect(story.lesson.big.trim()).not.toBe("");
      });

      it("keeps hotspots on the stage with unique ids per scene", () => {
        for (const scene of story.scenes) {
          const spots = scene.hotspots ?? [];
          const ids = spots.map((h) => h.id);
          expect(new Set(ids).size, `${scene.id} hotspot ids`).toBe(ids.length);
          for (const h of spots) {
            expect(h.x, `${scene.id}/${h.id} x`).toBeGreaterThanOrEqual(0);
            expect(h.x, `${scene.id}/${h.id} x`).toBeLessThanOrEqual(100);
            expect(h.y, `${scene.id}/${h.id} y`).toBeGreaterThanOrEqual(0);
            expect(h.y, `${scene.id}/${h.id} y`).toBeLessThanOrEqual(100);
            if (h.size !== undefined) expect(h.size, `${scene.id}/${h.id} size`).toBeGreaterThan(0);
            expect(h.label.trim()).not.toBe("");
            expect(h.reward.trim()).not.toBe("");
          }
        }
      });

      it("points every find-game target at a hotspot in the same scene", () => {
        for (const scene of story.scenes) {
          if (!scene.find) continue;
          const ids = new Set((scene.hotspots ?? []).map((h) => h.id));
          expect(scene.find.targets.length, `${scene.id} targets`).toBeGreaterThan(0);
          for (const t of scene.find.targets)
            expect(ids.has(t), `${scene.id} target ${t}`).toBe(true);
        }
      });

      it("has a devotional at both levels and a memory verse", () => {
        const d = story.devotional;
        expect(d, "devotional").toBeDefined();
        for (const level of ["little", "big"] as const) {
          expect(d.question[level].trim().endsWith("?"), `${level} question`).toBe(true);
          expect(d.prayer[level].trim(), `${level} prayer`).not.toBe("");
        }
        expect(d.activity.trim()).not.toBe("");
        expect(story.memoryVerse?.text.trim()).not.toBe("");
      });

      it("has answerable quiz questions and at least one for little readers", () => {
        expect(story.quiz.some((q) => q.level === "little")).toBe(true);
        for (const q of story.quiz) {
          expect(q.choices.length, q.question).toBeGreaterThanOrEqual(2);
          expect(new Set(q.choices).size, `${q.question} duplicate choices`).toBe(q.choices.length);
          expect(q.answerIndex, q.question).toBeGreaterThanOrEqual(0);
          expect(q.answerIndex, q.question).toBeLessThan(q.choices.length);
        }
      });
    });
  }
});
