/**
 * Renders each story's cover scene to `public/covers/<id>.webp` for the
 * library cards. The library no longer mounts live scenes (their art lives
 * in per-story chunks that may not be on the device), so the card shows this
 * still, which is the Calm-mode frame of the cover scene. Re-run after
 * changing a cover scene; the output is committed.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { createElement } from "react";
import { STORIES } from "../src/data/stories";
import { getSceneArt, loadAllStories } from "../src/scenes/index";
import { inlinePng } from "./lib/inline-png";

await loadAllStories();
mkdirSync("public/covers", { recursive: true });

for (const story of STORIES) {
  const Art = getSceneArt(story.cover);
  if (!Art) throw new Error(`${story.id}: cover art ${story.cover} is not registered`);
  const inner = await inlinePng(
    renderToStaticMarkup(createElement(Art, { active: true, animate: false, found: [] })),
  );
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="625" viewBox="0 0 1000 625">${inner}</svg>`;
  const webp = await sharp(Buffer.from(svg)).resize(640, 400).webp({ quality: 80 }).toBuffer();
  writeFileSync(`public/covers/${story.id}.webp`, webp);
  console.log("cover", story.id, `${Math.round(webp.length / 1024)} KB`);
}
