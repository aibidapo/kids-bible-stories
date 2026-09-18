# Session Handoff Summary

## 1. Current Goal

Upgrade the storybook's graphics from flat clipart to a soft-shaded cutout
style (concept "6"), without breaking the ship-nothing-binary rule, Calm
mode, or the SVG transform/animation constraints. This session delivered the
vertical slice: one scene (`daniel/den`) rebuilt in a new `src/art/v2/` kit,
plus a local pre-commit gate, so the user can judge the style before the
other 25 scenes are migrated.

## 2. Completed Work

Design and plan (committed):

- `design/concept-art/` — six Gemini concept images (four styles, two blends),
  generator `gen_styles.py`, `README.md`. **Untracked, not committed**: user
  asked to store them, did not ask to commit. ~5 MB of JPEGs.
- `docs/superpowers/specs/2026-09-18-daniel-den-style6-design.md` — spec (`1ba91de`)
- `docs/superpowers/plans/2026-09-18-daniel-den-style6.md` — plan, roasted and
  amended (`cd21376`)

Gate (`d177cd4`):

- `.githooks/pre-commit` runs `npm run check:motion` then `npm run build`.
  Activated with `git config core.hooksPath .githooks`; mode 100755 in index.
- `scripts/check-motion.tsx` + `npm run check:motion`: renders all 26 scenes'
  markup, fails on an `a-*` class sharing an element with a `transform`
  attribute, or an inline `transform-origin`. Proven: 26 clean; 2 offences
  when a violation is injected; hook refuses a staged `TS2322`.
- `esbuild@^0.28.2` added as devDependency (Vite 8 no longer ships it).
  `.playwright-mcp/` gitignored.

v2 art kit and scene:

- `src/art/v2/tone.ts` (`mix`/`lighten`/`darken`), `src/art/v2/effects.tsx`
  (`Shaded`, `SoftShadow`, `LightShaft`, `Grain`, `Motes`) — `164aa1d`
- `src/art/v2/den.tsx` `Den2` — `d795e86`
- `src/art/v2/lion.tsx` `Lion2` + `.a-blink` in `motion.css` — `a42a5f5`
- `src/art/v2/person.tsx` `Person2` (poses `pray`/`kneel`, faces `calm`/`happy`) — `395d840`
- `src/scenes/daniel.tsx` `IntoTheDen` recomposed; `src/data/stories/daniel.ts`
  den hotspots moved (`lions-awake` 25/88 size 24, `king-above` 50/8 size 18) — `628e08b`
- `scripts/shoot.mjs` shots 10–14 for the den — `cd49a4b`
- `CLAUDE.md` documents the gate, `check:motion`, the v2 kit, `BASE=` for
  shoot.mjs, and the tablet crop limit — this session, committed with this file.

Verification actually run (details and hashes in
`docs/evidence/2026-09-18-daniel-den-v2/record.md`):

- `npm run typecheck`, `npm run check:motion`, `npm run build`: green on every commit via the hook.
- Still render (`render-scenes.tsx`): Calm frame composes. Before/after/reference sheet at
  `docs/evidence/2026-09-18-daniel-den-v2/after/_before-after-reference.jpg`.
- Browser shots (headless Chrome via CDP, production preview build
  `index-D4Mg9aUA.js`): phone, tablet, Calm, hotspot-found, big mode all correct.
- Frame probe at 4x CPU throttle: ~35 ms avg, identical to an untouched v1 scene;
  grain filter adds nothing measurable. Emulated, not a real phone.
- Bundle: 77.7 KB gzipped (was ~76 KB).

## 3. Current State

- **Git Branch:** `main`, HEAD `cd49a4b` before the final docs commit
- **Uncommitted changes:** `CLAUDE.md` and `handoff.md` staged for the Task 7
  commit; `design/` untracked (see above)
