import { C, randIn } from "./palette";

export function Tree({
  x,
  y,
  scale = 1,
  fruit = false,
}: {
  x: number;
  y: number;
  scale?: number;
  fruit?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="2" rx="34" ry="8" fill={C.ink} opacity="0.16" />
      <path d="M-9,0 L-6,-70 L6,-70 L9,0 Z" fill={C.soil} />
      <path
        d="M-4,-52 q-18,-8 -26,-22 M4,-62 q18,-6 26,-20"
        stroke={C.soil}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <g className="a-sway-slow">
        <circle cx="0" cy="-104" r="46" fill={C.grassDark} />
        <circle cx="-34" cy="-84" r="32" fill={C.grass} />
        <circle cx="34" cy="-86" r="30" fill={C.grass} />
        <circle cx="-6" cy="-128" r="30" fill={C.grassLight} />
        <circle cx="22" cy="-112" r="26" fill={C.grassLight} opacity="0.8" />
        {fruit &&
          [
            [-28, -92],
            [20, -98],
            [-4, -122],
            [34, -80],
            [6, -84],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="7" fill="#e0574f" />
          ))}
      </g>
    </g>
  );
}

export function PalmTree({
  x,
  y,
  scale = 1,
  flip = false,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <ellipse cx="0" cy="2" rx="26" ry="7" fill={C.ink} opacity="0.16" />
      <path d="M-8,0 q6,-70 22,-116 l12,6 q-18,48 -22,110 Z" fill="#a9763f" />
      <g className="a-sway">
        {[-150, -110, -60, -15, 25, 60].map((a, i) => (
          <path
            key={i}
            d="M0,0 q34,-22 72,-8 q-32,-4 -52,16 q-14,-6 -20,-8 Z"
            fill={i % 2 ? C.grassDark : C.grass}
            transform={`translate(22 -118) rotate(${a})`}
          />
        ))}
        <circle cx="22" cy="-116" r="8" fill="#8a5a3b" />
        <circle cx="34" cy="-108" r="6" fill="#c98f3e" />
        <circle cx="12" cy="-106" r="6" fill="#c98f3e" />
      </g>
    </g>
  );
}

export function Bush({
  x,
  y,
  scale = 1,
  color = C.grassDark,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="-16" cy="-12" r="17" fill={color} />
      <circle cx="12" cy="-14" r="19" fill={color} />
      <circle cx="-2" cy="-24" r="18" fill={C.grass} />
    </g>
  );
}

export function Flowers({
  y,
  count = 14,
  seed = 7,
}: {
  y: number;
  count?: number;
  seed?: number;
}) {
  const cols = ["#f6c63c", "#e0574f", "#d94f8a", "#ffffff", "#b98cf0"];
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const s = seed * 40 + i;
        const x = randIn(s, 20, 980);
        const yy = y + randIn(s + 0.5, 0, 90);
        const sc = randIn(s + 0.9, 0.7, 1.3);
        const c = cols[i % cols.length];
        return (
          <g key={i} transform={`translate(${x} ${yy}) scale(${sc})`}>
            <g
              className="a-sway"
              style={{ animationDelay: `${randIn(s + 1.4, 0, 3)}s` }}
            >
              <path
                d="M0,0 L0,-14"
                stroke={C.grassDark}
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="0"
                  cy="-19"
                  rx="3.4"
                  ry="5.4"
                  fill={c}
                  transform={`rotate(${a} 0 -14)`}
                />
              ))}
              <circle cx="0" cy="-14" r="2.8" fill={C.sun} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

export function Mountains({
  y = 380,
  back = "#6f7fa8",
  front = "#55638a",
}: {
  y?: number;
  back?: string;
  front?: string;
}) {
  return (
    <g>
      <path d={`M-40,${y + 80} L140,${y - 140} L320,${y + 80} Z`} fill={back} />
      <path
        d={`M240,${y + 80} L430,${y - 190} L620,${y + 80} Z`}
        fill={front}
      />
      <path
        d={`M430,${y - 190} L470,${y - 140} L430,${y - 126} L392,${y - 142} Z`}
        fill="#eaf1ff"
      />
      <path d={`M560,${y + 80} L740,${y - 120} L940,${y + 80} Z`} fill={back} />
    </g>
  );
}

