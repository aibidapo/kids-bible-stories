import { HolyGlow, Lightning, Rain, Sparkle } from "../art/base";
import { rand } from "../art/palette";
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
import stormWave from "../assets/scenes/jonah/storm/wave.webp";
import swLayers from "../assets/scenes/jonah/swallowed/layers.json";
import swBg from "../assets/scenes/jonah/swallowed/bg.webp";
import swFish from "../assets/scenes/jonah/swallowed/great-fish.webp";
import swJonah from "../assets/scenes/jonah/swallowed/jonah-fall.webp";
import swTurtle from "../assets/scenes/jonah/swallowed/turtle.webp";
import swSchool from "../assets/scenes/jonah/swallowed/fish-school.webp";
import swJelly from "../assets/scenes/jonah/swallowed/jellyfish.webp";
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
      <SoftShadow x={470} y={402} rx={120} ry={10} opacity={0.4} />
      <Layer src={runSailors} w={L.sailors.w} h={L.sailors.h} x={470} y={402} scale={0.44} className="a-breathe-slow">
        <Eyelids {...EYES.sailors} w={L.sailors.w} h={L.sailors.h} delay={2.1} />
      </Layer>
      <SoftShadow x={320} y={436} rx={90} ry={10} opacity={0.4} />
      <Layer src={runJonah} w={L["jonah-walk"].w} h={L["jonah-walk"].h} x={320} y={436} scale={0.37} className="a-breathe">
        <Eyelids {...EYES.jonahWalk} w={L["jonah-walk"].w} h={L["jonah-walk"].h} />
      </Layer>
      {/* the ship, nearer the viewer than the quay, is drawn in front; prow to the left: west, away from Nineveh */}
      <g transform="translate(905 616) scale(-1 1)">
        <g className="a-rock">
          <image href={runShip} x={-L.ship.w * 0.44} y={-L.ship.h * 0.88} width={L.ship.w * 0.88} height={L.ship.h * 0.88} />
        </g>
      </g>
      {found.includes("ship") && <Sparkle x={840} y={300} s={1.6} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** The sea would not calm until Jonah went over the side. */
export function TheStorm() {
  const S = stormLayers.cutouts;
  const sc = 0.3;
  const shipS = 0.8;
  const wave = (x: number, y: number, scale: number, cls: string, delay: number, flip = false) => (
    <Layer src={stormWave} w={S.wave.w} h={S.wave.h} x={x} y={y} scale={scale} flip={flip} className={cls} delay={delay} />
  );
  return (
    <>
      <Backdrop src={stormBg} />
      <Lightning delay={0.8} />
      {/* far swell behind the ship */}
      {wave(280, 600, 0.6, "a-heave-slow", -2)}
      {wave(800, 590, 0.55, "a-heave-slow", -5, true)}
      {/* the ship rides the near swell: same heave class and delay as the wave in front of it */}
      <g transform="translate(500 590)">
        <g className="a-heave">
          <g className="a-rock">
            {/* crew inside the hull, drawn first so the gunwale covers their legs */}
            <g transform="translate(-70 -140)">
              <g className="a-shake">
                <image href={stormSailors} x={-S["sailors-afraid"].w * sc * 0.5} y={-S["sailors-afraid"].h * sc} width={S["sailors-afraid"].w * sc} height={S["sailors-afraid"].h * sc} />
                <g transform={`translate(${-S["sailors-afraid"].w * sc * 0.5} ${-S["sailors-afraid"].h * sc}) scale(${sc})`}>
                  <Eyelids {...EYES.sailorsAfraid} w={0} h={0} delay={1.3} />
                </g>
              </g>
            </g>
            <g transform="translate(80 -150)">
              <g className="a-breathe">
                <image href={stormJonah} x={-S["jonah-point-self"].w * 0.13} y={-S["jonah-point-self"].h * 0.26} width={S["jonah-point-self"].w * 0.26} height={S["jonah-point-self"].h * 0.26} />
                <g transform={`translate(${-S["jonah-point-self"].w * 0.13} ${-S["jonah-point-self"].h * 0.26}) scale(0.26)`}>
                  <Eyelids {...EYES.jonahPointSelf} w={0} h={0} />
                </g>
              </g>
            </g>
            <image href={stormShip} x={-S["ship-storm"].w * shipS * 0.5} y={-S["ship-storm"].h * shipS} width={S["ship-storm"].w * shipS} height={S["ship-storm"].h * shipS} />
          </g>
        </g>
      </g>
      {/* near swell in front, carrying the ship */}
      {wave(430, 650, 0.75, "a-heave", 0)}
      {wave(950, 640, 0.6, "a-heave", -1.4, true)}
      <Rain count={100} seed={42} />
      <Grain opacity={0.05} />
    </>
  );
}

/** Down, and swallowed whole. */
export function SwallowedWhole() {
  const L = swLayers.cutouts;
  const fishS = 0.55;
  const bubbles = Array.from({ length: 14 }, (_, i) => {
    const t = rand(11 + i);
    return { x: 120 + t * 760, y: 380 + rand(40 + i) * 220, r: 3 + rand(70 + i) * 6, d: -t * 7 };
  });
  return (
    <>
      <Backdrop src={swBg} />
      {/* other sea life, each on its own drift */}
      <Layer src={swTurtle} w={L.turtle.w} h={L.turtle.h} x={200} y={300} scale={0.36} className="a-swim-slow" delay={-3} />
      <Layer src={swSchool} w={L["fish-school"].w} h={L["fish-school"].h} x={800} y={230} scale={0.4} className="a-swim" delay={-1} />
      <Layer src={swJelly} w={L.jellyfish.w} h={L.jellyfish.h} x={900} y={470} scale={0.42} className="a-float" delay={-2} />
      <g transform="translate(660 500)">
        <g className="a-swim-slow">
          <image href={swFish} x={-L["great-fish"].w * fishS * 0.5} y={-L["great-fish"].h * fishS * 0.5} width={L["great-fish"].w * fishS} height={L["great-fish"].h * fishS} />
          <g transform={`translate(${-L["great-fish"].w * fishS * 0.5} ${-L["great-fish"].h * fishS * 0.5}) scale(${fishS})`}>
            <Eyelids {...EYES.greatFish} w={0} h={0} delay={2.8} />
          </g>
        </g>
      </g>
      {/* Jonah, head-first into the mouth and drawn in front of it so the swallowing shows; the beat replays his drift in */}
      <g transform="translate(372 528)">
        <g className="a-swallow">
          <image href={swJonah} x={-L["jonah-fall"].w * 0.14} y={-L["jonah-fall"].h * 0.14} width={L["jonah-fall"].w * 0.28} height={L["jonah-fall"].h * 0.28} />
          <g transform={`translate(${-L["jonah-fall"].w * 0.14} ${-L["jonah-fall"].h * 0.14}) scale(0.28)`}>
            <Eyelids {...EYES.jonahFall} w={0} h={0} />
          </g>
        </g>
      </g>
      {/* bubbles rise from the depths; each is drawn where it starts */}
      <g pointerEvents="none">
        {bubbles.map((b, i) => (
          <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
            <g className="a-bubble" style={{ animationDelay: `${b.d.toFixed(2)}s` }}>
              <circle r={b.r.toFixed(1)} fill="none" stroke="#e6f6ff" strokeWidth="1.5" opacity="0.7" />
              <circle r={(b.r * 0.3).toFixed(1)} cx={(-b.r * 0.35).toFixed(1)} cy={(-b.r * 0.35).toFixed(1)} fill="#ffffff" opacity="0.6" />
            </g>
          </g>
        ))}
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
      <SoftShadow x={660} y={608} rx={200} ry={16} opacity={0.4} />
      <Layer src={ninCrowd} w={L["crowd-listen"].w} h={L["crowd-listen"].h} x={660} y={608} scale={0.48} className="a-breathe-slow">
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
