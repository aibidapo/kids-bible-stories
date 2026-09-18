# Noah Story Raster Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all five Noah pages (`builds`, `two-by-two`, `flood`, `dove`, `rainbow`) to layered raster art with the proven pipeline.

**Architecture:** Identical to `docs/superpowers/plans/2026-09-18-daniel-story-raster.md`. Additions: sheet-less layers (animal pairs, arks, olive-branch dove) styled by the concept reference; the prays dove frames are reused for the two doves in `two-by-two`; the vector `Rain` overlay from `src/art/base.tsx` stays on top of the flood background (static tiles, allowed).

**Spec:** `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md`

## Global Constraints

As the Daniel story plan. Comparison gate per scene against the concept reference for style, T11 for Noah, hotspots on targets, max four cycles.

## Assets (generated before this plan was written; all accepted first pass)

| Scene | Background | Cutouts |
|---|---|---|
| builds | worksite with half-built ark right | `noah-raise`, `sons-carry` |
| two-by-two | finished ark right, ramp to centre | `giraffes`, `elephants`, `zebras`, `lions`, `sheep`, `noah-point` (+ prays `bird-up`/`bird-down` reused) |
| flood | stormy sea, no ark | `ark-afloat` |
| dove | calm dawn sea, peak at right | `ark-resting`, `noah-window` (chest up), `dove-branch` |
| rainbow | hillside with rainbow and ark right | `family`, `noah-look-up` (+ two-by-two `sheep`, `lions` reused) |

## Tasks

### Task 1: Compose the five scenes

Rewrite `src/scenes/noah.tsx` in full. Starting compositions (viewBox units), each `Layer` on a `SoftShadow`:

- **builds**: `noah-raise` (250, 590, 0.38) `a-breathe`; `sons-carry` (540, 600, 0.36) `a-breathe-slow`; `Grain 0.05`. Hotspots `ark-frame` → the hull, `noah` → Noah.
- **two-by-two**: queue toward the ramp: `giraffes` (140, 565, 0.3), `elephants` (320, 595, 0.32), `zebras` (190, 612, 0.26), `lions` (430, 614, 0.28), `sheep` (560, 616, 0.22), `noah-point` (650, 565, 0.33); two doves from the prays frames at (520, 250) and (575, 285) with the flipbook flap and no glide; `Sparkle` on `found.includes("doves")`; `Grain 0.05`. Hotspots `doves`, `elephants`.
- **flood**: `ark-afloat` (500, 400, 0.5) inside `a-rock`; `Rain count=90 seed=23` on top; `Grain 0.05`. Hotspots `ark-afloat`, `rain`.
- **dove**: `noah-window` behind the ark so his chest shows over the hull, `ark-resting` (380, 470, 0.5), `dove-branch` (620, 330, 0.3) `a-float` flying left toward him; `Sparkle` on `leaf`/`hill`; `Grain 0.05`. Hotspots `leaf` → dove, `hill` → the peak at right.
- **rainbow**: `family` (330, 600, 0.36), `noah-look-up` (560, 590, 0.38), `sheep` (770, 612, 0.2) and `lions` (140, 612, 0.22) reused, `dove-branch` (190, 230, 0.26) `a-float`; `Sparkle` on `rainbow`/`family`; `Grain 0.05`. Hotspots `rainbow` → arc, `family` → family.

Then typecheck, `check:motion`, compare loop per scene (≤ 4 cycles, logged), hotspot coordinates moved in `src/data/stories/noah.ts`, commit.

### Task 2: Evidence and handoff

Extend `scripts/shoot.mjs` with a Noah loop (phone, tablet, first hotspot per page), offline check on one page, frame probe on the heaviest (two-by-two: seven layers plus two flapping doves), record, handoff, commit.

## Roast (inline)

- Reusing the prays dove frames in two-by-two: they were generated as a single dove flying right; two of them side by side read as a pair. Fine. If they read as clones, flip one.
- `noah-window` is a chest-up cutout with a hard bottom edge; it must sit fully behind the hull, or the edge shows. Verify in compare.
- Flood: the ark rocks by `a-rock` (rotate about its own centre); the sea in the background does not move. Acceptable; if it reads dead, add a slow `a-sway-slow` on a second wave cutout later.
- Two-by-two has eight animated layers; probe it.
- Verdict: proceed.
