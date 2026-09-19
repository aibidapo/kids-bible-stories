import { STORIES, TOTAL_STICKERS } from "../data/stories";
import { useProgress } from "../lib/store";
import { download, useDownloads, type DownloadState } from "../lib/downloads";
import type { Story } from "../types";

interface Props {
  onOpen: (story: Story) => void;
  onStickers: () => void;
  onSettings: () => void;
  /** Bytes per downloadable story, from story-assets.json, for the Download label. */
  storySizes?: Record<string, number>;
}

/**
 * A still of the story's cover scene, rendered by `npm run covers` and
 * shipped in the app shell, so the library shows every story offline even
 * when the story's own art is not on the device yet.
 */
function CardArt({ storyId }: { storyId: string }) {
  return (
    <img
      className="card__art"
      src={`${import.meta.env.BASE_URL}covers/${storyId}.webp`}
      alt=""
      width={640}
      height={400}
      loading="lazy"
    />
  );
}

function megabytes(bytes: number): string {
  return `${Math.max(0.1, Math.round((bytes / 1024 / 1024) * 10) / 10)} MB`;
}

/**
 * The row under a card that says whether the story is on this device and
 * lets a grown-up fetch it. Its button is separate from the card so a
 * mis-tap never opens the story, and every failure has a visible state.
 */
function DownloadRow({
  storyId,
  state,
  bytes,
}: {
  storyId: string;
  state?: DownloadState;
  bytes: number;
}) {
  if (!state || state.status === "unknown" || state.status === "unsupported") return null;
  const retry = (
    <button type="button" className="btn card__download-btn" onClick={() => download(storyId)}>
      Try again
    </button>
  );
  switch (state.status) {
    case "builtin":
    case "ready":
      return (
        <p className="card__download">
          <span className="card__download-tick" aria-hidden="true">
            ✓
          </span>{" "}
          On this device
        </p>
      );
    case "downloading":
      return (
        <p className="card__download" role="status">
          Downloading, {state.done} of {state.total}
        </p>
      );
    case "no-space":
      return (
        <p className="card__download card__download--warn">
          Not enough space on this device {retry}
        </p>
      );
    case "error":
      return <p className="card__download card__download--warn">Download failed {retry}</p>;
    default:
      return (
        <p className="card__download">
          {state.status === "partial" && (
            <span className="card__download-note">
              {state.done} of {state.total} files here
            </span>
          )}
          <button
            type="button"
            className="btn card__download-btn"
            onClick={() => download(storyId)}
          >
            Download, {megabytes(bytes)}
          </button>
        </p>
      );
  }
}

export function Library({ onOpen, onStickers, onSettings, storySizes = {} }: Props) {
  const progress = useProgress();
  const downloads = useDownloads();

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
        <strong>{progress.stickers.length}</strong> of {TOTAL_STICKERS} stickers found
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
                  <CardArt storyId={story.id} />
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
                      <span className="card__stars" aria-label={`Best quiz score ${best}`}>
                        {"★".repeat(Math.max(1, Math.min(3, best)))}
                      </span>
                    )}
                  </span>
                </span>
              </button>
              <DownloadRow
                storyId={story.id}
                state={downloads[story.id]}
                bytes={storySizes[story.id] ?? 0}
              />
            </li>
          );
        })}
      </ul>

      <p className="library__footnote">
        {progress.mode === "little"
          ? "Little mode: short words, read aloud."
          : "Big mode: longer story, verses and harder questions."}{" "}
        <button type="button" className="linkish" onClick={onSettings}>
          Change
        </button>
      </p>
    </div>
  );
}
