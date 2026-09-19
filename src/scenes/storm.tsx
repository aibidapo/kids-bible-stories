import { Lightning, Rain, Sparkle } from "../art/base";
import { Grain, LightShaft, Motes, SoftShadow } from "../art/v2/effects";
import { Backdrop, Eyelids, Flipbook, Layer } from "../art/raster";
import eveningLayers from "../assets/scenes/storm/evening/layers.json";
import eveningBg from "../assets/scenes/storm/evening/bg.webp";
import eveningJesus from "../assets/scenes/storm/evening/jesus-invite.webp";
import eveningPeter from "../assets/scenes/storm/evening/peter-push.webp";
import eveningJohn from "../assets/scenes/storm/evening/john-nets.webp";
import eveningBoat from "../assets/scenes/storm/evening/boat-shore.webp";
import gullUp from "../assets/scenes/storm/evening/gull-up.webp";
import gullDown from "../assets/scenes/storm/evening/gull-down.webp";
import asleepLayers from "../assets/scenes/storm/asleep/layers.json";
import asleepBg from "../assets/scenes/storm/asleep/bg.webp";
import asleepBoatBack from "../assets/scenes/storm/asleep/boat-back.webp";
import asleepBoatHull from "../assets/scenes/storm/asleep/boat-hull.webp";
import asleepJesus from "../assets/scenes/storm/asleep/jesus-asleep.webp";
import asleepPeter from "../assets/scenes/storm/asleep/peter-row.webp";
import asleepJohn from "../assets/scenes/storm/asleep/john-bail.webp";
import afraidLayers from "../assets/scenes/storm/afraid/layers.json";
import afraidBg from "../assets/scenes/storm/afraid/bg.webp";
import afraidBoatBack from "../assets/scenes/storm/afraid/boat-back.webp";
import afraidBoatHull from "../assets/scenes/storm/afraid/boat-hull.webp";
import afraidJesus from "../assets/scenes/storm/afraid/jesus-waking.webp";
import afraidPeter from "../assets/scenes/storm/afraid/peter-afraid.webp";
import afraidJohn from "../assets/scenes/storm/afraid/john-afraid.webp";
import peaceLayers from "../assets/scenes/storm/peace/layers.json";
import peaceBg from "../assets/scenes/storm/peace/bg.webp";
import peaceBoatBack from "../assets/scenes/storm/peace/boat-back.webp";
import peaceBoatHull from "../assets/scenes/storm/peace/boat-hull.webp";
import peaceJesus from "../assets/scenes/storm/peace/jesus-command.webp";
import peacePeter from "../assets/scenes/storm/peace/peter-watch.webp";
import peaceJohn from "../assets/scenes/storm/peace/john-watch.webp";
import calmLayers from "../assets/scenes/storm/calm/layers.json";
import calmBg from "../assets/scenes/storm/calm/bg.webp";
import calmBoatBack from "../assets/scenes/storm/calm/boat-back.webp";
import calmBoatHull from "../assets/scenes/storm/calm/boat-hull.webp";
import calmJesus from "../assets/scenes/storm/calm/jesus-seated.webp";
import calmDisciples from "../assets/scenes/storm/calm/disciples-amazed.webp";
import jonahStormLayers from "../assets/scenes/jonah/storm/layers.json";
import stormWave from "../assets/scenes/jonah/storm/wave.webp";
import skyWaterLayers from "../assets/scenes/creation/sky-water/layers.json";
import shepherdLayers from "../assets/scenes/david/shepherd/layers.json";
import bluebirdUp from "../assets/scenes/david/shepherd/bluebird-up.webp";
import bluebirdDown from "../assets/scenes/david/shepherd/bluebird-down.webp";
import redbirdUp from "../assets/scenes/david/shepherd/redbird-up.webp";
import redbirdDown from "../assets/scenes/david/shepherd/redbird-down.webp";
import goldfinchUp from "../assets/scenes/david/shepherd/goldfinch-up.webp";
import goldfinchDown from "../assets/scenes/david/shepherd/goldfinch-down.webp";
import bluebirdFrontUp from "../assets/scenes/storm/calm/bluebird-front-up.webp";
import bluebirdFrontDown from "../assets/scenes/storm/calm/bluebird-front-down.webp";
import redbirdFrontUp from "../assets/scenes/storm/calm/redbird-front-up.webp";
import redbirdFrontDown from "../assets/scenes/storm/calm/redbird-front-down.webp";
import calmWave from "../assets/scenes/creation/sky-water/calm-wave.webp";
import type { SceneArt, SceneArtProps } from "../types";

