# Session Handoff Summary

## 1. Current Goal

Make the storybook look like the chosen concept
(`design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`) on a
phone, offline, with hotspots, Calm mode and character animation intact.
After a vector attempt fell short, the user chose the path that reaches the
concept: **layered AI-generated raster art** composed inside the existing SVG
stage. This session delivered that as a vertical slice on `daniel/den`, plus
the asset pipeline and a local pre-commit gate.

## 2. Completed Work

Latest: creatures page review round (`5e924f2`): five single fish cross on `a-swim-across`,
the dolphin leaps on `a-leap`, two clouds drift, seahorse/crab/octopus and bubbles added;
`gen.py` retries an empty model response. Before that: **Creation story, six pages, and the vector kit removed. All five
stories (27 pages) are layered raster.** Commits `05489d0` plan + manifests,
`d724a52` assets, `0e59dcc` compositions, then kit removal and the record.
Heavy reuse of earlier layers (birds, dove, sea life, animal pairs, trees,
lamb); eight new sheet-less layers. `src/art/` is now `palette.ts`,
`base.tsx` (overlays), `raster.tsx`, `v2/effects.tsx` + `tone.ts`. JS bundle
76 KB gzip, `dist` 6.1 MB. Evidence: `docs/evidence/2026-09-18-creation-story-raster/record.md`.
Earlier Jonah follow-ups: harbour figures on the quay top, ship west and
drawn in front (`1a7483f`, `79236f6`, `f99384c`).

Before that: **Jonah story, five pages, after one review round** (`babbf54`…`b4611a5`).
Four of five stories migrated. Harbour with a full quay and a moored ship,
storm on four heaving wave layers with the ship riding the near swell and the
crew inside the hull, Jonah head-first into the great fish with a turtle, a
fish school, a jellyfish and rising bubbles, prayer in the belly, Nineveh
crowd at Jonah's height. Second review: harbour figures stood on the quay top and the
ship enlarged (`edf0ae7`). New classes: `a-heave`, `a-swallow`, `a-bubble`.
**Quiz choices are now shuffled per mount** (`Quiz.tsx`); story data still lists the
right answer first, and `answerIndex` is remapped after the shuffle.
Pattern fixed: `Eyelids` over a raw `<image>` must sit in a group scaled the
same way as the image. Evidence: `docs/evidence/2026-09-18-jonah-story-raster/record.md`.

Before that: **David story, six pages, after two user review rounds** (`0219027`…`ceef0fd`).
New strike page (stone flies, giant staggers and collapses; Calm rests on the
outcome), blinks on every face including sheep and lamb, shepherd hill with a
swaying canopy, swaying tufts, three flapping birds and a flock of seven on the
meadow, Goliath re-sheeted bigger and at 0.6 everywhere, soldiers taller than
David, fallen Goliath in the foreground, four soldiers running down the hill.
Pipeline: `find_eyes.py`, `split_tail.py` for any part, `Part`/`Flipbook`/
`Layer delay` in `raster.tsx`. Evidence: `docs/evidence/2026-09-18-david-story-raster/record.md`.

**Incident, fixed:** `8273eb5` shipped `motion.css` with blinks, wing flips
and tail flicks deleted, because a string-sliced edit matched the vector
scene's old `stone-fly` keyframe first. Restored in `7e3072d`. Rule from now
on: edit `motion.css` with `Edit` on a unique anchor, never by first-match
slicing; and after any stylesheet edit, run `document.getAnimations()` on a
migrated page and check the animation names are all present.

Before that: **David story fully raster** (five pages). Three of five stories done.

- David (`8eb18a8` sheets + 17 layers + plan, `ad679d7` compositions): David,
  Goliath and Saul sheets; shepherd's flock reuses the Noah sheep; armour pile
  regenerated once (helmet had a face). Sling split-and-spin idea dropped: the
  generated loop circles David's head. All five compositions accepted first
  pass. Evidence: `docs/evidence/2026-09-18-david-story-raster/`.
- **Standards gap, stated on the user's question:** TDD never satisfied (no
  test runner installed); lint/format/secret scan/audit never installed; the
  David, dove and tail diffs got an inline roast, not a separate adversarial
  pass. Recommended next increment: install Vitest, ESLint (security plugin),
  Prettier, staged secret scan, `npm audit` on demand; wire into the hook;
  prove each fails; add unit tests for `tone.ts`, `Layer`/`Tail` geometry,
  `inlinePng`, hotspot data invariants. ~2–3 hours, before Jonah.

Before that: **Noah story fully raster** (five pages) plus a dove at Daniel's window.

- Dove at the window (`e7d9868`): two dove frames flip-book through
  `.a-frame-a/.a-frame-b`, glide on the `fly` path, clipped to the window.
  Manifests may now carry sheet-less layers.
