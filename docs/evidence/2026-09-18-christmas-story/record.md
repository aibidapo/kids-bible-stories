# Evidence record: The First Christmas (Life of Jesus, story 1)

## Scope

Roadmap phase 4, first story. Owner: "Start phase 4, ensure the graphics
are very rich and detailed." Spec
`docs/superpowers/specs/2026-09-18-life-of-jesus-design.md`, plan
`docs/superpowers/plans/2026-09-18-christmas-story.md` (roast inline).

## Artifact identity

- Six pages: `christmas/angel`, `journey`, `stable`, `shepherds`, `visit`,
  `wisemen`. Story data `src/data/stories/christmas.ts` (both levels,
  hotspots, find-games, five quiz questions, Luke 2:11 NIV, devotional).
  Scenes `src/scenes/christmas.tsx`. Registered in `src/scenes/index.ts`
  and `STORIES`; the library now lists six stories, 33 pages.
- Character sheets (new): `mary`, `joseph`, `shepherd`, `wise-men` (three
  in one sheet), `innkeeper`; the Daniel `angel` sheet reused for Gabriel
  and the host. `character-sheets.png`.
- Generation: `gemini-3-pro-image-preview`; backgrounds at **2K** (new
  `size` support in `gen_scene_layers.py` and `gen_character.py`),
  cutouts at 1K. Sidecars for the six backgrounds copied here; every asset
  has one under `design/pipeline/raw/christmas/` (gitignored).
- Calls: 5 sheets + 6 backgrounds + 25 cutouts = 36 first pass; 2
  regenerations attempted (gifts with faces, Mary with a doorway), **both
  refused: the Gemini prepaid credit ran out (429 RESOURCE_EXHAUSTED)**
  after the first pass. Fallbacks below.

## Sizes (`layers.json`)

| Page | background | cutouts | scene |
|---|---|---|---|
| angel | 88 KB | 3 | 219 KB |
| journey | 122 KB | 3 | 287 KB |
| stable | 104 KB | 5 | 335 KB |
| shepherds | 81 KB | 5 | 343 KB |
| visit | 151 KB | 4 | 369 KB |
| wisemen | 87 KB | 3 | 334 KB |

Story total 1890 KB; every scene under the 450 KB budget;
every background under the 250 KB line. `wise-men.webp` is 134 KB, over
the 80 KB per-cutout guideline because it holds three figures; accepted.
Precache after this story: 158 entries, 7.84 MB (budget 12 MB). JS bundle
82.2 KB gzip.

## Richness recipe applied

2K backgrounds, prompts naming materials and incidental details, six to
nine layers per page with props and animals as their own cutouts.
`detail-compare.png` puts a crop of Daniel page 1 (1K, first generation)
beside a crop of the stable page at the same scale.

## Review of the raw layers

All 25 cutouts accepted first pass for figure quality and chroma key. Two
prop misses, both the model giving objects faces: the journey lantern
(dropped; the hotspot uses the background's own lantern) and the wise men's
gifts (dropped; the men hold their gifts, the hotspot points at the
kneeling man's). Mary on the wise-men page came with her own stone doorway
although the background has a door; she is scaled so her frame stands in
for the background's door. A frameless regeneration is queued for when
credit returns.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Story data invariants | 37 tests incl. the new story: art keys registered, hotspots on stage, quiz answers in range, both levels, devotional, verse | suite |
| Full suite, typecheck, lint | 148 tests; `tsc -b` clean; lint 0 errors | hook |
| `check:motion` | 33 scenes clean | hook |
| Full-size renders | six pages, `christmas-*.png`; hotspots retuned to the rendered positions | this folder |
| Browser, fresh context, phone | stable page on `index-DDivc8dM.js`, 6 layers, 38 animations, baby hotspot ringed with its reward | `stable-hotspot-phone.png` |
| Browser, tablet | stable page letterboxed | `stable-tablet.png` |
| Performance budgets | run 1 (`perf.txt`) flagged cold-load LCP 2028 ms and first tap 251 ms while the DevTools browser was loading the same page on this machine; run 2 alone (`perf-run2.txt`): LCP 844 ms, first tap 111 ms, warm tap 41 ms, page turn 207 ms, quiz tap 53 ms, frame median 16.7 ms, all within budget. LCP is up from 748 ms because the first-visit precache grew to 7.84 MB; download-a-story (before story 3) is the planned fix | `perf.txt`, `perf-run2.txt`, `perf-run2.json` |
| Bundle budgets | 82.2 KB gzip, 7.84 MB precache | hook |

## Gaps

- Credit restored and the two regenerations done (follow-up below).
- No human review of the six pages yet (`christmas-*.png`, then the app).
- The Jesus-depiction decision for story 2 onward is still the owner's.
- Download-a-story ships before story 3 (precache would pass 12 MB).
- Real-device check open, as for every story.

## Follow-up: credit restored, two regenerations done

The owner topped up the Gemini prepay; the API kept answering 429 for
about twenty minutes, then the retry loop succeeded (21:2x). `mary-child`
regenerated without a doorway (344×800, 44 KB) and stands in the
background's doorway at scale 0.42; `gifts` regenerated with "inanimate,
no faces" (672×350, 50 KB) and is back as its own layer and hotspot
(56 %, 92 %) in front of the kneeling king. Scene 382 KB. Cutouts on green
`wisemen-regenerated-cutouts.png`; sidecars `mary-child-sidecar.json`,
`gifts-sidecar.json`; render `christmas-wisemen.png` replaced; browser
still `wisemen-hotspot-phone.png`. Motion 33 clean, data tests pass.
Total calls for the story: 38.
