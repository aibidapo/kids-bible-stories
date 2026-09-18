import { C } from "./palette";

export type Pose =
  | "stand"
  | "walk"
  | "raise"
  | "point"
  | "pray"
  | "kneel"
  | "throw"
  | "carry"
  | "fear"
  | "lie";
export type Expression =
  | "happy"
  | "calm"
  | "sad"
  | "scared"
  | "stern"
  | "sleep";

export interface PersonProps {
  x: number;
  /** Ground line the figure stands on. */
  y: number;
  /** 1 = roughly 118 units tall. */
  scale?: number;
  /** Mirrors the figure so it faces left. */
  flip?: boolean;
  robe?: string;
  sash?: string;
  skin?: string;
  hair?: string;
  beard?: boolean;
  /** Head covering, the usual shorthand for "this is a Bible story". */
  headscarf?: boolean;
  pose?: Pose;
  face?: Expression;
  /** Gentle breathing/idle motion. */
  idle?: boolean;
  child?: boolean;
}

interface ArmSet {
  back: string;
  front: string;
}

/** Arm paths per pose, drawn from the shoulders at (-13,-76) and (13,-76). */
const ARMS: Record<Pose, ArmSet> = {
  stand: { back: "M-13,-76 q-11,20 -9,38", front: "M13,-76 q11,20 9,38" },
  walk: { back: "M-13,-76 q-16,14 -12,32", front: "M13,-76 q14,16 4,34" },
  raise: { back: "M-13,-76 q-24,-14 -22,-44", front: "M13,-76 q24,-14 22,-44" },
  point: { back: "M-13,-76 q-11,20 -9,36", front: "M13,-76 q26,-6 44,-14" },
  pray: { back: "M-13,-76 q-8,20 6,26", front: "M13,-76 q8,20 -6,26" },
  kneel: { back: "M-13,-76 q-10,18 -4,30", front: "M13,-76 q10,18 4,30" },
  throw: { back: "M-13,-76 q-18,12 -14,30", front: "M13,-76 q20,-26 6,-46" },
  carry: { back: "M-13,-76 q-18,10 -4,22", front: "M13,-76 q18,10 4,22" },
  fear: { back: "M-13,-76 q-26,-6 -24,-30", front: "M13,-76 q26,-6 24,-30" },
  lie: { back: "M-13,-76 q-14,16 -18,26", front: "M13,-76 q14,16 18,26" },
};

