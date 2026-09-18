/**
 * One colour system for every scene, so 26 hand-drawn scenes still read as a
 * single storybook. Hues are deliberately warm and high-chroma; children's
 * illustration tolerates saturation that would look garish in a dashboard.
 */
export const C = {
  // Skies
  dawnTop: "#4b3a86",
  dawnBottom: "#f9a97c",
  daySkyTop: "#4aa8e0",
  daySkyBottom: "#bfe9ff",
  noonTop: "#2f8fd6",
  noonBottom: "#d6f2ff",
  duskTop: "#2b1b56",
  duskBottom: "#e8705a",
  nightTop: "#141034",
  nightBottom: "#3b2f7a",
  stormTop: "#2c3550",
  stormBottom: "#6b7b93",

  // Land
  grass: "#57b85a",
  grassDark: "#3d9243",
  grassLight: "#7fd07a",
  sand: "#e8c98a",
  sandDark: "#cfa863",
  rock: "#8a8296",
  rockDark: "#645d70",
  soil: "#8a5a3b",

  // Water
  sea: "#1f7fb8",
  seaDeep: "#12557f",
  seaLight: "#46a9dd",
  foam: "#eaf8ff",

  // Light
  sun: "#ffd34d",
  sunCore: "#fff3b8",
  moon: "#f3f0d8",
  star: "#fff6c9",
  glow: "#ffe98a",

  // Skin tones — the cast is deliberately varied
  skin: ["#f2c6a0", "#e0a97c", "#c88a5e", "#a96a45", "#83502f"],

  // Robes
  robe: ["#e0574f", "#3f7fd6", "#8b5fc4", "#f0913c", "#3aa889", "#d94f8a"],

  hair: ["#3a2418", "#1c1410", "#6b4226", "#8c6239", "#2b2b2b"],

  ink: "#2a2140",
  cream: "#fff8ec",
  white: "#ffffff",
} as const;

/** Deterministic pseudo-random in [0,1) so stars and raindrops never re-shuffle. */
export function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Deterministic value in [min,max). */
export function randIn(seed: number, min: number, max: number): number {
  return min + rand(seed) * (max - min);
}
