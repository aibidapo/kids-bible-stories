# Session Handoff Summary

## 1. Current Goal

Make the storybook look like the chosen concept
(`design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`) on a
phone, offline, with hotspots, Calm mode and character animation intact.
All five stories (27 pages) are now layered AI-generated raster art composed
inside the SVG stage. The user then asked whether the project coding
standards had been followed; the answer was no (no test runner, lint, format,
secret scan or audit). The latest increment closes that gap with local gates.

## 2. Completed Work

Latest: **Daniel page 2 palace regenerated, richer and more royal** (background
only: marble and gilded lotus columns, crimson carpet, blue-gold tile, banners,
lamp stands; king moved up onto the new dais, king hotspot moved). Evidence:
`docs/evidence/2026-09-18-trap-palace/record.md` (before/after renders, phone
hotspot still, sidecar). Gap: `pack.py` cannot repack a background alone; bytes
patched by hand, a `--bg-only` path is worth adding. Old raw kept locally as
`raw/daniel/trap/bg-v1.png`.

Before that: **angel wings beat slowly, forwards and back, and a third sleeping lion** (Daniel page 4).
`design/pipeline/split_part.py` cuts any named part off a cutout (several per
cutout); the angel is now body + two wing parts inside one `a-float` group,
wings on `a-wing-l` / `a-wing-r` (scaleX 1 → 0.5 about the shoulder, ±4°
tilt, 5 s). Evidence: `docs/evidence/2026-09-18-angel-wings/record.md`
(Calm render, phone stills at quarter and mid beat). Awaiting user review
of the motion.

Before that: **local gates and first unit tests** (`56bd1a5`, then `c67fc5b`
Prettier mechanical over 28 files, then the record commit).

- ESLint 9 flat config (typescript-eslint, eslint-plugin-security,
  react-hooks), Prettier 3, Vitest 5 with v8 coverage, `scripts/check-secrets.mjs`
  (staged-diff credential scan, `secret-ok` same-line pragma), `npm run audit`.
- `.githooks/pre-commit` runs secrets → prettier on staged files → lint →
  `check:motion` → tests → typecheck + build. Every step blocks. Proven both
  ways; the hook also rejected the real commit twice on its own (a line over
  print width, then `Object.hasOwn` failing `tsc -b`). Full run ≈ 12 s.
- `shuffleChoices(q, rng)` in `src/lib/quiz.ts` extracted from `Quiz.tsx`
  under TDD (red → stub red → green, captured). 52 tests: quiz shuffle, tone
  maths, raster geometry (`Layer`, `Part`, `Tail`, `Flipbook`, `Eyelids`,
  `Backdrop`, and the transform/class separation), `inlinePng`, and story-data
  invariants (art keys registered, hotspots on stage, quiz answers in range,
  both reading levels, find targets exist). Three hand mutations confirmed the
  tests fail.
- Lint: the one error fixed (ternary as a statement in `shoot.mjs`); 24
  `detect-object-injection` warnings reviewed per site, policy in `CLAUDE.md`;
  `getSceneArt` guards prototype keys.
- `npm audit`: two moderate findings in vitest 3 cleared by vitest 5; now 0.
- Coverage ratchet in place: `store.ts` characterised (12 tests, 64 total),
  thresholds in `vitest.config.ts` at lines 45 / branches 56 / functions 67 /
  statements 44, enforced by the hook through `npm run coverage`. A surviving
  mutation in the first `recordQuiz` test was found and closed.
- Evidence: `docs/evidence/2026-09-18-local-gates/record.md`.

Before that, the art migration, newest first (records under `docs/evidence/`):

- Garden page review (`e1fa37a`): swaying trees and tufts, animals wander on
  `a-wander` + `a-walk-bob`; dolphin leap lowered to the water line with
  splashes (`95e295f`).
- Creatures page review round (`5e924f2`): five single fish on
  `a-swim-across`, dolphin on `a-leap`, drifting clouds, seahorse/crab/octopus,
  bubbles; `gen.py` retries an empty model response.
- Creation story, six pages, and the vector kit removed (`05489d0`, `d724a52`,
  `0e59dcc`). `src/art/` is `palette.ts`, `base.tsx`, `raster.tsx`,
  `v2/effects.tsx` + `tone.ts`. JS bundle 77 KB gzip, `dist` 6.1 MB.
  Record: `2026-09-18-creation-story-raster`.
- Jonah, five pages, three review rounds (`babbf54`…`f99384c`): harbour with
  figures on the quay, ship west and in front, storm on heaving waves with the
  crew inside the hull, Jonah swallowed with sea life and bubbles, Nineveh
  crowd at Jonah's height. Quiz choices shuffled per mount.
  Record: `2026-09-18-jonah-story-raster`.