- Noah (`b8e438a` assets, `1419e5a` plan, `2000f53` compositions + hotspots):
  Noah sheet, 19 layers, all first-generation. `FlappingDove` in `noah.tsx`
  reuses the prays frames for the two-by-two pair; the flood keeps the vector
  `Rain` overlay and rocks the ark; Noah leans over the bow for the olive-branch
  dove. `shoot.mjs` loops over every migrated story (`STORY=<id>` to limit).
- Evidence: `docs/evidence/2026-09-18-noah-story-raster/` (story sheet, five
  renders, raw sheets, 15 browser shots, offline check, frame probe).

Before that: **the whole Daniel story is raster.**

- Plan + manifests `e1b811a`; pipeline `background.reuse` + angel/official
  sheets `086daea`; assets per scene `91c7851` `e883a61` `11a3d5f` `89a935d`.
- `8bf856a`: cutout matte switched from rembg to a chroma mask (rembg ghosted
  a figure behind another); every cutout regenerated; rembg dropped from
  requirements.
- `7301975`: `prays`, `trap`, `angel`, `rejoice` composed from layers, hotspot
  coordinates moved, `shoot.mjs` loops over all five pages.
- Tail flicks: `design/pipeline/split_tail.py` splits a lion cutout into
  body + tail by polygon; `Tail` in `src/art/raster.tsx`; `.a-tail-flick-tr`
  / `-tl` in `motion.css` (still for 78% of a 9 s cycle, then two swishes,
  pivot at the root corner). Five lions across den and angel, offsets 0/3/6
  and 2/5 s.
- Evidence: `docs/evidence/2026-09-18-daniel-story-raster/record.md`
  (15 browser shots, offline check on the angel page, frame probe 34.2 ms at
  4x throttle, story total 1,030 KB, mid-flick screenshot).

Earlier in the session (vector slice, now superseded but kept):

- Local gate: `.githooks/pre-commit` runs `npm run check:motion` (renders all
  scenes, fails on an `a-*` class sharing an element with a `transform`
  attribute or an inline `transform-origin`) then `npm run build`. Proven both
  ways. Activation: `git config core.hooksPath .githooks`.
- `src/art/v2/` vector kit and a hand-built den scene: commits `164aa1d`…`5d578db`.
  Evidence: `docs/evidence/2026-09-18-daniel-den-v2/record.md`.

This slice (layered raster):

- Spec `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md` (`aa22b56`),
  plan `docs/superpowers/plans/2026-09-18-layered-raster-den.md` (`4c45dee`).
  `docs/superpowers/plans/2026-09-18-daniel-den-fidelity.md` is marked SHELVED.
- Tooling (`8dcbb09`): `scripts/compare.tsx` (`npm run compare -- <key> <ref>`:
  full-size render stacked over a reference), `scripts/lib/inline-png.ts`
  (WebP→PNG data URIs so sharp can rasterise), `npm run render`, webp added to
  the workbox precache glob.
- Pipeline (`773ffbc`, `baa1b3f`): `design/pipeline/{gen,gen_character,gen_scene_layers,cutout,pack}.py`,
  `README.md`, `requirements.txt`, scene manifest `design/pipeline/scenes/daniel-den.json`.
  Character sheets `design/characters/{daniel,lion,king}.png` with sidecars.
  Shipped assets `src/assets/scenes/daniel/den/{bg,daniel,lion-a,lion-b,king}.webp` + `layers.json`,
  243 KB total against a 450 KB budget.
- Scene (`26887f9`): `src/art/raster.tsx` (`Backdrop`, `Layer` with `flip`, `Eyelids`),
  `IntoTheDen` recomposed from layers with the v2 `LightShaft`, `Motes`, `Grain`, `SoftShadow` on top.
- Docs (final commit of the session): `CLAUDE.md` media rule replaces the
  ship-nothing-binary rule; layout, adding-a-story and verifying sections
  updated; this handoff.

Verification actually run (details, hashes, numbers in
`docs/evidence/2026-09-18-layered-raster-den/record.md`):

- Comparison gate: four cycles, T1–T11 pass at cycle 04 (`cycle-04.png`).
- Browser shots at phone, tablet, Calm, hotspot-found, big mode: all correct.
- Offline: reload with network Offline renders the scene; all six images and
  the index come from the service worker cache (`15-den-offline.png`).
- Frame cost at 4x CPU throttle on the production build: 33.3 ms avg, max
  33.8; same floor as before, tighter tail.
- `check:motion` 26 clean, typecheck and build green on every commit.

## 3. Current State

- **Git Branch:** `main`, HEAD is the docs commit after `26887f9`
- **Uncommitted changes:** `design/concept-art/` untracked (six concept JPEGs,
  generator, README; ~5 MB). User asked to store them, never asked to commit.
