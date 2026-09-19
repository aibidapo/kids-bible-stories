import { HolyGlow, Sparkle } from "../art/base";
import { Grain, LightShaft, Motes, SoftShadow } from "../art/v2/effects";
import { Backdrop, Layer } from "../art/raster";
import angelLayers from "../assets/scenes/christmas/angel/layers.json";
import angelBg from "../assets/scenes/christmas/angel/bg.webp";
import angelMary from "../assets/scenes/christmas/angel/mary-kneel.webp";
import angelGabriel from "../assets/scenes/christmas/angel/gabriel.webp";
import angelDove from "../assets/scenes/christmas/angel/dove.webp";
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
import shepherdsAngel from "../assets/scenes/christmas/shepherds/angel-host.webp";
import shepherdsSheepA from "../assets/scenes/christmas/shepherds/sheep-a.webp";
import shepherdsSheepB from "../assets/scenes/christmas/shepherds/sheep-b.webp";
import visitLayers from "../assets/scenes/christmas/visit/layers.json";
import visitBg from "../assets/scenes/christmas/visit/bg.webp";
import visitFamily from "../assets/scenes/christmas/visit/manger-family.webp";
import visitShepherd from "../assets/scenes/christmas/visit/shepherd-gift.webp";
import visitBoy from "../assets/scenes/christmas/visit/shepherd-boy.webp";
import visitSheep from "../assets/scenes/christmas/visit/sheep-c.webp";
import wisemenLayers from "../assets/scenes/christmas/wisemen/layers.json";
import wisemenBg from "../assets/scenes/christmas/wisemen/bg.webp";
import wisemenMen from "../assets/scenes/christmas/wisemen/wise-men.webp";
import wisemenMary from "../assets/scenes/christmas/wisemen/mary-child.webp";
import wisemenCamel from "../assets/scenes/christmas/wisemen/camel.webp";
import wisemenGifts from "../assets/scenes/christmas/wisemen/gifts.webp";
import type { SceneArtProps } from "../types";

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
      />
      <SoftShadow x={650} y={590} rx={90} ry={12} opacity={0.3} />
      <Layer
        src={angelGabriel}
        w={L.gabriel.w}
        h={L.gabriel.h}
        x={650}
        y={585}
        scale={0.52}
        className="a-float"
      />
      <Layer
        src={angelDove}
        w={L.dove.w}
        h={L.dove.h}
        x={860}
        y={230}
        scale={0.23}
        className="a-float"
        delay={1.2}
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
      />
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
      />
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
      <HolyGlow x={440} y={470} r={240} />
      <SoftShadow x={150} y={608} rx={150} ry={16} opacity={0.4} />
      <Layer
        src={stableOx}
        w={L.ox.w}
        h={L.ox.h}
        x={150}
        y={608}
        scale={0.46}
        className="a-breathe-slow"
        delay={1.5}
      />
      <SoftShadow x={840} y={596} rx={100} ry={14} opacity={0.4} />
      <Layer
        src={stableDonkey}
        w={L.donkey.w}
        h={L.donkey.h}
        x={840}
        y={596}
        scale={0.42}
        className="a-breathe-slow"
        delay={0.7}
      />
      <SoftShadow x={300} y={585} rx={90} ry={13} opacity={0.4} />
      <Layer
        src={stableMary}
        w={L["mary-sit"].w}
        h={L["mary-sit"].h}
        x={300}
        y={585}
        scale={0.38}
        className="a-breathe"
      />
      <SoftShadow x={600} y={592} rx={70} ry={12} opacity={0.4} />
      <Layer
        src={stableJoseph}
        w={L["joseph-stand"].w}
        h={L["joseph-stand"].h}
        x={600}
        y={592}
        scale={0.42}
        className="a-breathe"
        delay={0.5}
      />
      <SoftShadow x={440} y={575} rx={110} ry={12} opacity={0.35} />
      <Layer src={stableBaby} w={L.baby.w} h={L.baby.h} x={440} y={575} scale={0.42} />
      <Motes x={440} top={200} bottom={560} spread={220} />
      {found.includes("baby") && <Sparkle x={440} y={380} s={1.8} />}
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
      <HolyGlow x={520} y={260} r={320} />
      <SoftShadow x={760} y={606} rx={90} ry={12} opacity={0.4} />
      <Layer
        src={shepherdsSheepA}
        w={L["sheep-a"].w}
        h={L["sheep-a"].h}
        x={760}
        y={606}
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
      />
      <Layer
        src={shepherdsAngel}
        w={L["angel-host"].w}
        h={L["angel-host"].h}
        x={520}
        y={440}
        scale={0.42}
        className="a-float"
      />
      <Sparkle x={380} y={150} s={1.4} delay={0.3} />
      <Sparkle x={660} y={120} s={1.6} delay={0.9} />
      {found.includes("angel-host") && <Sparkle x={520} y={90} s={2} />}
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
      <Sparkle x={719} y={75} s={2} />
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
      />
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
      <Sparkle x={500} y={70} s={2.4} />
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
      <SoftShadow x={458} y={550} rx={70} ry={11} opacity={0.4} />
      <Layer
        src={wisemenMary}
        w={L["mary-child"].w}
        h={L["mary-child"].h}
        x={458}
        y={548}
        scale={0.42}
        className="a-breathe"
      />
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