/** Noah's ark — a friendly houseboat rather than a shipwreck. */
export function Ark({
  x,
  y,
  scale = 1,
  doorOpen = false,
}: {
  x: number;
  y: number;
  scale?: number;
  doorOpen?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M-210,-40 q-16,60 60,84 q150,26 300,0 q76,-24 60,-84 Z"
        fill="#a9763f"
      />
      <path d="M-210,-40 L210,-40 L210,-22 L-210,-22 Z" fill="#8a5a3b" />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${-190 + i * 46},-36 q-4,40 6,66`}
          stroke="#8a5a3b"
          strokeWidth="3"
          fill="none"
          opacity="0.6"
        />
      ))}
      {/* cabin */}
      <path d="M-150,-42 L-150,-140 L150,-140 L150,-42 Z" fill="#c99a68" />
      <path d="M-172,-140 L0,-206 L172,-140 Z" fill="#b5533f" />
      <path d="M-172,-140 L172,-140 L172,-128 L-172,-128 Z" fill="#9a4232" />
      {[-110, -50, 50, 110].map((cx) => (
        <g key={cx}>
          <rect
            x={cx - 20}
            y={-116}
            width="40"
            height="34"
            rx="6"
            fill="#6fa8d6"
          />
          <path
            d={`M${cx},-116 L${cx},-82 M${cx - 20},-99 L${cx + 20},-99`}
            stroke="#8a5a3b"
            strokeWidth="3"
          />
        </g>
      ))}
      {doorOpen ? (
        <>
          <rect x="-24" y="-112" width="48" height="70" rx="6" fill="#3a2a1e" />
          <rect
            x="24"
            y="-112"
            width="14"
            height="70"
            rx="4"
            fill="#8a5a3b"
            transform="skewY(-8)"
          />
        </>
      ) : (
        <>
          <rect x="-24" y="-112" width="48" height="70" rx="6" fill="#8a5a3b" />
          <circle cx="12" cy="-76" r="4" fill="#f6c63c" />
        </>
      )}
    </g>
  );
}

/** A small wooden sailing boat, for Jonah's ship. */
export function Ship({
  x,
  y,
  scale = 1,
  sailFull = true,
  className,
}: {
  x: number;
  y: number;
  scale?: number;
  sailFull?: boolean;
  className?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={className}>
        <line
          x1="0"
          y1="-30"
          x2="0"
          y2="-210"
          stroke="#8a5a3b"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <line
          x1="-80"
          y1="-188"
          x2="80"
          y2="-188"
          stroke="#8a5a3b"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d={
            sailFull
              ? "M-78,-186 q90,26 156,0 q-16,70 -4,130 q-74,20 -148,0 q12,-60 -4,-130 Z"
              : "M-78,-186 q90,10 156,0 q-30,60 -20,120 q-58,10 -116,0 q10,-60 -20,-120 Z"
          }
          fill={C.cream}
        />
        <path
          d="M-40,-180 q10,66 6,124 M40,-180 q-10,66 -6,124"
          stroke="#ddd0b8"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M-130,-34 q-10,46 46,66 q84,18 168,0 q56,-20 46,-66 Z"
          fill="#a9763f"
        />
        <path d="M-130,-34 L130,-34 L130,-18 L-130,-18 Z" fill="#8a5a3b" />
        <path d="M124,-38 q22,-14 26,-40 q-22,8 -30,34 Z" fill="#8a5a3b" />
      </g>
    </g>
  );
}

/** Stone walls and towers of a city. */
export function City({
  x,
  y,
  scale = 1,
  warm = true,
}: {
  x: number;
  y: number;
  scale?: number;
  warm?: boolean;
}) {
  const wall = warm ? "#d9b986" : "#9c93a8";
  const dark = warm ? "#bb9764" : "#7b7288";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-260,0 L-260,-120 L260,-120 L260,0 Z" fill={wall} />
      {Array.from({ length: 14 }, (_, i) => (
        <rect
          key={i}
          x={-260 + i * 38}
          y={-140}
          width="24"
          height="22"
          fill={wall}
        />
      ))}
      <path d="M-40,0 L-40,-70 q40,-42 80,0 L40,0 Z" fill={dark} />
      <path d="M-30,0 L-30,-66 q30,-34 60,0 L30,0 Z" fill="#6b5340" />
      {[-200, -120, 120, 200].map((cx) => (
        <rect
          key={cx}
          x={cx - 14}
          y={-92}
          width="28"
          height="36"
          rx="4"
          fill={dark}
        />
      ))}
      {[-220, 220].map((cx) => (
        <g key={cx}>
          <rect x={cx - 42} y={-210} width="84" height="212" fill={wall} />
          {Array.from({ length: 3 }, (_, i) => (
            <rect
              key={i}
              x={cx - 42 + i * 30}
              y={-232}
              width="20"
              height="22"
              fill={wall}
            />
          ))}
          <rect
            x={cx - 14}
            y={-180}
            width="28"
            height="40"
            rx="6"
            fill={dark}
          />
        </g>
      ))}
      <path
        d="M-260,-120 L260,-120 M-260,-80 L260,-80 M-260,-40 L260,-40"
        stroke={dark}
        strokeWidth="3"
        opacity="0.5"
      />
    </g>
  );
}

/** The mouth of a stone pit, drawn as an interior so figures can stand inside. */
export function DenInterior() {
  return (
    <g>
      <rect x="0" y="0" width="1000" height="625" fill="#3a3346" />
      <path
        d="M0,0 L1000,0 L1000,150 Q820,230 500,232 Q180,230 0,150 Z"
        fill="#241f2e"
      />
      <path
        d="M0,470 Q250,430 500,448 Q750,430 1000,470 L1000,625 L0,625 Z"
        fill="#2b2536"
      />
      {[
        [120, 300],
        [880, 320],
        [220, 420],
        [790, 430],
        [60, 200],
        [940, 210],
      ].map(([cx, cy], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={randIn(i, 40, 90)}
          ry={randIn(i + 0.5, 30, 60)}
          fill="#443c52"
          opacity="0.7"
        />
      ))}
    </g>
  );
}

/** Shaft of daylight down into the pit, from the opening above. */
export function PitLight({
  x = 500,
  top = 60,
  spread = 150,
}: {
  x?: number;
  top?: number;
  spread?: number;
}) {
  return (
    <g className="a-pulse-soft">
      <path
        d={`M${x - 70},${top} L${x + 70},${top} L${x + spread},625 L${x - spread},625 Z`}
        fill={C.glow}
        opacity="0.2"
      />
      <ellipse
        cx={x}
        cy={top}
        rx="74"
        ry="20"
        fill={C.sunCore}
        opacity="0.45"
      />
    </g>
  );
}

export function Throne({
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
      <path d="M-70,0 L-70,-60 L70,-60 L70,0 Z" fill="#8a5a3b" />
      <path d="M-62,-60 L-62,-190 q62,-26 124,0 L62,-60 Z" fill="#7a4fc4" />
      <path d="M-62,-60 L-62,-190 q30,-13 62,-18 l0,148 Z" fill="#8f66d6" />
      <rect x="-86" y="-120" width="24" height="70" rx="6" fill="#6b3fa8" />
      <rect x="62" y="-120" width="24" height="70" rx="6" fill="#6b3fa8" />
      <circle cx="0" cy="-196" r="12" fill={C.sun} />
      <circle cx="-44" cy="-186" r="8" fill={C.sun} />
      <circle cx="44" cy="-186" r="8" fill={C.sun} />
    </g>
  );
}

export function Rocks({
  y = 500,
  seed = 9,
  count = 6,
  fill = C.rock,
}: {
  y?: number;
  seed?: number;
  count?: number;
  fill?: string;
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const s = seed * 15 + i;
        const x = randIn(s, 20, 980);
        const w = randIn(s + 0.4, 16, 44);
        const yy = y + randIn(s + 0.8, 0, 90);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={yy}
            rx={w}
            ry={w * 0.6}
            fill={fill}
            opacity="0.85"
          />
        );
      })}
    </g>
  );
}

/** A shepherd's sling, mid-whirl. */
export function Sling({
  x,
  y,
  scale = 1,
  spinning = true,
}: {
  x: number;
  y: number;
  scale?: number;
  spinning?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={spinning ? "a-spin-fast" : undefined}>
        <ellipse
          cx="0"
          cy="0"
          rx="34"
          ry="34"
          fill="none"
          stroke="#c9a06a"
          strokeWidth="3"
          strokeDasharray="6 8"
          opacity="0.6"
        />
        <path
          d="M0,0 L-26,20 M0,0 L-30,10"
          stroke="#8a5a3b"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <ellipse
          cx="-30"
          cy="16"
          rx="11"
          ry="8"
          fill="#a9763f"
          transform="rotate(30 -30 16)"
        />
        <circle cx="-30" cy="16" r="5" fill="#6d6577" />
      </g>
    </g>
  );
}

export function Tent({
  x,
  y,
  scale = 1,
  color = "#c9834f",
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-70,0 L0,-84 L70,0 Z" fill={color} />
      <path d="M0,-84 L70,0 L34,0 Z" fill="#000" opacity="0.12" />
      <path d="M-14,0 L0,-46 L14,0 Z" fill="#5a4230" />
      <path
        d="M0,-84 L0,-96"
        stroke="#8a5a3b"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Simple stone-tablet / scroll shape for laws and decrees. */
export function Scroll({
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
      <rect x="-44" y="-56" width="88" height="112" rx="6" fill={C.cream} />
      <rect x="-52" y="-64" width="104" height="14" rx="7" fill="#c9a06a" />
      <rect x="-52" y="50" width="104" height="14" rx="7" fill="#c9a06a" />
      {[-34, -16, 2, 20, 38].map((yy) => (
        <line
          key={yy}
          x1="-30"
          y1={yy}
          x2="30"
          y2={yy}
          stroke="#b9a88c"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}
