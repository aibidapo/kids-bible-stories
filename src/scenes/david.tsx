import { C } from "../art/palette";
import {
  Clouds,
  Ground,
  GrassTufts,
  Hills,
  HolyGlow,
  Sky,
  Sparkle,
  Sun,
} from "../art/base";
import { Bird, Sheep } from "../art/animals";
import { Crowd, Giant, Person } from "../art/figures";
import { Bush, Flowers, Rocks, Sling, Tent, Tree } from "../art/props";
import type { SceneArtProps } from "../types";

/** David the shepherd boy, before anybody knew his name. */
export function ShepherdBoy({ found }: SceneArtProps) {
  return (
    <>
      <Sky from={C.daySkyTop} to={C.daySkyBottom} />
      <Sun x={820} y={110} r={48} />
      <Clouds y={140} count={4} seed={31} />
      <Hills y={360} colors={["#8a9a5c", "#a3b06a"]} />
      <Ground y={470} fill="#a8b46e" top="#bcc684" />
      <Tree x={140} y={500} scale={0.85} />
      <Bush x={880} y={540} scale={1} color="#7f8f52" />
      <Sheep x={380} y={540} scale={0.7} />
      <Sheep x={500} y={568} scale={0.62} flip />
      <Sheep x={620} y={545} scale={0.58} />
      <Sheep x={720} y={590} scale={0.66} flip />
      <Person
        x={250}
        y={560}
        scale={1}
        robe={C.robe[2]}
        sash="#f0c97a"
        skin={C.skin[1]}
        hair={C.hair[2]}
        pose="stand"
        face="happy"
        child
      />
      {/* shepherd's staff */}
      <path
        d="M268,472 q0,-22 16,-22 q14,0 14,14 q0,10 -10,10 M268,472 L262,560"
        stroke="#a9763f"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <Bird x={560} y={150} scale={0.7} color="#f0913c" delay={2} />
      <GrassTufts y={480} count={24} seed={31} fill="#8a9a5c" />
      <Flowers y={520} count={12} seed={31} />
      <Rocks y={560} seed={31} count={4} fill="#9a9a86" />
      {found.includes("sheep") && <Sparkle x={380} y={480} s={1.4} />}
    </>
  );
}

/** Goliath shouts across the valley, and the army goes quiet. */
export function GoliathTaunts() {
  return (
    <>
      <Sky from="#7f8fa8" to="#d8d2c4" />
      <Clouds
        y={120}
        count={5}
        seed={32}
        fill="#e8e3d6"
        opacity={0.85}
        speed={55}
      />
      <Hills y={330} colors={["#8a8270", "#9c9480"]} />
      <Ground y={470} fill="#b0a78e" top="#c2b9a0" />
      {/* Israel's camp, small and far away */}
      <Tent x={110} y={452} scale={0.42} />
      <Tent x={200} y={462} scale={0.36} color="#b57a4a" />
      <Crowd
        x={180}
        y={470}
        count={7}
        scale={0.38}
        spread={220}
        opacity={0.75}
      />
      <Giant x={720} y={580} scale={1.12} flip />
      <Crowd
        x={880}
        y={596}
        count={4}
        scale={0.55}
        spread={150}
        colors={["#6a6f86", "#7a7f96", "#8d93ab", "#6a6f86"]}
        opacity={0.8}
      />
      {/* the shout */}
      <g className="a-shake">
        <path
          d="M600,300 q-70,-16 -66,22 q4,34 62,26 l-4,26 l30,-28 q60,-4 58,-26 q-2,-24 -80,-20 Z"
          fill={C.cream}
          opacity="0.95"
        />
        <text
          x="588"
          y="336"
          fontSize="34"
          fontWeight="800"
          fill={C.ink}
          textAnchor="middle"
          fontFamily="inherit"
        >
          !
        </text>
      </g>
      <Rocks y={520} seed={32} count={7} fill="#9a9280" />
      <GrassTufts y={500} count={10} seed={32} fill="#9a9068" />
    </>
  );
}

