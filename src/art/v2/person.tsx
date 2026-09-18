import { C } from "../palette";
import { darken, lighten } from "./tone";
import { Shaded, SoftShadow } from "./effects";

export type Pose2 = "pray" | "kneel";
export type Face2 = "calm" | "happy";

export interface Person2Props {
  x: number;
  /** Ground line the knees rest on. */
  y: number;
  scale?: number;
  robe: string;
  sash?: string;
  skin: string;
  hair: string;
  pose?: Pose2;
  face?: Face2;
}

const SCARF = "#fbf4e6";

/**
 * A kneeling storybook figure in the soft-shaded cutout style: big head, big
 * eyes, rounded layered body, one gradient per material. Knees sit on y=0.
 */
export function Person2({
  x,
  y,
  scale = 1,
  robe,
  sash = C.sun,
  skin,
  hair,
  pose = "pray",
  face = "calm",
}: Person2Props) {
  const sleeves =
    pose === "pray"
      ? {
          left: "M-40,-138 Q-64,-100 -22,-96 L-6,-100 L-6,-120 Z",
          right: "M40,-138 Q64,-100 22,-96 L6,-100 L6,-120 Z",
        }
      : {
          left: "M-40,-138 Q-66,-90 -46,-40 L-24,-44 L-18,-120 Z",
          right: "M40,-138 Q66,-90 46,-40 L24,-44 L18,-120 Z",
        };
  const hands =
    pose === "pray" ? (
      <g>
        <ellipse cx="-6" cy="-112" rx="9" ry="16" transform="rotate(-8 -6 -112)" />
        <ellipse cx="6" cy="-112" rx="9" ry="16" transform="rotate(8 6 -112)" />
      </g>
    ) : (
      <g>
        <circle cx="-44" cy="-38" r="11" />
        <circle cx="44" cy="-38" r="11" />
      </g>
    );

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <SoftShadow x={0} y={2} rx={78} ry={14} />
      <g className="a-breathe">
        <Shaded base={robe}>
          {(fill) => (
            <g>
              {/* kneeling skirt, then torso */}
              <path d="M-64,0 Q-72,-42 -48,-80 L48,-80 Q72,-42 64,0 Z" fill={fill} />
              <rect x="-46" y="-152" width="92" height="82" rx="32" fill={fill} />
              <path d={sleeves.left} fill={fill} />
              <path d={sleeves.right} fill={fill} />
            </g>
          )}
        </Shaded>
        <rect x="-46" y="-88" width="92" height="14" rx="7" fill={sash} opacity="0.9" />
        {/* rim light down the lit side of the torso */}
        <path
          d="M-38,-146 Q-48,-110 -40,-82"
          stroke={C.cream}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.32"
        />

        <Shaded base={skin} light={0.24} dark={0.34}>
          {(fill) => (
            <g fill={fill}>
              {hands}
              <rect x="-12" y="-166" width="24" height="24" rx="8" />
              <circle cx="0" cy="-198" r="42" />
            </g>
          )}
        </Shaded>

        {/* short beard along the jaw, lighter than the hair so the face stays warm */}
        <path
          d="M-28,-178 Q-32,-152 0,-148 Q32,-152 28,-178 Q14,-170 0,-171 Q-14,-170 -28,-178 Z"
          fill={lighten(hair, 0.22)}
        />
        {face === "happy" ? (
          <path d="M-12,-186 q12,16 24,0 Z" fill="#5a2a2a" />
        ) : (
          <path
            d="M-11,-186 q11,10 22,0"
            stroke={C.ink}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* eyes: sclera, iris, pupil, two highlights */}
        {[-15, 15].map((ex) => (
          <g key={ex}>
            <ellipse cx={ex} cy={-200} rx="8.5" ry="10" fill={C.white} />
            <circle cx={ex + 1} cy={-199} r="5.5" fill="#4a2f1d" />
            <circle cx={ex + 1.5} cy={-198.5} r="3.2" fill={C.ink} />
            <circle cx={ex - 1.5} cy={-202.5} r="2" fill={C.white} />
            <circle cx={ex + 3} cy={-196} r="1" fill={C.white} opacity="0.8" />
          </g>
        ))}
        <path
          d="M-24,-211 q9,-6 18,-2 M6,-213 q9,-4 18,2"
          stroke={darken(hair, 0.1)}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="-26" cy="-188" r="6" fill="#e88b7d" opacity="0.45" />
        <circle cx="26" cy="-188" r="6" fill="#e88b7d" opacity="0.45" />

        {/* headscarf over the crown, falling to the shoulders */}
        <Shaded base={SCARF} light={0.05} dark={0.3}>
          {(fill) => (
            <path
              d="M-46,-206 Q-54,-256 0,-250 Q54,-256 46,-206 L54,-150 Q34,-166 22,-172 L22,-206 Q0,-232 -22,-206 L-22,-172 Q-34,-166 -54,-150 Z"
              fill={fill}
            />
          )}
        </Shaded>
        <rect x="-44" y="-226" width="88" height="10" rx="5" fill={darken(robe, 0.25)} />
        <path
          d="M-36,-236 Q-46,-210 -40,-186"
          stroke={C.cream}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
      </g>
    </g>
  );
}
