import { C } from "../art/palette";
import {
  Clouds,
  Ground,
  GrassTufts,
  HolyGlow,
  LightRays,
  Moon,
  Sky,
  Sparkle,
  Stars,
  Sun,
} from "../art/base";
import { Lion } from "../art/animals";
import { Angel, Crowd, Person } from "../art/figures";
import {
  City,
  DenInterior,
  PalmTree,
  PitLight,
  Scroll,
  Throne,
} from "../art/props";
import { Grain, LightShaft, Motes } from "../art/v2/effects";
import { Backdrop, Eyelids, Layer } from "../art/raster";
import denLayers from "../assets/scenes/daniel/den/layers.json";
import denBg from "../assets/scenes/daniel/den/bg.webp";
import denDaniel from "../assets/scenes/daniel/den/daniel.webp";
import denLionA from "../assets/scenes/daniel/den/lion-a.webp";
import denLionB from "../assets/scenes/daniel/den/lion-b.webp";
import denKing from "../assets/scenes/daniel/den/king.webp";
import { SoftShadow } from "../art/v2/effects";
import type { SceneArtProps } from "../types";

/** Three times a day, at the open window. */
export function DanielPrays({ found }: SceneArtProps) {
  return (
    <>
      <defs>
        {/* The arch is used twice — once to cut the view out of the wall, once to
            draw the frame around it — so it is defined in one place. */}
        <clipPath id="daniel-window">
          <path d="M520,470 L520,340 A130,130 0 0 1 780,340 L780,470 Z" />
        </clipPath>
      </defs>

      {/* Daniel's upstairs room, seen from inside. */}
      <rect x="0" y="0" width="1000" height="625" fill="#c9a980" />
      <rect x="0" y="0" width="1000" height="30" fill="#a98a62" />
      <rect x="0" y="498" width="1000" height="127" fill="#b3946b" />
      <path d="M0,498 L1000,498 L1000,510 L0,510 Z" fill="#9c7f5a" />

      {/* The window he would not close. It faces Jerusalem. */}
      <g clipPath="url(#daniel-window)">
        <rect x="500" y="200" width="300" height="300" fill="#8fc6e8" />
        <rect
          x="500"
          y="200"
          width="300"
          height="300"
          fill="#f2c98a"
          opacity="0.35"
        />
        <Sun x={700} y={300} r={26} />
        <ellipse
          cx="580"
          cy="290"
          rx="44"
          ry="16"
          fill="#ffffff"
          opacity="0.85"
        />
        <ellipse
          cx="612"
          cy="278"
          rx="30"
          ry="14"
          fill="#ffffff"
          opacity="0.8"
        />
        <City x={650} y={470} scale={0.28} />
      </g>
      <path
        d="M520,470 L520,340 A130,130 0 0 1 780,340 L780,470 Z"
        fill="none"
        stroke="#a98a62"
        strokeWidth="16"
      />
      <path
        d="M650,216 L650,470 M524,352 L776,352"
        stroke="#a98a62"
        strokeWidth="10"
      />
      <rect x="502" y="466" width="296" height="22" rx="8" fill="#a98a62" />

      <LightRays x={650} y={300} count={6} len={460} />
      <HolyGlow x={430} y={430} r={210} />

      {/* the room's few furnishings, so it reads as a home */}
      <ellipse
        cx="330"
        cy="596"
        rx="190"
        ry="26"
        fill="#9c5f5a"
        opacity="0.8"
      />
      <ellipse
        cx="330"
        cy="592"
        rx="150"
        ry="18"
        fill="#b5735f"
        opacity="0.8"
      />
      <g transform="translate(860 498)">
        <rect x="-34" y="-96" width="68" height="96" rx="6" fill="#a98a62" />
        <path d="M-18,-96 q18,-30 36,0 Z" fill="#c9a980" />
        <circle cx="0" cy="-116" r="12" fill={C.sun} className="a-pulse" />
      </g>

      <Person
        x={330}
        y={588}
        scale={1.35}
        robe={C.robe[2]}
        sash={C.sun}
        skin={C.skin[2]}
        hair={C.hair[1]}
        beard
        headscarf
        pose="pray"
        face="calm"
      />
      {found.includes("window") && <Sparkle x={650} y={300} s={2} />}
    </>
  );
}

