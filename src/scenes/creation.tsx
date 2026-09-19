import { HolyGlow, Sparkle, Stars } from "../art/base";
import { rand } from "../art/palette";
import { Grain, Motes, SoftShadow } from "../art/v2/effects";
import { Backdrop, Eyelids, Flipbook, Layer, Part } from "../art/raster";
import lightBg from "../assets/scenes/creation/light/bg.webp";
import skyLayers from "../assets/scenes/creation/sky-water/layers.json";
import skyBg from "../assets/scenes/creation/sky-water/bg.webp";
import skyCloud from "../assets/scenes/creation/sky-water/cloud.webp";
import skyWave from "../assets/scenes/creation/sky-water/calm-wave.webp";
import landLayers from "../assets/scenes/creation/land/layers.json";
import landBg from "../assets/scenes/creation/land/bg.webp";
import landTrunk from "../assets/scenes/creation/land/fruit-tree-body.webp";
import landCanopy from "../assets/scenes/creation/land/fruit-tree-tail.webp";
import landFlowers from "../assets/scenes/creation/land/flowers.webp";
import shepherdLayers from "../assets/scenes/david/shepherd/layers.json";
import oliveTrunk from "../assets/scenes/david/shepherd/tree-body.webp";
import oliveCanopy from "../assets/scenes/david/shepherd/tree-tail.webp";
import bluebirdUp from "../assets/scenes/david/shepherd/bluebird-up.webp";
import bluebirdDown from "../assets/scenes/david/shepherd/bluebird-down.webp";
import redbirdUp from "../assets/scenes/david/shepherd/redbird-up.webp";
import redbirdDown from "../assets/scenes/david/shepherd/redbird-down.webp";
import goldfinchUp from "../assets/scenes/david/shepherd/goldfinch-up.webp";
import goldfinchDown from "../assets/scenes/david/shepherd/goldfinch-down.webp";
import lamb from "../assets/scenes/david/shepherd/lamb.webp";
import shepherdGrass from "../assets/scenes/david/shepherd/grass-tuft.webp";
import lightsLayers from "../assets/scenes/creation/lights/layers.json";
import lightsBg from "../assets/scenes/creation/lights/bg.webp";
import sunImg from "../assets/scenes/creation/lights/sun.webp";
import moonImg from "../assets/scenes/creation/lights/moon.webp";
import creaturesLayers from "../assets/scenes/creation/creatures/layers.json";
import creaturesBg from "../assets/scenes/creation/creatures/bg.webp";
import dolphinImg from "../assets/scenes/creation/creatures/dolphin.webp";
import fishOrange from "../assets/scenes/creation/creatures/fish-orange.webp";
import fishBlue from "../assets/scenes/creation/creatures/fish-blue.webp";
import fishGreen from "../assets/scenes/creation/creatures/fish-green.webp";
import seahorseImg from "../assets/scenes/creation/creatures/seahorse.webp";
import crabImg from "../assets/scenes/creation/creatures/crab.webp";
import octopusImg from "../assets/scenes/creation/creatures/octopus.webp";
import swLayers from "../assets/scenes/jonah/swallowed/layers.json";
import turtleImg from "../assets/scenes/jonah/swallowed/turtle.webp";
import jellyImg from "../assets/scenes/jonah/swallowed/jellyfish.webp";
import praysLayers from "../assets/scenes/daniel/prays/layers.json";
import doveUp from "../assets/scenes/daniel/prays/bird-up.webp";
import doveDown from "../assets/scenes/daniel/prays/bird-down.webp";
import peopleLayers from "../assets/scenes/creation/people/layers.json";
import peopleBg from "../assets/scenes/creation/people/bg.webp";
import adamEve from "../assets/scenes/creation/people/adam-eve.webp";
import twoLayers from "../assets/scenes/noah/two-by-two/layers.json";
import giraffes from "../assets/scenes/noah/two-by-two/giraffes.webp";
import elephants from "../assets/scenes/noah/two-by-two/elephants.webp";
import zebras from "../assets/scenes/noah/two-by-two/zebras.webp";
import lionsPair from "../assets/scenes/noah/two-by-two/lions.webp";
import type { SceneArt, SceneArtProps } from "../types";

