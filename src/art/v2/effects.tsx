import { useId, type ReactNode } from "react";
import { C, rand } from "../palette";
import { VB } from "../base";
import { darken, lighten } from "./tone";

/**
 * One radial gradient in bounding-box units, so every shape that uses the
 * returned fill is lit from its own top-left. A whole figure shares one of
 * these per base colour.
 */
export function Shaded({
  base,
  light = 0.28,
  dark = 0.38,
  children,
}: {
  base: string;
  light?: number;
  dark?: number;
  children: (fill: string) => ReactNode;
}) {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={id} cx="0.35" cy="0.28" r="0.85">
          <stop offset="0%" stopColor={lighten(base, light)} />
          <stop offset="55%" stopColor={base} />
          <stop offset="100%" stopColor={darken(base, dark)} />
        </radialGradient>
      </defs>
      {children(`url(#${id})`)}
    </>
  );
}

/** Gradient ellipse, not a filter, so it costs nothing when things move above it. */
export function SoftShadow({
  x,
  y,
  rx,
  ry = rx * 0.28,
  opacity = 0.42,
}: {
  x: number;
  y: number;
  rx: number;
  ry?: number;
  opacity?: number;
}) {
  const id = useId();
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={C.ink} stopOpacity="1" />
          <stop offset="65%" stopColor={C.ink} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.ink} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id})`} opacity={opacity} />
    </g>
  );
}

/** Warm wedge of light from an opening above, plus its pool on the floor. */
export function LightShaft({
  x = 500,
  top = 40,
  topWidth = 90,
  bottomSpread = 250,
  floorY = 575,
}: {
  x?: number;
  top?: number;
  topWidth?: number;
  bottomSpread?: number;
  floorY?: number;
}) {
  const wedge = useId();
  const pool = useId();
  return (
    <g>
      <defs>
        <linearGradient id={wedge} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.sunCore} stopOpacity="0.6" />
          <stop offset="100%" stopColor={C.glow} stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id={pool}>
          <stop offset="0%" stopColor={C.glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx={x}
        cy={floorY}
        rx={bottomSpread}
        ry={bottomSpread * 0.22}
        fill={`url(#${pool})`}
      />
      <g className="a-pulse-soft">
        <path
          d={`M${x - topWidth},${top} L${x + topWidth},${top} L${x + bottomSpread},${floorY} L${x - bottomSpread},${floorY} Z`}
          fill={`url(#${wedge})`}
        />
      </g>
    </g>
  );
}

/**
 * Paper grain over the whole frame. The filter lives on one static rect and
 * is rasterised once; nothing animated is inside it.
 */
export function Grain({ opacity = 0.06 }: { opacity?: number }) {
  const id = useId();
  return (
    <g pointerEvents="none">
      <defs>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} filter={`url(#${id})`} opacity={opacity} />
    </g>
  );
}

/**
 * Dust drifting in the light. Each mote is positioned by its own translate so
 * Calm mode leaves it exactly where it sits; motion is on inner elements only.
 */
export function Motes({
  x = 500,
  top = 110,
  bottom = 540,
  spread = 200,
  count = 14,
  seed = 3,
}: {
  x?: number;
  top?: number;
  bottom?: number;
  spread?: number;
  count?: number;
  seed?: number;
}) {
  return (
    <g pointerEvents="none">
      {Array.from({ length: count }, (_, i) => {
        const t = rand(seed + i);
        const y = top + t * (bottom - top);
        const halfW = 40 + (spread - 40) * t;
        const mx = x + (rand(seed + i + 50) * 2 - 1) * halfW;
        const r = 1.6 + rand(seed + i + 100) * 2.2;
        return (
          <g key={i} transform={`translate(${mx.toFixed(1)} ${y.toFixed(1)})`}>
            <g className="a-float" style={{ animationDelay: `${(-t * 6).toFixed(2)}s` }}>
              <circle
                r={r.toFixed(1)}
                fill={C.sunCore}
                opacity="0.55"
                className="a-twinkle"
                style={{ animationDelay: `${(-t * 3.4).toFixed(2)}s` }}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
}
