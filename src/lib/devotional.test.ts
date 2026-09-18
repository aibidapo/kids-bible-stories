import { describe, expect, it } from "vitest";
import { readAloudScript } from "./devotional";
import type { Story } from "../types";

const story = {
  id: "t",
  title: "Test Story",
  memoryVerse: { text: "Be strong and courageous.", reference: "Joshua 1:9" },
  devotional: {
    question: { little: "Who was brave?", big: "When is it hard to be brave?" },
    prayer: {
      little: "Dear God, help me be brave. Amen.",
      big: "Dear God, give us courage. Amen.",
    },
    activity: "Draw something brave.",
  },
} as unknown as Story;

describe("readAloudScript", () => {
  it("reads the card in order with its headings, at the little level", () => {
    const s = readAloudScript(story, "little");
    const order = [
      "Talk about it",
      "Who was brave?",
      "Pray together",
      "help me be brave",
      "Remember",
      "Be strong",
      "Joshua 1:9",
      "Try this",
      "Draw something brave",
    ];
    let last = -1;
    for (const part of order) {
      const i = s.indexOf(part);
      expect(i, part).toBeGreaterThan(last);
      last = i;
    }
    expect(s).not.toContain("undefined");
  });

  it("swaps the question and prayer at the big level", () => {
    const s = readAloudScript(story, "big");
    expect(s).toContain("When is it hard to be brave?");
    expect(s).toContain("give us courage");
    expect(s).not.toContain("Who was brave?");
  });

  it("copes with a story that has no memory verse", () => {
    const s = readAloudScript({ ...story, memoryVerse: undefined } as Story, "little");
    expect(s).not.toContain("Remember");
    expect(s).not.toContain("undefined");
  });
});
