import { C } from "../art/palette";
import {
  Clouds,
  Ground,
  GrassTufts,
  Hills,
  HolyGlow,
  LightRays,
  Moon,
  Sea,
  Sky,
  Sparkle,
  Stars,
  Sun,
} from "../art/base";
import {
  Bird,
  Butterfly,
  Elephant,
  FishSchool,
  Giraffe,
  Lion,
  Sheep,
  Zebra,
} from "../art/animals";
import { Person } from "../art/figures";
import { Bush, Flowers, Tree } from "../art/props";
import type { SceneArtProps } from "../types";

/** Day 1 — light splits the darkness. */
export function LetThereBeLight() {
  return (
    <>
      <Sky from="#0a0818" to="#211a44" />
      <Stars count={70} seed={11} maxY={600} />
      <LightRays x={500} y={250} count={14} len={900} />
      <HolyGlow x={500} y={250} r={300} />
      <circle cx="500" cy="250" r="86" fill={C.sunCore} className="a-pulse" />
      <circle cx="500" cy="250" r="54" fill="#ffffff" />
      <Sparkle x={300} y={180} s={2} />
      <Sparkle x={720} y={300} s={1.6} delay={0.6} />
      <Sparkle x={560} y={430} s={1.3} delay={1.1} />
      <Sparkle x={200} y={420} s={1.1} delay={1.6} />
    </>
  );
}

/** Day 2 — the waters below, the sky above. */
export function SkyAndWater() {
  return (
    <>
      <Sky from={C.dawnTop} to={C.dawnBottom} />
      <Stars count={22} seed={12} maxY={180} />
      <Clouds y={150} count={6} seed={12} speed={80} />
      <HolyGlow x={500} y={330} r={220} color="#ffd9a0" />
      <Sea y={380} amp={18} speed={8} />
      <Sparkle x={420} y={330} s={1.4} />
      <Sparkle x={640} y={300} s={1.1} delay={0.8} />
    </>
  );
}

/** Day 3 — dry land, seed and fruit. */
export function LandAndPlants() {
  return (
    <>
      <Sky from={C.daySkyTop} to={C.daySkyBottom} />
      <Clouds y={120} count={4} seed={13} />
      <Sea y={300} amp={10} depth={400} speed={11} />
      <Hills y={330} colors={[C.grassDark, C.grass]} />
      <Ground y={470} />
      <Tree x={170} y={520} scale={1.05} fruit />
      <Tree x={860} y={540} scale={0.9} />
      <Bush x={420} y={520} scale={1.1} />
      <Bush x={640} y={556} scale={0.9} color={C.grass} />
      <GrassTufts y={480} count={26} seed={13} />
      <Flowers y={500} count={18} seed={13} />
      <Butterfly x={520} y={420} scale={1.1} />
      <Butterfly x={760} y={470} scale={0.85} color="#f6c63c" delay={2} />
    </>
  );
}

/** Day 4 — sun to rule the day, moon and stars the night. */
export function SunMoonStars({ found }: SceneArtProps) {
  return (
    <>
      <defs>
        <linearGradient id="creation-split" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#141034" />
          <stop offset="45%" stopColor="#3b2f7a" />
          <stop offset="62%" stopColor="#e8705a" />
          <stop offset="100%" stopColor="#bfe9ff" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="625" fill="url(#creation-split)" />
      <Stars count={40} seed={14} maxY={420} />
      <Moon x={180} y={150} r={52} />
      <Sun x={810} y={160} r={62} />
      <Clouds y={200} count={3} seed={14} fill="#ffd9c4" opacity={0.75} />
      <Hills y={430} colors={["#3a3a66", "#4a5a52", C.grassDark]} />
      <GrassTufts y={500} count={20} seed={14} />
      {found.includes("moon") && <Sparkle x={180} y={150} s={2.2} />}
      {found.includes("sun") && <Sparkle x={810} y={160} s={2.2} delay={0.3} />}
    </>
  );
}

/** Day 5 — birds above, fish below. */
export function BirdsAndFish() {
  return (
    <>
      <Sky from={C.noonTop} to={C.noonBottom} />
      <Sun x={150} y={110} r={44} />
      <Clouds y={130} count={4} seed={15} />
      <Bird x={240} y={170} scale={1.2} color="#e0574f" />
      <Bird x={520} y={230} scale={0.9} color="#f0913c" delay={5} />
      <Bird x={740} y={120} scale={0.7} color="#7a4fc4" delay={11} />
      <Bird x={380} y={280} scale={1} color="#3aa889" delay={17} />
      <Sea y={340} amp={14} speed={9} />
      <FishSchool y={470} count={11} seed={15} />
      <path
        d="M0,600 q120,-40 260,-10 q160,34 320,-6 q180,-40 420,10 L1000,625 L0,625 Z"
        fill={C.seaDeep}
        opacity="0.45"
      />
    </>
  );
}

/** Day 6 & 7 — animals, people, and rest. */
export function AnimalsAndPeople({ found }: SceneArtProps) {
  return (
    <>
      <Sky from={C.daySkyTop} to={C.daySkyBottom} />
      <Sun x={840} y={100} r={50} />
      <Clouds y={130} count={4} seed={16} />
      <Hills y={340} colors={[C.grassDark, C.grass]} />
      <Ground y={460} />
      <Tree x={120} y={500} scale={0.95} fruit />
      <Tree x={920} y={520} scale={0.8} />
      <Giraffe x={230} y={470} scale={0.62} />
      <Elephant x={800} y={500} scale={0.66} flip />
      <Zebra x={620} y={498} scale={0.6} />
      <Lion x={380} y={505} scale={0.52} />
      <Sheep x={160} y={560} scale={0.6} />
      <Sheep x={262} y={578} scale={0.52} flip />
      <Person
        x={470}
        y={580}
        scale={1.15}
        robe={C.robe[4]}
        skin={C.skin[3]}
        hair={C.hair[1]}
        pose="raise"
        face="happy"
      />
      <Person
        x={560}
        y={582}
        scale={1.1}
        robe={C.robe[5]}
        skin={C.skin[1]}
        hair={C.hair[2]}
        pose="stand"
        face="happy"
        flip
      />
      <GrassTufts y={470} count={24} seed={16} />
      <Flowers y={520} count={14} seed={16} />
      <Butterfly x={700} y={400} scale={0.9} />
      <Bird x={620} y={160} scale={0.8} color="#3aa889" delay={3} />
      {found.includes("lion") && <Sparkle x={380} y={440} s={1.6} />}
      {found.includes("people") && (
        <Sparkle x={515} y={440} s={1.8} delay={0.4} />
      )}
    </>
  );
}