- **Environment / key config:** Node v24.13.0, npm 11.6.2, Vite 8.3.0, esbuild
  0.28.2. Hooks path `.githooks`. `GEMINI_API_KEY` is set in the user's
  environment for `design/concept-art/gen_styles.py` (billing enabled on the
  Google project; image models have zero free-tier quota). Background
  processes from this session may still be running: Vite dev on :5173, Vite
  preview on :4173, headless Chrome on :9222 with a scratch profile.
- **Evidence record:** `docs/evidence/2026-09-18-daniel-den-v2/record.md`

## 4. Next Steps

- [ ] **User reviews the slice**: open `docs/evidence/2026-09-18-daniel-den-v2/after/_before-after-reference.jpg`
      and `browser/10-den-phone.png` / `11-den-tablet.png`. Decide: go, tune, or rethink style.
- [ ] Decide whether `design/concept-art/` gets committed (5 MB of JPEGs in the repo) or gitignored.
- [ ] If go: migrate the rest of the Daniel story first (`prays`, `trap`, `angel`, `rejoice`) so one
      story is coherent. Needs v2 equivalents of: `Angel`, `Person` poses `stand`/`raise`/`fear`/`point`,
      faces `sad`/`scared`, a window/room interior, `City`, `Throne`, `Scroll`, `PalmTree`, `Crowd`.
- [ ] Fix or decide the tablet-landscape crop (see blockers). Options: letterbox the stage instead of
      `slice`, or adopt a vertical safe zone (y ≥ 225) and move the king lower.
- [ ] Optional quality tune on the slice: wall stone still slightly cool; `a-pulse-soft` scales the
      light wedge about its centre so its top edge drifts off the opening (~16 px, v1 had the same).
- [ ] Install the missing gates as a separate task: lint with security rules, format check, a test
      runner, secret scan, dependency audit. The hook currently covers only motion lint + typecheck + build.

Effort estimate for the remaining 25 scenes, from what this slice actually took
(one tune cycle each for lion and person, ~40 lines per figure part):

| Unit | Estimate |
|---|---|
| New `Person2` pose (arm/hand paths) | 30–60 min |
| New `Person2` face | 15–30 min |
| New animal (sheep, bird, fish, giant fish, zebra, giraffe, elephant, dove) | 1–2 h each |
| New prop (ark, ship, city, throne, sling, tree, palm, window, scroll) | 45–90 min each |
| Base layer (sky variants, sun/moon/stars, clouds, land, sea, rain, rainbow) | 30–60 min each |
| Scene composition + hotspot re-placement + shots | 30–60 min per scene |
| `Crowd`, `Giant`, `Angel` figures | 1–2 h each |

Rough total: 40–70 hours of hand-tuned SVG for full migration. v1 kit deletion
and folding v2 into `src/art/` comes last.

## 5. Active Blockers & Notes

- **Not for release.** Daniel page 3 is v2, pages 1, 2, 4, 5 are v1. Do not deploy until the
  Daniel story is fully migrated.
- **Pre-existing tablet-landscape crop.** At 1024x768 the stage frame is height-limited to ~2.5:1
  and `preserveAspectRatio="xMidYMax slice"` crops the top ~225 viewBox units. The opening, the
  king and the `king-above` hotspot are off-screen there; the hotspot ring floats over the wall.
  v1 had the same defect. Phone portrait (4:3 frame) shows the full height but crops x < 83 and
  x > 917.
- **Evidence gaps, stated in the record:** no failing-test-first artifact (no test runner); lint,
  format, secret scan, dependency audit unknown; coverage and mutation inapplicable; performance
  emulated only; human review not performed.
- **DevTools MCP browser profile** has a stale service worker for `localhost:4173` from another
  project ("TARENIX Money"); use an isolated context there. The CDP screenshot browser uses a
  fresh scratch profile and is unaffected.
- **Spec deviation, recorded:** the spec's `a-mote` class was replaced by existing `a-float` +
  `a-twinkle`; same rest behaviour, no new CSS.
- **Hook cost:** every commit runs a full Vite build (~2 s) plus the motion lint (~1 s).
