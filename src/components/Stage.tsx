import { useEffect, useRef, useState } from "react";
import { getSceneArt } from "../scenes";
import { play } from "../lib/sound";
import { foundIn, recordFound, useProgress } from "../lib/store";
import type { Scene } from "../types";

interface StageProps {
  storyId: string;
  scene: Scene;
  /** Bubbled up so the player can celebrate a newly earned sticker. */
  onSticker: (name: string) => void;
}

/**
 * The picture itself, plus the tappable spots layered over it.
 *
 * Hotspots are positioned as percentages of the stage, so they stay glued to
 * the art at any screen size, and every one is forced to at least 64px across —
 * small fingers do not aim well.
 */
export function Stage({ storyId, scene, onSticker }: StageProps) {
  const progress = useProgress();
  const found = foundIn(progress, storyId, scene.id);
  const [bubble, setBubble] = useState<{ id: string; text: string } | null>(
    null,
  );
  const timer = useRef<number | undefined>(undefined);

  const Art = getSceneArt(scene.art);

  useEffect(() => {
    setBubble(null);
    window.clearTimeout(timer.current);
  }, [scene.id]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function tap(hotspotId: string) {
    const spot = scene.hotspots?.find((h) => h.id === hotspotId);
    if (!spot) return;
    play(spot.sound ?? "chime");
    const earned = recordFound(storyId, scene.id, spot.id, spot.sticker);
    setBubble({ id: spot.id, text: spot.reward });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBubble(null), 6000);
    if (earned) onSticker(earned);
  }

  return (
    <div className="stage">
      <div className="stage__frame">
        <svg
          className="stage__svg"
          viewBox="0 0 1000 625"
          preserveAspectRatio="xMidYMax slice"
          role="img"
          aria-label={scene.text.little}
        >
          {Art ? <Art active animate={!progress.calm} found={found} /> : null}
        </svg>

        {scene.hotspots?.map((h) => {
          const isFound = found.includes(h.id);
          return (
            <button
              key={h.id}
              type="button"
              className={`hotspot${isFound ? " hotspot--found" : ""}`}
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: `${h.size ?? 18}%`,
              }}
              onClick={() => tap(h.id)}
              aria-label={isFound ? `${h.label} — found` : `Find ${h.label}`}
            >
              <span className="hotspot__ring" aria-hidden="true" />
              <span className="hotspot__tick" aria-hidden="true">
                ★
              </span>
            </button>
          );
        })}

        {bubble && (
          <div className="stage__bubble" role="status">
            {bubble.text}
          </div>
        )}
      </div>
    </div>
  );
}