- **Environment / key config:** Node v24.13.0, npm 11.6.2, Vite 8.3.0, esbuild
  0.28.2; Python 3.14 with google-genai, Pillow, rembg, onnxruntime.
  `GEMINI_API_KEY` in the user's environment, billing enabled. Hooks path
  `.githooks`. Background processes possibly still running from this session:
  Vite dev :5173, Vite preview :4173, headless Chrome :9222 (scratch profile).
  The DevTools MCP default browser profile has a stale service worker for
  `localhost:4173` from another project; use isolated contexts there.

## 4. Next Steps

- [ ] **User reviews** `docs/evidence/2026-09-18-layered-raster-den/cycle-04.png` and `browser/10-den-phone.png`. Go / tune / stop.
- [ ] Decide on `design/concept-art/`: commit or gitignore.
- [ ] Confirm licensing stance for Gemini-generated art in a published app.
- [x] Daniel story fully migrated (five pages). Observed cost: 2 sheets + 12 layers in 14 Gemini calls,
      zero regenerations, ~2.5 hours including the matte fix and tails. Per story of five scenes: expect
      ~15 calls and 2–3 hours. Remaining 21 scenes across four stories ≈ 10–14 hours.
- [ ] **User reviews the story**: `docs/evidence/2026-09-18-daniel-story-raster/story-sheet.png` and the
      phone shots under `browser/20-*`. Then the Daniel story is releasable on its own merits; the other
      four stories are still flat vector until migrated.
- [x] Noah migrated (five pages, one Gemini call per layer, ~1.5 hours).
- [ ] **User reviews Noah**: `docs/evidence/2026-09-18-noah-story-raster/story-sheet.png`, `phones.png`.
- [x] David migrated (five pages, 17 layers, one regeneration, ~1.5 hours).
- [ ] **User reviews David**: `docs/evidence/2026-09-18-david-story-raster/story-sheet.png`, `phones.png`.
- [ ] **Gate increment (recommended before Jonah):** Vitest, ESLint + security plugin, Prettier, staged
      secret scan, `npm audit` on demand; hook wiring; prove each fails; first unit tests on pure seams.
- [x] Jonah migrated (five pages, 21 layers, no regeneration, one review round).
- [ ] **User reviews Jonah**: `docs/evidence/2026-09-18-jonah-story-raster/story-sheet.png`, `phones.png`.
- [x] Creation migrated (six pages) and the vector kit deleted; `check:motion` 27 clean, build green.
- [ ] **User reviews Creation**: `docs/evidence/2026-09-18-creation-story-raster/story-sheet.png`, `phones.png`.
- [ ] **Migration complete → release checklist**: gate increment (test runner, lint + security plugin,
      format, staged secret scan, `npm audit`), the tablet-landscape crop decision (sun/moon and the den
      king sit above y=225), the licensing stance on generated art, `design/concept-art/` tracked or
      ignored, a real-phone performance check, and human review of every story.
- [ ] Optional prune: unused exports in `src/art/base.tsx` (Moon, Clouds, Hills, Sea, Rainbow,
      LightRays, GrassTufts, Rocks); `scripts/shoot.mjs` shots 3, 4, 9 still reference old routes by number.
- [ ] Blinks on the other Daniel pages (prays Daniel, trap king, rejoice king): measure pupils on the
      cutouts with the grid trick, add `Eyelids`.
- [ ] Library thumbnails: covers use scene art; check the card size once a story is fully raster.
- [ ] Bundle strategy: 26 scenes × ~250 KB ≈ 6.5 MB precache. Under the ~12 MB line in the media rule,
      but measure first-load on Fast 3G before deciding on precache-first-story.
- [x] Lions blink, staggered (done after user review; `Eyelids` has a `delay` prop). Tail sway would need tails as separate cutouts.
- [ ] Fix or decide the tablet-landscape crop (letterbox vs vertical safe zone).
- [ ] Delete `src/art/v2/{den,lion,person}.tsx` once no scene uses them (`effects.tsx` stays).
- [ ] Missing gates as a separate task: lint with security rules, format, test runner, secret scan, dependency audit.

## 5. Active Blockers & Notes

- **Release state.** All five stories are raster and consistent. Releasable on art; the open items are
  the gates, the tablet crop, licensing and human review.
- **Evidence gaps** are listed in the record: no failing-test-first artifact, unknown lint/format/secret/audit, emulated perf only, no human review yet.
- **Pipeline lessons** (already fixed in code): key the green field *after* rembg and intersect alphas, never before; keep one Gemini client per process; decode `inline_data.data` with PIL, the SDK's image wrapper is not PIL.
- **Compare tool is the acceptance test.** Judge art from `npm run compare`, never from the 500 px contact sheet.
- **Narration** costs frames while speaking (word highlighting), independent of art.
