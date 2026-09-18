import { C } from "../palette";
import { Shaded, SoftShadow } from "./effects";

const BODY = "#dea84c";
const MANE = "#b06d28";
const FACE = "#f2c470";
const MUZZLE = "#f8dfa8";
const IRIS = "#c0741f";

export interface Lion2Props {
  x: number;
  /** Ground line the lion lies on. */
  y: number;
  scale?: number;
  /** Mirrors the lion so it faces left. */
  flip?: boolean;
  /** Closed eyes and a softer smile; no blink. */
  asleep?: boolean;
}

function Eye({ cx, cy, asleep }: { cx: number; cy: number; asleep: boolean }) {
  if (asleep) {
    return (
      <path
        d={`M${cx - 8},${cy} q8,7 16,0`}
        stroke={C.ink}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="9" ry="10.5" fill={C.white} />
      <circle cx={cx + 1} cy={cy + 1} r="6.5" fill={IRIS} />
      <circle cx={cx + 1.5} cy={cy + 1.5} r="4" fill={C.ink} />
      <circle cx={cx - 1.5} cy={cy - 2.5} r="2.2" fill={C.white} />
      <circle cx={cx + 3} cy={cy + 3} r="1.1" fill={C.white} opacity="0.8" />
      {/* eyelid: rests invisible, appears for a blink */}
      <ellipse cx={cx} cy={cy} rx="9.5" ry="11" fill={FACE} opacity="0" className="a-blink" />
    </g>
  );
}

/**
 * A lying lion built from stacked rounded layers: haunch, body, paws, mane
 * tufts, head, muzzle. Feet sit on y=0 inside the group so callers position
 * the ground line only.
 */
export function Lion2({ x, y, scale = 1, flip = false, asleep = false }: Lion2Props) {
  const sx = flip ? -scale : scale;
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${scale})`}>
      <SoftShadow x={-10} y={2} rx={118} ry={16} />

      {/* tail first so it sits behind the body; it hinges at its root on the haunch */}
      <g transform="translate(-118 -40)">
        <g className="a-tail">
          <path
            d="M0,0 q-34,-6 -40,-40"
            stroke={MANE}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="-42" cy="-44" r="11" fill={MANE} />
        </g>
      </g>

      {/* one breathing group for body and head, so they scale from one origin */}
      <g className="a-breathe-slow">
        <Shaded base={BODY}>
          {(fill) => (
            <g>
              <circle cx="-84" cy="-46" r="42" fill={fill} />
              <ellipse cx="-18" cy="-44" rx="100" ry="44" fill={fill} />
              <rect x="6" y="-26" width="46" height="24" rx="12" fill={fill} />
              <rect x="40" y="-22" width="46" height="22" rx="11" fill={fill} />
            </g>
          )}
        </Shaded>
        {/* rim light along the back */}
        <path
          d="M-108,-60 Q-60,-92 20,-84"
          stroke={C.cream}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />

        <Shaded base={MANE} light={0.2} dark={0.4}>
          {(fill) => (
            <g>
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={(60 + Math.cos(a) * 58).toFixed(1)}
                    cy={(-78 + Math.sin(a) * 58).toFixed(1)}
                    r="23"
                    fill={fill}
                  />
                );
              })}
              <circle cx="60" cy="-78" r="60" fill={fill} />
            </g>
          )}
        </Shaded>

        <Shaded base={FACE} light={0.22} dark={0.3}>
          {(fill) => (
            <g>
              <circle cx="28" cy="-114" r="13" fill={fill} />
              <circle cx="92" cy="-114" r="13" fill={fill} />
              <circle cx="60" cy="-78" r="45" fill={fill} />
            </g>
          )}
        </Shaded>
        <circle cx="28" cy="-114" r="6" fill="#e69b8b" />
        <circle cx="92" cy="-114" r="6" fill="#e69b8b" />

        <ellipse cx="60" cy="-58" rx="24" ry="16" fill={MUZZLE} />
        <path d="M52,-70 L68,-70 L60,-61 Z" fill="#5a3a2a" />
        <path
          d={asleep ? "M48,-54 q12,8 24,0" : "M46,-56 q14,14 28,0"}
          stroke="#5a3a2a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="34" cy="-64" r="6" fill="#e69b8b" opacity="0.45" />
        <circle cx="86" cy="-64" r="6" fill="#e69b8b" opacity="0.45" />

        <Eye cx={44} cy={-86} asleep={asleep} />
        <Eye cx={76} cy={-86} asleep={asleep} />
        <path
          d="M34,-102 q10,-6 20,-2 M66,-104 q10,-4 20,2"
          stroke="#8a5a2a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}
