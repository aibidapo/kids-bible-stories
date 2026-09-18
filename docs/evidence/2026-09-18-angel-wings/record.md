# Evidence record: angel wings beat slowly (Daniel, page 4)

## Scope

User requests: "In Daniel's story on scene 4, can we have the angel's wings
flap slowly making it look realistic," then "The angel wings should simulate
flapping forwards and back slowly." Page `daniel/angel` (`#/story/daniel/3`).

## What changed

- `design/pipeline/split_part.py` (new): generalises `split_tail.py` to any
  named part; a second split starts from the current body so several parts
  can come off one cutout. Records `cutouts.<name>.parts.<part>` in
  `layers.json` with size, offset, root and polygon.
- `src/assets/scenes/daniel/angel/`: `angel-wing-l.webp` 16 KB,
  `angel-wing-r.webp` 15 KB, `angel-body.webp` 41 KB. Polygons were read off
  a 50 px grid over the cutout; the first cut of the right wing took a sliver
  of hair at its top (polygon x=440), redone from the original at x=456.
  Original `angel.webp` (64 KB) stays as the source but is no longer
  imported, so it is not bundled.
- `src/scenes/daniel.tsx`: the angel is a `<g className="a-float">` holding
  two `Part`s (`a-wing-l`, `a-wing-r`) drawn behind the body `Layer`, all
  three anchored at (500, 496) scale 0.45 so they line up pixel for pixel.
- `src/styles/motion.css`: the unused vector-era `wing-l` / `wing-r`
  keyframes (±4/12° in-plane rotate at 3 s) replaced. First pass was a
  slower in-plane rotate (2.5° / −6° at 5 s); after the second request the
  beat is forward-and-back: `scaleX(1) → scaleX(0.5)` about the shoulder
  pivot with a ±1.5° / ∓4° tilt, 5 s ease-in-out, so each wing foreshortens
  toward the body as it sweeps forward. Pivots unchanged (100% 35% and
  0% 35%). Two anchored replacements; keyframe count 44 throughout,
  blink/frame/tail rules present.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Part sheet | wings cleanly separated, no hair or sleeve in either wing | scratchpad `angel-parts.png` (not kept); right-wing corner re-checked at 4× |
| `npm run check:motion` | 27 scenes clean (wing parts: transform on outer group, class on inner) | hook output |
| `tsc -b`, build | green; final bundle `index-RTbREFnM.js`, JS 77.5 KB gzip | hook output |
| Calm still frame | `npm run render`: angel whole, wings joined at rest | `angel-calm-render.png` |
| Browser, fresh isolated context | first build `index-BLfE6PjJ.js`, then `index-RTbREFnM.js` after a cache-ignoring reload; animations running: `wing-l` 1, `wing-r` 1, `float` 15; wing pivots at 219 px / 0 px × 231 px (35 % of 660) | evaluate output in session |
| Mid-beat still (forward pose) | animations paused, wings scrubbed to 2.5 s: computed transform `matrix(0.4988, ∓0.0349, ±0.0698, 0.9976, 0, 0)`, wing width 40 px at phone scale; no gap at the shoulders | `angel-midbeat-phone.png` |
| Quarter-beat still | wings at 1.25 s, half-way through the sweep | `angel-quarterbeat-phone.png` |
| Tablet still | from the first (rotate-only) pass; shows the tablet crop, not the final beat | `angel-midbeat-tablet.png` |
| Unit tests + thresholds | 84 passed, thresholds hold | hook output |

## Notes and gaps

- At 1024×768 the stage crops the angel's head (the known tablet-landscape
  limit, y < 225). Pre-existing, not changed here; visible in the tablet shot.
- Wing pixels behind the sleeves stay in the body layer by design (the
  sleeve covers them). At the 6° extreme no gap showed at the shoulder in
  the stills; a true frame-by-frame check on a phone is still open.
- No human review of the final motion yet. Period 5 s, forward sweep to
  half width. Depth and speed are two numbers in `motion.css` (`scaleX` at
  50 % and the animation duration).
- Debt: `split_part.py` repeats the matte/crop logic of `split_tail.py`
  (about 25 lines). Next time either script changes, make `split_tail.py` a
  thin call into `split_part.py` with `part="tail"`.

## Follow-up: third lion

User: "In the 4th scene of Daniel, what happened to the 3rd lion?" The den
page draws three lions; the angel page had only two since its first
composition (a continuity miss, visible in the original
`daniel-story-raster/angel-render.png`). Added a third sleeper from
`lion-asleep-b` (unflipped, head toward Daniel) at (118, 612) scale 0.34,
drawn before Daniel so he covers its head, own shadow, tail flick delay
3.5 s, breathe delay 1.2 s. No new art. Full-size render
`angel-three-lions-render.png` (`npm run compare`); motion check, tests and
build through the hook.
Then, on request, Daniel moved from x 300 to x 340 (shadow and sparkle with
him) to sit centred between the left lion's head and the middle lion; no
hotspot sits on Daniel on this page, so story data is unchanged.
`angel-three-lions-render.png` is the final render.
