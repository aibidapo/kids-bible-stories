import { useMemo, useState } from "react";
import { shuffleChoices } from "../lib/quiz";
import { SCRIPTURE_ABBREVIATION } from "../data/scripture";
import { playCorrect, playTryAgain } from "../lib/sound";
import { recordQuiz, useProgress } from "../lib/store";
import { record as recordPilot } from "../lib/pilotLog";
import type { Story } from "../types";

interface Props {
  story: Story;
  onDone: () => void;
  /** Opens the Family time card for this story. */
  onFamily: () => void;
}

/**
 * A quiz that cannot be failed. A wrong answer is greyed out with a kind noise
 * and the child tries again; the score only counts first-time-right answers, so
 * there is something to beat without anything to lose.
 */
export function Quiz({ story, onDone, onFamily }: Props) {
  const progress = useProgress();
  // Story data lists the right answer first for readability; shuffle each
  // question's choices once per quiz so the answer is never always the top one.
  const questions = useMemo(
    () =>
      story.quiz
        .filter((q) => (progress.mode === "big" ? true : q.level === "little"))
        .map((q) => shuffleChoices(q)),
    [story.quiz, progress.mode],
  );

  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];

  function choose(i: number) {
    if (!q || wrong.includes(i)) return;
    if (i === q.answerIndex) {
      playCorrect();
      if (wrong.length === 0) setFirstTry((n) => n + 1);
      const next = index + 1;
      if (next >= questions.length) {
        const score = firstTry + (wrong.length === 0 ? 1 : 0);
        recordQuiz(story.id, score);
        recordPilot("quiz", story.id);
        setFinished(true);
      } else {
        setIndex(next);
        setWrong([]);
      }
    } else {
      playTryAgain();
      setWrong((w) => [...w, i]);
    }
  }

  if (finished) {
    const stars = Math.max(1, Math.round((firstTry / questions.length) * 3));
    return (
      <div className="quiz quiz--done">
        <h2 className="quiz__heading">Well done!</h2>
        <p className="quiz__stars" aria-label={`${stars} out of 3 stars`}>
          {"★★★".slice(0, stars)}
          <span className="quiz__stars-dim">{"★★★".slice(stars)}</span>
        </p>
        <p className="quiz__score">
          You got {firstTry} of {questions.length} right first time.
        </p>

        <div className="quiz__lesson">
          <h3>What this story is about</h3>
          <p>{story.lesson[progress.mode]}</p>
        </div>

        {progress.mode === "big" && story.memoryVerse && (
          <blockquote className="quiz__verse">
            “{story.memoryVerse.text}”
            <cite>
              {story.memoryVerse.reference} · {SCRIPTURE_ABBREVIATION}
            </cite>
          </blockquote>
        )}

        <div className="quiz__actions">
          <button type="button" className="btn btn--primary btn--big" onClick={onFamily}>
            Family time
          </button>
          <button type="button" className="btn btn--big" onClick={onDone}>
            Back to the stories
          </button>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="quiz quiz--done">
        <p className="quiz__score">No questions for this story yet.</p>
        <button type="button" className="btn btn--primary btn--big" onClick={onDone}>
          Back to the stories
        </button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <p className="quiz__count">
        Question {index + 1} of {questions.length}
      </p>
      <h2 className="quiz__heading">{q.question}</h2>
      <ul className="quiz__choices">
        {q.choices.map((c, i) => (
          <li key={c}>
            <button
              type="button"
              className={`quiz__choice${wrong.includes(i) ? " is-wrong" : ""}`}
              onClick={() => choose(i)}
              disabled={wrong.includes(i)}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
      {wrong.length > 0 && <p className="quiz__nudge">Not that one. Have another go!</p>}
    </div>
  );
}
