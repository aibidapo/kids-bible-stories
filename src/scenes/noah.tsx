import { C } from "../art/palette";
import {
  Clouds,
  Ground,
  GrassTufts,
  Hills,
  HolyGlow,
  LightRays,
  Lightning,
  Rain,
  Rainbow,
  Sea,
  Sky,
  Sparkle,
  Sun,
} from "../art/base";
import {
  Camel,
  Dove,
  Elephant,
  Giraffe,
  Lion,
  Sheep,
  Zebra,
} from "../art/animals";
import { Crowd, Person } from "../art/figures";
import { Ark, Bush, Flowers, Tree } from "../art/props";
import type { SceneArtProps } from "../types";

/** God gives Noah the plan, and Noah starts building. */
export function NoahBuilds() {
  return (
    <>
      <Sky from={C.daySkyTop} to={C.daySkyBottom} />
      <Sun x={150} y={110} r={44} />
      <Clouds y={140} count={4} seed={21} />
      <Hills y={360} colors={[C.grassDark, C.grass]} />
      <Ground y={470} fill="#b8925e" top="#cba874" />
      <LightRays x={500} y={-60} count={7} len={520} />
      <HolyGlow x={500} y={40} r={230} />
      {/* half-built ark on its scaffold */}
      <g transform="translate(620 500) scale(0.72)">
        <path
          d="M-210,-40 q-16,60 60,84 q150,26 300,0 q76,-24 60,-84 Z"
          fill="#a9763f"
        />
        <path d="M-210,-40 L210,-40 L210,-22 L-210,-22 Z" fill="#8a5a3b" />
        <path d="M-150,-42 L-150,-116 L60,-116 L60,-42 Z" fill="#c99a68" />
        <path
          d="M-160,-116 L-40,-168 L80,-116 Z"
          fill="#b5533f"
          opacity="0.9"
        />
        <path
          d="M-230,-30 L-230,60 M230,-30 L230,60"
          stroke="#8a5a3b"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M-250,20 L250,20"
          stroke="#8a5a3b"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>
      <Person
        x={250}
        y={560}
        scale={1.2}
        robe={C.robe[3]}
        skin={C.skin[2]}
        hair={C.hair[2]}
        beard
        headscarf
        pose="raise"
        face="calm"
      />
      <Person
        x={350}
        y={572}
        scale={0.95}
        robe={C.robe[1]}
        skin={C.skin[1]}
        hair={C.hair[0]}
        pose="carry"
        face="happy"
      />
      <Person
        x={170}
        y={578}
        scale={0.9}
        robe={C.robe[4]}
        skin={C.skin[3]}
        hair={C.hair[3]}
        pose="carry"
        face="happy"
        flip
      />
      <Crowd
        x={880}
        y={590}
        count={4}
        scale={0.5}
        spread={150}
        opacity={0.45}
      />
      <GrassTufts y={480} count={16} seed={21} fill="#9c7a4a" />
      <Tree x={70} y={520} scale={0.75} />
    </>
  );
}

/** Two by two, into the ark. */
export function TwoByTwo({ found }: SceneArtProps) {
  return (
    <>
      <Sky from="#6b7fb8" to="#d3d8e8" />
      <Clouds y={120} count={6} seed={22} fill="#e6e9f2" speed={50} />
      <Hills y={380} colors={["#4d7a52", "#5f9a5c"]} />
      <Ground y={480} fill="#8f9a62" top="#a3ae74" />
      <Ark x={700} y={520} scale={0.82} doorOpen />
      {/* the queue */}
      <Giraffe x={120} y={520} scale={0.44} />
      <Giraffe x={205} y={528} scale={0.4} />
      <Elephant x={330} y={548} scale={0.46} />
      <Elephant x={420} y={556} scale={0.42} />
      <Zebra x={112} y={590} scale={0.44} />
      <Zebra x={196} y={596} scale={0.42} />
      <Lion x={300} y={600} scale={0.38} />
      <Lion x={378} y={604} scale={0.36} />
      <Camel x={470} y={598} scale={0.44} />
      <Sheep x={548} y={602} scale={0.46} />
      <Sheep x={604} y={606} scale={0.42} />
      <Dove x={520} y={230} scale={0.8} />
      <Dove x={575} y={265} scale={0.7} />
      <Person
        x={648}
        y={578}
        scale={0.95}
        robe={C.robe[3]}
        skin={C.skin[2]}
        hair={C.hair[2]}
        beard
        headscarf
        pose="point"
        face="calm"
      />
      <GrassTufts y={490} count={18} seed={22} fill="#7c8a54" />
      {found.includes("doves") && <Sparkle x={548} y={240} s={1.6} />}
    </>
  );
}

