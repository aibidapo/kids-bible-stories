# Evidence record: Daniel page 2, a more royal palace

## Scope

User: "For the second scene in Daniel's story, can we make the palace look
more royal and elegant?" Page `daniel/trap` (`#/story/daniel/1`). Only the
background was regenerated; the three cutouts (king on throne, two
officials) are unchanged.

## What changed

- `design/pipeline/scenes/daniel-trap.json`: background prompt rewritten
  (marble columns with gold bands and gilded lotus capitals, crimson carpet
  with gold border to the dais, glazed blue-and-gold tile with a frieze,
  crimson banners with tassels, gold lamp stands, inlaid floor; dais still
  centre-right and empty, floor in front clear, evening windows kept).
- Old raw kept as `design/pipeline/raw/daniel/trap/bg-v1.{png,json}` (not
  committed, raw is gitignored). New raw `bg.png` generated in one call,
  `gemini-3-pro-image-preview`, sidecar copied here as `bg-sidecar.json`.
- `src/assets/scenes/daniel/trap/bg.webp` 142,964 bytes (was 90,466); scene
  total 286,688 bytes, under the 450 KB budget and the 200 KB background
  line. `layers.json` background bytes updated by hand because `pack.py`
  expects `cutouts.json` from a cutout run and there was none; see gap.
- `src/scenes/daniel.tsx` `TheTrap`: the dais top is higher in the new
  background, so the king moved from (640, 452) scale 0.40 to (712, 392)
  scale 0.37, shadow with him. Officials unchanged on the carpet.
- `src/data/stories/daniel.ts`: king hotspot from (64 %, 52 %) to
  (71 %, 42 %).

## Checks

| Check | Result | Evidence |
|---|---|---|
| Before / after full-size render | `npm run compare` | `trap-before.png`, `trap-after.png` |
| First composition on the new background | throne at the foot of the steps; moved onto the dais | (superseded render, not kept) |
| Browser, phone viewport, fresh build | king hotspot ring over the king | `trap-hotspot-phone.png` |
| Motion check, tests, thresholds, build | through the pre-commit hook | commit output |

## Gaps

- `pack.py` cannot repack a scene when only the background changed; it
  needs `cutouts.json` from `cutout.py`. Worth a `--bg-only` path next time
  a background is redone. Bytes were patched by hand this time.
- One generation, accepted on first look; no second candidate compared.
- No human review yet of the new background against the rest of the story
  (den and prays pages are plainer stone; the palace is now the richest
  room in the book, which fits the story).
