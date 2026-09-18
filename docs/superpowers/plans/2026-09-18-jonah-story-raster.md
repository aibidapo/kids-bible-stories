# Jonah Story Raster Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all five Jonah pages (`running`, `storm`, `swallowed`, `prayer`, `nineveh`) to layered raster art, with blinks on every face from the start.

**Architecture:** As the David plan after its review rounds: `Backdrop`/`Layer`/`Eyelids`, eyes from `find_eyes.py` verified with lids forced, vector `Rain` and `Lightning` overlays kept on the storm, `HolyGlow` on the prayer light.

**Spec:** `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md`

## Assets (generated before this plan; all 16 accepted first pass)

| Scene | Background | Cutouts |
|---|---|---|
| running | Joppa quay, town left, sea right | `jonah-walk`, `ship`, `sailors` |
| storm | storm sea, no ship | `ship-storm`, `sailors-afraid`, `jonah-point-self` |
| swallowed | underwater, light shafts | `great-fish` (faces left, mouth open), `jonah-fall` |
| prayer | inside the fish, light at top | `jonah-pray`, `little-fish` |
| nineveh | city gate, road | `jonah-preach`, `crowd-listen` |

## Task 1: Compose

`src/scenes/jonah.tsx` rewritten. Starting compositions:

- **running**: `ship` on the water at right (700, 470, 0.4) `a-rock`; `sailors` on the quay (560, 596, 0.32) `a-breathe-slow`; `jonah-walk` (250, 600, 0.38) `a-breathe`; `Sparkle` on `ship`. Hotspots `ship`, `jonah`.
- **storm**: `ship-storm` (500, 480, 0.5) `a-rock`; `sailors-afraid` on deck (470, 380, 0.3) `a-shake`; `jonah-point-self` (600, 400, 0.3) `a-breathe`; `Lightning`, `Rain` overlays. Hotspots `sailors`, `lightning`.
- **swallowed**: `great-fish` (640, 500, 0.55) `a-swim-slow`; `jonah-fall` (340, 380, 0.3) `a-float`. Hotspots `bigfish` → fish, `bubbles` → upper left.
- **prayer**: `HolyGlow` at the light; `jonah-pray` (500, 600, 0.4) `a-breathe`; `little-fish` in the pool (220, 606, 0.28) `a-swim`; `Sparkle` on `light`. Hotspots `light`, `jonah-praying`.
- **nineveh**: `jonah-preach` (300, 600, 0.38) `a-breathe`; `crowd-listen` (640, 604, 0.38) `a-breathe-slow`; `Sparkle`s. Hotspots `city`, `people`.

Blinks: every human face plus the great fish and the little fish, offsets staggered, verified with lids forced.

## Task 2: Evidence and handoff

`shoot.mjs` gains `jonah`; shots, offline, frame probe on the storm (rain overlay + rock + shake), record, handoff.

## Roast (inline)

- Storm sailors "on deck": a separate cutout placed above the hull will read as standing in the boat only if their cutout's bottom edge is hidden by the gunwale. Place them behind the ship layer, low enough that the hull covers their waists.
- The great fish faces left with Jonah falling toward it from the left: Jonah must be on the mouth side. Mouth is at the fish's left; Jonah at x < fish centre.
- Verdict: proceed.