/** A brand new law, written to trap one man. */
export function TheTrap() {
  return (
    <>
      <Sky from="#5b4a8a" to="#c98f8a" />
      <Stars count={18} seed={52} maxY={160} />
      <Clouds
        y={140}
        count={3}
        seed={52}
        fill="#d9c2d6"
        opacity={0.7}
        speed={50}
      />
      <rect x="0" y="300" width="1000" height="325" fill="#8f7fa8" />
      <path d="M0,300 L1000,300 L1000,318 L0,318 Z" fill="#7a6b92" />
      {[120, 880].map((x) => (
        <g key={x}>
          <rect x={x - 26} y={60} width="52" height="250" fill="#b9a8cc" />
          <rect
            x={x - 36}
            y={44}
            width="72"
            height="22"
            rx="6"
            fill="#cdbfdd"
          />
        </g>
      ))}
      <Throne x={640} y={300} scale={0.9} />
      <Person
        x={640}
        y={296}
        scale={1.05}
        robe="#f0c97a"
        sash="#e0574f"
        skin={C.skin[3]}
        hair={C.hair[1]}
        beard
        pose="stand"
        face="sad"
      />
      <path
        d="M636,186 q-22,-18 0,-26 q22,-8 22,10 q0,10 -22,16 Z"
        fill={C.sun}
      />
      <Scroll x={330} y={400} scale={0.9} />
      <Person
        x={230}
        y={560}
        scale={1.05}
        robe="#6b3fa8"
        skin={C.skin[1]}
        hair={C.hair[4]}
        beard
        pose="point"
        face="stern"
      />
      <Person
        x={430}
        y={566}
        scale={1}
        robe="#4a4a6a"
        skin={C.skin[2]}
        hair={C.hair[0]}
        beard
        pose="point"
        face="stern"
        flip
      />
      <Crowd x={860} y={580} count={3} scale={0.5} spread={120} opacity={0.5} />
    </>
  );
}

/** Down into the den, and a stone rolled over the top. */
export function IntoTheDen() {
  const L = denLayers.cutouts;
  return (
    <>
      <Backdrop src={denBg} />
      {/* the backdrop paints its own shaft; this one only adds the slow pulse */}
      <g opacity="0.45">
        <LightShaft x={500} top={48} topWidth={80} bottomSpread={240} floorY={560} />
      </g>
      {/* the king peers down through the opening */}
      <Layer src={denKing} w={L.king.w} h={L.king.h} x={500} y={74} scale={0.22} />
      {/* far lion, behind Daniel's shoulder */}
      <SoftShadow x={640} y={548} rx={95} ry={14} opacity={0.35} />
      <Layer
        src={denLionB}
        w={L["lion-b"].w}
        h={L["lion-b"].h}
        x={640}
        y={548}
        scale={0.34}
        className="a-breathe-slow"
      />
      <SoftShadow x={500} y={590} rx={80} ry={14} opacity={0.4} />
      <Layer
        src={denDaniel}
        w={L.daniel.w}
        h={L.daniel.h}
        x={500}
        y={590}
        scale={0.41}
        className="a-breathe"
      >
        {/* pupils measured on daniel.webp; lid tone sampled from the forehead */}
        <Eyelids
          points={[
            [174, 127],
            [247, 127],
          ]}
          w={L.daniel.w}
          h={L.daniel.h}
          rx={15}
          ry={13}
          tone="#c68058"
        />
      </Layer>
      <SoftShadow x={255} y={612} rx={200} ry={20} opacity={0.4} />
      <Layer
        src={denLionA}
        w={L["lion-a"].w}
        h={L["lion-a"].h}
        x={255}
        y={612}
        scale={0.5}
        className="a-breathe-slow"
      />
      <SoftShadow x={760} y={618} rx={170} ry={20} opacity={0.4} />
      <Layer
        src={denLionB}
        w={L["lion-b"].w}
        h={L["lion-b"].h}
        x={760}
        y={618}
        scale={0.5}
        flip
        className="a-breathe-slow"
      />
      <Motes x={500} top={110} bottom={540} spread={200} />
      <Grain opacity={0.05} />
    </>
  );
}

