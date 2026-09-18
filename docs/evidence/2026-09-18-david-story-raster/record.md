# Evidence record: David story, layered raster (all five pages)

## Scope

Task: migrate `david/shepherd`, `david/taunt`, `david/volunteers`,
`david/stones`, `david/victory` to layered raster art. Plan:
`docs/superpowers/plans/2026-09-18-david-story-raster.md`. Machinery and gate
inventory as the Daniel and Noah records.

## Artifact identity

- Branch `main`. Commits: `8eb18a8` sheets + manifests + 17 layers + plan,
  `ad679d7` compositions + hotspots + shoot loop, then the record commit.
- Browser evidence tested at `ad679d7`: `dist/assets/index-C4FTme_w.js`,
  served by `vite preview --port 4173`. Confirmed in-page: bundle
  `index-C4FTme_w.js`, service worker active, 4 raster images on the
  volunteers page.
- Story assets (bytes per `layers.json`): shepherd 137,326; taunt 207,758;
  volunteers 214,090; stones 231,706; victory 181,020. Story total 972 KB
  (`du` 1,032 KB). Every scene under 450 KB; every cutout ≤ 81 KB
  (goliath-taunt and goliath-loom at 81 KB, 1 KB over the guideline, accepted).
- `dist` 3,590 KB with three stories migrated.
- Generation: `gemini-3-pro-image-preview`; 3 sheets + 17 layers, one
  regeneration (armour-pile: first helmet had a face inside it).

## Environment

As the Noah record. Probes in a fresh isolated context `david-story`.

## Procedures and results

| Check | Procedure | Result | Evidence |
|---|---|---|---|
| Raw layer review | one sheet per scene | 16/17 accepted; armour-pile regenerated once | `raw-*.png`, `character-sheets.png` |
| Composition gate | `npm run compare` per scene | all five pass on the first composition | `cycles.md`, `story-sheet.png`, `*-render.png` |
| Motion constraints | `npm run check:motion` | 26 scenes clean | hook |
| Typecheck + build | hook | green | commit history |
| Browser: phone ×5 | `STORY=david node scripts/shoot.mjs` 20-* | every page renders; rings on targets | sha256: shepherd 82119278b2955380, taunt 1580f7fbbd259578, volunteers 6fe7b7a36131ff53, stones 576bb3fdf727a431, victory 02e41b18464f4219; `phones.png` |
| Browser: tablet ×5 | 21-* | layers positioned; Goliath's crest cropped at the top as expected | 6cefc9dfc5b279a2, e5fc6cc38c61d2cf, 9fbd0caa72ecf1b8, 868763b452f5b268, d3b6d3aa83b4d7fc |
| Browser: first hotspot ×5 | 22-* | every page's first hotspot fires its sticker and bubble | 573cdcd25f00e3e9, 024ccf6d7b8ced6d, afb6352f996a25ef, 55da086cff6ae83c, 26a2b4f02143fc42; `hotspots.png` |
| Frame cost | rAF sampler, 4x throttle, narration cancelled | 120 frames, avg 33.33 ms, p95 33.7, max 33.9 | this record |
| Offline | Offline, reload, probe every `<image>` and `fetch(`/`)` | renders; 3/3 images from cache; index 200. Note: the story autoplayed from page 2 to 4 during the check, so the probe ran on the victory page. | `browser/23-volunteers-offline.png` |

## Review

Automated: `check:motion`, `tsc -b`, Vite build per commit.

Visual (agent): five pages read as one book with Daniel and Noah; David,
Goliath and Saul match their sheets across poses.

Findings and disposition: the plan's sling-split idea was dropped before
implementation because the generated loop circles David's head; recorded in
the plan and the unused `.a-whirl` classes were removed before commit. The
adversarial review of this story's diff was inline in the plan, not a
separate roast pass; noted as a process gap in the handoff.

Human review: not performed on these pages.

## Gaps

- All gaps from the earlier records still apply (no test runner, unknown
  lint/format/secret/audit, emulated perf only, tablet-landscape crop,
  licensing stance).
- The sling does not spin; the find-game still targets it.
- No blinks on the David pages.
