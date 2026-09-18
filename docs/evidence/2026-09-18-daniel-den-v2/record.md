# Evidence record: Daniel den scene, style 6

## Scope

Task: rebuild `daniel/den` in a new v2 SVG art kit (soft-shaded cutout).
Spec: `docs/superpowers/specs/2026-09-18-daniel-den-style6-design.md`
Plan: `docs/superpowers/plans/2026-09-18-daniel-den-style6.md`

Gate inventory:

| Gate | Status |
|---|---|
| Pre-commit hook: `check:motion` + `build` (`tsc -b` + Vite) | installed this slice, proven both ways (below) |
| Lint with security rules | not installed, not run: unknown |
| Format check | not installed, not run: unknown |
| Unit tests | no runner in repo: unknown |
| Secret scan | not installed, not run: unknown |
| Dependency vulnerability audit | `npm install` reported "found 0 vulnerabilities" on 2026-09-18 during the esbuild install; not an independent audit run |
| Coverage, mutation | inapplicable: no test suite exists to measure |

## Artifact identity

- Checkout: `C:\Users\aibid\PROJECTS\KIDS BIBLE STORIES`, branch `main`
- Baseline commit: `d567255` (working tree then dirty: `package-lock.json` npm peer-flag normalisation only)
- Slice commits, in order: `1ba91de` spec, `cd21376` plan, `d177cd4` gate, `164aa1d` effects, `d795e86` den, `a42a5f5` lion, `395d840` person, `628e08b` composition
- Tested revision for browser evidence: `628e08b`, working tree dirty only with `scripts/shoot.mjs` (the den shot additions) and this evidence folder
- Runtime serving the browser evidence: `dist/` built by the pre-commit hook at 2026-09-18 06:34:56 local, bundle `dist/assets/index-D4Mg9aUA.js`, served by `vite preview --port 4173`. Confirmed from inside the page: `document.scripts` lists `index-D4Mg9aUA.js`; six `.a-blink` lids present (three v2 lions).
- `package-lock.json` sha256 (first 16) after esbuild install: not recorded; the lock is committed in `d177cd4`.

## Environment

- Windows 11 Pro 10.0.26200, Node v24.13.0, npm 11.6.2, Vite 8.3.0, esbuild 0.28.2, sharp 0.35.4
- Still renders: `sharp` (librsvg) via `scripts/render-scenes.tsx`, 500x313 per scene
- Browser shots: headless Chrome/153.0.8010.52 via CDP (`scripts/shoot.mjs`), fresh scratch profile, viewports 390x844 (mobile) and 1024x768
- Frame probe: Chrome DevTools MCP browser, isolated context, 1024x768 @2x, CPU throttling 4x

## Procedures and results

| Check | Command / procedure | Result | Evidence |
|---|---|---|---|
| Checker rejects | inject `transform` on `PitLight`'s `a-pulse-soft` group, `npm run check:motion` | exit 1, 2 offences (`daniel/den`, `daniel/angel`) | `check-motion-reject.txt` |
| Checker passes | `npm run check:motion` on every commit | `check-motion: 26 scenes clean`, exit 0 | `gate-pass.txt` |
| Hook rejects | stage `src/_gate_probe.ts` with a string-to-number assignment, `git commit` | `TS2322`, commit refused, exit 1 | `gate-reject.txt` |
| Hook passes | `git commit` of the gate files | build ok, commit `d177cd4` | `gate-pass.txt` |
| Typecheck + build | via hook on each of 6 code commits | exit 0 each time | commit history |
| Calm still composes | render command, `scratch/scenes/daniel-den.png` | composed frame, no collapse | `after/daniel-den.png` sha256 `e27e5855…b1444`; baseline `baseline/daniel-den.png` sha256 `9189fe6f…27339` |
| Before/after/reference | PIL composite | | `after/_before-after-reference.jpg` |
| Grain frame cost | rAF sampler, dev server, 4x throttle, with and without `<Grain />`, plus v1 `daniel/angel` | 33.6 / 34.2 / 35.1 ms avg; no measurable grain cost | `perf-grain.txt` |
| Frame cost, production build | same sampler on `localhost:4173` preview, isolated context, 4x throttle | 114 frames, avg 35.09 ms, p50 33.4, p95 33.7, max 100.4, 114 over 16.9 ms, 50 over 33.4 ms. Same floor as v1 under this throttle. | this record |
| Browser shots | `BASE=http://localhost:4173 OUT=… node scripts/shoot.mjs` | 14 PNGs, `PAGE ERRORS` absent | `browser/` |
| Phone layout | `browser/10-den-phone.png` | full scene visible incl. opening and king; rings on king and left lion face | sha256 `72e82599c5e8382d…` |
| Tablet layout, constraint 1 | `browser/11-den-tablet.png` | all figures positioned, none collapsed to origin; top ~225 units cropped (see gaps) | sha256 `d0678af7db02357b…` |
| Calm mode | `browser/12-den-calm.png` | composition identical to the still render | sha256 `9540881d40d53693…` |
| Hotspot tap | `browser/13-den-hotspot.png` | lions hotspot found, "Into the Den" sticker toast, reward bubble | sha256 `a5b777a5c6c945a0…` |
| Big reading level | `browser/14-den-big.png` | long text plus verse, art unchanged | sha256 `8cbf439969481f74…` |
| Bundle size | `gzip -c dist/assets/index-*.js \| wc -c` | 77657 bytes | this record |

## Review

Automated: `check:motion` and `tsc -b` + Vite build on every commit (hook). No other automated assertions exist.

Visual observations (agent, not human): style matches the reference in proportions, layering, face treatment and lighting. Texture fidelity is lower than the reference, as the spec predicted. Wall stone reads slightly cool against the warm reference even after the Task 5 warm-up.

Roast findings and disposition:

- Plan roast: motion-constraint lint added (done, Task 0b); grain perf probed early (done, kept); single breathe group per lion (done); hook runs build only plus exec bit in index (done); tune loops capped at three (used one each for lion and person); release caveat and effort estimate go in `handoff.md`.
- Code review per task: far lion was hidden behind the near lion (moved to x=555 behind Daniel); beard hid the mouth and brows hid under the headband (fixed in Person2).

Human review: **not performed**. Next authorized step is the user's review of `after/_before-after-reference.jpg` and the browser shots.

## Gaps

- **No failing-test-first artifact.** No unit-test runner exists; the visual baseline is a "before" capture, not a regression test.
- **Lint, format, secret scan, dependency audit:** unknown, tooling absent.
- **Coverage, mutation:** inapplicable, no test suite.
- **Performance measured under emulation** on a desktop GPU, not a real phone. Under 4x CPU throttle every route, v1 included, sits at ~33 ms; this does not distinguish the new scene from the old.
- **Pre-existing tablet-landscape crop.** With a 1024x768 viewport the stage frame is height-limited to ~2.5:1 and `preserveAspectRatio="xMidYMax slice"` crops the top ~225 viewBox units. The opening, the king, and the `king-above` hotspot are off-screen; the ring floats over the wall. v1 had the same defect (baseline `1-library`/story shots). Not addressed in this slice; needs a Stage layout decision (letterbox, or a vertical safe zone rule).
- **Style split inside the Daniel story.** Page 3 is v2, pages 1, 2, 4, 5 are v1. Not for release until the story is fully migrated.
- **DevTools MCP browser profile** carries a stale service worker for `localhost:4173` from another project; measurements there must use an isolated context (done). The CDP screenshot browser used a fresh profile.
