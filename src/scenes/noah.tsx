import { Rain, Sparkle } from "../art/base";
import { Grain, SoftShadow } from "../art/v2/effects";
import { Backdrop, Flipbook, Layer } from "../art/raster";
import buildsLayers from "../assets/scenes/noah/builds/layers.json";
import buildsBg from "../assets/scenes/noah/builds/bg.webp";
import buildsNoah from "../assets/scenes/noah/builds/noah-raise.webp";
import buildsSons from "../assets/scenes/noah/builds/sons-carry.webp";
import twoLayers from "../assets/scenes/noah/two-by-two/layers.json";
import twoBg from "../assets/scenes/noah/two-by-two/bg.webp";
import twoGiraffes from "../assets/scenes/noah/two-by-two/giraffes.webp";
import twoElephants from "../assets/scenes/noah/two-by-two/elephants.webp";
import twoZebras from "../assets/scenes/noah/two-by-two/zebras.webp";
import twoLions from "../assets/scenes/noah/two-by-two/lions.webp";
import twoSheep from "../assets/scenes/noah/two-by-two/sheep.webp";
import twoNoah from "../assets/scenes/noah/two-by-two/noah-point.webp";
import praysLayers from "../assets/scenes/daniel/prays/layers.json";
import birdUp from "../assets/scenes/daniel/prays/bird-up.webp";
import birdDown from "../assets/scenes/daniel/prays/bird-down.webp";
import floodLayers from "../assets/scenes/noah/flood/layers.json";
import floodBg from "../assets/scenes/noah/flood/bg.webp";
import floodArk from "../assets/scenes/noah/flood/ark-afloat.webp";
import doveLayers from "../assets/scenes/noah/dove/layers.json";
import doveBg from "../assets/scenes/noah/dove/bg.webp";
import doveArk from "../assets/scenes/noah/dove/ark-resting.webp";
import doveNoah from "../assets/scenes/noah/dove/noah-window.webp";
import doveBranch from "../assets/scenes/noah/dove/dove-branch.webp";
import rainbowLayers from "../assets/scenes/noah/rainbow/layers.json";
import rainbowBg from "../assets/scenes/noah/rainbow/bg.webp";
import rainbowFamily from "../assets/scenes/noah/rainbow/family.webp";
import rainbowNoah from "../assets/scenes/noah/rainbow/noah-look-up.webp";
import type { SceneArt, SceneArtProps } from "../types";

/** The two prays dove frames as a Flipbook, flapping in place. */
function FlappingDove({
  x,
  y,
  size = 1,
  flip = false,
}: {
  x: number;
  y: number;
  size?: number;
  flip?: boolean;
}) {
  const B = praysLayers.cutouts;
  return (
    <Flipbook
      a={{ src: birdUp, w: B["bird-up"].w, h: B["bird-up"].h, ax: 195, ay: 122, s: 0.25 * size }}
      b={{
        src: birdDown,
        w: B["bird-down"].w,
        h: B["bird-down"].h,
        ax: 247,
        ay: 32,
        s: 0.185 * size,
      }}
      x={x}
      y={y}
      flip={flip}
      motion="a-float"
    />
  );
}

/** God gives Noah the plan, and Noah starts building. */
export function NoahBuilds() {
  const L = buildsLayers.cutouts;
  return (
    <>
      <Backdrop src={buildsBg} />
      <SoftShadow x={250} y={592} rx={80} ry={14} opacity={0.4} />
      <Layer
        src={buildsNoah}
        w={L["noah-raise"].w}
        h={L["noah-raise"].h}
        x={250}
        y={592}
        scale={0.38}
        className="a-breathe"
      />
      <SoftShadow x={540} y={602} rx={150} ry={16} opacity={0.4} />
      <Layer
        src={buildsSons}
        w={L["sons-carry"].w}
        h={L["sons-carry"].h}
        x={540}
        y={602}
        scale={0.36}
        className="a-breathe-slow"
      />
      <Grain opacity={0.05} />
    </>
  );
}

