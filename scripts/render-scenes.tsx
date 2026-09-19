/**
 * Renders every registered scene to a PNG contact sheet.
 *
 * This is a development aid, not part of the app: it server-renders the scene
 * SVGs with animations frozen, which is exactly the "calm mode" still frame a
 * child with reduced-motion settings will see. If a scene only composes
 * correctly while it is moving, this catches it.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { createElement } from "react";
import { SCENE_ART, loadAllStories } from "../src/scenes/index";

await loadAllStories();
import { inlinePng } from "./lib/inline-png";

const OUT = process.env.OUT_DIR ?? "scratch/scenes";
mkdirSync(OUT, { recursive: true });

const keys = Object.keys(SCENE_ART);
const tiles: { key: string; png: Buffer }[] = [];

for (const key of keys) {
  const Art = SCENE_ART[key];
  const inner = await inlinePng(
    renderToStaticMarkup(createElement(Art, { active: true, animate: false, found: [] })),
  );
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="625" viewBox="0 0 1000 625">${inner}</svg>`;
  const file = `${OUT}/${key.replace("/", "-")}.png`;
  const png = await sharp(Buffer.from(svg)).resize(500, 313).png().toBuffer();
  writeFileSync(file, png);
  tiles.push({ key, png });
  console.log("rendered", key);
}

// One contact sheet so all 26 scenes can be checked at a glance.
const cols = 4;
const tw = 500;
const th = 313;
const rows = Math.ceil(tiles.length / cols);
const sheet = await sharp({
  create: { width: cols * tw, height: rows * th, channels: 3, background: "#120c26" },
})
  .composite(
    tiles.map((t, i) => ({ input: t.png, left: (i % cols) * tw, top: Math.floor(i / cols) * th })),
  )
  .png()
  .toBuffer();
writeFileSync(`${OUT}/_contact-sheet.png`, sheet);
console.log(`\nWrote ${tiles.length} scenes + ${OUT}/_contact-sheet.png`);
