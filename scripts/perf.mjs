/**
 * Interaction and load budgets, measured on the production build through the
 * Chrome DevTools Protocol with 4x CPU and Slow 4G throttling. On demand:
 *
 *   npm run preview -- --port 4173      (in one terminal)
 *   chrome --headless=new --remote-debugging-port=9222 about:blank
 *   BASE=http://localhost:4173 npm run perf [-- --json out.json]
 *
 * Emulation approximates a mid-range phone's CPU, not its GPU or thermal
 * state: these numbers guard against regression, they are not a promise.
 * Exit code 1 when any metric is over budget.
 */
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE ?? "http://127.0.0.1:4173";
const CDP = process.env.CDP ?? "http://127.0.0.1:9222";
const CPU = Number(process.env.CPU ?? 4);
const jsonOut = process.argv.includes("--json")
  ? process.argv[process.argv.indexOf("--json") + 1]
  : null;

const BUDGETS = {
  coldLoadLcpMs: 1500,
  firstTapToPaintMs: 250,
  tapToPaintMs: 150,
  pageTurnMs: 300,
  quizTapMs: 150,
  frameMedianMs: 40,
  frameP95Ms: 80,
};

// A fresh browser context so no service worker or cache from earlier runs helps.
const ctx = await (await fetch(`${CDP}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(ctx.webSocketDebuggerUrl);
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
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
};

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 3,
  mobile: true,
});
await send("Emulation.setCPUThrottlingRate", { rate: CPU });
// Slow 4G as Chrome DevTools defines it.
await send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});

const results = {};

// 1. Cold load: first visit, nothing cached, LCP from the performance timeline.
await send("Page.navigate", { url: `${BASE}/?perf=1#/story/creation/4` });
await sleep(6000);
// LCP entries are not kept in the timeline; a buffered observer replays them.
results.coldLoadLcpMs = await evaluate(`
  new Promise((res) => {
    let last = -1;
    const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) last = Math.round(e.startTime); });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => { po.disconnect(); res(last); }, 300);
  })
`);
results.bundle = await evaluate(
  `[...document.scripts].map(s => s.src).find(s => /index-/.test(s))?.split('/').pop()`,
);

// Frame cost on the heaviest page, animations running.
results.frames = await evaluate(`
  new Promise((res) => {
    const d = []; let last = performance.now(); let n = 0;
    const tick = (t) => { d.push(t - last); last = t; if (++n < 125) requestAnimationFrame(tick); else res(d.slice(5).sort((a, b) => a - b)); };
    requestAnimationFrame(tick);
  }).then((d) => ({ medianMs: +d[Math.floor(d.length / 2)].toFixed(1), p95Ms: +d[Math.floor(d.length * 0.95)].toFixed(1), animations: document.getAnimations().length }))
`);

// Helper: time from an action to the next painted frame after a DOM condition holds.
const timeToPaint = (action, condition) => `
  new Promise((res, rej) => {
    const t0 = performance.now();
    (${action})();
    const deadline = t0 + 5000;
    const check = () => {
      if ((${condition})()) { requestAnimationFrame(() => requestAnimationFrame(() => res(Math.round(performance.now() - t0)))); return; }
      if (performance.now() > deadline) { rej(new Error('condition not met')); return; }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  })
`;

// 2. Tap-to-paint: a hotspot on the den page. The first tap also creates the
// AudioContext (every sound waits for a gesture), so a warm second tap is
// measured too; the warm number is what every later tap in the session costs.
await send("Page.navigate", { url: `${BASE}/?perf=2#/story/daniel/2` });
await sleep(2500);
results.firstTapToPaintMs = await evaluate(
  timeToPaint(
    `() => document.querySelectorAll('.hotspot')[0].click()`,
    `() => !!document.querySelector('.stage__bubble')`,
  ),
);
await sleep(300);
results.tapToPaintMs = await evaluate(
  timeToPaint(
    `() => { window.__b = document.querySelector('.stage__bubble')?.textContent; document.querySelectorAll('.hotspot')[1].click(); }`,
    `() => document.querySelector('.stage__bubble') && document.querySelector('.stage__bubble').textContent !== window.__b`,
  ),
);

// 3. Page turn: Next → the new scene's art.
results.pageTurnMs = await evaluate(
  timeToPaint(
    `() => { window.__imgs = document.querySelectorAll('svg image').length; [...document.querySelectorAll('button')].find(b => /Next/.test(b.textContent)).click(); }`,
    `() => location.hash.endsWith('/3') && document.querySelectorAll('svg image').length !== window.__imgs`,
  ),
);

// 4. Quiz tap: first choice → next question or done page.
await send("Page.navigate", { url: `${BASE}/?perf=3#/story/daniel/quiz` });
await sleep(2000);
results.quizTapMs = await evaluate(
  timeToPaint(
    `() => { window.__q = document.querySelector('.quiz__heading').textContent; document.querySelector('.quiz__choice').click(); }`,
    `() => document.querySelector('.quiz__heading').textContent !== window.__q || document.querySelector('.quiz__choice.is-wrong')`,
  ),
);

ws.close();

const rows = [
  ["cold load LCP (Slow 4G, no cache)", results.coldLoadLcpMs, BUDGETS.coldLoadLcpMs],
  [
    "first tap to paint (hotspot, creates audio)",
    results.firstTapToPaintMs,
    BUDGETS.firstTapToPaintMs,
  ],
  ["tap to paint (hotspot, warm)", results.tapToPaintMs, BUDGETS.tapToPaintMs],
  ["page turn", results.pageTurnMs, BUDGETS.pageTurnMs],
  ["quiz tap", results.quizTapMs, BUDGETS.quizTapMs],
  ["frame median (heaviest page)", results.frames.medianMs, BUDGETS.frameMedianMs],
  ["frame p95 (heaviest page)", results.frames.p95Ms, BUDGETS.frameP95Ms],
];
let ok = true;
console.log(
  `perf: build ${results.bundle}, CPU ${CPU}x, Slow 4G, 390x844, ${results.frames.animations} animations on the heaviest page`,
);
for (const [name, value, budget] of rows) {
  const pass = value >= 0 && value <= budget;
  ok &&= pass;
  console.log(`perf: ${pass ? "ok  " : "OVER"} ${name}: ${value} ms (budget ${budget} ms)`);
}
if (jsonOut)
  writeFileSync(jsonOut, JSON.stringify({ cpu: CPU, budgets: BUDGETS, results }, null, 2));
process.exit(ok ? 0 : 1);
