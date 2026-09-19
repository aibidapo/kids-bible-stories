import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STORIES } from "../../src/data/stories";

describe("library covers", () => {
  it("has a rendered still in public/covers for every story (npm run covers)", () => {
    for (const story of STORIES) {
      expect(existsSync(`public/covers/${story.id}.webp`), story.id).toBe(true);
    }
  });
});
