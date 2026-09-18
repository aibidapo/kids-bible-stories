import { STORIES, TOTAL_STICKERS } from "../data/stories";
import { useProgress } from "../lib/store";

/** Every sticker in the library, in story order, with the unfound ones as outlines. */
const ALL = STORIES.flatMap((story) =>
  story.scenes.flatMap((scene) =>
    (scene.hotspots ?? [])
      .filter((h) => h.sticker)
      .map((h) => ({ story: story.title, name: h.sticker as string })),
  ),
);

export function StickerBook({ onBack }: { onBack: () => void }) {
  const progress = useProgress();

  return (
    <div className="stickers">
      <header className="stickers__head">
        <button
          type="button"
          className="btn btn--round"
          onClick={onBack}
          aria-label="Back to the stories"
        >
          ←
        </button>
        <h1>My stickers</h1>
        <span className="stickers__count">
          {progress.stickers.length}/{TOTAL_STICKERS}
        </span>
      </header>

      <ul className="stickers__grid">
        {ALL.map((s) => {
          const got = progress.stickers.includes(s.name);
          return (
            <li key={s.name} className={got ? "sticker is-got" : "sticker"}>
              <span className="sticker__disc" aria-hidden="true">
                {got ? "★" : "?"}
              </span>
              <span className="sticker__name">{got ? s.name : "Not found yet"}</span>
              <span className="sticker__story">{s.story}</span>
            </li>
          );
        })}
      </ul>

      <p className="stickers__hint">Tap things in the pictures to find more.</p>
    </div>
  );
}
