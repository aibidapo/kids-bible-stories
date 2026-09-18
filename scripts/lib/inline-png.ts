import sharp from "sharp";

/**
 * sharp rasterises SVG through librsvg, which decodes embedded PNG but not
 * WebP. Scene modules import .webp assets (bundled as data URIs by esbuild), so
 * swap each WebP data URI for a PNG one before handing the markup to sharp.
 */
export async function inlinePng(svg: string): Promise<string> {
  const re = /data:image\/webp;base64,([A-Za-z0-9+/=]+)/g;
  const cache = new Map<string, string>();
  for (const m of svg.matchAll(re)) {
    if (cache.has(m[1])) continue;
    const png = await sharp(Buffer.from(m[1], "base64")).png().toBuffer();
    cache.set(m[1], `data:image/png;base64,${png.toString("base64")}`);
  }
  return svg.replace(re, (_, b64: string) => cache.get(b64) ?? "");
}