/** Eye points from design/pipeline/find_eyes.py. */
const EYES = {
  adamEve: {
    points: [
      [127, 138],
      [200, 138],
      [470, 190],
      [545, 189],
    ] as [number, number][],
    rx: 15,
    ry: 16,
    tone: "#c46d45",
  },
  dolphin: { points: [[283, 80]] as [number, number][], rx: 15, ry: 16, tone: "#94a2a7" },
  turtle: { points: [[82, 42]] as [number, number][], rx: 24, ry: 25, tone: "#b1b362" },
};

const D = shepherdLayers.cutouts;
const BIRDS = {
  blue: {
    up: { src: bluebirdUp, w: D["bluebird-up"].w, h: D["bluebird-up"].h, ax: 205, ay: 85 },
    down: { src: bluebirdDown, w: D["bluebird-down"].w, h: D["bluebird-down"].h, ax: 240, ay: 50 },
  },
  red: {
    up: { src: redbirdUp, w: D["redbird-up"].w, h: D["redbird-up"].h, ax: 185, ay: 95 },
    down: { src: redbirdDown, w: D["redbird-down"].w, h: D["redbird-down"].h, ax: 215, ay: 50 },
  },
  gold: {
    up: { src: goldfinchUp, w: D["goldfinch-up"].w, h: D["goldfinch-up"].h, ax: 188, ay: 100 },
    down: {
      src: goldfinchDown,
      w: D["goldfinch-down"].w,
      h: D["goldfinch-down"].h,
      ax: 245,
      ay: 45,
    },
  },
  dove: {
    up: {
      src: doveUp,
      w: praysLayers.cutouts["bird-up"].w,
      h: praysLayers.cutouts["bird-up"].h,
      ax: 195,
      ay: 122,
    },
    down: {
      src: doveDown,
      w: praysLayers.cutouts["bird-down"].w,
      h: praysLayers.cutouts["bird-down"].h,
      ax: 247,
      ay: 32,
    },
  },
};

function Bird({
  kind,
  x,
  y,
  size,
  motion,
  delay,
  flip = false,
}: {
  kind: keyof typeof BIRDS;
  x: number;
  y: number;
  size: number;
  motion: string;
  delay: number;
  flip?: boolean;
}) {
  const b = BIRDS[kind];
  const downS = kind === "dove" ? size * 0.74 : size;
  return (
    <Flipbook
      a={{ ...b.up, s: size }}
      b={{ ...b.down, s: downS }}
      x={x}
      y={y}
      flip={flip}
      motion={motion}
      delay={delay}
    />
  );
}

/** "Let there be light." */
export function LetThereBeLight() {
  return (
    <>
      <Backdrop src={lightBg} />
      <HolyGlow x={500} y={312} r={340} />
      <Motes x={500} top={80} bottom={560} spread={380} count={24} seed={21} />
      <Sparkle x={500} y={300} s={2.4} />
      <Sparkle x={380} y={220} s={1.4} delay={0.7} />
      <Sparkle x={640} y={380} s={1.6} delay={1.3} />
      <Grain opacity={0.05} />
    </>
  );
}

/** Sky above, waters below. */
export function SkyAndWater() {
  const L = skyLayers.cutouts;
  return (
    <>
      <Backdrop src={skyBg} />
      <Layer
        src={skyCloud}
        w={L.cloud.w}
        h={L.cloud.h}
        x={300}
        y={190}
        scale={0.5}
        className="a-drift"
        delay={-10}
      />
      <Layer
        src={skyCloud}
        w={L.cloud.w}
        h={L.cloud.h}
        x={700}
        y={120}
        scale={0.32}
        className="a-drift"
        delay={-40}
        flip
      />
      <Layer
        src={skyWave}
        w={L["calm-wave"].w}
        h={L["calm-wave"].h}
        x={260}
        y={560}
        scale={0.7}
        className="a-heave-slow"
        delay={-3}
      />
      <Layer
        src={skyWave}
        w={L["calm-wave"].w}
        h={L["calm-wave"].h}
        x={760}
        y={600}
        scale={0.8}
        className="a-heave-slow"
        delay={-6}
        flip
      />
      <Grain opacity={0.05} />
    </>
  );
}

