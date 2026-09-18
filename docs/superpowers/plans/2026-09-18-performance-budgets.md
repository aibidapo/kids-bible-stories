# Performance Budgets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Interactions stay quick on a mid-range phone and the app scales with users, with both stated as measured budgets and enforced by gates rather than asserted.

**Architecture:** Two gates. (1) `scripts/check-bundle.mjs` runs in the pre-commit hook after the build and fails when the JS bundle or the precache total crosses its budget. (2) `scripts/perf.mjs` drives the production build through Chrome DevTools Protocol with 4× CPU and Slow 4G throttling, measures cold load, tap-to-paint, page turn, quiz tap and frame cost, prints a table and exits non-zero over budget; run on demand (`npm run perf`) since it needs Chrome and the preview server. Scaling is documented as a hosting property: static, immutable hashed assets, service-worker precache, zero requests after install.

**Tech Stack:** Node 24 WebSocket CDP client (as `scripts/shoot.mjs`), Vite build output, workbox manifest.

**Spec:** owner requirement 2026-09-18: "quick response time when interacting with the app and the app should scale properly with load."

## Budgets (first set at the measured baseline, ratchet down only)

| Metric | How | Budget |
|---|---|---|
| JS bundle, gzip | `dist/assets/index-*.js` | ≤ 100 KB |
| Precache total | sum of workbox manifest entries | ≤ 12 MB (media rule) |
| Cold load LCP, Slow 4G + 4× CPU, no cache | CDP trace-free: `performance.getEntriesByType('largest-contentful-paint')` | ≤ 1500 ms |
| Tap-to-paint, hotspot, 4× CPU | click → next paint after bubble appears | ≤ 150 ms |
| Page turn, 4× CPU | Next click → new scene's images in DOM and painted | ≤ 300 ms |
| Quiz tap, 4× CPU | choice click → next question painted | ≤ 150 ms |
| Frame cost, heaviest page, 4× CPU | median rAF delta over 120 frames | ≤ 40 ms (≈ 10 ms unthrottled) |

## Roast (before code)

- **Architect (3):** CDP timings in headless Chrome on a desktop are not a phone. 4× CPU throttling approximates a mid-range Android CPU but not its GPU or thermal state. Budgets are relative guards against regression, not absolute promises; say so in the docs and keep the real-phone check open.
- **Architect (3):** `performance.now()` around a click measures script time, not paint. Use a double `requestAnimationFrame` after the DOM change to include the next paint, and `PerformanceObserver` for LCP.
- **Architect (2):** the hook already runs ~12 s; a bundle check is milliseconds. The perf script is minutes and needs Chrome, so it stays on demand with its cadence documented (before a release, after any scene or animation change).
- **CFO (1):** zero hosting cost change; static hosting is the cheapest tier.
- **Buyer (2):** parents notice tap lag and stutter, not LCP. Weight the tap-to-paint and frame budgets in the report and lead with them.
- **Verdict:** proceed-with-changes: double-rAF paint timing, honest wording about emulation.

### Task 1: bundle gate

- [ ] `scripts/check-bundle.mjs`: read `dist/assets/index-*.js`, gzip it, read `dist/sw.js` precache manifest sizes (or sum `dist/**` files listed), compare to budgets, print, exit 1 over.
- [ ] Hook: after build, `npm run --silent check:bundle`.
- [ ] Prove: temporarily set the JS budget to 10 KB, hook rejects; restore.

### Task 2: perf script

- [ ] `scripts/perf.mjs` (CDP, `BASE`, `CDP` env like `shoot.mjs`): throttles, measures the table above on `#/story/creation/4` (heaviest), `#/story/daniel/2` (tap), `#/story/daniel/quiz` (quiz), prints results vs budgets, exits 1 over budget, `--json` writes the table for evidence.
- [ ] Run against the current build; record baseline; set budgets at or above baseline with headroom.

### Task 3: docs and evidence

- [ ] `CLAUDE.md`: Performance section (budgets, commands, cadence, what scaling means here).
- [ ] Evidence record `docs/evidence/2026-09-18-performance-budgets/record.md`; roadmap note; handoff; commit; push.