/** Forty days and forty nights. */
export function TheFlood() {
  return (
    <>
      <Sky from={C.stormTop} to={C.stormBottom} />
      <Clouds
        y={100}
        count={7}
        seed={23}
        fill="#4a5568"
        opacity={0.95}
        speed={30}
      />
      <Lightning delay={1.5} />
      <Sea y={330} amp={34} speed={5} color="#2e5f82" crest="#6fa8c9" />
      <g className="a-rock">
        <Ark x={500} y={392} scale={0.66} />
      </g>
      <Rain count={90} seed={23} />
      <path
        d="M0,520 q150,-46 300,-6 q160,40 320,-8 q170,-44 380,14 L1000,625 L0,625 Z"
        fill="#20496a"
        opacity="0.6"
      />
    </>
  );
}

/** The dove comes back with an olive leaf. */
export function DoveReturns({ found }: SceneArtProps) {
  return (
    <>
      <Sky from="#5e7fa8" to="#e6d3b0" />
      <Clouds
        y={130}
        count={5}
        seed={24}
        fill="#f0e6d2"
        opacity={0.85}
        speed={70}
      />
      <Sun x={190} y={140} r={40} />
      <Sea y={400} amp={14} speed={10} color="#3a7a9e" crest="#7cc0dd" />
      {/* the first hilltops breaking the surface */}
      <path
        d="M760,420 q60,-66 130,-8 q40,34 90,10 L1000,430 Z"
        fill="#6f7f62"
      />
      <Ark x={420} y={452} scale={0.74} />
      <Dove x={560} y={280} scale={1.15} branch />
      <Person
        x={420}
        y={330}
        scale={0.58}
        robe={C.robe[3]}
        skin={C.skin[2]}
        hair={C.hair[2]}
        beard
        headscarf
        pose="raise"
        face="happy"
      />
      {found.includes("leaf") && <Sparkle x={600} y={278} s={1.6} />}
      {found.includes("hill") && (
        <Sparkle x={870} y={400} s={1.4} delay={0.5} />
      )}
    </>
  );
}

/** The promise in the sky. */
export function TheRainbow({ found }: SceneArtProps) {
  return (
    <>
      <Sky from="#3f86c4" to="#d9f0ff" />
      <Sun x={150} y={120} r={46} />
      <Clouds y={150} count={4} seed={25} speed={80} />
      <Rainbow cx={520} cy={560} r={360} />
      <Hills y={380} colors={[C.grassDark, C.grass]} />
      <Ground y={470} />
      <Ark x={790} y={540} scale={0.5} doorOpen />
      <Person
        x={330}
        y={560}
        scale={1.1}
        robe={C.robe[3]}
        skin={C.skin[2]}
        hair={C.hair[2]}
        beard
        headscarf
        pose="raise"
        face="happy"
      />
      <Person
        x={420}
        y={568}
        scale={0.92}
        robe={C.robe[1]}
        skin={C.skin[1]}
        hair={C.hair[4]}
        pose="raise"
        face="happy"
      />
      <Person
        x={250}
        y={572}
        scale={0.88}
        robe={C.robe[5]}
        skin={C.skin[3]}
        hair={C.hair[3]}
        pose="stand"
        face="happy"
        flip
      />
      <Sheep x={560} y={580} scale={0.5} />
      <Lion x={640} y={588} scale={0.38} />
      <Dove x={190} y={230} scale={0.85} branch />
      <Tree x={60} y={540} scale={0.8} fruit />
      <Bush x={900} y={600} scale={0.9} />
      <GrassTufts y={480} count={22} seed={25} />
      <Flowers y={520} count={16} seed={25} />
      {found.includes("rainbow") && (
        <>
          <Sparkle x={200} y={300} s={1.8} />
          <Sparkle x={840} y={320} s={1.6} delay={0.5} />
        </>
      )}
    </>
  );
}
