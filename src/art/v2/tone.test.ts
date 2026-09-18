import { describe, expect, it } from "vitest";
import { darken, lighten, mix } from "./tone";

describe("mix", () => {
  it("returns the endpoints at t=0 and t=1", () => {
    expect(mix("#ff0000", "#0000ff", 0)).toBe("#ff0000");
    expect(mix("#ff0000", "#0000ff", 1)).toBe("#0000ff");
  });

  it("blends each channel linearly", () => {
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
  });

  it("clamps t outside [0, 1]", () => {
    expect(mix("#000000", "#ffffff", -3)).toBe("#000000");
    expect(mix("#000000", "#ffffff", 7)).toBe("#ffffff");
  });

  it("expands 3-digit hex before blending", () => {
    expect(mix("#f00", "#00f", 0)).toBe("#ff0000");
    expect(mix("#abc", "#abc", 0.4)).toBe("#aabbcc");
  });

  it("always emits six lowercase hex digits", () => {
    expect(mix("#010203", "#000000", 0.5)).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe("lighten and darken", () => {
  const base = "#3366aa";
  const lum = (hex: string) => parseInt(hex.slice(1), 16);

  it("lighten moves toward cream and darken toward ink", () => {
    expect(lum(lighten(base, 0.5))).toBeGreaterThan(lum(base));
    expect(lum(darken(base, 0.5))).toBeLessThan(lum(base));
  });

  it("t=0 is the identity for both", () => {
    expect(lighten(base, 0)).toBe(base);
    expect(darken(base, 0)).toBe(base);
  });

  it("t=1 reaches the palette endpoints", () => {
    expect(lighten(base, 1)).toBe("#fff8ec");
    expect(darken(base, 1)).toBe("#2a2140");
  });
});