/** Dry land, and everything green. */
export function LandAndPlants({ found }: SceneArtProps) {
  const L = landLayers.cutouts;
  const tree = L["fruit-tree"];
  const olive = D.tree;
  const flowers = (x: number, y: number, s: number, delay: number, flip = false) => (
    <Layer
      src={landFlowers}
      w={L.flowers.w}
      h={L.flowers.h}
      x={x}
      y={y}
      scale={s}
      flip={flip}
      className="a-sway"
      delay={delay}
    />
  );
  return (
    <>
      <Backdrop src={landBg} />
      <Layer src={oliveTrunk} w={olive.w} h={olive.h} x={880} y={520} scale={0.5} />
      <Part
        src={oliveCanopy}
        tw={olive.tail.w}
        th={olive.tail.h}
        ox={olive.tail.ox}
        oy={olive.tail.oy}
        w={olive.w}
        h={olive.h}
        x={880}
        y={520}
        scale={0.5}
        className="a-sway-slow"
        delay={-2}
      />
      <Layer src={landTrunk} w={tree.w} h={tree.h} x={200} y={604} scale={0.42} />
      <Part
        src={landCanopy}
        tw={tree.tail.w}
        th={tree.tail.h}
        ox={tree.tail.ox}
        oy={tree.tail.oy}
        w={tree.w}
        h={tree.h}
        x={200}
        y={604}
        scale={0.42}
        className="a-sway-slow"
      />
      {flowers(560, 610, 0.5, 0)}
      {flowers(700, 622, 0.42, -1.2, true)}
      {flowers(420, 624, 0.38, -2.1)}
      {found.includes("fruit-tree") && <Sparkle x={180} y={380} s={1.8} />}
      {found.includes("flowers") && <Sparkle x={620} y={560} s={1.4} delay={0.3} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Sun by day, moon and stars by night. */
export function SunMoonStars({ found }: SceneArtProps) {
  const L = lightsLayers.cutouts;
  return (
    <>
      <Backdrop src={lightsBg} />
      <Stars count={40} seed={14} maxY={300} />
      <g transform="translate(810 175)">
        <g className="a-pulse-soft">
          <image
            href={sunImg}
            x={-L.sun.w * 0.2}
            y={-L.sun.h * 0.2}
            width={L.sun.w * 0.4}
            height={L.sun.h * 0.4}
          />
        </g>
      </g>
      <g transform="translate(180 160)">
        <g className="a-float">
          <image
            href={moonImg}
            x={-L.moon.w * 0.18}
            y={-L.moon.h * 0.18}
            width={L.moon.w * 0.36}
            height={L.moon.h * 0.36}
          />
        </g>
      </g>
      {found.includes("moon") && <Sparkle x={180} y={150} s={2.2} />}
      {found.includes("sun") && <Sparkle x={810} y={160} s={2.2} delay={0.3} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Fish in the sea, birds in the sky. */
export function BirdsAndFish() {
  const L = creaturesLayers.cutouts;
  const J = swLayers.cutouts;
  const S = skyLayers.cutouts;
  const fish = (
    src: string,
    key: keyof typeof L,
    x: number,
    y: number,
    s: number,
    delay: number,
    flip = false,
  ) => (
    <Layer
      src={src}
      w={L[key].w}
      h={L[key].h}
      x={x}
      y={y}
      scale={s}
      flip={flip}
      className="a-swim-across"
      delay={delay}
    />
  );
  const bubbles = Array.from({ length: 12 }, (_, i) => {
    const t = rand(31 + i);
    return { x: 80 + t * 840, y: 420 + rand(60 + i) * 190, r: 2.5 + rand(90 + i) * 5, d: -t * 7 };
  });
  return (
    <>
      <Backdrop src={creaturesBg} />
      {/* clouds drift across the sky in front of the painted ones */}
      <Layer
        src={skyCloud}
        w={S.cloud.w}
        h={S.cloud.h}
        x={200}
        y={130}
        scale={0.3}
        className="a-drift"
        delay={-25}
      />
      <Layer
        src={skyCloud}
        w={S.cloud.w}
        h={S.cloud.h}
        x={650}
        y={90}
        scale={0.22}
        className="a-drift"
        delay={-55}
        flip
      />
      <Bird kind="red" x={240} y={150} size={0.3} motion="a-fly" delay={0} />
      <Bird kind="blue" x={540} y={110} size={0.26} motion="a-flutter" delay={-4} />
      <Bird kind="gold" x={760} y={200} size={0.24} motion="a-flutter" delay={-8} flip />
      <Bird kind="dove" x={400} y={240} size={0.26} motion="a-flutter" delay={-2} />
      {/* the dolphin leaps just clear of the surface; at rest it sits at the top of the leap */}
      <g transform="translate(560 350)">
        <g className="a-leap">
          <image
            href={dolphinImg}
            x={-L.dolphin.w * 0.2}
            y={-L.dolphin.h * 0.2}
            width={L.dolphin.w * 0.4}
            height={L.dolphin.h * 0.4}
          />
          <g transform={`translate(${-L.dolphin.w * 0.2} ${-L.dolphin.h * 0.2}) scale(0.4)`}>
            <Eyelids {...EYES.dolphin} w={0} h={0} delay={1.8} />
          </g>
        </g>
      </g>
      {/* splashes at the launch and the plunge, timed to the leap; hidden at rest */}
      {[
        { x: 320, delay: 0 },
        { x: 800, delay: -0.55 },
      ].map((sp) => (
        <g key={sp.x} transform={`translate(${sp.x} 352)`}>
          <g className="a-splash" opacity="0" style={{ animationDelay: `${sp.delay}s` }}>
            <path
              d="M-40,0 Q-30,-40 -18,-8 Q-8,-56 0,-14 Q8,-56 18,-8 Q30,-40 40,0 Z"
              fill="#f4fbff"
              opacity="0.9"
            />
            <circle cx="-34" cy="-46" r="4" fill="#ffffff" />
            <circle cx="30" cy="-52" r="3" fill="#ffffff" />
            <circle cx="4" cy="-64" r="3.5" fill="#ffffff" />
            <ellipse cx="0" cy="2" rx="52" ry="7" fill="#f4fbff" opacity="0.7" />
          </g>
        </g>
      ))}
      {/* each fish crosses on its own; flipped ones go the other way */}
      {fish(fishOrange, "fish-orange", 300, 470, 0.34, -3)}
      {fish(fishBlue, "fish-blue", 700, 430, 0.32, -12, true)}
      {fish(fishGreen, "fish-green", 480, 520, 0.36, -7)}
      {fish(fishOrange, "fish-orange", 820, 560, 0.24, -17, true)}
      {fish(fishBlue, "fish-blue", 150, 590, 0.26, -20)}
      <Layer
        src={seahorseImg}
        w={L.seahorse.w}
        h={L.seahorse.h}
        x={80}
        y={560}
        scale={0.44}
        className="a-float"
        delay={-1}
      />
      <Layer
        src={octopusImg}
        w={L.octopus.w}
        h={L.octopus.h}
        x={640}
        y={612}
        scale={0.38}
        className="a-float"
        delay={-4}
      />
      <Layer
        src={crabImg}
        w={L.crab.w}
        h={L.crab.h}
        x={380}
        y={620}
        scale={0.3}
        className="a-swim"
        delay={-2}
      />
      <g transform="translate(880 590)">
        <g className="a-swim-slow">
          <image
            href={turtleImg}
            x={-J.turtle.w * 0.2}
            y={-J.turtle.h * 0.2}
            width={J.turtle.w * 0.4}
            height={J.turtle.h * 0.4}
          />
          <g transform={`translate(${-J.turtle.w * 0.2} ${-J.turtle.h * 0.2}) scale(0.4)`}>
            <Eyelids {...EYES.turtle} w={0} h={0} delay={3.2} />
          </g>
        </g>
      </g>
      <Layer
        src={jellyImg}
        w={J.jellyfish.w}
        h={J.jellyfish.h}
        x={230}
        y={470}
        scale={0.3}
        className="a-float"
        delay={-3}
      />
      {/* bubbles rise through the water; each is drawn where it starts */}
      <g pointerEvents="none">
        {bubbles.map((b, i) => (
          <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
            <g className="a-bubble" style={{ animationDelay: `${b.d.toFixed(2)}s` }}>
              <circle
                r={b.r.toFixed(1)}
                fill="none"
                stroke="#e6f6ff"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <circle
                r={(b.r * 0.3).toFixed(1)}
                cx={(-b.r * 0.35).toFixed(1)}
                cy={(-b.r * 0.35).toFixed(1)}
                fill="#ffffff"
                opacity="0.6"
              />
            </g>
          </g>
        ))}
      </g>
      <Grain opacity={0.05} />
    </>
  );
}

/** Every animal, and then the first people. */
export function AnimalsAndPeople({ found }: SceneArtProps) {
  const L = peopleLayers.cutouts;
  const T = twoLayers.cutouts;
  const F = landLayers.cutouts;
  const olive = D.tree;
  const fruit = F["fruit-tree"];
  /** Walks a little way and back; the shadow stays put, the animal paces over it. */
  const roam = (
    src: string,
    w: number,
    h: number,
    x: number,
    y: number,
    s: number,
    cls: string,
    delay: number,
    flip = false,
  ) => (
    <>
      <SoftShadow x={x} y={y} rx={w * s * 0.42} ry={12} opacity={0.35} />
      <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
        <g className={cls} style={{ animationDelay: `${delay}s` }}>
          <g className="a-walk-bob" style={{ animationDelay: `${delay * 0.37}s` }}>
            <image href={src} x={-w / 2} y={-h} width={w} height={h} />
          </g>
        </g>
      </g>
    </>
  );
  const tuft = (x: number, y: number, s: number, delay: number, flip = false) => (
    <Layer
      src={shepherdGrass}
      w={D["grass-tuft"].w}
      h={D["grass-tuft"].h}
      x={x}
      y={y}
      scale={s}
      flip={flip}
      className="a-sway"
      delay={delay}
    />
  );
  return (
    <>
      <Backdrop src={peopleBg} />
      {/* trees at the edges, canopies swaying in the wind */}
      <Layer src={oliveTrunk} w={olive.w} h={olive.h} x={70} y={560} scale={0.6} />
      <Part
        src={oliveCanopy}
        tw={olive.tail.w}
        th={olive.tail.h}
        ox={olive.tail.ox}
        oy={olive.tail.oy}
        w={olive.w}
        h={olive.h}
        x={70}
        y={560}
        scale={0.6}
        className="a-sway-slow"
        delay={-1}
      />
      <Layer src={landTrunk} w={fruit.w} h={fruit.h} x={930} y={580} scale={0.4} flip />
      <Part
        src={landCanopy}
        tw={fruit.tail.w}
        th={fruit.tail.h}
        ox={fruit.tail.ox}
        oy={fruit.tail.oy}
        w={fruit.w}
        h={fruit.h}
        x={930}
        y={580}
        scale={0.4}
        flip
        className="a-sway-slow"
        delay={-4}
      />
      <Bird kind="blue" x={620} y={150} size={0.22} motion="a-flutter" delay={-3} />
      <Bird kind="gold" x={300} y={120} size={0.2} motion="a-fly" delay={-9} />
      {/* the animals wander the meadow, far to near */}
      {roam(giraffes, T.giraffes.w, T.giraffes.h, 190, 548, 0.28, "a-wander-slow", -6)}
      {roam(elephants, T.elephants.w, T.elephants.h, 860, 566, 0.26, "a-wander-slow", -14, true)}
      {roam(zebras, T.zebras.w, T.zebras.h, 740, 602, 0.24, "a-wander", -3)}
      {roam(lionsPair, T.lions.w, T.lions.h, 270, 610, 0.24, "a-wander", -10)}
      {roam(lamb, D.lamb.w, D.lamb.h, 640, 616, 0.26, "a-wander", -1)}
      <SoftShadow x={520} y={600} rx={110} ry={14} opacity={0.4} />
      <Layer
        src={adamEve}
        w={L["adam-eve"].w}
        h={L["adam-eve"].h}
        x={520}
        y={600}
        scale={0.46}
        className="a-breathe"
      >
        <Eyelids {...EYES.adamEve} w={L["adam-eve"].w} h={L["adam-eve"].h} />
      </Layer>
      {/* foreground grass, swaying */}
      {tuft(140, 624, 0.46, 0)}
      {tuft(430, 628, 0.4, -1.3, true)}
      {tuft(600, 626, 0.44, -2.2)}
      {tuft(820, 628, 0.38, -0.7, true)}
      {found.includes("lion") && <Sparkle x={270} y={540} s={1.6} />}
      {found.includes("giraffe") && <Sparkle x={190} y={380} s={1.6} delay={0.2} />}
      {found.includes("people") && <Sparkle x={520} y={300} s={2} delay={0.4} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Scene art by key; the registry in `index.ts` loads this module on demand. */
export const SCENES: Record<string, SceneArt> = {
  "creation/light": LetThereBeLight,
  "creation/sky-water": SkyAndWater,
  "creation/land": LandAndPlants,
  "creation/lights": SunMoonStars,
  "creation/creatures": BirdsAndFish,
  "creation/people": AnimalsAndPeople,
};
