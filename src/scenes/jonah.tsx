import { HolyGlow, Lightning, Rain, Sparkle } from "../art/base";
import { Grain, SoftShadow } from "../art/v2/effects";
import { Backdrop, Eyelids, Layer } from "../art/raster";
import runLayers from "../assets/scenes/jonah/running/layers.json";
import runBg from "../assets/scenes/jonah/running/bg.webp";
import runJonah from "../assets/scenes/jonah/running/jonah-walk.webp";
import runShip from "../assets/scenes/jonah/running/ship.webp";
import runSailors from "../assets/scenes/jonah/running/sailors.webp";
import stormLayers from "../assets/scenes/jonah/storm/layers.json";
import stormBg from "../assets/scenes/jonah/storm/bg.webp";
import stormShip from "../assets/scenes/jonah/storm/ship-storm.webp";
import stormSailors from "../assets/scenes/jonah/storm/sailors-afraid.webp";
import stormJonah from "../assets/scenes/jonah/storm/jonah-point-self.webp";
import swLayers from "../assets/scenes/jonah/swallowed/layers.json";
import swBg from "../assets/scenes/jonah/swallowed/bg.webp";
import swFish from "../assets/scenes/jonah/swallowed/great-fish.webp";
import swJonah from "../assets/scenes/jonah/swallowed/jonah-fall.webp";
import prayLayers from "../assets/scenes/jonah/prayer/layers.json";
import prayBg from "../assets/scenes/jonah/prayer/bg.webp";
import prayJonah from "../assets/scenes/jonah/prayer/jonah-pray.webp";
import prayFish from "../assets/scenes/jonah/prayer/little-fish.webp";
import ninLayers from "../assets/scenes/jonah/nineveh/layers.json";
import ninBg from "../assets/scenes/jonah/nineveh/bg.webp";
import ninJonah from "../assets/scenes/jonah/nineveh/jonah-preach.webp";
import ninCrowd from "../assets/scenes/jonah/nineveh/crowd-listen.webp";
import type { SceneArtProps } from "../types";

/** Eye points from design/pipeline/find_eyes.py; noise blobs dropped, far eyes mirrored by hand. */
const EYES = {
  jonahWalk: { points: [[311, 133], [377, 134]] as [number, number][], rx: 17, ry: 17, tone: "#cb8b5c" },
  sailors: { points: [[121, 100], [177, 93], [492, 99], [548, 99]] as [number, number][], rx: 13, ry: 13, tone: "#d8935f" },
  jonahPointSelf: { points: [[120, 99], [185, 99]] as [number, number][], rx: 12, ry: 10, tone: "#d18c61" },
  sailorsAfraid: {
    points: [[91, 166], [135, 149], [290, 125], [342, 136], [429, 186], [474, 188]] as [number, number][],
    rx: 13,
    ry: 13,
    tone: "#d98c62",
  },
  greatFish: { points: [[377, 204]] as [number, number][], rx: 44, ry: 36, tone: "#507179" },
  jonahFall: { points: [[650, 300], [723, 313]] as [number, number][], rx: 22, ry: 20, tone: "#d0905f" },
  jonahPray: { points: [[255, 116], [323, 115]] as [number, number][], rx: 18, ry: 14, tone: "#d69168" },
  littleFish: { points: [[191, 85]] as [number, number][], rx: 19, ry: 20, tone: "#eec65f" },
  jonahPreach: { points: [[175, 125], [232, 125]] as [number, number][], rx: 17, ry: 14, tone: "#d69365" },
  crowd: {
    points: [[110, 124], [161, 121], [327, 99], [380, 101], [472, 412], [550, 168], [686, 119], [736, 122]] as [number, number][],
    rx: 13,
    ry: 12,
    tone: "#d88a5c",
  },
};

