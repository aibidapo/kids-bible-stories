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

## Round 2: elegant throne and seated courtiers

User: "Make it richer with a more elegant throne and other officials seated
around the throne; both male and female courtiers." Background kept.

- `king-throne` regenerated from the king sheet: tall arched back with a
  sunburst crest, winged-lion armrests, lapis and ruby inlay, red velvet.
  Old raw kept locally as `king-throne-v1.png`.
- Two new sheet-less layers, `courtiers-left` (woman in teal with a veil,
  man in purple with a tall hat) and `courtiers-right` (man in navy with gold
  trim, woman in rose with a jewelled headband), each a seated pair on a
  gilded bench, 4:3, max height 560.
- First `courtiers-right` had the man in a **dark green robe**; the chroma
  key ate it (`cutouts-round-1.png`, right pair). Regenerated in navy; raw
  kept locally as `courtiers-right-v1-green.png`. Rule added to the pipeline
  README: never green clothing or props.
- Full pipeline run this time (`gen_scene_layers`, `cutout`, `pack`), so
  `layers.json` is tool-written. Scene total 415 KB (budget 450); background
  139 KB; `courtiers-left` 82 KB, 2 KB over the per-cutout guideline,
  accepted as for the Noah family.
- Composition: courtiers on the dais either side of the throne at (590, 400)
  and (855, 402), scale 0.32 (first pass 0.27 read small next to the seated
  king), drawn before the throne so it covers their inner edges, slow
  breathing offset 1.1 s and 2.3 s. King and officials unchanged from round 1.
- Sidecars: `king-throne-sidecar.json`, `courtiers-left-sidecar.json`,
  `courtiers-right-sidecar.json`. Final render `trap-after-court.png`.
- Browser (fresh context, bundle from this build): king hotspot lands on the
  king with the new throne; `trap-court-phone.png`.

## Round 3: courtiers on the floor beside the carpet, facing the room

User: "The courtiers should be seated to the side of the carpets and the
king's throne facing the room, not to the sides."

- Both pairs regenerated facing the viewer straight on (the round-2 pairs
  were turned toward the centre); raws kept locally as
  `courtiers-*-v2-turned.png`. Cutouts clean first time
  (`cutouts-round-3.png`); `courtiers-left` 76 KB, `courtiers-right` 53 KB,
  scene 414 KB.
- Placed at floor level either side of the carpet, in front of the dais:
  left pair (125, 548) scale 0.35, right pair (880, 548) scale 0.36, drawn
  after the king and before the officials. The scroll official moved from
  x 300 to 318 so he no longer hides the purple courtier; his hotspot moved
  from 32 % to 34 %. `trap-after-court.png` replaced with the round-3 render;
  the sidecars replaced with the round-3 ones (round-2 sidecars are in the
  previous commit).
- The first phone still clipped both outer courtiers: the phone stage keeps
  roughly x 90–910 of the viewBox. Pairs moved inward and a step back, left
  (195, 535) and right (815, 535) at scale 0.29; officials shifted right to
  x 355 and 505 so the purple courtier stays visible; scroll hotspot from
  34 % to 38 %. Render and phone still replaced with this layout.
- Browser, fresh context on this build (`index-BlhP43lk.js`): six layers,
  scroll hotspot tapped, both pairs fully inside the phone frame;
  `trap-court-phone.png`.

## Round 4: throne facing the room, courtiers at size, seated naturally

User: "The throne is still to the angle and not facing the room. Also, the
courtiers are seated awkwardly." Then: "The courtiers also look tiny sitting
down."

- Cause: the round-1 background put the dais and carpet on a diagonal into
  the right corner, so the frontal throne cutout still read as angled, and
  straight-on benches sat oddly on that diagonal floor. Background
  regenerated symmetric and straight-on: dais centre-back facing the
  viewer, carpet straight up the middle, matching column rows, three
  windows behind the dais. Raw of the diagonal version kept locally as
  `bg-v2-diagonal.png`. New `bg.webp` 120 KB.
- Courtiers regenerated "sitting naturally, knees bent, feet flat, seen at
  eye level" (`cutouts-round-4.png`); `courtiers-left` 80 KB (rounded, at
  the guideline), `courtiers-right` 60 KB. Scene 399 KB.
- Generation was blocked for ~10 minutes: `generativelanguage.googleapis.com`
  and `www.googleapis.com` timed out on IPv4 and IPv6 through the machine's
  VPN route (gateway 10.5.0.1) while `google.com`, `oauth2.googleapis.com`
  and GitHub answered. A background loop retried once a minute and
  succeeded on attempt 3 at 18:15.
- Layout: king centred at (500, 372) on the platform (first pass at y 392
  sat him on the steps); courtiers at (215, 560) and (785, 560) scale 0.38,
  the officials' scale is 0.42, so a seated courtier is about 65 % of a
  standing official; the pointing official at (440, 608) points right at
  the throne, the scroll official mirrored at (590, 612) faces him, so the
  two conspire over the scroll in front of the king. Both pairs inside the
  phone-safe zone (x 90–910). Hotspots: king 50 % / 42 %, scroll 54 % / 64 %.
- Checks: `check:motion` 27 clean; full-size render `trap-after-court.png`;
  browser fresh context `trap-court-phone.png`; hook on commit.

## Round 5: the king himself faces the room

User: "The king still needs to face the room properly." The round-2 king
cutout had the throne frontal but the king turned to his left with the
raised hand. Regenerated as a formal front portrait: head straight,
shoulders square, eyes on the viewer, feet symmetrical, throne centred and
symmetrical, same worried expression and raised palm. Raw of the turned
version kept locally as `king-throne-v2-turned.png`; cutout 538×700, 59 KB;
scene still 399 KB. Cutout on green `king-throne-round-5.png`; render
`trap-after-court.png` and phone still `trap-court-phone.png` replaced;
sidecar replaced.