function Face({ face, skin }: { face: Expression; skin: string }) {
  const eye = (cx: number) => {
    if (face === "sleep") {
      return (
        <path
          key={cx}
          d={`M${cx - 5},-101 q5,4 10,0`}
          stroke={C.ink}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    if (face === "scared") {
      return (
        <ellipse key={cx} cx={cx} cy={-101} rx="3.6" ry="4.6" fill={C.ink} />
      );
    }
    if (face === "stern") {
      return (
        <g key={cx}>
          <circle cx={cx} cy={-100} r="2.6" fill={C.ink} />
          <path
            d={`M${cx - 6},-107 L${cx + 5},-104`}
            stroke={C.ink}
            strokeWidth="2.4"
            strokeLinecap="round"
            transform={cx < 0 ? "" : `rotate(180 ${cx} -105.5)`}
          />
        </g>
      );
    }
    return <circle key={cx} cx={cx} cy={-101} r="2.9" fill={C.ink} />;
  };

  const mouth =
    face === "sad" || face === "scared"
      ? "M-5,-90 q5,-5 10,0"
      : face === "stern"
        ? "M-5,-91 L5,-91"
        : face === "sleep"
          ? "M-3,-91 q3,3 6,0"
          : "M-6,-93 q6,7 12,0";

  return (
    <g>
      <circle cx="0" cy="-100" r="17" fill={skin} />
      {face === "scared" && (
        <ellipse cx="0" cy="-88" rx="4" ry="5.5" fill={C.ink} opacity="0.85" />
      )}
      {eye(-6)}
      {eye(6)}
      <path
        d={mouth}
        transform="translate(-0.5 0)"
        stroke={C.ink}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      {face !== "stern" && face !== "sleep" && (
        <>
          <circle cx="-12" cy="-94" r="3.4" fill="#e88b7d" opacity="0.5" />
          <circle cx="12" cy="-94" r="3.4" fill="#e88b7d" opacity="0.5" />
        </>
      )}
    </g>
  );
}

/**
 * A stylised storybook figure. Feet sit on y=0 inside the group, so callers only
 * ever position the ground line. Everything above is composed from the same
 * parts, which is what keeps a cast of dozens looking like one book.
 */
export function Person({
  x,
  y,
  scale = 1,
  flip = false,
  robe = C.robe[0],
  sash,
  skin = C.skin[1],
  hair = C.hair[0],
  beard = false,
  headscarf = false,
  pose = "stand",
  face = "happy",
  idle = true,
  child = false,
}: PersonProps) {
  const arms = ARMS[pose];
  const s = scale * (child ? 0.66 : 1);
  const kneeling = pose === "kneel" || pose === "pray";
  const lying = pose === "lie";

  const body = (
    <g>
      {/* back arm sits behind the robe */}
      <path
        d={arms.back}
        stroke={skin}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      {/* robe */}
      <path
        d={
          kneeling
            ? "M-13,-82 L13,-82 L30,-6 Q0,2 -30,-6 Z"
            : "M-13,-82 L13,-82 Q20,-40 24,0 L-24,0 Q-20,-40 -13,-82 Z"
        }
        fill={robe}
      />
      <path
        d={
          kneeling
            ? "M-13,-82 L-4,-82 L-14,-6 Q-24,-4 -30,-6 Z"
            : "M-13,-82 L-4,-82 Q-14,-40 -14,0 L-24,0 Q-20,-40 -13,-82 Z"
        }
        fill="#000"
        opacity="0.1"
      />
      {sash && <path d="M-14,-70 L14,-52 L14,-44 L-14,-62 Z" fill={sash} />}
      {/* neck */}
      <rect x="-5" y="-92" width="10" height="12" fill={skin} />
      {/* front arm */}
      <path
        d={arms.front}
        stroke={skin}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      {/* head */}
      <g className={idle ? "a-nod" : undefined}>
        {!headscarf && (
          <path
            d="M-17,-104 q2,-18 17,-18 q15,0 17,18 q-8,-8 -17,-7 q-9,-1 -17,7 Z"
            fill={hair}
          />
        )}
        <Face face={face} skin={skin} />
        {beard && (
          <path
            d="M-13,-97 q2,20 13,21 q11,-1 13,-21 q-6,12 -13,12 q-7,0 -13,-12 Z"
            fill={hair}
          />
        )}
        {headscarf && (
          <>
            <path
              d="M-20,-99 q0,-24 20,-24 q20,0 20,24 q0,14 -6,20 l-8,-6 q6,-10 4,-20 q-10,-5 -20,0 q-2,10 4,20 l-8,6 q-6,-6 -6,-20 Z"
              fill={C.cream}
            />
            <path
              d="M-19,-104 q6,-4 19,-4 q13,0 19,4"
              stroke="#d9c7a6"
              strokeWidth="3"
              fill="none"
            />
          </>
        )}
      </g>
    </g>
  );

  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) ${lying ? "rotate(-80) translate(-10 -40)" : ""}`}
    >
      <ellipse
        cx="0"
        cy="2"
        rx={lying ? 14 : 26}
        ry="6"
        fill={C.ink}
        opacity="0.16"
      />
      <g className={idle && !lying ? "a-breathe" : undefined}>{body}</g>
    </g>
  );
}

/** A crowd rendered as flattened silhouettes — depth without drawing 30 faces. */
export function Crowd({
  x,
  y,
  count = 6,
  scale = 1,
  spread = 200,
  colors = C.robe,
  opacity = 0.9,
}: {
  x: number;
  y: number;
  count?: number;
  scale?: number;
  spread?: number;
  colors?: readonly string[];
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const px = x - spread / 2 + t * spread;
        const s = scale * (0.82 + ((i * 7) % 5) * 0.06);
        return (
          <g
            key={i}
            transform={`translate(${px} ${y}) scale(${s})`}
            opacity="0.95"
          >
            <ellipse cx="0" cy="2" rx="22" ry="5" fill={C.ink} opacity="0.14" />
            <path
              d="M-12,-74 L12,-74 Q18,-36 22,0 L-22,0 Q-18,-36 -12,-74 Z"
              fill={colors[i % colors.length]}
            />
            <circle cx="0" cy="-90" r="15" fill={C.skin[i % C.skin.length]} />
            <path
              d="M-15,-94 q2,-16 15,-16 q13,0 15,16 q-7,-7 -15,-6 q-8,-1 -15,6 Z"
              fill={C.hair[i % C.hair.length]}
            />
          </g>
        );
      })}
    </g>
  );
}

/** A giant — same construction, deliberately over-scaled and armoured. */
export interface GiantProps {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  face?: Expression;
}

export function Giant({
  x,
  y,
  scale = 1,
  flip = false,
  face = "stern",
}: GiantProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <ellipse cx="0" cy="3" rx="44" ry="9" fill={C.ink} opacity="0.2" />
      <g className="a-breathe-slow">
        {/* legs */}
        <path d="M-22,-70 L-8,-70 L-10,0 L-26,0 Z" fill="#6a6f86" />
        <path d="M8,-70 L22,-70 L26,0 L10,0 Z" fill="#7a7f96" />
        {/* tunic + armour */}
        <path
          d="M-26,-124 L26,-124 Q34,-96 30,-58 L-30,-58 Q-34,-96 -26,-124 Z"
          fill="#8d93ab"
        />
        <path
          d="M-26,-112 L26,-112 M-28,-98 L28,-98 M-29,-84 L29,-84"
          stroke="#6a6f86"
          strokeWidth="5"
        />
        <path
          d="M-30,-124 q-12,4 -14,20"
          stroke={C.skin[2]}
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />
        {/* spear arm */}
        <path
          d="M28,-124 q18,10 22,34"
          stroke={C.skin[2]}
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />
        <line
          x1="52"
          y1="-150"
          x2="46"
          y2="-6"
          stroke="#8a5a3b"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M52,-150 l-9,-16 l18,0 Z" fill="#c9cede" />
        {/* head + helmet */}
        <circle cx="0" cy="-146" r="24" fill={C.skin[2]} />
        <path
          d="M-24,-150 q0,-28 24,-28 q24,0 24,28 q-10,-10 -24,-9 q-14,-1 -24,9 Z"
          fill="#b9bfd2"
        />
        <path
          d="M0,-176 l0,-16"
          stroke="#e0574f"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M-12,-142 l10,3 M12,-142 l-10,3"
          stroke={C.ink}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="-8" cy="-146" r="3.4" fill={C.ink} />
        <circle cx="8" cy="-146" r="3.4" fill={C.ink} />
        <path
          d={face === "stern" ? "M-8,-133 L8,-133" : "M-8,-136 q8,8 16,0"}
          stroke={C.ink}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M-16,-134 q4,22 16,23 q12,-1 16,-23 q-8,14 -16,14 q-8,0 -16,-14 Z"
          fill="#2b2118"
        />
      </g>
    </g>
  );
}

/** A winged messenger, kept abstract and luminous rather than literal. */
export function Angel({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="a-float">
        <g className="a-wing-l">
          <path
            d="M-10,-78 q-46,-36 -74,-14 q26,4 30,18 q-22,2 -28,16 q30,-6 72,-6 Z"
            fill={C.cream}
            opacity="0.95"
          />
        </g>
        <g className="a-wing-r">
          <path
            d="M10,-78 q46,-36 74,-14 q-26,4 -30,18 q22,2 28,16 q-30,-6 -72,-6 Z"
            fill={C.cream}
            opacity="0.95"
          />
        </g>
        <path
          d="M-14,-86 L14,-86 Q22,-44 26,-2 L-26,-2 Q-22,-44 -14,-86 Z"
          fill="#fdfbf2"
        />
        <path
          d="M-14,-80 q-14,16 -12,36"
          stroke={C.skin[0]}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14,-80 q14,16 12,36"
          stroke={C.skin[0]}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="0" cy="-104" r="17" fill={C.skin[0]} />
        <circle cx="-6" cy="-105" r="2.8" fill={C.ink} />
        <circle cx="6" cy="-105" r="2.8" fill={C.ink} />
        <path
          d="M-6,-97 q6,6 12,0"
          stroke={C.ink}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx="0"
          cy="-126"
          rx="20"
          ry="6"
          fill="none"
          stroke={C.sun}
          strokeWidth="5"
          className="a-pulse"
        />
      </g>
    </g>
  );
}
