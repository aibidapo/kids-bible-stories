import type { SceneArt } from "../types";
import * as creation from "./creation";
import * as noah from "./noah";
import * as david from "./david";
import * as jonah from "./jonah";
import * as daniel from "./daniel";

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
};

export function getSceneArt(key: string): SceneArt | undefined {
  return SCENE_ART[key];
}