- David, six pages, two review rounds (`0219027`…`ceef0fd`): strike page,
  blinks on every face, swaying canopy and tufts, coloured birds, Goliath
  re-sheeted bigger, soldiers taller than David, fallen Goliath, soldiers
  running downhill. `find_eyes.py`, `split_tail.py`, `Part`/`Flipbook`.
  Record: `2026-09-18-david-story-raster`.
- Noah, five pages, plus a dove past Daniel's window (`e7d9868`, `2000f53`).
  Record: `2026-09-18-noah-story-raster`.
- Daniel, five pages, lions blink staggered and flick tails (`7301975` and
  earlier). Chroma-mask matte replaced rembg (`8bf856a`).
  Record: `2026-09-18-daniel-story-raster`.
- Spec `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md`;
  pipeline under `design/pipeline/` (Gemini `gemini-3-pro-image-preview`,
  character sheets, `layers.json` manifests, 450 KB per-scene budget).

**Incident, fixed:** `8273eb5` shipped `motion.css` with blinks, wing flips
and tail flicks deleted (string-sliced edit matched the wrong keyframe).
Restored in `7e3072d`. Rule: edit `motion.css` with `Edit` on a unique anchor;
after any stylesheet edit, run `document.getAnimations()` on a migrated page.

## 3. Current State

- **Git Branch:** `main`, pushed to origin through `f5a4bf0`; HEAD is the trap-palace commit.
- **Uncommitted changes:** none. `coverage/` is generated and gitignored.
- **Environment / key config:** Node v24.13.0, npm 11.6.2, Vite 8.3.0,
  Vitest 5.0.1, ESLint 9.39.5, Prettier 3.9.8; Python 3.14 with google-genai,
  Pillow. `GEMINI_API_KEY` in the user's environment, billing enabled. Hooks
  path `.githooks` (verify with `git config core.hooksPath` at session start).
  Background processes possibly still running: Vite dev :5173, Vite preview
  :4173, headless Chrome :9222 (scratch profile). The DevTools MCP default
  browser profile has a stale service worker for `localhost:4173`; use fresh
  isolated contexts and close other pages before frame probes.

## 4. Next Steps

- [ ] **User reviews the new palace** on `#/story/daniel/1`.
- [ ] Pipeline: `pack.py --bg-only` so a background can be redone without a cutout run.
- [ ] **User reviews the angel wing beat** on `#/story/daniel/3` (phone); depth and speed are two numbers in `motion.css`.
- [ ] **User reviews** each story from its record's `story-sheet.png` and
      `phones.png` (`docs/evidence/2026-09-18-{daniel,noah,david,jonah,creation}-story-raster/`).
- [x] Coverage ratchet: thresholds at the measured floor, hook-enforced.
- [x] `sound.ts` characterised with a fake Web Audio graph (20 tests, 84
      total); thresholds now lines 98 / branches 95 / functions 93 /
      statements 97 over the pure-seam include set.
- [ ] Widen the coverage include set to components rendered through
      `react-dom/server` (Quiz, NarrationText, StoryPlayer), then scenes.
      Raise thresholds in the same commit each time. First review 2026-10-02.
- [ ] Decide on CI (GitHub Actions running the identical hook commands plus
      `npm run audit`). Without it the hook is per-clone only.
- [ ] Tablet-landscape crop decision (sun/moon and the den king sit above y=225).
- [ ] Licensing stance for Gemini-generated art in a published app.
- [x] `design/concept-art/` committed (`f5a4bf0`) and pushed.
- [ ] Real-phone performance check. Fallback done (record, follow-up 3):
      cold load on Slow 4G + 4× CPU, LCP 591 ms, frames avg 35 ms at 4×.
      Still needs a phone: `npm run preview -- --host`, open
      `http://192.168.4.27:4173` on the same Wi-Fi.
- [x] Pruned `Hills`, `GrassTufts`, `Rainbow`, `LightRays` from `base.tsx`;
      `shoot.mjs` numbered routes verified and annotated.
- [ ] Optional: leg flipbooks for true walking gaits in the garden.
- [ ] Optional: mutation testing tool (Stryker) on `quiz.ts`, `tone.ts`,
      `store.ts` once covered.

## 5. Active Blockers & Notes

- **Release state.** All five stories raster and consistent; local gates in
  place. Open before release: human review of every story, coverage ratchet,
  CI, tablet crop, licensing.
- **Gate limits** (details in the local-gates record): format gate checks
  working copies not the index; secret scan is regex-only; object-injection
  warnings never block; unit tests are node-only, so motion, layering, Calm
  and offline stay browser checks.
- **Pipeline lessons** (fixed in code): key the green field after the matte
  and intersect alphas; one Gemini client per process; decode
  `inline_data.data` with PIL; retry an empty `response.parts`.
- **Compare tool is the acceptance test** for art: `npm run compare`, never
  the 500 px contact sheet.
