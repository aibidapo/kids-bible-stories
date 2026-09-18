import type { ComponentType } from "react";

/** Two reading levels live side by side so one story set grows with the child. */
export type AgeMode = "little" | "big";

/** A tappable spot layered over a scene. Coordinates are percentages of the stage. */
export interface Hotspot {
  id: string;
  /** Centre of the tap target, as a percentage of stage width/height. */
  x: number;
  y: number;
  /** Diameter of the tap target as a percentage of stage width. Minimum rendered size is enforced in CSS. */
  size?: number;
  /** Announced by screen readers and shown in the "what did I find?" bubble. */
  label: string;
  /** Short line spoken/shown when tapped. */
  reward: string;
  /** Sound effect played on tap. */
  sound?: SoundName;
  /** Name of the sticker unlocked the first time this hotspot is found. */
  sticker?: string;
}

export interface FindGame {
  /** What the child is asked to find, e.g. "the dove". */
  prompt: string;
  /** Hotspot ids that count as correct. */
  targets: string[];
}

export interface Scene {
  id: string;
  /** Key into the scene-art registry in src/scenes/index.ts. */
  art: string;
  /** Narration text per reading level. */
  text: Record<AgeMode, string>;
  /** Optional scripture reference shown in "big" mode. */
  verse?: string;
  hotspots?: Hotspot[];
  find?: FindGame;
}

export interface QuizQuestion {
  /** Asked at both levels; "big" adds the harder questions via `level`. */
  question: string;
  choices: string[];
  answerIndex: number;
  /** 'little' questions are asked in both modes; 'big' questions only in big mode. */
  level: AgeMode;
}

/** The Family time card shown after a story's quiz. Nothing here is persisted. */
export interface Devotional {
  /** One question to talk about together, per reading level. */
  question: Record<AgeMode, string>;
  /** A short prayer to say together, per reading level. */
  prayer: Record<AgeMode, string>;
  /** One thing to do together this week, written for the grown-up. */
  activity: string;
}

export interface Story {
  id: string;
  title: string;
  /** One-line teaser on the library card. */
  blurb: string;
  /** Where the story is found, e.g. "Genesis 1". */
  reference: string;
  /** The takeaway, phrased for a child. */
  lesson: Record<AgeMode, string>;
  /** Drives the library card's colour treatment. */
  palette: { from: string; to: string; ink: string };
  /** Key into the scene-art registry, used for the card's animated thumbnail. */
  cover: string;
  scenes: Scene[];
  quiz: QuizQuestion[];
  /** Memory verse, shown in big mode after the quiz and on the Family time card. */
  memoryVerse?: { text: string; reference: string };
  /** Family time after the quiz: talk, pray, remember, try. */
  devotional: Devotional;
}

export type SoundName =
  | "chime"
  | "sparkle"
  | "splash"
  | "thunder"
  | "roar"
  | "sheep"
  | "bird"
  | "whoosh"
  | "cheer"
  | "knock";

/** Every animated scene receives the same props. */
export interface SceneArtProps {
  /** True while the scene is the active page, so art can start/stop motion. */
  active: boolean;
  /** Honours prefers-reduced-motion; art should hold still when false. */
  animate: boolean;
  /** Ids of hotspots the child has already tapped in this scene. */
  found: string[];
}

export type SceneArt = ComponentType<SceneArtProps>;
