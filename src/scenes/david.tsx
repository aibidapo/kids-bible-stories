import { Sparkle } from "../art/base";
import { Grain, SoftShadow } from "../art/v2/effects";
import { Backdrop, Eyelids, Flipbook, Layer, Part } from "../art/raster";
import shepherdLayers from "../assets/scenes/david/shepherd/layers.json";
import shepherdBg from "../assets/scenes/david/shepherd/bg.webp";
import shepherdDavid from "../assets/scenes/david/shepherd/david-staff.webp";
import shepherdLamb from "../assets/scenes/david/shepherd/lamb.webp";
import shepherdTrunk from "../assets/scenes/david/shepherd/tree-body.webp";
import shepherdCanopy from "../assets/scenes/david/shepherd/tree-tail.webp";
import shepherdGrass from "../assets/scenes/david/shepherd/grass-tuft.webp";
import bluebirdUp from "../assets/scenes/david/shepherd/bluebird-up.webp";
import bluebirdDown from "../assets/scenes/david/shepherd/bluebird-down.webp";
import redbirdUp from "../assets/scenes/david/shepherd/redbird-up.webp";
import redbirdDown from "../assets/scenes/david/shepherd/redbird-down.webp";
import goldfinchUp from "../assets/scenes/david/shepherd/goldfinch-up.webp";
import goldfinchDown from "../assets/scenes/david/shepherd/goldfinch-down.webp";
import twoLayers from "../assets/scenes/noah/two-by-two/layers.json";
import twoSheep from "../assets/scenes/noah/two-by-two/sheep.webp";
import tauntLayers from "../assets/scenes/david/taunt/layers.json";
import tauntBg from "../assets/scenes/david/taunt/bg.webp";
import tauntGoliath from "../assets/scenes/david/taunt/goliath-taunt.webp";
import tauntArmy from "../assets/scenes/david/taunt/army-afraid.webp";
import volLayers from "../assets/scenes/david/volunteers/layers.json";
import volBg from "../assets/scenes/david/volunteers/bg.webp";
import volSaul from "../assets/scenes/david/volunteers/saul-point.webp";
import volDavid from "../assets/scenes/david/volunteers/david-brave.webp";
import volArmour from "../assets/scenes/david/volunteers/armour-pile.webp";
import stonesLayers from "../assets/scenes/david/stones/layers.json";
import stonesBg from "../assets/scenes/david/stones/bg.webp";
import stonesDavid from "../assets/scenes/david/stones/david-sling.webp";
import stonesGoliath from "../assets/scenes/david/stones/goliath-loom.webp";
import stonesPile from "../assets/scenes/david/stones/stones.webp";
import victoryLayers from "../assets/scenes/david/victory/layers.json";
import victoryBg from "../assets/scenes/david/victory/bg.webp";
import victoryDavid from "../assets/scenes/david/victory/david-victory.webp";
import victoryArmy from "../assets/scenes/david/victory/army-cheer.webp";
import victoryGoliath from "../assets/scenes/david/victory/goliath-fallen.webp";
import victoryRunners from "../assets/scenes/david/victory/soldiers-run.webp";
import type { SceneArtProps } from "../types";

/** Eye points and lid tones come from design/pipeline/find_eyes.py. */
const EYES = {
  // measured by hand on a 10 px grid: the detector had found only the white crescents
  davidStaff: { points: [[249, 136], [320, 136]] as [number, number][], rx: 17, ry: 15, tone: "#d98050" },
  // the Noah sheep pair shows one eye per sheep; black faces
  sheepPair: { points: [[456, 140], [702, 186]] as [number, number][], rx: 21, ry: 19, tone: "#1e1a1a" },
  goliathTaunt: { points: [[298, 234], [375, 237]] as [number, number][], rx: 16, ry: 16, tone: "#e4a578" },
  armyAfraid: {
    points: [[126, 183], [190, 182], [386, 164], [459, 156], [608, 178], [673, 176]] as [number, number][],
    rx: 15,
    ry: 17,
    tone: "#dd8f60",
  },
  saul: { points: [[281, 123], [345, 127]] as [number, number][], rx: 15, ry: 14, tone: "#d9a07a" },
  davidBrave: { points: [[95, 121], [150, 121]] as [number, number][], rx: 9, ry: 13, tone: "#cf8051" },
  davidSling: { points: [[371, 243]] as [number, number][], rx: 16, ry: 18, tone: "#d67e50" },
  goliathLoom: { points: [[282, 253], [359, 252]] as [number, number][], rx: 16, ry: 17, tone: "#e0a074" },
  davidVictory: { points: [[259, 139], [321, 139]] as [number, number][], rx: 9, ry: 12, tone: "#d28454" },
  armyCheer: {
    points: [[145, 134], [201, 125], [414, 115], [492, 114], [700, 124], [759, 132]] as [number, number][],
    rx: 12,
    ry: 14,
    tone: "#e59a68",
  },
};