/** Eye centres per cutout, in cutout pixels, read off the packed art. Closed-eyed poses have none. */
const EYES: Record<string, { points: [number, number][]; rx: number; ry: number; tone: string }> = {
  "jesus-invite": {
    points: [
      [160, 77],
      [204, 78],
    ],
    rx: 12,
    ry: 11,
    tone: "#cb7d4c",
  },
  "peter-push": {
    points: [
      [330, 115],
      [383, 116],
    ],
    rx: 16,
    ry: 13,
    tone: "#d5966b",
  },
  "john-nets": {
    points: [
      [352, 104],
      [402, 104],
    ],
    rx: 14,
    ry: 12,
    tone: "#d69060",
  },
  "peter-row": {
    points: [
      [204, 102],
      [240, 91],
    ],
    rx: 13,
    ry: 12,
    tone: "#d2875b",
  },
  "john-bail": {
    points: [
      [197, 127],
      [252, 120],
    ],
    rx: 16,
    ry: 13,
    tone: "#d3875b",
  },
  "peter-afraid": {
    points: [
      [257, 106],
      [306, 107],
    ],
    rx: 14,
    ry: 12,
    tone: "#d2895d",
  },
  "john-afraid": {
    points: [
      [196, 115],
      [228, 115],
    ],
    rx: 12,
    ry: 11,
    tone: "#d3865c",
  },
  "jesus-command": {
    points: [
      [255, 76],
      [299, 77],
    ],
    rx: 13,
    ry: 11,
    tone: "#cb7d4c",
  },
  "peter-watch": {
    points: [
      [387, 86],
      [427, 76],
    ],
    rx: 14,
    ry: 12,
    tone: "#d07f54",
  },
  "john-watch": { points: [[244, 91]], rx: 13, ry: 12, tone: "#d88457" },
  "jesus-seated": {
    points: [
      [322, 58],
      [352, 58],
    ],
    rx: 11,
    ry: 10,
    tone: "#cb7d4c",
  },
  "disciples-amazed": {
    points: [
      [204, 160],
      [252, 156],
      [498, 86],
      [545, 83],
    ],
    rx: 13,
    ry: 12,
    tone: "#d9905a",
  },
};

/** Blink lids for one cutout, sized to its packed box. */
function Lids({ name, w, h, delay }: { name: string; w: number; h: number; delay: number }) {
  const e = EYES[name as keyof typeof EYES];
  if (!e) return null;
  return <Eyelids points={e.points} w={w} h={h} rx={e.rx} ry={e.ry} tone={e.tone} delay={delay} />;
}

const WAVE = jonahStormLayers.cutouts.wave;
const CALM = skyWaterLayers.cutouts["calm-wave"];

/** A rough wave from Jonah's storm, heaving. */
function Wave({
  x,
  y,
  scale,
  cls,
  delay,
  flip = false,
}: {
  x: number;
  y: number;
  scale: number;
  cls: string;
  delay: number;
  flip?: boolean;
}) {
  return (
    <Layer
      src={stormWave}
      w={WAVE.w}
      h={WAVE.h}
      x={x}
      y={y}
      scale={scale}
      flip={flip}
      className={cls}
      delay={delay}
    />
  );
}

