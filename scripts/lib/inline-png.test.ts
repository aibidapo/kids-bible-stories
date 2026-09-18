import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { inlinePng } from "./inline-png";

async function webpUri(rgb: { r: number; g: number; b: number }): Promise<string> {
  const buf = await sharp({ create: { width: 2, height: 2, channels: 3, background: rgb } })
    .webp()
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

describe("inlinePng", () => {
  it("replaces each WebP data URI with a decodable PNG one", async () => {
    const uri = await webpUri({ r: 255, g: 0, b: 0 });
    const out = await inlinePng(`<image href="${uri}"/>`);
    expect(out).not.toContain("image/webp");
    const b64 = /data:image\/png;base64,([A-Za-z0-9+/=]+)/.exec(out)?.[1];
    expect(b64).toBeDefined();
    const meta = await sharp(Buffer.from(b64!, "base64")).metadata();
    expect(meta.format).toBe("png");
    expect(meta.width).toBe(2);
  });

  it("converts a repeated asset once and leaves other markup untouched", async () => {
    const uri = await webpUri({ r: 0, g: 0, b: 255 });
    const svg = `<g><image href="${uri}"/><image href="${uri}"/><rect/></g>`;
    const out = await inlinePng(svg);
    const pngs = out.match(/data:image\/png;base64,[A-Za-z0-9+/=]+/g) ?? [];
    expect(pngs).toHaveLength(2);
    expect(pngs[0]).toBe(pngs[1]);
    expect(out).toContain("<rect/>");
  });

  it("returns markup without WebP unchanged", async () => {
    expect(await inlinePng("<svg><rect/></svg>")).toBe("<svg><rect/></svg>");
  });
});
