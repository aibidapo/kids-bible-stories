import { HolyGlow, Sparkle, Stars } from "../art/base";
import { Grain, LightShaft, Motes, SoftShadow } from "../art/v2/effects";
import { Backdrop, Eyelids, Flipbook, Layer, Part } from "../art/raster";
import angelLayers from "../assets/scenes/christmas/angel/layers.json";
import angelBg from "../assets/scenes/christmas/angel/bg.webp";
import angelMary from "../assets/scenes/christmas/angel/mary-kneel.webp";
import angelGabrielBody from "../assets/scenes/christmas/angel/gabriel-body.webp";
import angelGabrielWingL from "../assets/scenes/christmas/angel/gabriel-wings-wing-l.webp";
import angelGabrielWingR from "../assets/scenes/christmas/angel/gabriel-wings-wing-r.webp";
import angelDove from "../assets/scenes/christmas/angel/dove.webp";
import angelDoveDown from "../assets/scenes/christmas/angel/dove-down.webp";
import journeyLayers from "../assets/scenes/christmas/journey/layers.json";
import journeyBg from "../assets/scenes/christmas/journey/bg.webp";
import journeyJoseph from "../assets/scenes/christmas/journey/joseph-lead.webp";
import journeyMary from "../assets/scenes/christmas/journey/mary-donkey.webp";
import journeyInnkeeper from "../assets/scenes/christmas/journey/innkeeper.webp";
import stableLayers from "../assets/scenes/christmas/stable/layers.json";
import stableBg from "../assets/scenes/christmas/stable/bg.webp";
import stableBaby from "../assets/scenes/christmas/stable/baby.webp";
import stableMary from "../assets/scenes/christmas/stable/mary-sit.webp";
import stableJoseph from "../assets/scenes/christmas/stable/joseph-stand.webp";
import stableOx from "../assets/scenes/christmas/stable/ox.webp";
import stableDonkey from "../assets/scenes/christmas/stable/donkey.webp";
import shepherdsLayers from "../assets/scenes/christmas/shepherds/layers.json";
import shepherdsBg from "../assets/scenes/christmas/shepherds/bg.webp";
import shepherdsKneel from "../assets/scenes/christmas/shepherds/shepherd-kneel.webp";
import shepherdsOld from "../assets/scenes/christmas/shepherds/shepherd-old.webp";
import shepherdsAngelBody from "../assets/scenes/christmas/shepherds/angel-host-body.webp";
import shepherdsAngelWingL from "../assets/scenes/christmas/shepherds/angel-host-wings-wing-l.webp";
import shepherdsAngelWingR from "../assets/scenes/christmas/shepherds/angel-host-wings-wing-r.webp";
import visitSheepC from "../assets/scenes/christmas/visit/sheep-c.webp";
import visitLayersForSheep from "../assets/scenes/christmas/visit/layers.json";
import shepherdsSheepA from "../assets/scenes/christmas/shepherds/sheep-a.webp";
import shepherdsSheepB from "../assets/scenes/christmas/shepherds/sheep-b.webp";
import shepherdsFire from "../assets/scenes/christmas/shepherds/campfire.webp";
import visitLayers from "../assets/scenes/christmas/visit/layers.json";
import visitBg from "../assets/scenes/christmas/visit/bg.webp";
import visitFamily from "../assets/scenes/christmas/visit/manger-family.webp";
import visitShepherd from "../assets/scenes/christmas/visit/shepherd-gift.webp";
import visitBoy from "../assets/scenes/christmas/visit/shepherd-boy.webp";
import visitSheep from "../assets/scenes/christmas/visit/sheep-c.webp";
import visitTree from "../assets/scenes/christmas/visit/olive-tree.webp";
import wisemenLayers from "../assets/scenes/christmas/wisemen/layers.json";
import wisemenBg from "../assets/scenes/christmas/wisemen/bg.webp";
import wisemenMen from "../assets/scenes/christmas/wisemen/wise-men.webp";
import wisemenMary from "../assets/scenes/christmas/wisemen/mary-child.webp";
import wisemenCamel from "../assets/scenes/christmas/wisemen/camel.webp";
import wisemenGifts from "../assets/scenes/christmas/wisemen/gifts.webp";
import type { SceneArtProps } from "../types";

type Wings = {
  w: number;
  h: number;
  parts: Record<"wing-l" | "wing-r", { w: number; h: number; ox: number; oy: number }>;
};

