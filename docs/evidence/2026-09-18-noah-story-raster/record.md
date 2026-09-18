# Evidence record: Noah story, layered raster (all five pages)

## Scope

Task: migrate `noah/builds`, `noah/two-by-two`, `noah/flood`, `noah/dove`,
`noah/rainbow` to layered raster art. Plan:
`docs/superpowers/plans/2026-09-18-noah-story-raster.md`. Machinery and gate
inventory as the Daniel records (`docs/evidence/2026-09-18-layered-raster-den/record.md`,
`docs/evidence/2026-09-18-daniel-story-raster/record.md`).

## Artifact identity

- Branch `main`. Commits: `b8e438a` Noah sheet + manifests + 19 layers,
  `1419e5a` plan, `2000f53` compositions + hotspots + shoot loop, then the
  record commit.
- Browser evidence tested at `2000f53`: `dist/assets/index-JxDzmBlX.js`,
  served by `vite preview --port 4173`. Confirmed in-page on the two-by-two
  route: bundle `index-JxDzmBlX.js`, 11 SVG `<image>` elements, 14 animations,
  service worker active.
- Story assets (bytes per `layers.json`): builds 183,798; two-by-two 416,794;
  flood 165,532; dove 140,886; rainbow 238,962. Story total 1,146 KB (`du`
  1,185 KB). Every scene under 450 KB; two-by-two is the largest in the book at
  407 KB. `family.webp` is 82 KB, 2 KB over the per-cutout guideline; accepted.
- `dist` 2,586 KB; 43 webp entries in the precache manifest; JS 77.6 KB gzip.
- Generation: `gemini-3-pro-image-preview`; 1 sheet + 19 layers, one call
  each, no regeneration. Sidecars under `design/pipeline/raw/noah/*/` (not
  committed) and `design/characters/noah.json` (committed).

## Environment

As the Daniel story record. DevTools MCP probes in a fresh isolated context
`noah-story` with every other page closed; an earlier attempt in the old
`daniel-story` context hit its stale service worker (old bundle, zero raster
images) and was discarded.

## Procedures and results

| Check | Procedure | Result | Evidence |
|---|---|---|---|
| Raw layer review | one sheet per scene | 19/19 accepted first generation | `raw-*.png` |
| Composition gate | `npm run compare` per scene, three cycles | all five pass | `cycles.md`, `story-sheet.png`, `*-render.png` |
| Motion constraints | `npm run check:motion` | 26 scenes clean on every commit | hook |
| Typecheck + build | hook | green | commit history |
| Browser: phone ×5 | `STORY=noah node scripts/shoot.mjs` 20-* | every page renders; rings on targets | sha256: builds cc85d573462b8239, two-by-two e09733edbc00b852, flood 23073aa3a3d8f11e, dove b7a9ce75245d97ba, rainbow f7f6cb487cdd4a31; `phones.png` |
| Browser: tablet ×5 | 21-* | layers positioned; top crop as known | afee26a6177a1ee8, 5c9f087ad14071a6, ee3d1e6d9b5bbe0e, 4919f4fa68d414ec, 51326fe9bdf0afee |
| Browser: first hotspot ×5 | 22-* | every page's first hotspot fires its sticker or bubble | 66679bfa15832af0, 64285242ad6da612, 5d0f7da5178ec577, 9331a65ff8888607, 61d1ad760de0a561; `hotspots.png` |
| Offline | isolated context, SW active, Offline, reload two-by-two, probe every `<image>` and `fetch('/')` | renders; 11/11 images from cache; index 200 | `browser/23-two-by-two-offline.png` |
| Frame cost, two-by-two (11 images, 14 animations) | rAF sampler, 4x throttle, other pages closed, narration cancelled | 120 frames, avg 33.33 ms, p95 33.7, max 34.0 | this record |

## Review

Automated: `check:motion`, `tsc -b`, Vite build per commit.

Visual (agent): five pages read as one book with Daniel; Noah matches his
sheet across five poses; animal pairs consistent in style.

Findings and disposition: Noah blocked the ark door (moved to the ramp foot);
Noah hidden behind the cabin, then behind the bow (moved to lean over the
hull's top edge, cutout's hard bottom hidden). No pipeline changes needed.

Human review: not performed on these pages.

## Gaps

- All gaps from the Daniel records still apply.
- No blinks on the Noah pages (pupils not measured).
- The flood's sea does not move; only the ark rocks and the vector rain falls.
- Tablet-landscape hotspot mapping: percentages are of the cropped frame, so
  a hotspot placed for the phone (full height) lands lower on tablet (e.g. the
  flood ark ring sits under the hull there). Pre-existing Stage behaviour.
- Licensing stance on generated art still the user's call.