/** A gentle wave from the creation sea. */
function Ripple({
  x,
  y,
  scale,
  delay,
  flip = false,
  cls = "a-heave-slow",
}: {
  x: number;
  y: number;
  scale: number;
  delay: number;
  flip?: boolean;
  cls?: string;
}) {
  return (
    <Layer
      src={calmWave}
      w={CALM.w}
      h={CALM.h}
      x={x}
      y={y}
      scale={scale}
      flip={flip}
      className={cls}
      delay={delay}
    />
  );
}

/** A seagull, two frames on the fly path. */
function Gull({
  x,
  y,
  s,
  delay,
  flip = false,
}: {
  x: number;
  y: number;
  s: number;
  delay: number;
  flip?: boolean;
}) {
  const L = eveningLayers.cutouts;
  return (
    <Flipbook
      a={{
        src: gullUp,
        w: L["gull-up"].w,
        h: L["gull-up"].h,
        ax: L["gull-up"].w * 0.5,
        ay: L["gull-up"].h * 0.55,
        s,
      }}
      b={{
        src: gullDown,
        w: L["gull-down"].w,
        h: L["gull-down"].h,
        ax: L["gull-down"].w * 0.5,
        ay: L["gull-down"].h * 0.45,
        s,
      }}
      x={x}
      y={y}
      flip={flip}
      motion="a-fly"
      delay={delay}
    />
  );
}

/** The songbirds from David's hill, two frames each, aligned on the eye. All three cutouts face right. */
const SONGBIRDS = {
  blue: { up: bluebirdUp, down: bluebirdDown, upEye: [205, 85], downEye: [240, 50] },
  red: { up: redbirdUp, down: redbirdDown, upEye: [185, 95], downEye: [215, 50] },
  gold: { up: goldfinchUp, down: goldfinchDown, upEye: [188, 100], downEye: [245, 45] },
} as const;

function SongBird({
  kind,
  x,
  y,
  s,
  motion,
  delay,
  flip = false,
}: {
  kind: keyof typeof SONGBIRDS;
  x: number;
  y: number;
  s: number;
  motion: string;
  delay: number;
  flip?: boolean;
}) {
  const b = SONGBIRDS[kind];
  const L = shepherdLayers.cutouts;
  const up = L[`${kind === "blue" ? "bluebird" : kind === "red" ? "redbird" : "goldfinch"}-up`];
  const down = L[`${kind === "blue" ? "bluebird" : kind === "red" ? "redbird" : "goldfinch"}-down`];
  return (
    <Flipbook
      a={{ src: b.up, w: up.w, h: up.h, ax: b.upEye[0], ay: b.upEye[1], s }}
      b={{ src: b.down, w: down.w, h: down.h, ax: b.downEye[0], ay: b.downEye[1], s }}
      x={x}
      y={y}
      flip={flip}
      motion={motion}
      delay={delay}
    />
  );
}

/** A bird seen head-on, flying straight at the viewer; frames aligned on the head. */
function FrontBird({
  kind,
  x,
  y,
  s,
  delay,
}: {
  kind: "blue" | "red";
  x: number;
  y: number;
  s: number;
  delay: number;
}) {
  const L = calmLayers.cutouts;
  const up = kind === "blue" ? L["bluebird-front-up"] : L["redbird-front-up"];
  const down = kind === "blue" ? L["bluebird-front-down"] : L["redbird-front-down"];
  return (
    <Flipbook
      a={{
        src: kind === "blue" ? bluebirdFrontUp : redbirdFrontUp,
        w: up.w,
        h: up.h,
        ax: up.w * 0.5,
        ay: up.h * 0.62,
        s,
      }}
      b={{
        src: kind === "blue" ? bluebirdFrontDown : redbirdFrontDown,
        w: down.w,
        h: down.h,
        ax: down.w * 0.5,
        ay: down.h * 0.38,
        s,
      }}
      x={x}
      y={y}
      motion="a-swoop-far"
      delay={delay}
    />
  );
}

