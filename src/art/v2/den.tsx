import { useId } from "react";
import { randIn } from "../palette";
import { VB } from "../base";
import { Shaded } from "./effects";

const WALL = "#6f5f57";
const FLOOR = "#5c4c46";
const OPENING = "#ffe9b8";

/**
 * Stone wall as rounded cut-paper blocks, a floor, the round opening the king
 * looks through, and a vignette so the edges fall away. Nothing here moves.
 */
export function Den2() {
  const edge = useId();
  const vignette = useId();
  const rows = 7;
  const blockW = 124;
  const blockH = 66;

  return (
    <g>
      <rect width={VB.w} height={VB.h} fill="#3a2f2b" />

      <Shaded base={WALL} light={0.22} dark={0.42}>
        {(fill) => (
          <g>
            {Array.from({ length: rows }, (_, r) => {
              const y = 4 + r * (blockH + 4);
              const offset = r % 2 === 0 ? 0 : blockW / 2;
              const cols = Math.ceil(VB.w / blockW) + 1;
              return Array.from({ length: cols }, (_, c) => {
                const seed = r * 31 + c;
                const x = c * blockW - offset + randIn(seed, -6, 6);
                const w = blockW - 8 + randIn(seed + 0.3, -10, 10);
                const h = blockH + randIn(seed + 0.6, -6, 4);
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={x.toFixed(1)}
                    y={y}
                    width={w.toFixed(1)}
                    height={h.toFixed(1)}
                    rx="20"
                    fill={fill}
                  />
                );
              });
            })}
          </g>
        )}
      </Shaded>

      {/* the opening, lit from the day above */}
      <ellipse cx="500" cy="42" rx="92" ry="26" fill={OPENING} />

      <Shaded base={FLOOR} light={0.18} dark={0.45}>
        {(fill) => (
          <path
            d={`M0,478 Q250,462 500,470 Q750,462 1000,478 L1000,${VB.h} L0,${VB.h} Z`}
            fill={fill}
          />
        )}
      </Shaded>

      {/* cut-paper edge: the wall layer casts onto the floor layer */}
      <defs>
        <linearGradient id={edge} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1218" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a1218" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={vignette} cx="0.5" cy="0.45" r="0.72">
          <stop offset="60%" stopColor="#1a1218" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a1218" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <path
        d="M0,478 Q250,462 500,470 Q750,462 1000,478 L1000,512 Q750,496 500,504 Q250,496 0,512 Z"
        fill={`url(#${edge})`}
      />
      <rect width={VB.w} height={VB.h} fill={`url(#${vignette})`} />
    </g>
  );
}
