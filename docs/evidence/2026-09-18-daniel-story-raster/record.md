# Evidence record: Daniel story, layered raster (pages 1, 2, 4, 5)

## Scope

Task: migrate `daniel/prays`, `daniel/trap`, `daniel/angel`, `daniel/rejoice`
to layered raster art so the whole Daniel story is one style. Follow-ups in
the same session: staggered lion blinks (den), tail flicks on every awake and
sleeping lion (den, angel).

Plan: `docs/superpowers/plans/2026-09-18-daniel-story-raster.md`
Spec: `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md`
Den slice record: `docs/evidence/2026-09-18-layered-raster-den/record.md`

Gate inventory: unchanged from the den record (hook: `check:motion` + build;
comparison gate; lint/format/tests/secret scan/audit absent; coverage and
mutation inapplicable).

## Artifact identity

- Branch `main`. Commits: `e1b811a` plan + manifests, `086daea` pipeline
  `reuse` + angel/official sheets, `91c7851` `e883a61` `11a3d5f` `89a935d`
  assets per scene, `8bf856a` chroma-mask matte + all cutouts regenerated,
  `7301975` four compositions + hotspots + shoot loop, then the tail-flick
  commit and this record's commit.
- Browser evidence tested at `7301975`: `dist/assets/index-BWSDHTUr.js`,
  18 webp assets in `dist/assets`, served by `vite preview --port 4173`.
- Story assets on disk after `7301975` (bytes per `layers.json`): prays
  131,586; trap 234,190; den 222,842; angel 158,256 (background reused from
  den, counted once); rejoice 283,114. Story total 1,030 KB, `du` of the five
  folders 1,040 KB. Every scene under the 450 KB budget; every cutout ≤ 80 KB
  after quality 85.
- Generation: `gemini-3-pro-image-preview`, 2 sheets + 12 layers, all accepted
  on the first generation. Sidecars under `design/pipeline/raw/daniel/*/`
  (not committed) and `design/characters/*.json` (committed).

## Environment

As the den record, minus rembg (removed from the pipeline; see Review).
DevTools MCP browser: the offline check and frame probes ran in a fresh
isolated context `daniel-story` with every other page closed.

## Procedures and results

| Check | Procedure | Result | Evidence |
|---|---|---|---|
| Raw layer review | one review sheet per scene | all 12 accepted, no regeneration | `raw-prays.png`, `raw-trap.png`, `raw-angel.png`, `raw-rejoice.png` |
| Composition gate | `npm run compare` per scene, four cycles | all four pass: characters match sheets, read as one book with the den | `cycles.md`, `story-sheet.png`, `<scene>-render.png` |
| Cutout matte | dark-field inspection; crowd alpha histogram | rembg ghosted the back figure (100% of the torso under alpha 200); chroma-mask matte fixed it | `cycles.md` cycle 02–03 |
| Motion constraints | `npm run check:motion` | 26 scenes clean on every commit | hook output |
| Typecheck + build | hook | green on every commit | commit history |
| Browser: phone, all five pages | `shoot.mjs` 20-* | every page renders, rings on targets | sha256: prays 747afe7f657d181e, trap 7db6f018feba4397, den 9ca130d6f379de2a, angel 22a3d670963de5d6, rejoice 579326ef48db2c95 |
| Browser: tablet, all five pages | `shoot.mjs` 21-* | layers positioned; top crop as known | 3f93dc45b1cb7111, 83580e8076f82739, 2d2bf7c434063316, d447f907483e1a7c, 9ac912678ebecc52 |
| Browser: first hotspot tapped, all five pages | `shoot.mjs` 22-* | every page's first hotspot fires its sticker and bubble | 5b206c2b7ee27469, 125ce3dbf59ce77d, bb2152c6437cc3b1, 77984dbdc3f55f0c, 5085368eb4845d32 |
| Offline | isolated context, SW active, `networkConditions: Offline`, reload angel page, probe every `<image>` and `fetch('/')` | renders; 5/5 images load from cache; index 200 | `browser/23-angel-offline.png` |
| Frame cost, angel page (heaviest: 5 layers, glow, float, sparkles, motes) | rAF sampler, 4x throttle, other pages closed, narration cancelled | all on: avg 34.19 ms, p95 33.8, max 66.9; angel float off: avg 33.33, max 33.9; float back on: avg 34.49 | this record |
| Frame cost, contaminated run | same page while three other animated pages were open in the browser | avg 56–62 ms, p95 100–133: discarded, cause was the other pages | this record |
| Tail split at rest | pixel diff of the angel still before/after splitting tails into their own layers | bbox (430,354)–(888,614), 0.008% of pixels differ by more than 8/255: rest frame unchanged | this record |

## Review

Automated: `check:motion`, `tsc -b`, Vite build per commit.

Visual (agent): the five pages read as one book; character faces match their
sheets across poses; hotspots land on their targets on phone and tablet.

Findings and disposition:

- rembg alpha matting ghosted a figure standing behind another (crowd).
  Replaced by a chroma-mask matte with a one-pixel soft edge; every cutout in
  the story regenerated from the raws; `rembg`/`onnxruntime` dropped from
  `requirements.txt`.
- Three cutouts exceeded the 80 KB guideline at quality 88 (king-throne 85,
  king-run 86, crowd 89 KB). Quality 85 brings all under 80 KB.
- The angel cutout grew from 745 to 900 px tall with the new matte (the full
  wing glow survived), so the angel's scale was lowered from 0.52 to 0.45.
- Plan deviation: the four compositions and the hotspot moves went in one
  commit (`7301975`) rather than one per scene. Recorded here.

Human review: not performed on these four pages. User reviewed and approved
the den page earlier in the session.

## Gaps

- All gaps from the den record still apply (no test runner, unknown
  lint/format/secret/audit, emulated perf only, tablet-landscape crop).
- No blink on Daniel in `prays` (face in three-quarter view, pupils not
  measured) or on the king in `trap`/`rejoice`, or on the officials. Only the
  den has blinks.
- The angel scene's `lions` hotspot sits on the peeking second lion, not the
  large front one; both are "the sleeping lions" so the label holds.
- Tail flick verified at rest by pixel diff and mid-flick by a scrubbed
  browser screenshot (see the tail commit's note in `cycles.md`); the flick's
  feel at real speed has not been reviewed by a human.
- Licensing stance on generated art still the user's call.