/** An angel shut the lions' mouths. */
export function AngelShutsTheMouths({ found }: SceneArtProps) {
  return (
    <>
      <DenInterior />
      <PitLight x={500} top={70} spread={180} />
      <HolyGlow x={500} y={300} r={330} />
      <Angel x={500} y={330} scale={1.1} />
      <Person
        x={330}
        y={560}
        scale={1.1}
        robe={C.robe[2]}
        sash={C.sun}
        skin={C.skin[2]}
        hair={C.hair[1]}
        beard
        headscarf
        pose="pray"
        face="calm"
      />
      <Lion x={660} y={572} scale={0.6} flip asleep />
      <Lion x={830} y={600} scale={0.5} flip asleep />
      <Lion x={170} y={600} scale={0.52} asleep />
      <Sparkle x={300} y={260} s={1.6} />
      <Sparkle x={720} y={230} s={1.4} delay={0.6} />
      <Sparkle x={560} y={470} s={1.2} delay={1.1} />
      {found.includes("lions") && (
        <Sparkle x={660} y={500} s={1.6} delay={0.3} />
      )}
    </>
  );
}

/** Morning. The king runs to the den, and Daniel answers. */
export function TheKingRejoices({ found }: SceneArtProps) {
  return (
    <>
      <Sky from="#f0a05c" to="#ffe8c4" />
      <Sun x={760} y={150} r={54} />
      <Moon x={120} y={110} r={26} />
      <Stars count={8} seed={55} maxY={120} />
      <Clouds y={170} count={4} seed={55} fill="#ffe9d2" speed={70} />
      <City x={620} y={400} scale={0.44} />
      <Ground y={450} fill="#d0b585" top="#e0c79a" />
      {/* the open mouth of the den */}
      <ellipse cx="480" cy="520" rx="160" ry="48" fill="#3a3346" />
      <ellipse cx="480" cy="512" rx="160" ry="48" fill="#241f2e" />
      <path d="M660,540 q60,-40 116,6 q-56,34 -116,-6 Z" fill="#8a8296" />
      <LightRays x={480} y={512} count={7} len={420} color="#ffe08a" />
      <HolyGlow x={480} y={470} r={220} />
      <Person
        x={430}
        y={506}
        scale={1.05}
        robe={C.robe[2]}
        sash={C.sun}
        skin={C.skin[2]}
        hair={C.hair[1]}
        beard
        headscarf
        pose="raise"
        face="happy"
      />
      <Person
        x={250}
        y={572}
        scale={1.2}
        robe="#f0c97a"
        sash="#e0574f"
        skin={C.skin[3]}
        hair={C.hair[1]}
        beard
        pose="raise"
        face="happy"
      />
      <path
        d="M246,452 q-24,-20 0,-28 q24,-8 24,10 q0,12 -24,18 Z"
        fill={C.sun}
      />
      <Crowd
        x={840}
        y={584}
        count={5}
        scale={0.55}
        spread={220}
        opacity={0.85}
      />
      <Lion x={600} y={560} scale={0.4} flip asleep />
      <PalmTree x={90} y={540} scale={0.72} />
      <GrassTufts y={470} count={12} seed={55} fill="#bfa470" />
      <Sparkle x={380} y={330} s={1.6} />
      {found.includes("king") && (
        <Sparkle x={250} y={420} s={1.7} delay={0.4} />
      )}
    </>
  );
}
