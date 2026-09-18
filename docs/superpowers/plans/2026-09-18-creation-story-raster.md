# Creation Story Raster Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all six Creation pages (`light`, `sky-water`, `land`, `lights`, `creatures`, `people`) to layered raster art. Last story; after it the vector kit can go.

**Architecture:** As the Jonah plan. Heavy reuse: the David birds and Daniel dove (`Flipbook`), the Jonah fish school, turtle and jellyfish, the Noah animal pairs, the David tree/lamb/sheep. New sheet-less layers only: cloud, calm wave, fruit tree, flowers, sun, moon, dolphin, Adam and Eve. Vector `Stars`, `Sparkle`, `HolyGlow` and `Motes` stay as overlays.

**Spec:** `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md`

## Compositions (starting values)

- **light**: bg burst; `HolyGlow` at centre pulsing; `Motes` drifting as sparks. Hotspot `first-light` at the burst.
- **sky-water**: bg; two `cloud` layers on `a-drift` at different scales and delays; two `calm-wave` layers on `a-heave-slow`. Hotspots `clouds`, `sea`.
- **land**: bg; `fruit-tree` split trunk/canopy, canopy `a-sway-slow`, at left; David `tree` reused at right; three `flowers` clusters on `a-sway`. Hotspots `fruit-tree`, `flowers`.
- **lights**: bg; `sun` upper right on `a-pulse-soft`; `moon` upper left on `a-float`; vector `Stars`. Hotspots `sun`, `moon`; Sparkles on found.
- **creatures**: bg; David bluebird/redbird/goldfinch and Daniel dove as `Flipbook`s on `a-fly`/`a-flutter`; Jonah `fish-school` `a-swim`, `turtle` `a-swim-slow`, `jellyfish` `a-float`, new `dolphin` `a-float`. Hotspots `fish`, `birds`.
- **people**: bg; `adam-eve` centre `a-breathe` with blinks; Noah `giraffes`, `lions`, `zebras`, `elephants` pairs and David `lamb`; David birds. Hotspots `lion`, `giraffe`, `people`.

Blinks: Adam and Eve, dolphin, turtle (reuse Jonah's eye data where the asset is reused: none measured yet for Noah pairs, add if the detector finds them).

## Tasks

1. Generate (14 calls), cut out, pack, review raws; commit assets.
2. Compose `src/scenes/creation.tsx`, move hotspots, compare loop, lids forced, commit.
3. Evidence: shoot loop gains `creation`, frame probe on `creatures` (most animated), record, handoff, commit.
4. **Kit removal** (separate commit, own review): delete `src/art/{figures,animals,props}.tsx`, `src/art/v2/{den,lion,person,tone}.tsx` if unused, keep `base.tsx` (VB, Stars, Sparkle, HolyGlow, Rain, Lightning, Sea?) and `v2/effects.tsx`; `check:motion` and build must pass; `CLAUDE.md` layout updated.

## Roast (inline)

- The light scene has no characters; a page with only a background and a glow may feel dead. Motes as sparks plus a slow pulse of the glow give it life. If it still reads flat, a second "ray" cutout on `a-spin-vslow`.
- Sun raster spinning would rotate its face; use `a-pulse-soft` not spin.
- Verdict: proceed.
