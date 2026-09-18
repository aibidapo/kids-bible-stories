import { useId } from "react";
import { C, rand, randIn } from "./palette";

/**
 * Every scene draws into this 1000x625 box. Keeping one viewBox for all art
 * means hotspot percentages, the stage and the scene registry all line up.
 */
export const VB = { w: 1000, h: 625 };

/* ---------------------------------------------------------------- sky ---- */

export function Sky({ from, to }: { from: string; to: string }) {
  const id = useId();
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={VB.w} height={VB.h} fill={`url(#${id})`} />
    </>
  );
}

export function Sun({
  x = 820,
  y = 120,
  r = 58,
}: {
  x?: number;
  y?: number;
  r?: number;
}) {
  const id = useId();
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={C.sunCore} />
          <stop offset="60%" stopColor={C.sun} />
          <stop offset="100%" stopColor={C.sun} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 2.4} fill={`url(#${id})`} opacity="0.55" />
      <g className="a-spin-slow">
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            x={x - 4}
            y={y - r - 30}
            width="8"
            height="20"
            rx="4"
            fill={C.sun}
            opacity="0.85"
            transform={`rotate(${i * 30} ${x} ${y})`}
          />
        ))}
      </g>
      <circle cx={x} cy={y} r={r} fill={C.sun} />
      <circle
        cx={x - r * 0.25}
        cy={y - r * 0.25}
        r={r * 0.55}
        fill={C.sunCore}
        opacity="0.7"
      />
    </g>
  );
}

export function Moon({
  x = 180,
  y = 110,
  r = 44,
}: {
  x?: number;
  y?: number;
  r?: number;
}) {
  const id = useId();
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="55%" stopColor={C.moon} stopOpacity="0.45" />
          <stop offset="100%" stopColor={C.moon} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 2.6} fill={`url(#${id})`} />
      <circle cx={x} cy={y} r={r} fill={C.moon} />
      <circle cx={x + r * 0.3} cy={y - r * 0.2} r={r * 0.16} fill="#ded9bd" />
      <circle cx={x - r * 0.25} cy={y + r * 0.3} r={r * 0.22} fill="#ded9bd" />
      <circle cx={x + r * 0.05} cy={y + r * 0.55} r={r * 0.1} fill="#ded9bd" />
    </g>
  );
}

export function Stars({
  count = 40,
  seed = 1,
  maxY = 340,
}: {
  count?: number;
  seed?: number;
  maxY?: number;
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const s = seed * 100 + i;
        const x = randIn(s, 10, VB.w - 10);
        const y = randIn(s + 0.5, 10, maxY);
        const r = randIn(s + 0.9, 1.4, 3.4);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={C.star}
            className="a-twinkle"
            style={{ animationDelay: `${rand(s + 1.3) * 3}s` }}
          />
        );
      })}
    </g>
  );
}

/** A single four-point sparkle, used for miracles and "you found it" feedback. */
export function Sparkle({
  x,
  y,
  s = 1,
  delay = 0,
}: {
  x: number;
  y: number;
  s?: number;
  delay?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0,-16 Q2.5,-2.5 16,0 Q2.5,2.5 0,16 Q-2.5,2.5 -16,0 Q-2.5,-2.5 0,-16 Z"
        fill={C.sunCore}
        className="a-sparkle"
        style={{ animationDelay: `${delay}s` }}
      />
    </g>
  );
}

/* -------------------------------------------------------------- clouds ---- */

function cloudPath(w: number) {
  const u = w / 100;
  return `M${12 * u},${0} q${-14 * u},0 ${-12 * u},${-11 * u} q${-1 * u},${-13 * u} ${14 * u},${-11 * u}
          q${5 * u},${-15 * u} ${22 * u},${-11 * u} q${12 * u},${-9 * u} ${23 * u},${4 * u}
          q${16 * u},${-2 * u} ${16 * u},${13 * u} q${1 * u},${16 * u} ${-15 * u},${16 * u} Z`;
}

