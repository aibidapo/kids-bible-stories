import type { SceneArt } from "../types";
import * as creation from "./creation";
import * as noah from "./noah";
import * as david from "./david";
import * as jonah from "./jonah";
import * as daniel from "./daniel";
import * as christmas from "./christmas";
import * as storm from "./storm";

/**
 * Story data refers to art by string key rather than importing components, so
 * a new story is a data file plus a few entries here — no wiring anywhere else.
 */
export const SCENE_ART: Record<string, SceneArt> = {
  "creation/light": creation.LetThereBeLight,
  "creation/sky-water": creation.SkyAndWater,
  "creation/land": creation.LandAndPlants,
  "creation/lights": creation.SunMoonStars,
  "creation/creatures": creation.BirdsAndFish,
  "creation/people": creation.AnimalsAndPeople,

  "noah/builds": noah.NoahBuilds,
  "noah/two-by-two": noah.TwoByTwo,
  "noah/flood": noah.TheFlood,
  "noah/dove": noah.DoveReturns,
  "noah/rainbow": noah.TheRainbow,

  "david/shepherd": david.ShepherdBoy,
  "david/taunt": david.GoliathTaunts,
  "david/volunteers": david.DavidVolunteers,
  "david/stones": david.FiveSmoothStones,
  "david/strike": david.TheStrike,
  "david/victory": david.Victory,

  "jonah/running": jonah.RunningAway,
  "jonah/storm": jonah.TheStorm,
  "jonah/swallowed": jonah.SwallowedWhole,
  "jonah/prayer": jonah.PrayerInsideTheFish,
  "jonah/nineveh": jonah.Nineveh,

  "daniel/prays": daniel.DanielPrays,
  "daniel/trap": daniel.TheTrap,
  "daniel/den": daniel.IntoTheDen,
  "daniel/angel": daniel.AngelShutsTheMouths,
  "daniel/rejoice": daniel.TheKingRejoices,
  "christmas/angel": christmas.AngelVisitsMary,
  "christmas/journey": christmas.NoRoomAtTheInn,
  "christmas/stable": christmas.BornInAStable,
  "christmas/shepherds": christmas.ShepherdsAndAngels,
  "christmas/visit": christmas.TheShepherdsVisit,
  "christmas/wisemen": christmas.TheWiseMen,
  "storm/evening": storm.SettingOut,
  "storm/asleep": storm.AsleepInTheStern,
  "storm/afraid": storm.TheWildNight,
  "storm/peace": storm.QuietBeStill,
  "storm/calm": storm.WhoIsThis,
};

export function getSceneArt(key: string): SceneArt | undefined {
  // Own-property check so a key like "constructor" cannot reach the prototype.
  return Object.prototype.hasOwnProperty.call(SCENE_ART, key) ? SCENE_ART[key] : undefined;
}
