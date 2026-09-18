/**
 * Bundle-size gate, run by the pre-commit hook after `npm run build`.
 * Fails when the main JS bundle (gzip) or the service-worker precache total
 * crosses its budget. Budgets are ratchets: lower them as the app slims,
 * never raise them without a written reason in docs/roadmap.md.
 */
import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const BUDGET_JS_GZIP = 100 * 1024;
const BUDGET_PRECACHE = 12 * 1024 * 1024;

const assets = readdirSync(join(DIST, "assets"));
const js = assets.find((f) => /^index-.*\.js$/.test(f));
if (!js) {
  console.error("check-bundle: no dist/assets/index-*.js; run the build first");
  process.exit(1);
}
const jsGzip = gzipSync(readFileSync(join(DIST, "assets", js))).length;

// Workbox writes the precache manifest into sw.js as [{url:"...",revision:"..."}, ...].
const sw = readFileSync(join(DIST, "sw.js"), "utf8");
const urls = [...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]);
let precache = 0;
for (const url of urls) {
  try {
    precache += statSync(join(DIST, decodeURIComponent(url))).size;
  } catch {
    // A manifest entry without a file (e.g. index.html served as /) counts nothing.
  }
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
const rows = [
  ["JS bundle gzip", kb(jsGzip), kb(BUDGET_JS_GZIP), jsGzip <= BUDGET_JS_GZIP],
  [
    `precache (${urls.length} entries)`,
    mb(precache),
    mb(BUDGET_PRECACHE),
    precache <= BUDGET_PRECACHE,
  ],
];
let ok = true;
for (const [name, value, budget, pass] of rows) {
  console.log(`check-bundle: ${pass ? "ok  " : "OVER"} ${name}: ${value} (budget ${budget})`);
  ok &&= pass;
}
process.exit(ok ? 0 : 1);