/**
 * An angel whose wings beat slowly: the wings-only cutout split down the
 * middle into two Parts on a-wing-flap-l / a-wing-flap-r (an up-and-down
 * flutter about the shoulder), drawn behind a wingless body, the whole group floating.
 */
function WingedAngel({
  body,
  bodyW,
  bodyH,
  wingL,
  wingR,
  wings,
  x,
  y,
  scale,
  wingScale,
  wingY,
  eyes,
}: {
  body: string;
  bodyW: number;
  bodyH: number;
  wingL: string;
  wingR: string;
  wings: Wings;
  x: number;
  y: number;
  scale: number;
  wingScale: number;
  wingY: number;
  /** Eye centres in the body cutout's pixels, for a slow blink. */
  eyes?: { points: [number, number][]; rx: number; ry: number; tone: string; delay?: number };
}) {
  return (
    <g className="a-float">
      {(["wing-l", "wing-r"] as const).map((k) => (
        <Part
          key={k}
          src={k === "wing-l" ? wingL : wingR}
          tw={wings.parts[k].w}
          th={wings.parts[k].h}
          ox={wings.parts[k].ox}
          oy={wings.parts[k].oy}
          w={wings.w}
          h={wings.h}
          x={x}
          y={wingY}
          scale={wingScale}
          className={k === "wing-l" ? "a-wing-flap-l" : "a-wing-flap-r"}
        />
      ))}
      <Layer src={body} w={bodyW} h={bodyH} x={x} y={y} scale={scale}>
        {eyes && (
          <Eyelids
            points={eyes.points}
            w={bodyW}
            h={bodyH}
            rx={eyes.rx}
            ry={eyes.ry}
            tone={eyes.tone}
            delay={eyes.delay}
          />
        )}
      </Layer>
    </g>
  );
}

