# David Story Raster Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all five David pages (`shepherd`, `taunt`, `volunteers`, `stones`, `victory`) to layered raster art.

**Architecture:** As the Noah plan. Considered and dropped: splitting the sling off David's cutout to spin it. The generated loop circles his head, so a rotated raster loop would sweep through his face. The sling stays part of the cutout; the find-game hotspot still sits on it.

**Spec:** `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md`

## Global Constraints

As the Daniel and Noah plans. Sheets: `david`, `goliath`, `saul` (generated, accepted). The lamb and the Noah sheep pair supply the flock.

## Assets

| Scene | Background | Cutouts |
|---|---|---|
| shepherd | pasture, stream right, olive tree left | `david-staff`, `lamb` (+ Noah `sheep` pair reused) |
| taunt | valley, cream tents left hill, red tents right | `goliath-taunt`, `army-afraid` |
| volunteers | Saul's purple tent right | `saul-point`, `david-brave`, `armour-pile` (regenerated once: first helmet had a face) |
| stones | valley floor, stream bed of stones left | `david-sling` (sling split off), `goliath-loom`, `stones` |
| victory | valley, abandoned helmet and spear right | `david-victory`, `army-cheer` |

## Task 1: Compose

Rewrite `src/scenes/david.tsx`. Starting compositions (viewBox units):

- **shepherd**: `david-staff` (300, 596, 0.38) `a-breathe`; `lamb` (470, 600, 0.3) `a-breathe-slow`; Noah `sheep` pair (640, 596, 0.24) and flipped (800, 610, 0.2); `Sparkle` on `sheep`; `Grain 0.05`. Hotspots `sheep` → the pair, `staff` → the staff.
- **taunt**: `army-afraid` (200, 600, 0.36) `a-breathe`; `goliath-taunt` (740, 612, 0.5) `a-breathe-slow` (Goliath about 500 tall, reads as a giant next to the 360-tall soldiers); `Grain`. Hotspots `goliath`, `army`.
- **volunteers**: `armour-pile` (310, 606, 0.36); `david-brave` (420, 600, 0.36) `a-breathe`; `saul-point` (640, 596, 0.42) `a-breathe-slow`; `Sparkle` on `armour`; `Grain`. Hotspots `armour`, `saul`.
- **stones**: `stones` (150, 600, 0.3); `david-sling` body (300, 600, 0.38) `a-breathe` with the sling `Tail` spun by `a-whirl`; `goliath-loom` (780, 612, 0.5) `a-breathe-slow`; `Sparkle` on `stones`/`sling`; `Grain`. Hotspots `sling` → above David's head, `stones` → the pile.
- **victory**: `david-victory` (400, 596, 0.38) `a-breathe`; `army-cheer` (720, 606, 0.38) `a-breathe-slow`; `Sparkle`s; `Grain`. Hotspots `david`, `crowd`.

Then typecheck, `check:motion`, compare loop (≤ 4 cycles), hotspots in `src/data/stories/david.ts`, commit.

## Task 2: Evidence and handoff

`shoot.mjs` gains `david` in `STORIES`; phone/tablet/hotspot for all five, offline on one, frame probe on `stones` (whirl), record, handoff, commit.

## Roast (inline)

- Whirling sling: a continuous rotate of a raster loop about the hand. If the split polygon clips the arm, the arm rotates too. Keep the polygon to the loop and cords above the wrist; verify by scrubbing.
- Goliath scale: 0.5 of a 1000-tall cutout is 500 units, 80% of the frame height. Tablet landscape crops the top 225, so his head is cut there. Acceptable for a giant; the phone shows him whole.
- Verdict: proceed.

## Addendum: user review round (2026-09-18)

Requests: slain Goliath in the victory scene; soldiers taller than David;
blinks on every character; richer shepherd scene (more sheep, realistic
swaying tree and grass, coloured birds); a new scene showing the stone hit
and Goliath going down; Goliath bigger and more formidable.

Design, roasted inline:

- **Strike scene** (`david/strike`, between stones and victory): reuses the
  stones background and cutouts plus the fallen Goliath. One-shot 6 s beat:
  the stone waits at the sling, flies to the forehead, the standing giant
  staggers 30° about his feet, then crossfades into the fallen pose.
  Attributes hold the outcome (stone hidden, standing hidden, fallen shown)
  so Calm mode shows Goliath already down. A full 84° rigid topple was
  rejected: a 600-unit giant cannot fall inside a 1000-wide frame, and a
  rotated raster plank sinks its far corner into the ground.
- **Blinks**: `design/pipeline/find_eyes.py` finds sclera blobs in the top of
  each cutout and prints lid centres, radii and skin tone; two three-quarter
  faces needed their far eye mirrored by hand. Verified by rendering every
  page with lids forced visible.
- **Shepherd**: background regenerated without a tree; tree as its own cutout
  split into trunk and canopy (`split_tail.py` with a canopy polygon), canopy
  on `a-sway-slow`; grass tufts on `a-sway` with staggered delays; three
  birds as two-frame `Flipbook`s on `a-fly` / `a-flutter`; flock of seven.
- **Goliath**: sheet regenerated (bulkier); the three Goliath layers
  regenerated; scaled 0.6 in taunt and stones (600 units tall).
- **Victory**: soldiers at 0.6 (352 tall) above David at 0.36 (324); fallen
  Goliath in the foreground so the soldiers cannot hide him.
- `raster.tsx` gains `Part` (generic split-off part), `Flipbook`, and a
  `delay` prop on `Layer`; `Tail` wraps `Part`; Noah's dove uses `Flipbook`.
