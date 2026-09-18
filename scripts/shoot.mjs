/**
 * Minimal Chrome DevTools Protocol driver: navigates, taps and screenshots the
 * running app. Node 22 ships a WebSocket client, so this needs no dependencies.
 */
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE ?? "http://127.0.0.1:4173";
const CDP = process.env.CDP ?? "http://127.0.0.1:9222";

const targets = await (await fetch(`${CDP}/json/list`)).json();
let page = targets.find((t) => t.type === "page");
if (!page) {
  page = await (await fetch(`${CDP}/json/new?about:blank`, { method: "PUT" })).json();
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await send("Page.enable");
await send("Runtime.enable");

let nonce = 0;

/**
 * Takes one screenshot.
 *
 * Each call does a *full* document load (via a changing query string) because a
 * hash-only navigation leaves the React app mounted, which would let one shot's
 * open dialog or reading mode leak into the next. `progress` is written to
 * localStorage before that load, so the app boots already in the wanted state.
 */
async function shot({ path, route = "#/", width, height, progress, before }) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: width < 700,
  });

  // Land on the origin first so localStorage is reachable, then seed it.
  await send("Page.navigate", { url: `${BASE}/?n=${++nonce}` });
  await sleep(500);
  const seed = {
    mode: "little",
    calm: false,
    muted: false,
    narrate: false,
    found: {},
    stickers: [],
    completed: [],
    quizBest: {},
    ...progress,
  };
  await send("Runtime.evaluate", {
    expression: `localStorage.setItem('bible-adventures:v1', ${JSON.stringify(JSON.stringify(seed))}); true`,
    returnByValue: true,
  });

  await send("Page.navigate", { url: `${BASE}/?n=${++nonce}${route}` });
  await sleep(1500);

  if (before) {
    const r = await send("Runtime.evaluate", {
      expression: before,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.exceptionDetails) throw new Error(`${path}: ${JSON.stringify(r.exceptionDetails)}`);
    await sleep(900);
  }

  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(path, Buffer.from(data, "base64"));
  console.log("shot", path);
}

// Surface anything the page logs as an error, so a blank screenshot is never a mystery.
const errors = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.text);
});

const D = process.env.OUT ?? "scratch/ui";

await shot({ path: `${D}/1-library-phone.png`, width: 390, height: 844 });
await shot({ path: `${D}/2-library-tablet.png`, width: 1024, height: 768 });
await shot({ path: `${D}/3-story-phone.png`, route: "#/story/noah/4", width: 390, height: 844 });
await shot({
  path: `${D}/4-story-hotspot.png`,
  route: "#/story/creation/5",
  width: 1024,
  height: 768,
  before: `document.querySelectorAll('.hotspot')[2].click(); true`,
});
await shot({
  path: `${D}/5-story-big-mode.png`,
  route: "#/story/daniel/0",
  width: 1024,
  height: 768,
  progress: { mode: "big" },
});
await shot({ path: `${D}/6-quiz.png`, route: "#/story/david/quiz", width: 390, height: 844 });
await shot({
  path: `${D}/7-stickers.png`,
  route: "#/stickers",
  width: 1024,
  height: 768,
  progress: { stickers: ["First Light", "The Sun", "The Moon", "Fruit Tree", "The Ark"] },
});
await shot({
  path: `${D}/8-settings.png`,
  width: 390,
  height: 844,
  before: `[...document.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === 'Grown-up settings').click(); true`,
});
await shot({
  path: `${D}/9-calm-storm.png`,
  route: "#/story/jonah/1",
  width: 1024,
  height: 768,
  progress: { calm: true },
});

// Daniel den: the reference scene for the raster art style.
await shot({ path: `${D}/10-den-phone.png`, route: "#/story/daniel/2", width: 390, height: 844 });
await shot({ path: `${D}/11-den-tablet.png`, route: "#/story/daniel/2", width: 1024, height: 768 });
await shot({
  path: `${D}/12-den-calm.png`,
  route: "#/story/daniel/2",
  width: 1024,
  height: 768,
  progress: { calm: true },
});
await shot({
  path: `${D}/13-den-hotspot.png`,
  route: "#/story/daniel/2",
  width: 1024,
  height: 768,
  before: `document.querySelectorAll('.hotspot')[0].click(); true`,
});
await shot({
  path: `${D}/14-den-big.png`,
  route: "#/story/daniel/2",
  width: 1024,
  height: 768,
  progress: { mode: "big" },
});

// Every page of each migrated story at phone and tablet, plus the first hotspot tapped on each.
const STORIES = {
  daniel: ["prays", "trap", "den", "angel", "rejoice"],
  noah: ["builds", "two-by-two", "flood", "dove", "rainbow"],
  david: ["shepherd", "taunt", "volunteers", "stones", "strike", "victory"],
  jonah: ["running", "storm", "swallowed", "prayer", "nineveh"],
  creation: ["light", "sky-water", "land", "lights", "creatures", "people"],
};
const only = process.env.STORY ? [process.env.STORY] : Object.keys(STORIES);
for (const story of only) {
  for (const [i, name] of STORIES[story].entries()) {
    const route = `#/story/${story}/${i}`;
    await shot({ path: `${D}/20-${story}-${i}-${name}-phone.png`, route, width: 390, height: 844 });
    await shot({
      path: `${D}/21-${story}-${i}-${name}-tablet.png`,
      route,
      width: 1024,
      height: 768,
    });
    await shot({
      path: `${D}/22-${story}-${i}-${name}-hotspot.png`,
      route,
      width: 1024,
      height: 768,
      before: `document.querySelectorAll('.hotspot')[0].click(); true`,
    });
  }
}

if (errors.length) {
  console.log("\nPAGE ERRORS:");
  errors.forEach((e) => console.log(" -", e));
}
ws.close();
