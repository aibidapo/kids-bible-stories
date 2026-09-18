import { HolyGlow, Sparkle } from "../art/base";
import { Grain, LightShaft, Motes } from "../art/v2/effects";
import { Backdrop, Eyelids, Layer, Tail } from "../art/raster";
import denLayers from "../assets/scenes/daniel/den/layers.json";
import denBg from "../assets/scenes/daniel/den/bg.webp";
import denDaniel from "../assets/scenes/daniel/den/daniel.webp";
import denLionA from "../assets/scenes/daniel/den/lion-a-body.webp";
import denLionATail from "../assets/scenes/daniel/den/lion-a-tail.webp";
import denLionB from "../assets/scenes/daniel/den/lion-b-body.webp";
import denLionBTail from "../assets/scenes/daniel/den/lion-b-tail.webp";
import denKing from "../assets/scenes/daniel/den/king.webp";
import praysLayers from "../assets/scenes/daniel/prays/layers.json";
import praysBg from "../assets/scenes/daniel/prays/bg.webp";
import praysDaniel from "../assets/scenes/daniel/prays/daniel-kneel.webp";
import praysBirdUp from "../assets/scenes/daniel/prays/bird-up.webp";
import praysBirdDown from "../assets/scenes/daniel/prays/bird-down.webp";
import { useId } from "react";
import trapLayers from "../assets/scenes/daniel/trap/layers.json";
import trapBg from "../assets/scenes/daniel/trap/bg.webp";
import trapKing from "../assets/scenes/daniel/trap/king-throne.webp";
import trapOfficialScroll from "../assets/scenes/daniel/trap/official-scroll.webp";
import trapOfficialPoint from "../assets/scenes/daniel/trap/official-point.webp";
import angelLayers from "../assets/scenes/daniel/angel/layers.json";
import angelCutout from "../assets/scenes/daniel/angel/angel.webp";
import angelLionA from "../assets/scenes/daniel/angel/lion-asleep-a-body.webp";
import angelLionATail from "../assets/scenes/daniel/angel/lion-asleep-a-tail.webp";
import angelLionB from "../assets/scenes/daniel/angel/lion-asleep-b-body.webp";
import angelLionBTail from "../assets/scenes/daniel/angel/lion-asleep-b-tail.webp";
import rejoiceLayers from "../assets/scenes/daniel/rejoice/layers.json";
import rejoiceBg from "../assets/scenes/daniel/rejoice/bg.webp";
import rejoiceDaniel from "../assets/scenes/daniel/rejoice/daniel-raise.webp";
import rejoiceKing from "../assets/scenes/daniel/rejoice/king-run.webp";
import rejoiceCrowd from "../assets/scenes/daniel/rejoice/crowd.webp";
import { SoftShadow } from "../art/v2/effects";
import type { SceneArtProps } from "../types";

