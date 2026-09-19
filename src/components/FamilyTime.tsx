import { useEffect } from "react";
import { useNarration } from "../hooks/useNarration";
import { record as recordPilot } from "../lib/pilotLog";
import { FAMILY_HEADINGS, readAloudScript } from "../lib/devotional";
import { SCRIPTURE_ABBREVIATION } from "../data/scripture";
import { useProgress } from "../lib/store";
import type { Story } from "../types";

interface Props {
  story: Story;
  onDone: () => void;
}

/**
 * The Family time card after a story's quiz: one question, a short prayer,
 * the memory verse, one thing to do together. A prompt card for a grown-up
 * to read from, not a game: nothing is scored or saved.
 */
export function FamilyTime({ story, onDone }: Props) {
  const { mode } = useProgress();
  const narration = useNarration();
  const d = story.devotional;

  useEffect(() => {
    recordPilot("family", story.id);
  }, [story.id]);

  function readAloud() {
    if (narration.speaking) narration.stop();
    else narration.speak(readAloudScript(story, mode), mode === "little" ? 0.85 : 0.95);
  }

  return (
    <section className="family" aria-labelledby="family-heading">
      <p className="family__kicker">Family time · {story.title}</p>
      <h2 id="family-heading" className="family__heading">
        Before you go
      </h2>

      <div className="family__card">
        <h3>{FAMILY_HEADINGS.talk}</h3>
        <p>{d.question[mode]}</p>
      </div>

      <div className="family__card">
        <h3>{FAMILY_HEADINGS.pray}</h3>
        <p>{d.prayer[mode]}</p>
      </div>

      {story.memoryVerse && (
        <div className="family__card">
          <h3>{FAMILY_HEADINGS.remember}</h3>
          <blockquote className="family__verse">
            “{story.memoryVerse.text}”
            <cite>
              {story.memoryVerse.reference} · {SCRIPTURE_ABBREVIATION}
            </cite>
          </blockquote>
        </div>
      )}

      <div className="family__card">
        <h3>{FAMILY_HEADINGS.activity}</h3>
        <p>{d.activity}</p>
      </div>

      <div className="family__actions">
        {narration.supported && (
          <button
            type="button"
            className={`btn btn--round${narration.speaking ? " is-active" : ""}`}
            onClick={readAloud}
            aria-label={narration.speaking ? "Stop reading" : "Read this to me"}
          >
            <span aria-hidden="true">{narration.speaking ? "■" : "🔊"}</span>
          </button>
        )}
        <button type="button" className="btn btn--primary btn--big" onClick={onDone}>
          Done
        </button>
      </div>
    </section>
  );
}
