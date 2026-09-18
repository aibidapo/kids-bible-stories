import { C, randIn } from "./palette";

interface CreatureProps {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  className?: string;
  /** Sleeping animals get closed eyes — used when the lions' mouths are shut. */
  asleep?: boolean;
}

function wrap(
  { x, y, scale = 1, flip = false, className }: CreatureProps,
  children: React.ReactNode,
  shadow = 30,
) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <ellipse cx="0" cy="2" rx={shadow} ry="6" fill={C.ink} opacity="0.16" />
      <g className={className}>{children}</g>
    </g>
  );
}

export function Lion(p: CreatureProps) {
  const eyes = p.asleep ? (
    <>
      <path
        d="M22,-56 q5,4 10,0"
        stroke={C.ink}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M40,-56 q5,4 10,0"
        stroke={C.ink}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ) : (
    <>
      <circle cx="27" cy="-57" r="3" fill={C.ink} />
      <circle cx="45" cy="-57" r="3" fill={C.ink} />
    </>
  );
  return wrap(
    p,
    <>
      <path
        d="M-46,-6 L-42,-34 M-24,-6 L-22,-34 M18,-6 L20,-32 M36,-6 L36,-32"
        stroke="#d09a4e"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M-52,-58 q-6,-22 14,-26 l50,-2 q26,0 26,22 q0,20 -26,22 l-48,0 q-16,0 -16,-16 Z"
        fill="#e0aa5c"
      />
      <path
        d="M-52,-56 q-22,-10 -28,-26 q16,8 24,6 q-10,-14 -6,-28 q10,14 18,16"
        fill="#d09a4e"
        className={p.className ? undefined : "a-tail"}
      />
      {/* mane */}
      <circle cx="36" cy="-56" r="40" fill="#c9833c" />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse
          key={i}
          cx={36}
          cy={-56}
          rx="44"
          ry="13"
          fill="#b87232"
          transform={`rotate(${i * 30} 36 -56)`}
          opacity="0.75"
        />
      ))}
      <circle cx="36" cy="-56" r="30" fill="#f0c274" />
      {eyes}
      <ellipse cx="36" cy="-44" rx="8" ry="6" fill="#e08a6a" />
      <path
        d="M36,-40 q-8,10 -16,4 M36,-40 q8,10 16,4"
        stroke={C.ink}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="16" cy="-82" r="9" fill="#c9833c" />
      <circle cx="56" cy="-82" r="9" fill="#c9833c" />
    </>,
    54,
  );
}

export function Sheep(p: CreatureProps) {
  return wrap(
    p,
    <>
      <path
        d="M-18,-6 L-18,-22 M-2,-6 L-2,-22 M16,-6 L16,-22 M28,-6 L28,-22"
        stroke="#4a4450"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <ellipse cx="4" cy="-38" rx="34" ry="24" fill={C.white} />
      <circle cx="-22" cy="-44" r="12" fill={C.white} />
      <circle cx="-4" cy="-56" r="13" fill={C.white} />
      <circle cx="18" cy="-54" r="12" fill={C.white} />
      <circle cx="32" cy="-42" r="11" fill={C.white} />
      <ellipse cx="40" cy="-52" rx="14" ry="16" fill="#4a4450" />
      <ellipse
        cx="54"
        cy="-58"
        rx="9"
        ry="7"
        fill="#4a4450"
        transform="rotate(-24 54 -58)"
      />
      <circle cx="44" cy="-56" r="2.6" fill={C.white} />
      <path
        d="M28,-62 q-4,-12 6,-14"
        stroke="#4a4450"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </>,
    40,
  );
}

export function Bird({
  x,
  y,
  scale = 1,
  color = "#e0574f",
  delay = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  delay?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="a-fly" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx="0" cy="0" rx="16" ry="10" fill={color} />
        <circle cx="14" cy="-6" r="8" fill={color} />
        <path d="M21,-6 l10,3 l-10,3 Z" fill={C.sun} />
        <circle cx="16" cy="-8" r="1.8" fill={C.ink} />
        <path d="M-18,0 l-14,-6 l4,8 Z" fill={color} opacity="0.85" />
        <g className="a-flap" style={{ animationDelay: `${delay}s` }}>
          <path
            d="M-2,-4 q-14,-20 -26,-14 q12,4 12,12 q-4,8 16,6 Z"
            fill="#ffffff"
            opacity="0.9"
          />
        </g>
      </g>
    </g>
  );
}

