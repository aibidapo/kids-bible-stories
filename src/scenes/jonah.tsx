import { C } from "../art/palette";
import {
  Clouds,
  Ground,
  GrassTufts,
  HolyGlow,
  LightRays,
  Lightning,
  Rain,
  Sea,
  Sky,
  Sparkle,
  Sun,
} from "../art/base";
import { BigFish, Bird, Fish, FishSchool } from "../art/animals";
import { Crowd, Person } from "../art/figures";
import { City, PalmTree, Ship } from "../art/props";
import type { SceneArtProps } from "../types";

/** God says "go east". Jonah buys a ticket west. */
export function RunningAway({ found }: SceneArtProps) {
  return (
    <>
      <Sky from="#f0a05c" to="#ffe0b8" />
      <Sun x={140} y={140} r={50} />
      <Clouds y={150} count={4} seed={41} fill="#ffe9d2" speed={70} />
      <LightRays x={840} y={-40} count={6} len={420} color="#ffd9a0" />
      <Sea y={420} amp={12} speed={11} color="#2e7fa8" crest="#78c2dd" />
      {/* the harbour */}
      <path d="M0,400 L300,400 L300,470 L0,470 Z" fill="#c9a06a" />
      <path d="M0,400 L300,400 L300,412 L0,412 Z" fill="#b08a56" />
      {[40, 130, 230].map((x) => (
        <rect key={x} x={x} y={470} width="16" height="60" fill="#8a5a3b" />
      ))}
      <PalmTree x={80} y={398} scale={0.6} />
      <Ship x={640} y={466} scale={0.62} className="a-rock" />
      <Person
        x={250}
        y={396}
        scale={0.9}
        robe={C.robe[1]}
        skin={C.skin[2]}
        hair={C.hair[0]}
        beard
        pose="walk"
        face="sad"
      />
      <Crowd
        x={140}
        y={398}
        count={3}
        scale={0.55}
        spread={120}
        opacity={0.6}
      />
      <Bird x={430} y={190} scale={0.7} color={C.white} delay={4} />
      {found.includes("ship") && <Sparkle x={640} y={330} s={1.6} />}
    </>
  );
}

/** A wind so wild the sailors were afraid. */
export function TheStorm() {
  return (
    <>
      <Sky from="#1e2740" to="#4c5b74" />
      <Clouds
        y={90}
        count={8}
        seed={42}
        fill="#39445c"
        opacity={0.95}
        speed={22}
      />
      <Lightning delay={0.8} />
      <Sea y={360} amp={44} speed={4} color="#254f70" crest="#5d9cc0" />
      <g className="a-rock">
        <Ship x={500} y={430} scale={0.58} sailFull={false} />
        <Person
          x={460}
          y={400}
          scale={0.5}
          robe={C.robe[0]}
          skin={C.skin[1]}
          hair={C.hair[0]}
          pose="fear"
          face="scared"
          idle={false}
        />
        <Person
          x={540}
          y={400}
          scale={0.5}
          robe={C.robe[4]}
          skin={C.skin[3]}
          hair={C.hair[1]}
          pose="raise"
          face="scared"
          idle={false}
          flip
        />
      </g>
      <Rain count={100} seed={42} />
      <path
        d="M0,540 q140,-56 300,-10 q170,46 330,-10 q160,-50 370,16 L1000,625 L0,625 Z"
        fill="#1b3f5c"
        opacity="0.7"
      />
    </>
  );
}

/** And the Lord appointed a great fish. */
export function SwallowedWhole() {
  return (
    <>
      <Sky from="#0f3a55" to="#1f6a90" />
      <rect
        x="0"
        y="0"
        width="1000"
        height="625"
        fill="#12557f"
        opacity="0.5"
      />
      <Sea
        y={-40}
        amp={20}
        speed={8}
        color="#1a6a95"
        crest="#54a8cc"
        depth={625}
      />
      <rect
        x="0"
        y="0"
        width="1000"
        height="625"
        fill="#0d4a70"
        opacity="0.35"
      />
      <BigFish x={640} y={330} scale={0.92} flip mouthOpen />
      <Person
        x={230}
        y={330}
        scale={0.62}
        robe={C.robe[1]}
        skin={C.skin[2]}
        hair={C.hair[0]}
        beard
        pose="fear"
        face="scared"
        idle={false}
      />
      {/* bubbles */}
      {[
        [200, 250, 8],
        [230, 190, 5],
        [180, 150, 6],
        [270, 120, 4],
        [150, 300, 5],
      ].map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill={C.foam}
          opacity="0.45"
          className="a-float"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
      <FishSchool y={520} count={6} seed={43} />
    </>
  );
}

/** Three days in the dark, and a prayer that got through. */
export function PrayerInsideTheFish({ found }: SceneArtProps) {
  return (
    <>
      <rect x="0" y="0" width="1000" height="625" fill="#5e2f3e" />
      {/* ribs of the belly */}
      <path d="M0,0 Q500,120 1000,0 L1000,625 L0,625 Z" fill="#7a3f4e" />
      <path d="M0,625 Q500,500 1000,625 Z" fill="#4a2532" />
      {[-2, -1, 0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${500 + i * 210},60 q${i * -40},260 ${i * -20},520`}
          stroke="#8c4a5a"
          strokeWidth="26"
          fill="none"
          opacity="0.55"
          strokeLinecap="round"
        />
      ))}
      <LightRays x={500} y={-180} count={5} len={620} color="#ffd9a0" />
      <HolyGlow x={500} y={210} r={230} color="#ffd9a0" />
      <Person
        x={500}
        y={520}
        scale={1.35}
        robe={C.robe[1]}
        skin={C.skin[2]}
        hair={C.hair[0]}
        beard
        pose="pray"
        face="calm"
      />
      <Sparkle x={360} y={260} s={1.4} />
      <Sparkle x={650} y={300} s={1.2} delay={0.7} />
      <Fish x={140} y={520} scale={0.5} color="#f6c63c" />
      {found.includes("light") && (
        <Sparkle x={500} y={180} s={2.4} delay={0.2} />
      )}
    </>
  );
}

/** Nineveh listens — which is the part Jonah did not expect. */
export function Nineveh({ found }: SceneArtProps) {
  return (
    <>
      <Sky from="#4aa8e0" to="#f0dcb8" />
      <Sun x={840} y={120} r={50} />
      <Clouds y={140} count={4} seed={45} fill="#fdf0da" speed={70} />
      <City x={560} y={470} scale={0.92} />
      <Ground y={470} fill="#d9be86" top="#e6cf9c" />
      <HolyGlow x={560} y={200} r={220} />
      <Person
        x={180}
        y={570}
        scale={1.15}
        robe={C.robe[1]}
        skin={C.skin[2]}
        hair={C.hair[0]}
        beard
        pose="point"
        face="calm"
      />
      <Crowd
        x={560}
        y={584}
        count={9}
        scale={0.6}
        spread={400}
        opacity={0.95}
      />
      <PalmTree x={90} y={520} scale={0.7} />
      <PalmTree x={950} y={540} scale={0.6} flip />
      <GrassTufts y={490} count={12} seed={45} fill="#c2a874" />
      {found.includes("city") && (
        <>
          <Sparkle x={380} y={300} s={1.5} />
          <Sparkle x={760} y={280} s={1.3} delay={0.6} />
        </>
      )}
    </>
  );
}
