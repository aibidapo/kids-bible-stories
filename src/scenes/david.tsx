import { Sparkle } from "../art/base";
import { Grain, SoftShadow } from "../art/v2/effects";
import { Backdrop, Layer } from "../art/raster";
import shepherdLayers from "../assets/scenes/david/shepherd/layers.json";
import shepherdBg from "../assets/scenes/david/shepherd/bg.webp";
import shepherdDavid from "../assets/scenes/david/shepherd/david-staff.webp";
import shepherdLamb from "../assets/scenes/david/shepherd/lamb.webp";
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
import type { SceneArtProps } from "../types";

/** A boy, a staff, and a flock on the hills. */
export function ShepherdBoy({ found }: SceneArtProps) {
  const L = shepherdLayers.cutouts;
  const T = twoLayers.cutouts;
  return (
    <>
      <Backdrop src={shepherdBg} />
      <SoftShadow x={800} y={610} rx={70} ry={10} opacity={0.35} />
      <Layer src={twoSheep} w={T.sheep.w} h={T.sheep.h} x={800} y={610} scale={0.2} flip className="a-breathe-slow" />
      <SoftShadow x={640} y={596} rx={90} ry={12} opacity={0.4} />
      <Layer src={twoSheep} w={T.sheep.w} h={T.sheep.h} x={640} y={596} scale={0.24} className="a-breathe" />
      <SoftShadow x={470} y={600} rx={60} ry={10} opacity={0.4} />
      <Layer
        src={shepherdLamb}
        w={L.lamb.w}
        h={L.lamb.h}
        x={470}
        y={600}
        scale={0.3}
        className="a-breathe-slow"
      />
      <SoftShadow x={300} y={596} rx={70} ry={12} opacity={0.4} />
      <Layer
        src={shepherdDavid}
        w={L["david-staff"].w}
        h={L["david-staff"].h}
        x={300}
        y={596}
        scale={0.38}
        className="a-breathe"
      />
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
      <Layer
        src={tauntArmy}
        w={L["army-afraid"].w}
        h={L["army-afraid"].h}
        x={200}
        y={602}
        scale={0.36}
        className="a-breathe"
      />
      <SoftShadow x={740} y={614} rx={150} ry={18} opacity={0.45} />
      <Layer
        src={tauntGoliath}
        w={L["goliath-taunt"].w}
        h={L["goliath-taunt"].h}
        x={740}
        y={614}
        scale={0.5}
        className="a-breathe-slow"
      />
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
      <Layer
        src={volDavid}
        w={L["david-brave"].w}
        h={L["david-brave"].h}
        x={440}
        y={600}
        scale={0.36}
        className="a-breathe"
      />
      <SoftShadow x={640} y={596} rx={90} ry={14} opacity={0.4} />
      <Layer
        src={volSaul}
        w={L["saul-point"].w}
        h={L["saul-point"].h}
        x={640}
        y={596}
        scale={0.42}
        className="a-breathe-slow"
      />
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
      <SoftShadow x={780} y={614} rx={140} ry={18} opacity={0.45} />
      <Layer
        src={stonesGoliath}
        w={L["goliath-loom"].w}
        h={L["goliath-loom"].h}
        x={780}
        y={614}
        scale={0.5}
        className="a-breathe-slow"
      />
      <SoftShadow x={150} y={602} rx={60} ry={10} opacity={0.4} />
      <Layer src={stonesPile} w={L.stones.w} h={L.stones.h} x={150} y={602} scale={0.3} />
      <SoftShadow x={300} y={600} rx={80} ry={12} opacity={0.4} />
      <Layer
        src={stonesDavid}
        w={L["david-sling"].w}
        h={L["david-sling"].h}
        x={300}
        y={600}
        scale={0.38}
        className="a-breathe"
      />
      {found.includes("stones") && <Sparkle x={150} y={560} s={1.3} />}
      {found.includes("sling") && <Sparkle x={300} y={300} s={1.6} delay={0.3} />}
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
      <SoftShadow x={720} y={608} rx={150} ry={16} opacity={0.4} />
      <Layer
        src={victoryArmy}
        w={L["army-cheer"].w}
        h={L["army-cheer"].h}
        x={720}
        y={608}
        scale={0.38}
        className="a-breathe-slow"
      />
      <SoftShadow x={400} y={596} rx={80} ry={12} opacity={0.4} />
      <Layer
        src={victoryDavid}
        w={L["david-victory"].w}
        h={L["david-victory"].h}
        x={400}
        y={596}
        scale={0.38}
        className="a-breathe"
      />
      <Sparkle x={330} y={300} s={1.6} />
      <Sparkle x={520} y={260} s={1.3} delay={0.5} />
      <Grain opacity={0.05} />
    </>
  );
}