export function Dove({
  x,
  y,
  scale = 1,
  branch = false,
}: {
  x: number;
  y: number;
  scale?: number;
  branch?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="a-float">
        <ellipse cx="0" cy="0" rx="20" ry="12" fill={C.white} />
        <path
          d="M-20,0 q-16,-4 -24,-12 q2,10 -2,16 q12,2 26,0 Z"
          fill="#f2f6ff"
        />
        <circle cx="17" cy="-8" r="9" fill={C.white} />
        <path d="M25,-8 l10,3 l-10,3 Z" fill={C.sun} />
        <circle cx="19" cy="-10" r="1.9" fill={C.ink} />
        <g className="a-flap">
          <path
            d="M-4,-6 q-10,-26 -28,-22 q14,6 12,16 q-2,10 20,10 Z"
            fill="#eef4ff"
          />
        </g>
        {branch && (
          <g transform="translate(26 -2)">
            <path
              d="M0,0 q16,-4 30,-2"
              stroke="#5c8c3a"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx="12"
              cy="-6"
              rx="7"
              ry="4"
              fill={C.grass}
              transform="rotate(-20 12 -6)"
            />
            <ellipse
              cx="24"
              cy="-7"
              rx="7"
              ry="4"
              fill={C.grassDark}
              transform="rotate(-14 24 -7)"
            />
            <ellipse
              cx="19"
              cy="3"
              rx="6"
              ry="3.6"
              fill={C.grass}
              transform="rotate(18 19 3)"
            />
          </g>
        )}
      </g>
    </g>
  );
}

export function Fish({
  x,
  y,
  scale = 1,
  color = "#f0913c",
  delay = 0,
  flip = false,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  delay?: number;
  flip?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <g className="a-swim" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx="0" cy="0" rx="22" ry="13" fill={color} />
        <path d="M-20,0 l-16,-12 l0,24 Z" fill={color} opacity="0.85" />
        <path d="M0,-12 l6,-10 l8,10 Z" fill={color} opacity="0.7" />
        <circle cx="12" cy="-4" r="3" fill={C.white} />
        <circle cx="13" cy="-4" r="1.6" fill={C.ink} />
        <path
          d="M2,-9 q-8,9 0,18"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </g>
    </g>
  );
}