/** Three times a day, at the open window. */
export function DanielPrays({ found }: SceneArtProps) {
  const L = praysLayers.cutouts;
  const windowClip = useId();
  // Two dove frames aligned on the eye and scaled to the same body size, so
  // the flipbook swap doesn't jump. Frame sizes come from layers.json; eye
  // positions were read off the cutouts.
  const up = { s: 0.25, eye: [195, 122] as const };
  const down = { s: 0.185, eye: [247, 32] as const };
  return (
    <>
      <Backdrop src={praysBg} />
      {/* a dove crosses the sky now and then; the window frame hides it otherwise */}
      <defs>
        <clipPath id={windowClip}>
          <path d="M585,375 L585,200 A112,112 0 0 1 810,200 L810,375 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${windowClip})`}>
        <g transform="translate(700 250)">
          <g className="a-fly">
            <image
              href={praysBirdUp}
              x={-up.eye[0] * up.s}
              y={-up.eye[1] * up.s}
              width={L["bird-up"].w * up.s}
              height={L["bird-up"].h * up.s}
              opacity="1"
              className="a-frame-a"
            />
            <image
              href={praysBirdDown}
              x={-down.eye[0] * down.s}
              y={-down.eye[1] * down.s}
              width={L["bird-down"].w * down.s}
              height={L["bird-down"].h * down.s}
              opacity="0"
              className="a-frame-b"
            />
          </g>
        </g>
      </g>
      <SoftShadow x={380} y={592} rx={110} ry={16} opacity={0.4} />
      <Layer
        src={praysDaniel}
        w={L["daniel-kneel"].w}
        h={L["daniel-kneel"].h}
        x={380}
        y={592}
        scale={0.36}
        className="a-breathe"
      />
      <Motes x={700} top={150} bottom={520} spread={140} count={10} seed={7} />
      {found.includes("window") && <Sparkle x={700} y={250} s={2} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** A brand new law, written to trap one man. */
export function TheTrap() {
  const L = trapLayers.cutouts;
  return (
    <>
      <Backdrop src={trapBg} />
      <SoftShadow x={640} y={452} rx={110} ry={16} opacity={0.4} />
      <Layer
        src={trapKing}
        w={L["king-throne"].w}
        h={L["king-throne"].h}
        x={640}
        y={452}
        scale={0.4}
        className="a-breathe-slow"
      />
      <SoftShadow x={300} y={612} rx={80} ry={14} opacity={0.4} />
      <Layer
        src={trapOfficialScroll}
        w={L["official-scroll"].w}
        h={L["official-scroll"].h}
        x={300}
        y={612}
        scale={0.42}
        className="a-breathe"
      />
      <SoftShadow x={470} y={608} rx={90} ry={14} opacity={0.4} />
      <Layer
        src={trapOfficialPoint}
        w={L["official-point"].w}
        h={L["official-point"].h}
        x={470}
        y={608}
        scale={0.42}
        className="a-breathe-slow"
      />
      <Grain opacity={0.05} />
    </>
  );
}

/** Down into the den, and a stone rolled over the top. */
export function IntoTheDen() {
  const L = denLayers.cutouts;
  return (
    <>
      <Backdrop src={denBg} />
      {/* the backdrop paints its own shaft; this one only adds the slow pulse */}
      <g opacity="0.45">
        <LightShaft x={500} top={48} topWidth={80} bottomSpread={240} floorY={560} />
      </g>
      {/* the king peers down through the opening */}
      <Layer src={denKing} w={L.king.w} h={L.king.h} x={500} y={74} scale={0.22} />
      {/* far lion, behind Daniel's shoulder */}
      <SoftShadow x={640} y={548} rx={95} ry={14} opacity={0.35} />
      <Tail
        src={denLionBTail}
        tw={L["lion-b"].tail.w}
        th={L["lion-b"].tail.h}
        ox={L["lion-b"].tail.ox}
        oy={L["lion-b"].tail.oy}
        w={L["lion-b"].w}
        h={L["lion-b"].h}
        x={640}
        y={548}
        scale={0.34}
        root="tr"
        delay={0}
      />
      <Layer
        src={denLionB}
        w={L["lion-b"].w}
        h={L["lion-b"].h}
        x={640}
        y={548}
        scale={0.34}
        className="a-breathe-slow"
      >
        <Eyelids
          points={[
            [138, 168],
            [247, 168],
          ]}
          w={L["lion-b"].w}
          h={L["lion-b"].h}
          rx={22}
          ry={20}
          tone="#dfa74c"
          delay={1.3}
        />
      </Layer>
      <SoftShadow x={500} y={590} rx={80} ry={14} opacity={0.4} />
      <Layer
        src={denDaniel}
        w={L.daniel.w}
        h={L.daniel.h}
        x={500}
        y={590}
        scale={0.41}
        className="a-breathe"
      >
        {/* pupils measured on daniel.webp; lid tone sampled from the forehead */}
        <Eyelids
          points={[
            [174, 127],
            [247, 127],
          ]}
          w={L.daniel.w}
          h={L.daniel.h}
          rx={15}
          ry={13}
          tone="#c68058"
        />
      </Layer>
      <SoftShadow x={255} y={612} rx={200} ry={20} opacity={0.4} />
      <Tail
        src={denLionATail}
        tw={L["lion-a"].tail.w}
        th={L["lion-a"].tail.h}
        ox={L["lion-a"].tail.ox}
        oy={L["lion-a"].tail.oy}
        w={L["lion-a"].w}
        h={L["lion-a"].h}
        x={255}
        y={612}
        scale={0.5}
        root="tr"
        delay={3}
      />
      <Layer
        src={denLionA}
        w={L["lion-a"].w}
        h={L["lion-a"].h}
        x={255}
        y={612}
        scale={0.5}
        className="a-breathe-slow"
      >
        <Eyelids
          points={[
            [152, 170],
            [267, 170],
          ]}
          w={L["lion-a"].w}
          h={L["lion-a"].h}
          rx={24}
          ry={22}
          tone="#ecbb56"
          delay={2.6}
        />
      </Layer>
      <SoftShadow x={760} y={618} rx={170} ry={20} opacity={0.4} />
      <Tail
        src={denLionBTail}
        tw={L["lion-b"].tail.w}
        th={L["lion-b"].tail.h}
        ox={L["lion-b"].tail.ox}
        oy={L["lion-b"].tail.oy}
        w={L["lion-b"].w}
        h={L["lion-b"].h}
        x={760}
        y={618}
        scale={0.5}
        flip
        root="tr"
        delay={6}
      />
      <Layer
        src={denLionB}
        w={L["lion-b"].w}
        h={L["lion-b"].h}
        x={760}
        y={618}
        scale={0.5}
        flip
        className="a-breathe-slow"
      >
        {/* points are in the unflipped image; the group's flip mirrors them with it */}
        <Eyelids
          points={[
            [138, 168],
            [247, 168],
          ]}
          w={L["lion-b"].w}
          h={L["lion-b"].h}
          rx={22}
          ry={20}
          tone="#dfa74c"
          delay={3.9}
        />
      </Layer>
      <Motes x={500} top={110} bottom={540} spread={200} />
      <Grain opacity={0.05} />
    </>
  );
}

/** An angel shut the lions' mouths. */
export function AngelShutsTheMouths({ found }: SceneArtProps) {
  const L = angelLayers.cutouts;
  const D = denLayers.cutouts;
  return (
    <>
      <Backdrop src={denBg} />
      <g opacity="0.45">
        <LightShaft x={500} top={48} topWidth={80} bottomSpread={240} floorY={560} />
      </g>
      <HolyGlow x={500} y={330} r={330} />
      <Layer
        src={angelCutout}
        w={L.angel.w}
        h={L.angel.h}
        x={500}
        y={496}
        scale={0.45}
        className="a-float"
      />
      <SoftShadow x={300} y={600} rx={80} ry={14} opacity={0.4} />
      <Layer
        src={denDaniel}
        w={D.daniel.w}
        h={D.daniel.h}
        x={300}
        y={600}
        scale={0.36}
        className="a-breathe"
      >
        <Eyelids
          points={[
            [174, 127],
            [247, 127],
          ]}
          w={D.daniel.w}
          h={D.daniel.h}
          rx={15}
          ry={13}
          tone="#c68058"
        />
      </Layer>
      {/* second lion asleep behind the first, peeking over its back */}
      <SoftShadow x={560} y={548} rx={120} ry={14} opacity={0.35} />
      <Tail
        src={angelLionBTail}
        tw={L["lion-asleep-b"].tail.w}
        th={L["lion-asleep-b"].tail.h}
        ox={L["lion-asleep-b"].tail.ox}
        oy={L["lion-asleep-b"].tail.oy}
        w={L["lion-asleep-b"].w}
        h={L["lion-asleep-b"].h}
        x={560}
        y={548}
        scale={0.32}
        flip
        root="tl"
        delay={2}
      />
      <Layer
        src={angelLionB}
        w={L["lion-asleep-b"].w}
        h={L["lion-asleep-b"].h}
        x={560}
        y={548}
        scale={0.32}
        flip
        className="a-breathe-slow"
      />
      <SoftShadow x={700} y={614} rx={190} ry={20} opacity={0.4} />
      <Tail
        src={angelLionATail}
        tw={L["lion-asleep-a"].tail.w}
        th={L["lion-asleep-a"].tail.h}
        ox={L["lion-asleep-a"].tail.ox}
        oy={L["lion-asleep-a"].tail.oy}
        w={L["lion-asleep-a"].w}
        h={L["lion-asleep-a"].h}
        x={700}
        y={614}
        scale={0.5}
        root="tl"
        delay={5}
      />
      <Layer
        src={angelLionA}
        w={L["lion-asleep-a"].w}
        h={L["lion-asleep-a"].h}
        x={700}
        y={614}
        scale={0.5}
        className="a-breathe-slow"
      />
      <Motes x={500} top={110} bottom={540} spread={200} />
      <Sparkle x={300} y={260} s={1.6} />
      <Sparkle x={720} y={230} s={1.4} delay={0.6} />
      {found.includes("lions") && <Sparkle x={700} y={500} s={1.6} delay={0.3} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Morning. The king runs to the den, and Daniel answers. */
export function TheKingRejoices({ found }: SceneArtProps) {
  const L = rejoiceLayers.cutouts;
  return (
    <>
      <Backdrop src={rejoiceBg} />
      <SoftShadow x={470} y={578} rx={90} ry={14} opacity={0.4} />
      <Layer
        src={rejoiceDaniel}
        w={L["daniel-raise"].w}
        h={L["daniel-raise"].h}
        x={470}
        y={578}
        scale={0.36}
        className="a-breathe"
      />
      <SoftShadow x={230} y={602} rx={110} ry={16} opacity={0.4} />
      <Layer
        src={rejoiceKing}
        w={L["king-run"].w}
        h={L["king-run"].h}
        x={230}
        y={602}
        scale={0.38}
        className="a-breathe-slow"
      />
      <SoftShadow x={780} y={602} rx={130} ry={16} opacity={0.4} />
      <Layer
        src={rejoiceCrowd}
        w={L.crowd.w}
        h={L.crowd.h}
        x={780}
        y={602}
        scale={0.36}
        className="a-breathe-slow"
      />
      <Sparkle x={380} y={330} s={1.6} />
      {found.includes("king") && <Sparkle x={250} y={420} s={1.7} delay={0.4} />}
      <Grain opacity={0.05} />
    </>
  );
}