/** David steps forward. The king offers armour; it does not fit. */
export function DavidVolunteers({ found }: SceneArtProps) {
  return (
    <>
      <Sky from="#8f9ab0" to="#ded6c6" />
      <Clouds y={120} count={4} seed={33} fill="#ece7da" speed={60} />
      <Hills y={360} colors={["#8a8270", "#9c9480"]} />
      <Ground y={480} fill="#b0a78e" top="#c2b9a0" />
      <Tent x={840} y={520} scale={0.95} color="#8d5fc4" />
      <Tent x={120} y={540} scale={0.7} />
      <HolyGlow x={430} y={430} r={170} color="#ffe8a8" />
      {/* King Saul, tall and unconvinced */}
      <Person
        x={600}
        y={570}
        scale={1.3}
        robe="#6b3fa8"
        sash={C.sun}
        skin={C.skin[2]}
        hair={C.hair[1]}
        beard
        pose="point"
        face="stern"
        flip
      />
      <path
        d="M596,452 q-20,-16 0,-24 q20,-8 20,8 q0,10 -20,16 Z"
        fill={C.sun}
        transform="translate(0 -28)"
      />
      <Person
        x={430}
        y={572}
        scale={1}
        robe={C.robe[2]}
        sash="#f0c97a"
        skin={C.skin[1]}
        hair={C.hair[2]}
        pose="raise"
        face="happy"
        child
      />
      {/* discarded armour */}
      <g transform="translate(300 560)">
        <path d="M-26,0 L-20,-44 L20,-44 L26,0 Z" fill="#9aa0b5" />
        <path
          d="M-20,-36 L20,-36 M-22,-24 L22,-24"
          stroke="#7a8096"
          strokeWidth="4"
        />
        <ellipse cx="44" cy="-8" rx="20" ry="14" fill="#b9bfd2" />
      </g>
      <Crowd
        x={760}
        y={596}
        count={5}
        scale={0.5}
        spread={190}
        colors={["#6a6f86", "#7a7f96", "#8d93ab"]}
        opacity={0.7}
      />
      <Rocks y={540} seed={33} count={5} fill="#9a9280" />
      {found.includes("armour") && <Sparkle x={310} y={520} s={1.5} />}
    </>
  );
}

/** Five smooth stones, one sling, and a name spoken out loud. */
export function FiveSmoothStones({ found }: SceneArtProps) {
  return (
    <>
      <Sky from="#7f92b0" to="#e0d8c6" />
      <Clouds y={110} count={4} seed={34} fill="#ece7da" speed={45} />
      <Hills y={340} colors={["#8a8270", "#9c9480"]} />
      <Ground y={480} fill="#b0a78e" top="#c2b9a0" />
      <Giant x={800} y={584} scale={1.08} flip face="stern" />
      <Person
        x={230}
        y={578}
        scale={1.05}
        robe={C.robe[2]}
        sash="#f0c97a"
        skin={C.skin[1]}
        hair={C.hair[2]}
        pose="throw"
        face="calm"
        child
      />
      <Sling x={278} y={452} scale={1.15} />
      {/* the stone's flight */}
      <g className="a-stone">
        <circle cx="330" cy="450" r="9" fill="#6d6577" />
        <circle cx="327" cy="447" r="3" fill="#8f889c" />
      </g>
      {/* the brook, and the four stones he did not need */}
      <g transform="translate(120 600)">
        {[0, 22, 44, 66].map((dx, i) => (
          <ellipse
            key={dx}
            cx={dx}
            cy={i % 2 ? -4 : 0}
            rx="10"
            ry="7"
            fill="#6d6577"
          />
        ))}
      </g>
      <Crowd
        x={900}
        y={600}
        count={3}
        scale={0.5}
        spread={110}
        colors={["#6a6f86", "#7a7f96"]}
        opacity={0.6}
      />
      <Crowd x={80} y={470} count={4} scale={0.32} spread={130} opacity={0.5} />
      <Rocks y={530} seed={34} count={6} fill="#9a9280" />
      {found.includes("stones") && <Sparkle x={155} y={588} s={1.3} />}
      {found.includes("sling") && (
        <Sparkle x={278} y={452} s={1.5} delay={0.4} />
      )}
    </>
  );
}

/** The valley erupts. The smallest person there was the bravest. */
export function Victory() {
  return (
    <>
      <Sky from="#4aa8e0" to="#dff2ff" />
      <Sun x={500} y={120} r={56} />
      <Clouds y={150} count={4} seed={35} speed={70} />
      <Hills y={360} colors={["#8a9a5c", "#a3b06a"]} />
      <Ground y={480} fill="#b4c078" top="#c6cf90" />
      <HolyGlow x={400} y={420} r={200} />
      <Person
        x={400}
        y={560}
        scale={1.15}
        robe={C.robe[2]}
        sash="#f0c97a"
        skin={C.skin[1]}
        hair={C.hair[2]}
        pose="raise"
        face="happy"
        child
      />
      <Crowd
        x={720}
        y={584}
        count={8}
        scale={0.62}
        spread={340}
        opacity={0.95}
      />
      <Crowd
        x={160}
        y={572}
        count={4}
        scale={0.58}
        spread={180}
        opacity={0.9}
      />
      <Sparkle x={300} y={330} s={1.8} />
      <Sparkle x={520} y={290} s={1.5} delay={0.5} />
      <Sparkle x={680} y={360} s={1.3} delay={0.9} />
      <Bird x={280} y={170} scale={0.8} color="#f6c63c" delay={1} />
      <Bird x={660} y={220} scale={0.6} color="#e0574f" delay={7} />
      <GrassTufts y={490} count={20} seed={35} fill="#8fa055" />
      <Flowers y={530} count={14} seed={35} />
      <Tree x={70} y={520} scale={0.7} />
      <Bush x={930} y={560} scale={0.9} />
    </>
  );
}