export function Clouds({
  y = 110,
  count = 4,
  seed = 2,
  speed = 60,
  fill = "#ffffff",
  opacity = 0.9,
}: {
  y?: number;
  count?: number;
  seed?: number;
  speed?: number;
  fill?: string;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const s = seed * 50 + i;
        const w = randIn(s, 90, 190);
        const cy = y + randIn(s + 0.4, -40, 60);
        const dur = speed + rand(s + 0.8) * speed;
        return (
          <g
            key={i}
            className="a-drift"
            style={{
              animationDuration: `${dur}s`,
              animationDelay: `${-rand(s + 1.1) * dur}s`,
            }}
          >
            <path
              d={cloudPath(w)}
              transform={`translate(${randIn(s + 1.6, 0, VB.w - 60)} ${cy})`}
              fill={fill}
            />
          </g>
        );
      })}
    </g>
  );
}

/* ---------------------------------------------------------------- land ---- */

export function Hills({
  y = 400,
  colors = [C.grassDark, C.grass],
}: {
  y?: number;
  colors?: string[];
}) {
  return (
    <g>
      {colors.map((c, i) => {
        const dy = y + i * 34;
        return (
          <path
            key={i}
            d={`M0,${dy + 40} Q${180 + i * 70},${dy - 90} ${420 + i * 40},${dy + 10}
                Q${640 - i * 60},${dy + 90} ${780 + i * 30},${dy - 20}
                Q${900 + i * 20},${dy - 70} ${VB.w},${dy + 30} L${VB.w},${VB.h} L0,${VB.h} Z`}
            fill={c}
          />
        );
      })}
    </g>
  );
}

export function Ground({
  y = 480,
  fill = C.grass,
  top = C.grassLight,
}: {
  y?: number;
  fill?: string;
  top?: string;
}) {
  return (
    <g>
      <rect x="0" y={y} width={VB.w} height={VB.h - y} fill={fill} />
      <path
        d={`M0,${y + 8} Q120,${y - 12} 260,${y + 4} Q420,${y + 20} 580,${y - 6} Q760,${y - 22} 1000,${y + 6} L1000,${y + 26} L0,${y + 26} Z`}
        fill={top}
        opacity="0.55"
      />
    </g>
  );
}

/** Tufts of grass along a baseline — cheap detail that makes ground read as ground. */
export function GrassTufts({
  y = 500,
  count = 22,
  seed = 3,
  fill = C.grassDark,
}: {
  y?: number;
  count?: number;
  seed?: number;
  fill?: string;
}) {
  return (
    <g fill={fill} opacity="0.8">
      {Array.from({ length: count }, (_, i) => {
        const s = seed * 30 + i;
        const x = randIn(s, 0, VB.w);
        const h = randIn(s + 0.3, 8, 20);
        const yy = y + randIn(s + 0.7, 0, VB.h - y - 10);
        return (
          <path
            key={i}
            d={`M${x},${yy} q${-4},${-h} ${-9},${-h * 1.1} q${8},${1} ${9},${h} q${1},${-h} ${9},${-h * 1.1} q${-5},${2} ${-9},${h} Z`}
            className="a-sway"
            style={{ animationDelay: `${rand(s + 1.9) * 3}s` }}
          />
        );
      })}
    </g>
  );
}

/* --------------------------------------------------------------- water ---- */

/**
 * A horizontally tiling wave band. The path covers two tiles and slides by one
 * tile width forever, which reads as endless rolling water with no JS at all.
 */