function Bird({
  up,
  down,
  upEye,
  downEye,
  x,
  y,
  size,
  motion,
  delay,
  flip = false,
}: {
  up: { src: string; w: number; h: number };
  down: { src: string; w: number; h: number };
  upEye: [number, number];
  downEye: [number, number];
  x: number;
  y: number;
  size: number;
  motion: string;
  delay: number;
  flip?: boolean;
}) {
  return (
    <Flipbook
      a={{ src: up.src, w: up.w, h: up.h, ax: upEye[0], ay: upEye[1], s: size }}
      b={{ src: down.src, w: down.w, h: down.h, ax: downEye[0], ay: downEye[1], s: size }}
      x={x}
      y={y}
      flip={flip}
      motion={motion}
      delay={delay}
    />
  );
}

/** A boy, a staff, and a flock on the hills. */
export function ShepherdBoy({ found }: SceneArtProps) {
  const L = shepherdLayers.cutouts;
  const T = twoLayers.cutouts;
  const tree = L.tree;
  const sheep = (x: number, y: number, s: number, flip: boolean, cls: string, blink: number) => (
    <>
      <SoftShadow x={x} y={y} rx={T.sheep.w * s * 0.42} ry={10} opacity={0.4} />
      <Layer src={twoSheep} w={T.sheep.w} h={T.sheep.h} x={x} y={y} scale={s} flip={flip} className={cls}>
        <Eyelids {...EYES.sheepPair} w={T.sheep.w} h={T.sheep.h} delay={blink} />
      </Layer>
    </>
  );
  const tuft = (x: number, y: number, s: number, delay: number, flip = false) => (
    <Layer src={shepherdGrass} w={L["grass-tuft"].w} h={L["grass-tuft"].h} x={x} y={y} scale={s} flip={flip} className="a-sway" delay={delay} />
  );
  return (
    <>
      <Backdrop src={shepherdBg} />

      {/* the olive tree: trunk still, canopy swaying from where it meets the trunk */}
      <Layer src={shepherdTrunk} w={tree.w} h={tree.h} x={110} y={520} scale={0.62} />
      <Part
        src={shepherdCanopy}
        tw={tree.tail.w}
        th={tree.tail.h}
        ox={tree.tail.ox}
        oy={tree.tail.oy}
        w={tree.w}
        h={tree.h}
        x={110}
        y={520}
        scale={0.62}
        className="a-sway-slow"
      />

      {/* birds of different colours, each on its own path and flap offset */}
      <Bird up={{ src: bluebirdUp, w: L["bluebird-up"].w, h: L["bluebird-up"].h }} down={{ src: bluebirdDown, w: L["bluebird-down"].w, h: L["bluebird-down"].h }} upEye={[205, 85]} downEye={[240, 50]} x={420} y={150} size={0.26} motion="a-fly" delay={0} />
      <Bird up={{ src: redbirdUp, w: L["redbird-up"].w, h: L["redbird-up"].h }} down={{ src: redbirdDown, w: L["redbird-down"].w, h: L["redbird-down"].h }} upEye={[185, 95]} downEye={[215, 50]} x={620} y={230} size={0.22} motion="a-flutter" delay={-3} />
      <Bird up={{ src: goldfinchUp, w: L["goldfinch-up"].w, h: L["goldfinch-up"].h }} down={{ src: goldfinchDown, w: L["goldfinch-down"].w, h: L["goldfinch-down"].h }} upEye={[188, 100]} downEye={[245, 45]} x={330} y={120} size={0.2} motion="a-flutter" delay={-7} flip />

      {/* the flock grazes the meadow between David and the stream, far to near */}
      {sheep(600, 528, 0.13, true, "a-breathe-slow", 0.7)}
      {sheep(520, 536, 0.14, false, "a-breathe", 1.9)}
      {sheep(680, 548, 0.15, true, "a-breathe-slow", 3.1)}
      {sheep(430, 556, 0.16, false, "a-breathe", 4.3)}
      {sheep(590, 578, 0.19, true, "a-breathe-slow", 2.5)}
      {sheep(660, 604, 0.22, false, "a-breathe", 0.2)}
      {sheep(540, 616, 0.22, true, "a-breathe-slow", 3.7)}
      <SoftShadow x={450} y={604} rx={60} ry={10} opacity={0.4} />
      <Layer src={shepherdLamb} w={L.lamb.w} h={L.lamb.h} x={450} y={604} scale={0.3} className="a-breathe-slow">
        {/* lamb faces left: a small far eye and a big near eye, measured on a 10 px grid */}
        <Eyelids points={[[57, 108]]} w={L.lamb.w} h={L.lamb.h} rx={9} ry={8} tone="#241f1f" delay={1.4} />
        <Eyelids points={[[133, 125]]} w={L.lamb.w} h={L.lamb.h} rx={19} ry={16} tone="#241f1f" delay={1.4} />
      </Layer>

      <SoftShadow x={300} y={596} rx={70} ry={12} opacity={0.4} />
      <Layer src={shepherdDavid} w={L["david-staff"].w} h={L["david-staff"].h} x={300} y={596} scale={0.38} className="a-breathe">
        <Eyelids {...EYES.davidStaff} w={L["david-staff"].w} h={L["david-staff"].h} />
      </Layer>

      {/* foreground grass, swaying */}
      {tuft(60, 622, 0.5, 0)}
      {tuft(210, 626, 0.42, -1.1, true)}
      {tuft(400, 628, 0.46, -2.3)}
      {tuft(720, 626, 0.4, -0.6, true)}
      {tuft(940, 624, 0.48, -1.7)}

      {found.includes("sheep") && <Sparkle x={640} y={520} s={1.4} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Forty days of shouting across the valley. */
export function GoliathTaunts() {
  const L = tauntLayers.cutouts;
  return (
    <>
      <Backdrop src={tauntBg} />
      <SoftShadow x={200} y={602} rx={130} ry={14} opacity={0.4} />
      <Layer src={tauntArmy} w={L["army-afraid"].w} h={L["army-afraid"].h} x={200} y={602} scale={0.36} className="a-breathe">
        <Eyelids {...EYES.armyAfraid} w={L["army-afraid"].w} h={L["army-afraid"].h} delay={1.1} />
      </Layer>
      <SoftShadow x={740} y={618} rx={180} ry={20} opacity={0.45} />
      <Layer src={tauntGoliath} w={L["goliath-taunt"].w} h={L["goliath-taunt"].h} x={740} y={618} scale={0.6} className="a-breathe-slow">
        <Eyelids {...EYES.goliathTaunt} w={L["goliath-taunt"].w} h={L["goliath-taunt"].h} delay={3.4} />
      </Layer>
      <Grain opacity={0.05} />
    </>
  );
}

/** The king's armour, and a boy who does not need it. */
export function DavidVolunteers({ found }: SceneArtProps) {
  const L = volLayers.cutouts;
  return (
    <>
      <Backdrop src={volBg} />
      <SoftShadow x={310} y={608} rx={100} ry={12} opacity={0.4} />
      <Layer src={volArmour} w={L["armour-pile"].w} h={L["armour-pile"].h} x={310} y={608} scale={0.36} />
      <SoftShadow x={440} y={600} rx={70} ry={12} opacity={0.4} />
      <Layer src={volDavid} w={L["david-brave"].w} h={L["david-brave"].h} x={440} y={600} scale={0.36} className="a-breathe">
        <Eyelids {...EYES.davidBrave} w={L["david-brave"].w} h={L["david-brave"].h} />
      </Layer>
      <SoftShadow x={640} y={596} rx={90} ry={14} opacity={0.4} />
      <Layer src={volSaul} w={L["saul-point"].w} h={L["saul-point"].h} x={640} y={596} scale={0.42} className="a-breathe-slow">
        <Eyelids {...EYES.saul} w={L["saul-point"].w} h={L["saul-point"].h} delay={2.2} />
      </Layer>
      {found.includes("armour") && <Sparkle x={310} y={520} s={1.5} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Five smooth stones, and the sling going round. */
export function FiveSmoothStones({ found }: SceneArtProps) {
  const L = stonesLayers.cutouts;
  return (
    <>
      <Backdrop src={stonesBg} />
      <SoftShadow x={780} y={620} rx={170} ry={20} opacity={0.45} />
      <Layer src={stonesGoliath} w={L["goliath-loom"].w} h={L["goliath-loom"].h} x={780} y={620} scale={0.6} className="a-breathe-slow">
        <Eyelids {...EYES.goliathLoom} w={L["goliath-loom"].w} h={L["goliath-loom"].h} delay={2.7} />
      </Layer>
      <SoftShadow x={150} y={602} rx={60} ry={10} opacity={0.4} />
      <Layer src={stonesPile} w={L.stones.w} h={L.stones.h} x={150} y={602} scale={0.3} />
      <SoftShadow x={300} y={600} rx={80} ry={12} opacity={0.4} />
      <Layer src={stonesDavid} w={L["david-sling"].w} h={L["david-sling"].h} x={300} y={600} scale={0.38} className="a-breathe">
        <Eyelids {...EYES.davidSling} w={L["david-sling"].w} h={L["david-sling"].h} />
      </Layer>
      {found.includes("stones") && <Sparkle x={150} y={560} s={1.3} />}
      {found.includes("sling") && <Sparkle x={300} y={300} s={1.6} delay={0.3} />}
      <Grain opacity={0.05} />
    </>
  );
}

/**
 * The stone flies, and the giant goes down. The beat plays once when the page
 * opens; attributes hold the outcome so Calm mode shows Goliath already down.
 */
export function TheStrike({ found }: SceneArtProps) {
  const S = stonesLayers.cutouts;
  const V = victoryLayers.cutouts;
  return (
    <>
      <Backdrop src={stonesBg} />

      {/* standing Goliath, toppling about his heels, then hidden */}
      {/* standing Goliath staggers about his feet, then fades as the fallen pose fades in */}
      <SoftShadow x={820} y={622} rx={170} ry={20} opacity={0.45} />
      <g transform="translate(820 622) scale(0.6)">
        <g className="a-topple">
          <g className="a-stand-out" opacity="0">
            <image
              href={stonesGoliath}
              x={-S["goliath-loom"].w / 2}
              y={-S["goliath-loom"].h}
              width={S["goliath-loom"].w}
              height={S["goliath-loom"].h}
            />
          </g>
        </g>
      </g>
      <SoftShadow x={700} y={628} rx={270} ry={20} opacity={0.4} />
      <g transform="translate(700 628) scale(0.5)">
        <g className="a-land-in" opacity="1">
          <image
            href={victoryGoliath}
            x={-V["goliath-fallen"].w / 2}
            y={-V["goliath-fallen"].h}
            width={V["goliath-fallen"].w}
            height={V["goliath-fallen"].h}
          />
        </g>
      </g>

      <SoftShadow x={240} y={600} rx={80} ry={12} opacity={0.4} />
      <Layer src={stonesDavid} w={S["david-sling"].w} h={S["david-sling"].h} x={240} y={600} scale={0.38} className="a-breathe">
        <Eyelids {...EYES.davidSling} w={S["david-sling"].w} h={S["david-sling"].h} />
      </Layer>

      {/* the stone: waits at the sling, flies to the forehead, vanishes; hidden at rest */}
      <g transform="translate(280 300)">
        <g className="a-stone-fly" opacity="0">
          <circle r="14" fill="#5e5c66" />
          <circle r="10" fill="#8f8d97" cx="-3" cy="-3" />
          <circle r="4" fill="#c9c7d0" cx="-6" cy="-6" />
        </g>
      </g>

      {found.includes("stone-hit") && <Sparkle x={800} y={110} s={1.8} />}
      {found.includes("goliath-down") && <Sparkle x={700} y={560} s={1.5} delay={0.3} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** The giant is down, and the valley erupts. */
export function Victory() {
  const L = victoryLayers.cutouts;
  return (
    <>
      <Backdrop src={victoryBg} />
      {/* soldiers pour down the hill from the camp and rest where they arrive */}
      <g transform="translate(250 522)">
        <g className="a-run-down">
          <g className="a-run-bob">
            <image
              href={victoryRunners}
              x={-L["soldiers-run"].w * 0.15}
              y={-L["soldiers-run"].h * 0.3}
              width={L["soldiers-run"].w * 0.3}
              height={L["soldiers-run"].h * 0.3}
            />
          </g>
        </g>
      </g>
      {/* the army already in the valley, adult height, behind the fallen giant */}
      <SoftShadow x={700} y={562} rx={140} ry={14} opacity={0.4} />
      <Layer src={victoryArmy} w={L["army-cheer"].w} h={L["army-cheer"].h} x={700} y={562} scale={0.5} className="a-breathe-slow">
        <Eyelids {...EYES.armyCheer} w={L["army-cheer"].w} h={L["army-cheer"].h} delay={1.6} />
      </Layer>
      <SoftShadow x={420} y={600} rx={80} ry={12} opacity={0.4} />
      <Layer src={victoryDavid} w={L["david-victory"].w} h={L["david-victory"].h} x={420} y={600} scale={0.36} className="a-breathe">
        <Eyelids {...EYES.davidVictory} w={L["david-victory"].w} h={L["david-victory"].h} />
      </Layer>
      <SoftShadow x={790} y={632} rx={260} ry={20} opacity={0.4} />
      <Layer src={victoryGoliath} w={L["goliath-fallen"].w} h={L["goliath-fallen"].h} x={790} y={632} scale={0.48} />
      <Sparkle x={350} y={300} s={1.6} />
      <Sparkle x={540} y={260} s={1.3} delay={0.5} />
      <Grain opacity={0.05} />
    </>
  );
}