/** The "great fish" of Jonah — big enough to be a room, friendly enough not to scare. */
export function BigFish({
  x,
  y,
  scale = 1,
  flip = false,
  mouthOpen = false,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  mouthOpen?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <g className="a-swim-slow">
        <path
          d="M-150,0 q-40,-46 -74,-56 q14,52 0,110 q40,-12 74,-54 Z"
          fill="#2f6f9e"
        />
        <path
          d="M-160,0 q0,-92 90,-116 q110,-30 190,44 q34,32 34,72 q0,40 -34,72 q-80,74 -190,44 q-90,-24 -90,-116 Z"
          fill="#3a86bd"
        />
        <path
          d="M-160,0 q0,60 40,96 q110,26 190,-12 q60,-30 78,-84 Z"
          fill="#2c6b9b"
          opacity="0.6"
        />
        <path d="M40,-108 q10,-46 46,-58 q-6,34 8,58 Z" fill="#2f6f9e" />
        <circle cx="122" cy="-34" r="16" fill={C.white} />
        <circle cx="126" cy="-34" r="8" fill={C.ink} />
        <circle cx="130" cy="-38" r="3" fill={C.white} />
        {mouthOpen ? (
          <path
            d="M148,-8 q-40,10 -86,8 q30,44 86,36 q16,-22 0,-44 Z"
            fill="#8c3f4e"
          />
        ) : (
          <path
            d="M150,4 q-46,26 -96,18"
            stroke="#245a83"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {Array.from({ length: 5 }, (_, i) => (
          <path
            key={i}
            d={`M${-100 + i * 42},-36 q14,34 0,66`}
            stroke="#2c6b9b"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
          />
        ))}
      </g>
    </g>
  );
}

export function Elephant(p: CreatureProps) {
  return wrap(
    p,
    <>
      <path
        d="M-34,-6 L-34,-34 M-8,-6 L-8,-34 M20,-6 L20,-32 M42,-6 L42,-32"
        stroke="#8e93a8"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <ellipse cx="0" cy="-54" rx="52" ry="34" fill="#9aa0b5" />
      <circle cx="52" cy="-62" r="30" fill="#a6acc0" />
      <ellipse
        cx="44"
        cy="-68"
        rx="20"
        ry="24"
        fill="#8e93a8"
        className="a-ear"
      />
      <path
        d="M74,-56 q16,18 6,42 q-2,10 -12,6 q8,-22 -6,-38 Z"
        fill="#a6acc0"
        className="a-trunk"
      />
      <circle cx="62" cy="-68" r="3" fill={C.ink} />
      <path
        d="M-50,-66 q-16,4 -12,20"
        stroke="#8e93a8"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </>,
    60,
  );
}

export function Giraffe(p: CreatureProps) {
  return wrap(
    p,
    <>
      <path
        d="M-24,-6 L-24,-44 M-4,-6 L-4,-44 M14,-6 L14,-44 M30,-6 L30,-44"
        stroke="#e0b35e"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <ellipse cx="2" cy="-62" rx="38" ry="24" fill="#f0c97a" />
      <path d="M26,-76 q10,-54 22,-72 l20,6 q-14,20 -22,72 Z" fill="#f0c97a" />
      <ellipse
        cx="60"
        cy="-152"
        rx="19"
        ry="14"
        fill="#f0c97a"
        transform="rotate(-16 60 -152)"
      />
      <circle cx="70" cy="-158" r="2.8" fill={C.ink} />
      <path
        d="M52,-164 l-3,-14 M64,-166 l2,-14"
        stroke="#e0b35e"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="49" cy="-180" r="4" fill="#c99a4a" />
      <circle cx="66" cy="-181" r="4" fill="#c99a4a" />
      {[
        [-18, -70],
        [6, -58],
        [24, -66],
        [-4, -74],
        [16, -48],
        [38, -100],
        [44, -124],
      ].map(([cx, cy], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx="9"
          ry="7"
          fill="#c98f3e"
          opacity="0.7"
        />
      ))}
    </>,
    44,
  );
}

export function Camel(p: CreatureProps) {
  return wrap(
    p,
    <>
      <path
        d="M-26,-6 L-26,-40 M-6,-6 L-6,-40 M14,-6 L14,-40 M32,-6 L32,-40"
        stroke="#c99a68"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <ellipse cx="2" cy="-58" rx="42" ry="22" fill="#dcae78" />
      <path
        d="M-22,-70 q10,-24 22,-2 q12,-22 22,0 q-22,10 -44,2 Z"
        fill="#dcae78"
      />
      <path d="M36,-70 q16,-30 26,-42 l16,6 q-12,16 -20,44 Z" fill="#dcae78" />
      <ellipse
        cx="76"
        cy="-116"
        rx="17"
        ry="12"
        fill="#dcae78"
        transform="rotate(-18 76 -116)"
      />
      <circle cx="84" cy="-122" r="2.8" fill={C.ink} />
      <path
        d="M-42,-60 q-12,6 -10,20"
        stroke="#c99a68"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </>,
    46,
  );
}

export function Zebra(p: CreatureProps) {
  return wrap(
    p,
    <>
      <path
        d="M-26,-6 L-26,-40 M-6,-6 L-6,-40 M14,-6 L14,-40 M32,-6 L32,-40"
        stroke="#efeae2"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <ellipse cx="2" cy="-58" rx="42" ry="24" fill="#f4f1ea" />
      <path d="M38,-70 q18,-16 30,-22 l12,10 q-14,10 -24,26 Z" fill="#f4f1ea" />
      <ellipse
        cx="80"
        cy="-92"
        rx="18"
        ry="12"
        fill="#f4f1ea"
        transform="rotate(-20 80 -92)"
      />
      <circle cx="88" cy="-96" r="2.8" fill={C.ink} />
      {[-30, -16, -2, 12, 26].map((cx, i) => (
        <path
          key={i}
          d={`M${cx},-80 q5,22 0,44`}
          stroke="#2b2b2b"
          strokeWidth="7"
          fill="none"
          opacity="0.9"
        />
      ))}
      <path
        d="M48,-82 q8,10 12,22"
        stroke="#2b2b2b"
        strokeWidth="6"
        fill="none"
      />
      <path
        d="M-44,-62 q-12,8 -8,22"
        stroke="#2b2b2b"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </>,
    46,
  );
}

export function Butterfly({
  x,
  y,
  scale = 1,
  color = "#d94f8a",
  delay = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  delay?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="a-flutter" style={{ animationDelay: `${delay}s` }}>
        <g className="a-flap-fast">
          <ellipse cx="-10" cy="-6" rx="11" ry="9" fill={color} />
          <ellipse cx="10" cy="-6" rx="11" ry="9" fill={color} />
          <ellipse cx="-8" cy="6" rx="8" ry="7" fill={color} opacity="0.8" />
          <ellipse cx="8" cy="6" rx="8" ry="7" fill={color} opacity="0.8" />
        </g>
        <ellipse cx="0" cy="0" rx="2.6" ry="11" fill={C.ink} />
      </g>
    </g>
  );
}

/** A scatter of small creatures, for "and God filled the sea with life". */
export function FishSchool({
  y,
  count = 9,
  seed = 5,
  colors = ["#f0913c", "#e0574f", "#f6c63c", "#3aa889"],
}: {
  y: number;
  count?: number;
  seed?: number;
  colors?: string[];
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const s = seed * 20 + i;
        return (
          <Fish
            key={i}
            x={randIn(s, 40, 960)}
            y={y + randIn(s + 0.4, -60, 90)}
            scale={randIn(s + 0.8, 0.45, 0.95)}
            color={colors[i % colors.length]}
            delay={randIn(s + 1.2, 0, 3)}
            flip={i % 3 === 0}
          />
        );
      })}
    </g>
  );
}