export function Sea({
  y = 400,
  amp = 14,
  color = C.sea,
  crest = C.seaLight,
  speed = 9,
  depth = VB.h,
}: {
  y?: number;
  amp?: number;
  color?: string;
  crest?: string;
  speed?: number;
  depth?: number;
}) {
  const tile = 250;
  const wave = (offsetY: number) => {
    let d = `M-${tile},${offsetY} `;
    for (let x = -tile; x < VB.w + tile * 2; x += tile) {
      d += `q${tile / 4},${-amp} ${tile / 2},0 q${tile / 4},${amp} ${tile / 2},0 `;
    }
    d += `L${VB.w + tile * 2},${depth} L-${tile},${depth} Z`;
    return d;
  };
  return (
    <g>
      <rect x="0" y={y} width={VB.w} height={depth - y} fill={color} />
      <g className="a-wave" style={{ animationDuration: `${speed}s` }}>
        <path d={wave(y)} fill={color} />
        <path d={wave(y - 2)} fill={crest} opacity="0.35" />
      </g>
      <g
        className="a-wave-rev"
        style={{ animationDuration: `${speed * 1.6}s` }}
      >
        <path d={wave(y + 26)} fill={crest} opacity="0.22" />
      </g>
    </g>
  );
}

/**
 * Rain, built as a band of drops repeated down the frame and slid by exactly one
 * band height — the same tiling trick as the waves. It loops seamlessly, and
 * because every drop starts inside the picture it still reads as rain when Calm
 * mode freezes the animation.
 */
export function Rain({
  count = 60,
  seed = 4,
  opacity = 0.65,
}: {
  count?: number;
  seed?: number;
  opacity?: number;
}) {
  const TILE = 260;
  const band = (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const s = seed * 70 + i;
        const x = randIn(s, -40, VB.w + 40);
        const y = randIn(s + 0.3, 0, TILE);
        const len = randIn(s + 0.6, 18, 42);
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x - 10}
            y2={y + len}
            stroke="#cfe9ff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
  return (
    <g opacity={opacity}>
      <g className="a-rainfall">
        {[-1, 0, 1, 2].map((k) => (
          <g key={k} transform={`translate(0 ${k * TILE})`}>
            {band}
          </g>
        ))}
      </g>
    </g>
  );
}

export function Lightning({ delay = 0 }: { delay?: number }) {
  return (
    <g className="a-flash" style={{ animationDelay: `${delay}s` }}>
      <rect
        x="0"
        y="0"
        width={VB.w}
        height={VB.h}
        fill="#ffffff"
        opacity="0.5"
      />
      <path
        d="M520,40 L470,210 L540,200 L470,380 L600,180 L525,190 L575,40 Z"
        fill="#fff8c4"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </g>
  );
}

export function Rainbow({
  cx = 500,
  cy = 560,
  r = 330,
}: {
  cx?: number;
  cy?: number;
  r?: number;
}) {
  const bands = [
    "#e8453c",
    "#f5871f",
    "#f6c63c",
    "#4caf50",
    "#3f7fd6",
    "#7a4fc4",
  ];
  return (
    <g className="a-draw-in">
      {bands.map((c, i) => (
        <path
          key={c}
          d={`M${cx - r + i * 24},${cy} A${r - i * 24},${r - i * 24} 0 0 1 ${cx + r - i * 24},${cy}`}
          fill="none"
          stroke={c}
          strokeWidth="24"
          strokeLinecap="round"
          opacity="0.9"
        />
      ))}
    </g>
  );
}

/** Soft radiant glow, used wherever God's presence or a miracle is shown. */
export function HolyGlow({
  x,
  y,
  r = 200,
  color = C.glow,
}: {
  x: number;
  y: number;
  r?: number;
  color?: string;
}) {
  const id = useId();
  return (
    <g className="a-pulse">
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="45%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  );
}

/** Diagonal shafts of light from a point — the "God speaks" motif. */
export function LightRays({
  x,
  y,
  count = 9,
  len = 700,
  color = C.glow,
}: {
  x: number;
  y: number;
  count?: number;
  len?: number;
  color?: string;
}) {
  return (
    <g className="a-spin-vslow" opacity="0.5">
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={`M${x},${y} L${x - 40},${y + len} L${x + 40},${y + len} Z`}
          fill={color}
          opacity={0.25 + (i % 3) * 0.12}
          transform={`rotate(${(360 / count) * i} ${x} ${y})`}
        />
      ))}
    </g>
  );
}