/** The wrong ship, the wrong direction. */
export function RunningAway({ found }: SceneArtProps) {
  const L = runLayers.cutouts;
  return (
    <>
      <Backdrop src={runBg} />
      <g transform="translate(720 470)">
        <g className="a-rock">
          <image href={runShip} x={-L.ship.w * 0.2} y={-L.ship.h * 0.4} width={L.ship.w * 0.4} height={L.ship.h * 0.4} />
        </g>
      </g>
      <SoftShadow x={560} y={598} rx={110} ry={12} opacity={0.4} />
      <Layer src={runSailors} w={L.sailors.w} h={L.sailors.h} x={560} y={598} scale={0.32} className="a-breathe-slow">
        <Eyelids {...EYES.sailors} w={L.sailors.w} h={L.sailors.h} delay={2.1} />
      </Layer>
      <SoftShadow x={250} y={602} rx={90} ry={12} opacity={0.4} />
      <Layer src={runJonah} w={L["jonah-walk"].w} h={L["jonah-walk"].h} x={250} y={602} scale={0.38} className="a-breathe">
        <Eyelids {...EYES.jonahWalk} w={L["jonah-walk"].w} h={L["jonah-walk"].h} />
      </Layer>
      {found.includes("ship") && <Sparkle x={720} y={300} s={1.6} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** The sea would not calm until Jonah went over the side. */
export function TheStorm() {
  const S = stormLayers.cutouts;
  const sc = 0.34;
  return (
    <>
      <Backdrop src={stormBg} />
      <Lightning delay={0.8} />
      {/* sailors and Jonah ride inside the hull: drawn first so the ship covers their legs */}
      <g transform="translate(430 445)">
        <g className="a-shake">
          <image href={stormSailors} x={-S["sailors-afraid"].w * sc * 0.5} y={-S["sailors-afraid"].h * sc} width={S["sailors-afraid"].w * sc} height={S["sailors-afraid"].h * sc} />
          <g transform={`translate(${-S["sailors-afraid"].w * sc * 0.5} ${-S["sailors-afraid"].h * sc}) scale(${sc})`}>
            <Eyelids {...EYES.sailorsAfraid} w={0} h={0} delay={1.3} />
          </g>
        </g>
      </g>
      <Layer src={stormJonah} w={S["jonah-point-self"].w} h={S["jonah-point-self"].h} x={578} y={452} scale={0.32} className="a-breathe">
        <Eyelids {...EYES.jonahPointSelf} w={S["jonah-point-self"].w} h={S["jonah-point-self"].h} />
      </Layer>
      <g transform="translate(500 520)">
        <g className="a-rock">
          <image href={stormShip} x={-S["ship-storm"].w * 0.31} y={-S["ship-storm"].h * 0.62} width={S["ship-storm"].w * 0.62} height={S["ship-storm"].h * 0.62} />
        </g>
      </g>
      <Rain count={100} seed={42} />
      <Grain opacity={0.05} />
    </>
  );
}

/** Down, and swallowed whole. */
export function SwallowedWhole() {
  const L = swLayers.cutouts;
  return (
    <>
      <Backdrop src={swBg} />
      <g transform="translate(340 380)">
        <g className="a-float">
          <image href={swJonah} x={-L["jonah-fall"].w * 0.15} y={-L["jonah-fall"].h * 0.15} width={L["jonah-fall"].w * 0.3} height={L["jonah-fall"].h * 0.3} />
          <g transform={`translate(${-L["jonah-fall"].w * 0.15} ${-L["jonah-fall"].h * 0.15}) scale(0.3)`}>
            <Eyelids {...EYES.jonahFall} w={0} h={0} />
          </g>
        </g>
      </g>
      <g transform="translate(660 500)">
        <g className="a-swim-slow">
          <image href={swFish} x={-L["great-fish"].w * 0.275} y={-L["great-fish"].h * 0.275} width={L["great-fish"].w * 0.55} height={L["great-fish"].h * 0.55} />
          <g transform={`translate(${-L["great-fish"].w * 0.275} ${-L["great-fish"].h * 0.275}) scale(0.55)`}>
            <Eyelids {...EYES.greatFish} w={0} h={0} delay={2.8} />
          </g>
        </g>
      </g>
      <Grain opacity={0.05} />
    </>
  );
}

/** Three days in the dark, and a prayer. */
export function PrayerInsideTheFish({ found }: SceneArtProps) {
  const L = prayLayers.cutouts;
  return (
    <>
      <Backdrop src={prayBg} />
      <HolyGlow x={500} y={70} r={220} />
      <g transform="translate(230 600)">
        <g className="a-swim">
          <image href={prayFish} x={-L["little-fish"].w * 0.14} y={-L["little-fish"].h * 0.28} width={L["little-fish"].w * 0.28} height={L["little-fish"].h * 0.28} />
          <g transform={`translate(${-L["little-fish"].w * 0.14} ${-L["little-fish"].h * 0.28}) scale(0.28)`}>
            <Eyelids {...EYES.littleFish} w={0} h={0} delay={3.9} />
          </g>
        </g>
      </g>
      <SoftShadow x={500} y={602} rx={100} ry={14} opacity={0.4} />
      <Layer src={prayJonah} w={L["jonah-pray"].w} h={L["jonah-pray"].h} x={500} y={602} scale={0.4} className="a-breathe">
        <Eyelids {...EYES.jonahPray} w={L["jonah-pray"].w} h={L["jonah-pray"].h} />
      </Layer>
      {found.includes("light") && <Sparkle x={500} y={80} s={2} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** A big city, and the message it did not expect to hear. */
export function Nineveh({ found }: SceneArtProps) {
  const L = ninLayers.cutouts;
  return (
    <>
      <Backdrop src={ninBg} />
      <SoftShadow x={640} y={606} rx={160} ry={14} opacity={0.4} />
      <Layer src={ninCrowd} w={L["crowd-listen"].w} h={L["crowd-listen"].h} x={640} y={606} scale={0.38} className="a-breathe-slow">
        <Eyelids {...EYES.crowd} w={L["crowd-listen"].w} h={L["crowd-listen"].h} delay={1.7} />
      </Layer>
      <SoftShadow x={300} y={602} rx={90} ry={12} opacity={0.4} />
      <Layer src={ninJonah} w={L["jonah-preach"].w} h={L["jonah-preach"].h} x={300} y={602} scale={0.38} className="a-breathe">
        <Eyelids {...EYES.jonahPreach} w={L["jonah-preach"].w} h={L["jonah-preach"].h} />
      </Layer>
      {found.includes("city") && <Sparkle x={600} y={180} s={1.8} />}
      {found.includes("people") && <Sparkle x={640} y={420} s={1.4} delay={0.4} />}
      <Grain opacity={0.05} />
    </>
  );
}