/** Two of every kind, up the ramp. */
export function TwoByTwo({ found }: SceneArtProps) {
  const L = twoLayers.cutouts;
  const animal = (
    src: string,
    key: keyof typeof L,
    x: number,
    y: number,
    scale: number,
    cls: string,
    rx: number,
  ) => (
    <>
      <SoftShadow x={x} y={y} rx={rx} ry={rx * 0.12} opacity={0.4} />
      <Layer src={src} w={L[key].w} h={L[key].h} x={x} y={y} scale={scale} className={cls} />
    </>
  );
  return (
    <>
      <Backdrop src={twoBg} />
      {animal(twoGiraffes, "giraffes", 140, 565, 0.3, "a-breathe-slow", 90)}
      {animal(twoElephants, "elephants", 320, 595, 0.32, "a-breathe-slow", 150)}
      {animal(twoZebras, "zebras", 190, 612, 0.26, "a-breathe", 110)}
      {animal(twoLions, "lions", 430, 614, 0.28, "a-breathe-slow", 130)}
      {animal(twoSheep, "sheep", 560, 616, 0.22, "a-breathe", 80)}
      <SoftShadow x={610} y={598} rx={80} ry={14} opacity={0.4} />
      <Layer
        src={twoNoah}
        w={L["noah-point"].w}
        h={L["noah-point"].h}
        x={610}
        y={598}
        scale={0.33}
        className="a-breathe"
      />
      <FlappingDove x={520} y={250} size={0.8} />
      <FlappingDove x={578} y={285} size={0.7} />
      {found.includes("doves") && <Sparkle x={548} y={240} s={1.6} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Forty days of rain; the ark floats. */
export function TheFlood() {
  const L = floodLayers.cutouts;
  return (
    <>
      <Backdrop src={floodBg} />
      <g transform="translate(500 400)">
        <g className="a-rock">
          <image
            href={floodArk}
            x={-L["ark-afloat"].w * 0.25}
            y={-L["ark-afloat"].h * 0.5}
            width={L["ark-afloat"].w * 0.5}
            height={L["ark-afloat"].h * 0.5}
          />
        </g>
      </g>
      <Rain count={90} seed={23} />
      <Grain opacity={0.05} />
    </>
  );
}

/** The dove comes back with an olive leaf. */
export function DoveReturns({ found }: SceneArtProps) {
  const L = doveLayers.cutouts;
  return (
    <>
      <Backdrop src={doveBg} />
      {/* Noah stands inside the ark beside the cabin; the hull hides the cutout's bottom edge */}
      <Layer
        src={doveNoah}
        w={L["noah-window"].w}
        h={L["noah-window"].h}
        x={560}
        y={345}
        scale={0.34}
        className="a-breathe"
      />
      <Layer
        src={doveArk}
        w={L["ark-resting"].w}
        h={L["ark-resting"].h}
        x={380}
        y={470}
        scale={0.5}
      />
      <SoftShadow x={380} y={472} rx={200} ry={18} opacity={0.3} />
      <Layer
        src={doveBranch}
        w={L["dove-branch"].w}
        h={L["dove-branch"].h}
        x={620}
        y={330}
        scale={0.3}
        className="a-float"
      />
      {found.includes("leaf") && <Sparkle x={600} y={278} s={1.6} />}
      {found.includes("hill") && <Sparkle x={900} y={330} s={1.4} delay={0.4} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Dry ground, and a promise in the sky. */
export function TheRainbow({ found }: SceneArtProps) {
  const L = rainbowLayers.cutouts;
  const T = twoLayers.cutouts;
  const D = doveLayers.cutouts;
  return (
    <>
      <Backdrop src={rainbowBg} />
      <SoftShadow x={140} y={612} rx={110} ry={14} opacity={0.4} />
      <Layer
        src={twoLions}
        w={T.lions.w}
        h={T.lions.h}
        x={140}
        y={612}
        scale={0.22}
        className="a-breathe-slow"
      />
      <SoftShadow x={330} y={602} rx={150} ry={16} opacity={0.4} />
      <Layer
        src={rainbowFamily}
        w={L.family.w}
        h={L.family.h}
        x={330}
        y={602}
        scale={0.36}
        className="a-breathe-slow"
      />
      <SoftShadow x={560} y={592} rx={90} ry={14} opacity={0.4} />
      <Layer
        src={rainbowNoah}
        w={L["noah-look-up"].w}
        h={L["noah-look-up"].h}
        x={560}
        y={592}
        scale={0.38}
        className="a-breathe"
      />
      <SoftShadow x={770} y={612} rx={80} ry={12} opacity={0.4} />
      <Layer
        src={twoSheep}
        w={T.sheep.w}
        h={T.sheep.h}
        x={770}
        y={612}
        scale={0.2}
        className="a-breathe"
      />
      <Layer
        src={doveBranch}
        w={D["dove-branch"].w}
        h={D["dove-branch"].h}
        x={190}
        y={230}
        scale={0.26}
        className="a-float"
      />
      <Sparkle x={500} y={120} s={1.4} />
      {found.includes("rainbow") && <Sparkle x={440} y={150} s={1.8} delay={0.3} />}
      {found.includes("family") && <Sparkle x={330} y={420} s={1.5} delay={0.5} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Scene art by key; the registry in `index.ts` loads this module on demand. */
export const SCENES: Record<string, SceneArt> = {
  "noah/builds": NoahBuilds,
  "noah/two-by-two": TwoByTwo,
  "noah/flood": TheFlood,
  "noah/dove": DoveReturns,
  "noah/rainbow": TheRainbow,
};
