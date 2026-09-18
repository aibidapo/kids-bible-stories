import type { QuizQuestion } from "../types";

/**
 * Returns a copy of `q` with its choices in a random order and `answerIndex`
 * remapped so it still points at the correct choice. Pure: the input is
 * never mutated, and the order is fully determined by `rng`, which must
 * return values in [0, 1). Fisher–Yates over an index permutation.
 */
export function shuffleChoices(q: QuizQuestion, rng: () => number = Math.random): QuizQuestion {
  const order = q.choices.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  return {
    ...q,
    choices: order.map((i) => q.choices[i]),
    answerIndex: order.indexOf(q.answerIndex),
  };
}