/** Nazareth: Gabriel tells Mary. Late sun through the window, a dove at the door. */
export function AngelVisitsMary({ found }: SceneArtProps) {
  const L = angelLayers.cutouts;
  return (
    <>
      <Backdrop src={angelBg} />
      <g opacity="0.35">
        <LightShaft x={150} top={120} topWidth={90} bottomSpread={260} floorY={560} />
      </g>
      <HolyGlow x={650} y={330} r={260} />
      <SoftShadow x={330} y={585} rx={110} ry={14} opacity={0.4} />
      <Layer
        src={angelMary}
        w={L["mary-kneel"].w}
        h={L["mary-kneel"].h}
        x={330}
        y={585}
        scale={0.41}
        className="a-breathe"
      >
        <Eyelids
          points={[
            [305, 125],
            [371, 122],
          ]}
          w={L["mary-kneel"].w}
          h={L["mary-kneel"].h}
          rx={18}
          ry={14}
          tone="#d77753"
          delay={0.6}
        />
      </Layer>
      <SoftShadow x={650} y={590} rx={90} ry={12} opacity={0.3} />
      <WingedAngel
        body={angelGabrielBody}
        bodyW={L["gabriel-body"].w}
        bodyH={L["gabriel-body"].h}
        wingL={angelGabrielWingL}
        wingR={angelGabrielWingR}
        wings={L["gabriel-wings"] as Wings}
        x={650}
        y={585}
        scale={0.52}
        wingScale={0.5}
        wingY={468}
        eyes={{
          points: [
            [236, 126],
            [304, 126],
          ],
          rx: 16,
          ry: 13,
          tone: "#d98a5e",
          delay: 2.1,
        }}
      />
      {/* the dove flies in through the sunlit door, flapping */}
      <Flipbook
        a={{
          src: angelDove,
          w: L.dove.w,
          h: L.dove.h,
          ax: L.dove.w * 0.5,
          ay: L.dove.h * 0.55,
          s: 0.23,
        }}
        b={{
          src: angelDoveDown,
          w: L["dove-down"].w,
          h: L["dove-down"].h,
          ax: L["dove-down"].w * 0.5,
          ay: L["dove-down"].h * 0.45,
          s: 0.23,
        }}
        x={900}
        y={95}
        flip
        motion="a-fly"
        delay={-14}
      />
      <Motes x={650} top={140} bottom={560} spread={160} />
      {found.includes("gabriel") && <Sparkle x={650} y={250} s={1.6} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Bethlehem at night: no room at the inn. */
export function NoRoomAtTheInn({ found }: SceneArtProps) {
  const L = journeyLayers.cutouts;
  return (
    <>
      <Backdrop src={journeyBg} />
      <Sparkle x={500} y={75} s={1.8} />
      <SoftShadow x={745} y={578} rx={80} ry={12} opacity={0.35} />
      <Layer
        src={journeyInnkeeper}
        w={L.innkeeper.w}
        h={L.innkeeper.h}
        x={745}
        y={578}
        scale={0.36}
        className="a-breathe-slow"
        delay={0.8}
      >
        <Eyelids
          points={[
            [277, 123],
            [358, 126],
          ]}
          w={L.innkeeper.w}
          h={L.innkeeper.h}
          rx={18}
          ry={15}
          tone="#e4ab7a"
          delay={3.2}
        />
      </Layer>
      <SoftShadow x={270} y={608} rx={130} ry={16} opacity={0.4} />
      <Layer
        src={journeyMary}
        w={L["mary-donkey"].w}
        h={L["mary-donkey"].h}
        x={270}
        y={608}
        scale={0.43}
        className="a-breathe-slow"
      />
      <SoftShadow x={440} y={606} rx={80} ry={14} opacity={0.4} />
      <Layer
        src={journeyJoseph}
        w={L["joseph-lead"].w}
        h={L["joseph-lead"].h}
        x={440}
        y={606}
        scale={0.41}
        className="a-breathe"
        delay={0.4}
      >
        <Eyelids
          points={[
            [177, 85],
            [221, 85],
          ]}
          w={L["joseph-lead"].w}
          h={L["joseph-lead"].h}
          rx={12}
          ry={10}
          tone="#da8c63"
          delay={1.3}
        />
      </Layer>
      {found.includes("lantern") && <Sparkle x={737} y={360} s={1.4} />}
      <Grain opacity={0.06} />
    </>
  );
}

/** The stable: Jesus is born. */
export function BornInAStable({ found }: SceneArtProps) {
  const L = stableLayers.cutouts;
  return (
    <>
      <Backdrop src={stableBg} />
      <HolyGlow x={520} y={470} r={240} />
      <SoftShadow x={150} y={608} rx={150} ry={16} opacity={0.4} />
      <Layer
        src={stableOx}
        w={L.ox.w}
        h={L.ox.h}
        x={150}
        y={612}
        scale={0.52}
        className="a-breathe-slow"
        delay={1.5}
      />
      <SoftShadow x={880} y={606} rx={90} ry={13} opacity={0.4} />
      <Layer
        src={stableDonkey}
        w={L.donkey.w}
        h={L.donkey.h}
        x={880}
        y={606}
        scale={0.5}
        className="a-breathe-slow"
        delay={0.7}
      />
      <SoftShadow x={300} y={585} rx={90} ry={13} opacity={0.4} />
      <Layer
        src={stableMary}
        w={L["mary-sit"].w}
        h={L["mary-sit"].h}
        x={300}
        y={588}
        scale={0.42}
        className="a-breathe"
      />
      <SoftShadow x={725} y={598} rx={80} ry={12} opacity={0.4} />
      <Layer
        src={stableJoseph}
        w={L["joseph-stand"].w}
        h={L["joseph-stand"].h}
        x={725}
        y={598}
        scale={0.52}
        className="a-breathe"
        delay={0.5}
      >
        <Eyelids
          points={[
            [137, 83],
            [184, 83],
          ]}
          w={L["joseph-stand"].w}
          h={L["joseph-stand"].h}
          rx={12}
          ry={10}
          tone="#de956a"
          delay={1.7}
        />
      </Layer>
      <SoftShadow x={520} y={580} rx={125} ry={12} opacity={0.35} />
      <Layer src={stableBaby} w={L.baby.w} h={L.baby.h} x={520} y={580} scale={0.5} />
      <Motes x={520} top={200} bottom={560} spread={220} />
      {found.includes("baby") && <Sparkle x={520} y={370} s={1.8} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** Shepherds on the hills: the angel's good news. */
export function ShepherdsAndAngels({ found }: SceneArtProps) {
  const L = shepherdsLayers.cutouts;
  return (
    <>
      <Backdrop src={shepherdsBg} />
      <Stars count={70} seed={7} maxY={300} />
      <HolyGlow x={780} y={250} r={300} />
      {/* the flock: the same three sheep cutouts at different sizes and facings */}
      <SoftShadow x={120} y={616} rx={80} ry={11} opacity={0.4} />
      <Layer
        src={shepherdsSheepB}
        w={L["sheep-b"].w}
        h={L["sheep-b"].h}
        x={120}
        y={616}
        scale={0.3}
        flip
        className="a-breathe-slow"
        delay={2.2}
      />
      <SoftShadow x={560} y={604} rx={80} ry={11} opacity={0.4} />
      <Layer
        src={visitSheepC}
        w={visitLayersForSheep.cutouts["sheep-c"].w}
        h={visitLayersForSheep.cutouts["sheep-c"].h}
        x={560}
        y={604}
        scale={0.32}
        flip
        className="a-breathe"
        delay={1.4}
      />
      <SoftShadow x={840} y={596} rx={70} ry={10} opacity={0.35} />
      <Layer
        src={shepherdsSheepA}
        w={L["sheep-a"].w}
        h={L["sheep-a"].h}
        x={840}
        y={596}
        scale={0.28}
        flip
        className="a-breathe"
        delay={0.3}
      />
      <SoftShadow x={680} y={612} rx={90} ry={12} opacity={0.4} />
      <Layer
        src={shepherdsSheepA}
        w={L["sheep-a"].w}
        h={L["sheep-a"].h}
        x={680}
        y={612}
        scale={0.34}
        className="a-breathe"
        delay={0.9}
      />
      <SoftShadow x={890} y={612} rx={100} ry={12} opacity={0.4} />
      <Layer
        src={shepherdsSheepB}
        w={L["sheep-b"].w}
        h={L["sheep-b"].h}
        x={890}
        y={612}
        scale={0.34}
        className="a-breathe-slow"
        delay={1.6}
      />
      <SoftShadow x={200} y={598} rx={100} ry={14} opacity={0.4} />
      <Layer
        src={shepherdsOld}
        w={L["shepherd-old"].w}
        h={L["shepherd-old"].h}
        x={200}
        y={598}
        scale={0.4}
        className="a-breathe-slow"
      >
        <Eyelids
          points={[
            [250, 109],
            [318, 108],
          ]}
          w={L["shepherd-old"].w}
          h={L["shepherd-old"].h}
          rx={16}
          ry={13}
          tone="#e48b5e"
          delay={2.6}
        />
      </Layer>
      <Layer
        src={shepherdsFire}
        w={L.campfire.w}
        h={L.campfire.h}
        x={325}
        y={612}
        scale={0.42}
        className="a-pulse-soft"
      />
      <SoftShadow x={430} y={606} rx={90} ry={14} opacity={0.4} />
      <Layer
        src={shepherdsKneel}
        w={L["shepherd-kneel"].w}
        h={L["shepherd-kneel"].h}
        x={430}
        y={606}
        scale={0.4}
        className="a-breathe"
        delay={0.6}
      >
        <Eyelids
          points={[
            [297, 126],
            [364, 126],
          ]}
          w={L["shepherd-kneel"].w}
          h={L["shepherd-kneel"].h}
          rx={17}
          ry={14}
          tone="#d87f54"
          delay={0.9}
        />
      </Layer>
      <WingedAngel
        body={shepherdsAngelBody}
        bodyW={L["angel-host-body"].w}
        bodyH={L["angel-host-body"].h}
        wingL={shepherdsAngelWingL}
        wingR={shepherdsAngelWingR}
        wings={L["angel-host-wings"] as Wings}
        x={780}
        y={430}
        scale={0.42}
        wingScale={0.34}
        wingY={315}
        eyes={{
          points: [
            [275, 130],
            [350, 128],
          ],
          rx: 17,
          ry: 14,
          tone: "#d98a5e",
          delay: 1.4,
        }}
      />
      <Sparkle x={380} y={150} s={1.4} delay={0.3} />
      <Sparkle x={640} y={110} s={1.6} delay={0.9} />
      {found.includes("angel-host") && <Sparkle x={780} y={70} s={2} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** The shepherds find the baby, just as the angel said. */
export function TheShepherdsVisit({ found }: SceneArtProps) {
  const L = visitLayers.cutouts;
  return (
    <>
      <Backdrop src={visitBg} />
      <Stars count={60} seed={11} maxY={260} />
      <Sparkle x={719} y={75} s={2} />
      <SoftShadow x={880} y={604} rx={90} ry={12} opacity={0.35} />
      <Layer
        src={visitTree}
        w={L["olive-tree"].w}
        h={L["olive-tree"].h}
        x={880}
        y={604}
        scale={0.46}
        className="a-sway-slow"
      />
      <HolyGlow x={430} y={470} r={220} />
      <SoftShadow x={150} y={608} rx={90} ry={12} opacity={0.4} />
      <Layer
        src={visitSheep}
        w={L["sheep-c"].w}
        h={L["sheep-c"].h}
        x={150}
        y={608}
        scale={0.36}
        className="a-breathe"
        delay={1.1}
      />
      <SoftShadow x={430} y={592} rx={170} ry={16} opacity={0.4} />
      <Layer
        src={visitFamily}
        w={L["manger-family"].w}
        h={L["manger-family"].h}
        x={430}
        y={592}
        scale={0.48}
        className="a-breathe-slow"
      />
      <SoftShadow x={700} y={604} rx={90} ry={13} opacity={0.4} />
      <Layer
        src={visitShepherd}
        w={L["shepherd-gift"].w}
        h={L["shepherd-gift"].h}
        x={700}
        y={604}
        scale={0.42}
        className="a-breathe"
        delay={0.5}
      />
      <SoftShadow x={860} y={596} rx={60} ry={11} opacity={0.4} />
      <Layer
        src={visitBoy}
        w={L["shepherd-boy"].w}
        h={L["shepherd-boy"].h}
        x={860}
        y={596}
        scale={0.4}
        className="a-breathe"
        delay={0.9}
      >
        <Eyelids
          points={[
            [120, 90],
            [166, 90],
          ]}
          w={L["shepherd-boy"].w}
          h={L["shepherd-boy"].h}
          rx={11}
          ry={11}
          tone="#d28051"
          delay={2.0}
        />
      </Layer>
      <Motes x={430} top={200} bottom={560} spread={200} />
      {found.includes("lamb") && <Sparkle x={690} y={470} s={1.5} />}
      <Grain opacity={0.05} />
    </>
  );
}

/** The wise men bring their gifts. */
export function TheWiseMen({ found }: SceneArtProps) {
  const L = wisemenLayers.cutouts;
  return (
    <>
      <Backdrop src={wisemenBg} />
      <Stars count={40} seed={5} maxY={200} />
      <Sparkle x={500} y={70} s={2.4} />
      {/* a dove flies across the rooftops, flapping: two frames from page 1 on the fly path */}
      <Flipbook
        a={{
          src: angelDove,
          w: angelLayers.cutouts.dove.w,
          h: angelLayers.cutouts.dove.h,
          ax: angelLayers.cutouts.dove.w * 0.5,
          ay: angelLayers.cutouts.dove.h * 0.55,
          s: 0.2,
        }}
        b={{
          src: angelDoveDown,
          w: angelLayers.cutouts["dove-down"].w,
          h: angelLayers.cutouts["dove-down"].h,
          ax: angelLayers.cutouts["dove-down"].w * 0.5,
          ay: angelLayers.cutouts["dove-down"].h * 0.45,
          s: 0.2,
        }}
        x={300}
        y={220}
        motion="a-fly"
        delay={-6}
      />
      <SoftShadow x={880} y={598} rx={110} ry={14} opacity={0.4} />
      <Layer
        src={wisemenCamel}
        w={L.camel.w}
        h={L.camel.h}
        x={880}
        y={598}
        scale={0.46}
        className="a-breathe-slow"
        delay={1.3}
      />
      <SoftShadow x={420} y={550} rx={70} ry={11} opacity={0.4} />
      <Layer
        src={wisemenMary}
        w={L["mary-child"].w}
        h={L["mary-child"].h}
        x={420}
        y={548}
        scale={0.42}
        className="a-breathe"
      >
        <Eyelids
          points={[
            [139, 103],
            [203, 103],
            [61, 172],
            [101, 165],
          ]}
          w={L["mary-child"].w}
          h={L["mary-child"].h}
          rx={12}
          ry={11}
          tone="#d28658"
          delay={1.1}
        />
      </Layer>
      <SoftShadow x={660} y={604} rx={200} ry={16} opacity={0.4} />
      <Layer
        src={wisemenMen}
        w={L["wise-men"].w}
        h={L["wise-men"].h}
        x={660}
        y={604}
        scale={0.48}
        className="a-breathe-slow"
        delay={0.4}
      />
      <Layer src={wisemenGifts} w={L.gifts.w} h={L.gifts.h} x={560} y={620} scale={0.4} />
      {found.includes("gifts") && <Sparkle x={560} y={540} s={1.6} />}
      <Grain opacity={0.05} />
    </>
  );
}
