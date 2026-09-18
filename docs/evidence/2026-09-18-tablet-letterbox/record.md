# Evidence record: tablet letterbox and hotspot layer (roadmap phase 2b)

## Scope

Plan `docs/superpowers/plans/2026-09-18-tablet-letterbox.md` (roast inline).
Owner chose the letterbox option. Two changes in `Stage` and `app.css`, no
scene edits:

1. **Letterbox.** `.stage` is a size container; `.stage__frame` width is
   `min(100%, 160cqh)` (portrait override `133.34cqh` for the 4:3 frame),
   after a plain `width: 100%` fallback. On a height-limited landscape frame
   the picture keeps 16:10 and nothing is cropped.
2. **Hotspot layer.** Hotspots moved into `.stage__spots`, positioned in the
   frame with width `max(100%, 160cqh)` and centred, which is exactly the
   art's rendered box under `xMidYMax slice`. Hotspot percentages are now
   art coordinates on every frame shape. Before this, on a portrait phone a
   hotspot at x 23 % sat about 4.5 % off its art position (pre-existing).

## TDD

`src/components/Stage.test.tsx` written first: hotspots render inside
`.stage__spots` with their percentages; viewBox and `slice` unchanged. Red
(`tdd-red.txt`: layer null), then green after the wrapper (`tdd-green.txt`,
97 tests). Two test-side fixes on the way: the regex expected a second
closing tag, and the counter matched the ring and tick spans.

## Browser measurements (fresh isolated context, build `index-3Ud6D_ow.js`)

| Frame | Result |
|---|---|
| 1024×768 | stage row 1000×410; frame 656×410, ratio 1.600; spots layer 656×410 at 0; den king hotspot centred at (328, 33) inside the frame; the whole den incl. the king at the opening visible (`den-tablet-after.png`, compare the cropped `docs/evidence/2026-09-18-daniel-story-raster/browser/11-den-tablet.png`) |
| 390×844 | frame 477×358 ratio 1.333 (unchanged); art box from x −48 to 525 = 573 wide; spots layer 573 wide at −48: identical to the art box (`den-phone-after.png`) |

## Gate: 27-page tablet re-shoot

`BASE=http://localhost:4173 OUT=scratch/ui-letterbox node scripts/shoot.mjs`
against build `index-3Ud6D_ow.js`, headless Chrome on :9222, all five
stories: 27 `21-*-tablet.png` at 1024×768, no page errors logged. Contact
sheet `tablet-sheet.png` (5 columns, page id under each). Reviewed: every
page shows the whole 16:10 picture; the previously cropped subjects are
present (den king at the opening, trap king and throne crest, the angel's
head, the sun and moon on creation-3). Frame width varies by page with the
text below it (pages with a find-game prompt get a slightly smaller
picture); accepted, the picture is never cut.

## Gaps

- Container query units need Chrome 105+ / Safari 16+; older browsers keep
  the previous behaviour (crop) because the `width: 100%` fallback stays.
  Not tested on an old browser.
- The letterboxed picture is smaller on a tablet (656 px wide on 1024). The
  owner chose this over cropping; a safe-zone re-composition remains an
  option later.
- No real-device check yet.
