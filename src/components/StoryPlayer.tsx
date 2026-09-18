import { useCallback, useEffect, useState } from "react";
import { Stage } from "./Stage";
import { NarrationText } from "./NarrationText";
import { useNarration } from "../hooks/useNarration";
import { foundIn, markCompleted, useProgress } from "../lib/store";
import { play } from "../lib/sound";
import type { Story } from "../types";

interface Props {
  story: Story;
  index: number;
  onIndex: (i: number) => void;
  onQuiz: () => void;
  onHome: () => void;
}

export function StoryPlayer({ story, index, onIndex, onQuiz, onHome }: Props) {
  const progress = useProgress();
  const narration = useNarration();
  const [sticker, setSticker] = useState<string | null>(null);

  const scene = story.scenes[index];
  const text = scene.text[progress.mode];
  const isLast = index === story.scenes.length - 1;

  // The hunt prompt disappears once every target in the scene has been found.
  const found = foundIn(progress, story.id, scene.id);
  const quest =
    scene.find && !scene.find.targets.every((t) => found.includes(t))
      ? scene.find.prompt
      : null;

  const speakNow = useCallback(() => {
    narration.speak(text, progress.mode === "little" ? 0.82 : 0.95);
  }, [narration, text, progress.mode]);

  // Read each new scene aloud automatically while narration is switched on.
  useEffect(() => {
    narration.stop();
    if (!progress.narrate || progress.muted) return;
    const t = window.setTimeout(speakNow, 450);
    return () => window.clearTimeout(t);
    // speakNow changes identity with the narration object on every boundary event,
    // so this deliberately keys off the scene and the settings that matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.id, index, progress.mode, progress.narrate, progress.muted]);

  useEffect(() => {
    if (!sticker) return;
    const t = window.setTimeout(() => setSticker(null), 4200);
    return () => window.clearTimeout(t);
  }, [sticker]);

  function go(next: number) {
    narration.stop();
    play("whoosh");
    if (next >= story.scenes.length) {
      markCompleted(story.id);
      onQuiz();
      return;
    }
    onIndex(Math.max(0, next));
  }

  // Arrow keys page through the book, for tablets with keyboards and for testing.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft" && index > 0) go(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="player">
      <header className="player__bar">
        <button
          type="button"
          className="btn btn--round"
          onClick={onHome}
          aria-label="Back to the stories"
        >
          ←
        </button>
        <div className="player__title">
          <h1>{story.title}</h1>
          <ol
            className="player__dots"
            aria-label={`Page ${index + 1} of ${story.scenes.length}`}
          >
            {story.scenes.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`dot${i === index ? " is-current" : ""}${i < index ? " is-done" : ""}`}
                  onClick={() => go(i)}
                  aria-label={`Page ${i + 1}`}
                  aria-current={i === index ? "step" : undefined}
                />
              </li>
            ))}
          </ol>
        </div>
        <button
          type="button"
          className={`btn btn--round${narration.speaking ? " is-active" : ""}`}
          onClick={() => (narration.speaking ? narration.stop() : speakNow())}
          aria-label={
            narration.speaking ? "Stop reading" : "Read this page to me"
          }
          disabled={!narration.supported}
        >
          {narration.speaking ? "◼" : "▶"}
        </button>
      </header>

      <Stage storyId={story.id} scene={scene} onSticker={setSticker} />

      <section className="player__text">
        {quest && (
          <p className="player__quest">
            <span aria-hidden="true">🔎</span> {quest}
          </p>
        )}
        <NarrationText
          text={text}
          charIndex={narration.charIndex}
          mode={progress.mode}
        />
        {progress.mode === "big" && scene.verse && (
          <p className="player__verse">{scene.verse}</p>
        )}
      </section>

      <nav className="player__nav">
        <button
          type="button"
          className="btn btn--big"
          onClick={() => go(index - 1)}
          disabled={index === 0}
        >
          ← Back
        </button>
        <button
          type="button"
          className="btn btn--primary btn--big"
          onClick={() => go(index + 1)}
        >
          {isLast ? "Finish →" : "Next →"}
        </button>
      </nav>

      {sticker && (
        <div className="sticker-pop" role="status">
          <span className="sticker-pop__badge" aria-hidden="true">
            ★
          </span>
          <div>
            <strong>New sticker!</strong>
            <span>{sticker}</span>
          </div>
        </div>
      )}
    </div>
  );
}
