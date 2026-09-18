/**
 * Pure colour maths for the v2 shading recipe. Hex in, hex out, no DOM.
 * Every shaded part is one base colour pushed toward cream for the lit side
 * and toward ink for the shadow side, so figures stay on the story palette.
 */

const CREAM = "#fff8ec";
const INK = "#2a2140";

function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channel(v: number): string {
  return Math.round(Math.max(0, Math.min(255, v)))
    .toString(16)
    .padStart(2, "0");
}

/** Linear blend from `a` (t=0) to `b` (t=1). */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const k = Math.max(0, Math.min(1, t));
  return `#${channel(ar + (br - ar) * k)}${channel(ag + (bg - ag) * k)}${channel(ab + (bb - ab) * k)}`;
}

export function lighten(hex: string, t: number): string {
  return mix(hex, CREAM, t);
}

export function darken(hex: string, t: number): string {
  return mix(hex, INK, t);
}
