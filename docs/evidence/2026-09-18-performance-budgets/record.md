# Evidence record: performance budgets

## Scope

Owner requirement 2026-09-18: quick response time when interacting with the
app; scale properly with load. Plan
`docs/superpowers/plans/2026-09-18-performance-budgets.md` (roast inline).

## What "load" means here

Static PWA, no backend, no runtime network calls; after install the
service worker serves everything. Scaling with users is the static host's
property (a CDN serves any number of clients); per-user server cost is
zero. Response time is per device and is what the gates measure.

## Gates added

- `scripts/check-bundle.mjs`, `npm run check:bundle`, in the pre-commit hook
  after the build: main JS gzip <= 100 KB, precache total <= 12 MB. Proven
  both ways (`bundle-gate-proof.txt`): with a temporary 10 KB budget it
  exits 1; restored, it passes at 76.8 KB and 5.97 MB (129 entries).
- `scripts/perf.mjs`, `npm run perf`, on demand: fresh CDP browser
  context, 390x844, 4x CPU, Slow 4G; measures cold-load LCP (buffered
  PerformanceObserver), first and warm hotspot tap-to-paint (double rAF
  after the DOM condition), page turn, quiz tap, frame median and p95 on
  the heaviest page (creation/4, 43 animations); exits 1 over budget;
  `--json` for evidence.

## Baseline (build `index-7sQxFND0.js`, Chrome 153 headless, this machine)

| Metric | Measured | Budget |
|---|---|---|
| cold load LCP, Slow 4G, no cache | 748 ms | 1500 ms |
| first tap to paint (creates AudioContext) | 97 ms | 250 ms |
| warm tap to paint | 44 ms | 150 ms |
| page turn | 164 ms | 300 ms |
| quiz tap | 53 ms | 150 ms |
| frame median, heaviest page | 16.7 ms | 40 ms |
| frame p95, heaviest page | 16.7 ms | 80 ms |

`perf-baseline.txt`, `perf-baseline.json`. A first run measured the first
tap at 198 ms and LCP as -1: the -1 was the measurement (timeline entries
are not buffered), fixed with a buffered observer; the 198 ms was a cold
context outlier, hence the separate first-tap and warm-tap budgets.

Frame median 16.7 ms at 4x throttle means the compositor drives the CSS
animations at the display rate; the main thread is idle between
interactions.

## Gaps

- Emulated CPU, desktop GPU, no thermal throttling; a real mid-range phone
  check is still open (roadmap phase 5 pilot devices).
- `npm run perf` is not in the hook (needs Chrome and the preview server);
  cadence is documented in `CLAUDE.md`.
- Budgets were set with headroom over a single-machine baseline; tighten
  once a phone baseline exists.
