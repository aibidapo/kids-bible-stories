import { describe, expect, it } from "vitest";
import { shuffleChoices } from "./quiz";
import type { QuizQuestion } from "../types";

const q: QuizQuestion = {
  question: "How often did Daniel pray?",
  choices: ["Three times every day", "Once a year", "Only when he was scared"],
  answerIndex: 0,
  level: "little",
};

/** A deterministic rng: yields the given fractions in order, then repeats the last. */
function rngOf(...values: number[]) {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
}

describe("shuffleChoices", () => {
  it("keeps every choice exactly once", () => {
    const out = shuffleChoices(q, rngOf(0.9, 0.1, 0.5));
    expect([...out.choices].sort()).toEqual([...q.choices].sort());
  });

  it("points answerIndex at the correct choice after shuffling", () => {
    for (const rng of [rngOf(0.9, 0.1), rngOf(0.1, 0.9), rngOf(0.5, 0.5), rngOf(0, 0)]) {
      const out = shuffleChoices(q, rng);
      expect(out.choices[out.answerIndex]).toBe(q.choices[q.answerIndex]);
    }
  });

  it("is deterministic for a given rng and leaves the input untouched", () => {
    const a = shuffleChoices(q, rngOf(0.7, 0.2));
    const b = shuffleChoices(q, rngOf(0.7, 0.2));
    expect(a).toEqual(b);
    expect(q.choices[0]).toBe("Three times every day");
    expect(q.answerIndex).toBe(0);
  });

  it("actually moves the answer for some rng values", () => {
    // rng 0.9 on the last swap picks a partner other than itself
    const out = shuffleChoices(q, rngOf(0.1, 0.9));
    expect(out.answerIndex).not.toBe(0);
  });
});