/** Evening on the shore: "Let us go over to the other side." */
export function SettingOut({ found }: SceneArtProps) {
  const L = eveningLayers.cutouts;
  return (
    <>
      <Backdrop src={eveningBg} />
      <Gull x={380} y={92} s={0.22} delay={-4} flip />
      <Gull x={520} y={58} s={0.16} delay={-13} flip />
      <SoftShadow x={690} y={612} rx={340} ry={20} opacity={0.35} />
      <Layer
        src={eveningBoat}
        w={L["boat-shore"].w}
        h={L["boat-shore"].h}
        x={690}
        y={612}
        scale={0.9}
        className="a-rock"
      />
      <SoftShadow x={300} y={604} rx={80} ry={13} opacity={0.4} />
      <Layer
        src={eveningJesus}
        w={L["jesus-invite"].w}
        h={L["jesus-invite"].h}
        x={300}
        y={604}
        scale={0.42}
        className="a-breathe"
      >
        <Lids name="jesus-invite" w={L["jesus-invite"].w} h={L["jesus-invite"].h} delay={0.3} />
      </Layer>
      <SoftShadow x={480} y={608} rx={80} ry={13} opacity={0.4} />
      <Layer
        src={eveningJohn}
        w={L["john-nets"].w}
        h={L["john-nets"].h}
        x={480}
        y={608}
        scale={0.4}
        className="a-breathe"
        delay={0.6}
      >
        <Lids name="john-nets" w={L["john-nets"].w} h={L["john-nets"].h} delay={2.6} />
      </Layer>
      <SoftShadow x={610} y={612} rx={90} ry={13} opacity={0.4} />
      <Layer
        src={eveningPeter}
        w={L["peter-push"].w}
        h={L["peter-push"].h}
        x={610}
        y={612}
        scale={0.4}
        className="a-breathe-slow"
        delay={1.1}
      >
        <Lids name="peter-push" w={L["peter-push"].w} h={L["peter-push"].h} delay={1.7} />
      </Layer>
      {found.includes("nets") && <Sparkle x={470} y={380} s={1.5} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Out on the lake, the wind rising, Jesus asleep on the cushion. */
export function AsleepInTheStern({ found }: SceneArtProps) {
  const L = asleepLayers.cutouts;
  return (
    <>
      <Backdrop src={asleepBg} />
      <Wave x={150} y={560} scale={0.6} cls="a-heave" delay={0} />
      <Wave x={880} y={585} scale={0.42} cls="a-heave" delay={0} flip />
      <g className="a-heave">
        <g className="a-rock">
          <Layer
            src={asleepBoatBack}
            w={L["boat-back"].w}
            h={L["boat-back"].h}
            x={500}
            y={540}
            scale={0.62}
          />
          <Layer
            src={asleepPeter}
            w={L["peter-row"].w}
            h={L["peter-row"].h}
            x={370}
            y={480}
            scale={0.46}
            className="a-breathe"
          >
            <Lids name="peter-row" w={L["peter-row"].w} h={L["peter-row"].h} delay={0.9} />
          </Layer>
          <Layer
            src={asleepJohn}
            w={L["john-bail"].w}
            h={L["john-bail"].h}
            x={492}
            y={488}
            scale={0.44}
            className="a-breathe"
            delay={0.7}
          >
            <Lids name="john-bail" w={L["john-bail"].w} h={L["john-bail"].h} delay={2.1} />
          </Layer>
          <Layer
            src={asleepJesus}
            w={L["jesus-asleep"].w}
            h={L["jesus-asleep"].h}
            x={640}
            y={468}
            scale={0.36}
            flip
            className="a-breathe-slow"
            delay={1.4}
          />
          <Layer
            src={asleepBoatHull}
            w={L["boat-hull"].w}
            h={L["boat-hull"].h}
            x={500}
            y={600}
            scale={0.62}
          />
        </g>
        <Wave x={470} y={640} scale={0.45} cls="" delay={0} />
      </g>
      {found.includes("cushion") && <Sparkle x={660} y={300} s={1.5} />}
      <Grain opacity={0.06} />
    </>
  );
}

/** The wild night: waking Jesus. */
export function TheWildNight({ found }: SceneArtProps) {
  const L = afraidLayers.cutouts;
  return (
    <>
      <Backdrop src={afraidBg} />
      <Lightning delay={0.8} x={-120} y={30} s={0.55} />
      <Wave x={130} y={540} scale={0.72} cls="a-heave" delay={0} />
      <Wave x={890} y={565} scale={0.52} cls="a-heave" delay={0} flip />
      {/* the whole boat, pitched bow-down on the wave: one rotate on a positioning group, the motion classes inside it */}
      <g transform="rotate(-7 500 600)">
        <g className="a-heave">
          <g className="a-rock">
            <g className="a-shake">
              <Layer
                src={afraidBoatBack}
                w={L["boat-back"].w}
                h={L["boat-back"].h}
                x={500}
                y={540}
                scale={0.62}
              />
              <Layer
                src={afraidJohn}
                w={L["john-afraid"].w}
                h={L["john-afraid"].h}
                x={370}
                y={478}
                scale={0.44}
                className="a-breathe"
              >
                <Lids
                  name="john-afraid"
                  w={L["john-afraid"].w}
                  h={L["john-afraid"].h}
                  delay={1.9}
                />
              </Layer>
              <Layer
                src={afraidPeter}
                w={L["peter-afraid"].w}
                h={L["peter-afraid"].h}
                x={520}
                y={478}
                scale={0.44}
                className="a-breathe"
                delay={0.4}
              >
                <Lids
                  name="peter-afraid"
                  w={L["peter-afraid"].w}
                  h={L["peter-afraid"].h}
                  delay={0.5}
                />
              </Layer>
              <Layer
                src={afraidJesus}
                w={L["jesus-waking"].w}
                h={L["jesus-waking"].h}
                x={640}
                y={482}
                scale={0.44}
                className="a-breathe-slow"
                delay={1}
              />
              <Layer
                src={afraidBoatHull}
                w={L["boat-hull"].w}
                h={L["boat-hull"].h}
                x={500}
                y={600}
                scale={0.62}
              />
            </g>
          </g>
          <Wave x={460} y={645} scale={0.5} cls="" delay={0} />
        </g>
      </g>
      <Rain count={120} seed={7} />
      {found.includes("lightning") && <Sparkle x={240} y={110} s={2} />}
      <Grain opacity={0.07} />
    </>
  );
}

/** "Quiet! Be still!" The light breaks through. */
export function QuietBeStill({ found }: SceneArtProps) {
  const L = peaceLayers.cutouts;
  return (
    <>
      <Backdrop src={peaceBg} />
      <g opacity="0.5">
        <LightShaft x={500} top={0} topWidth={140} bottomSpread={420} floorY={560} />
      </g>
      <Ripple x={140} y={575} scale={0.6} delay={0} />
      <Ripple x={880} y={590} scale={0.42} delay={0} flip />
      <g className="a-heave-slow">
        <Layer
          src={peaceBoatBack}
          w={L["boat-back"].w}
          h={L["boat-back"].h}
          x={500}
          y={540}
          scale={0.62}
        />
        <Layer
          src={peacePeter}
          w={L["peter-watch"].w}
          h={L["peter-watch"].h}
          x={380}
          y={478}
          scale={0.44}
          className="a-breathe"
        >
          <Lids name="peter-watch" w={L["peter-watch"].w} h={L["peter-watch"].h} delay={1.6} />
        </Layer>
        <Layer
          src={peaceJohn}
          w={L["john-watch"].w}
          h={L["john-watch"].h}
          x={500}
          y={482}
          scale={0.42}
          className="a-breathe"
          delay={0.6}
        >
          <Lids name="john-watch" w={L["john-watch"].w} h={L["john-watch"].h} delay={2.8} />
        </Layer>
        <Layer
          src={peaceJesus}
          w={L["jesus-command"].w}
          h={L["jesus-command"].h}
          x={650}
          y={560}
          scale={0.46}
          className="a-breathe-slow"
          delay={1.2}
        >
          <Lids
            name="jesus-command"
            w={L["jesus-command"].w}
            h={L["jesus-command"].h}
            delay={0.4}
          />
        </Layer>
        <Layer
          src={peaceBoatHull}
          w={L["boat-hull"].w}
          h={L["boat-hull"].h}
          x={500}
          y={600}
          scale={0.62}
        />
        <Ripple x={470} y={640} scale={0.5} delay={0} cls="" />
      </g>
      {/* the last of the rain, still falling, thin and outside the light shaft */}
      <Rain count={45} seed={11} opacity={0.4} />
      <Motes x={500} top={40} bottom={560} spread={200} />
      {found.includes("light") && <Sparkle x={500} y={90} s={2.2} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Flat calm at dawn: "Who is this?" */
export function WhoIsThis({ found }: SceneArtProps) {
  const L = calmLayers.cutouts;
  return (
    <>
      <Backdrop src={calmBg} />
      <Gull x={140} y={110} s={0.2} delay={-9} flip />
      <SongBird kind="blue" x={560} y={88} s={0.2} motion="a-fly" delay={-15} />
      {/* birds arrive toward the men: two from specks over the far hills behind the boat, one from the right */}
      <FrontBird kind="red" x={215} y={215} s={0.3} delay={-3} />
      <FrontBird kind="blue" x={585} y={200} s={0.28} delay={-11} />
      <SongBird kind="blue" x={760} y={190} s={0.2} motion="a-swoop-r" delay={-7} flip />
      <Ripple x={160} y={580} scale={0.56} delay={0} />
      <Ripple x={860} y={592} scale={0.42} delay={0} flip />
      <g className="a-heave-slow">
        <Layer
          src={calmBoatBack}
          w={L["boat-back"].w}
          h={L["boat-back"].h}
          x={500}
          y={540}
          scale={0.62}
        />
        <Layer
          src={calmDisciples}
          w={L["disciples-amazed"].w}
          h={L["disciples-amazed"].h}
          x={400}
          y={470}
          scale={0.48}
          className="a-breathe"
        >
          <Lids
            name="disciples-amazed"
            w={L["disciples-amazed"].w}
            h={L["disciples-amazed"].h}
            delay={2.2}
          />
        </Layer>
        <Layer
          src={calmJesus}
          w={L["jesus-seated"].w}
          h={L["jesus-seated"].h}
          x={650}
          y={502}
          scale={0.46}
          className="a-breathe-slow"
          delay={1}
        >
          <Lids name="jesus-seated" w={L["jesus-seated"].w} h={L["jesus-seated"].h} delay={0.7} />
        </Layer>
        <Layer
          src={calmBoatHull}
          w={L["boat-hull"].w}
          h={L["boat-hull"].h}
          x={500}
          y={600}
          scale={0.62}
        />
        <Ripple x={470} y={640} scale={0.5} delay={0} cls="" />
      </g>
      <Sparkle x={300} y={90} s={1.2} delay={0.4} />
      <Sparkle x={720} y={70} s={1} delay={1.1} />
      {found.includes("gull") && <Sparkle x={220} y={110} s={1.6} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Scene art by key; the registry in `index.ts` loads this module on demand. */
export const SCENES: Record<string, SceneArt> = {
  "storm/evening": SettingOut,
  "storm/asleep": AsleepInTheStern,
  "storm/afraid": TheWildNight,
  "storm/peace": QuietBeStill,
  "storm/calm": WhoIsThis,
};
