import { getSceneArt } from "../scenes";
import { STORIES, TOTAL_STICKERS } from "../data/stories";
import { useProgress } from "../lib/store";
import type { Story } from "../types";

interface Props {
  onOpen: (story: Story) => void;
  onStickers: () => void;
  onSettings: () => void;
}

function CardArt({ artKey }: { artKey: string }) {
  const Art = getSceneArt(artKey);
  if (!Art) return null;
  return (
    <svg
      className="card__art"
      viewBox="0 0 1000 625"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <Art active={false} animate found={[]} />
    </svg>
  );
}

export function Library({ onOpen, onStickers, onSettings }: Props) {
  const progress = useProgress();

  return (
    <div className="library">
      <header className="library__head">
        <div>
          <p className="library__eyebrow">Bible Adventures</p>
          <h1 className="library__title">Pick a story</h1>
        </div>
        <div className="library__actions">
          <button
            type="button"
            className="btn btn--round btn--light"
            onClick={onStickers}
            aria-label="My stickers"
          >
            ★
          </button>
          <button
            type="button"
            className="btn btn--round btn--light"
            onClick={onSettings}
            aria-label="Grown-up settings"
          >
            ⚙
          </button>
        </div>
      </header>

      <p className="library__progress">
        <strong>{progress.stickers.length}</strong> of {TOTAL_STICKERS} stickers
        found
        <span className="library__bar" aria-hidden="true">
          <span
            style={{
              width: `${(progress.stickers.length / TOTAL_STICKERS) * 100}%`,
            }}
          />
        </span>
      </p>

      <ul className="library__grid">
        {STORIES.map((story) => {
          const done = progress.completed.includes(story.id);
          const best = progress.quizBest[story.id];
          return (
            <li key={story.id}>
              <button
                type="button"
                className="card"
                style={{
                  ["--from" as string]: story.palette.from,
                  ["--to" as string]: story.palette.to,
                }}
                onClick={() => onOpen(story)}
              >
                <span className="card__frame">
                  <CardArt artKey={story.cover} />
                  {done && (
                    <span className="card__badge" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </span>
                <span className="card__body">
                  <strong className="card__title">{story.title}</strong>
                  <span className="card__blurb">{story.blurb}</span>
                  <span className="card__meta">
                    <span className="card__ref">{story.reference}</span>
                    {best !== undefined && (
                      <span
                        className="card__stars"
                        aria-label={`Best quiz score ${best}`}
                      >
                        {"★".repeat(Math.max(1, Math.min(3, best)))}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="library__footnote">
        {progress.mode === "little"
          ? "Little mode — short words, read aloud."
          : "Big mode — longer story, verses and harder questions."}{" "}
        <button type="button" className="linkish" onClick={onSettings}>
          Change
        </button>
      </p>
    </div>
  );
}
