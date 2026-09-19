# Christmas Story Implementation Plan (Life of Jesus, story 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A six-page Christmas story in the app, richer and more detailed than the existing five, with the same data completeness (both levels, hotspots, find-games, quiz, memory verse, devotional).

**Architecture:** Existing pipeline (character sheets → scene manifests → `gen_scene_layers` → `cutout` → `pack`), with `size` per layer in the manifest so backgrounds render at 2K. Scenes composed in `src/scenes/christmas.tsx` from `Backdrop`, `Layer`, `Part`, `Flipbook`, `Eyelids` and the v2 effects. Story data in `src/data/stories/christmas.ts`, registered in `STORIES` and the art registry. Tests are the existing story-data invariants plus `check:motion`.

**Tech Stack:** Gemini `gemini-3-pro-image-preview` via `design/pipeline`, React/TS scenes, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-18-life-of-jesus-design.md`

## Global Constraints

- 450 KB per scene; background ≤ 250 KB, each cutout ≤ 80 KB.
- Never green clothing or props (chroma key).
- No `a-*` class on an element with a `transform` attribute; pivots in `motion.css`.
- Both reading levels; little sentences short; quiz cannot be failed.
- Story-critical art inside x 90–910 (portrait crop); nothing above y 0 matters now (letterbox).

## Roast (before code)

- **Architect (3):** 2K generation triples call time and raises raw size; the pack step downsamples to 1600×1000 anyway. Worth it only for backgrounds; cutouts stay 1K (they are ≤ 800 px tall after trim).
- **Architect (3):** more layers per scene means more `<image>` elements and animations; the creatures page at 43 animations sits at 16.7 ms median under 4× CPU, so a nine-layer scene with six animations is fine, but run `npm run perf` after the story lands.
- **Buyer (3):** "rich" must not mean busy for a three-year-old. Keep one clear subject per page, detail in the surroundings, and the hotspots on story objects (the manger, the star, the gifts), not on decoration.
- **CFO (2):** ~6 backgrounds at 2K + ~20 cutouts + 5 sheets ≈ 31 calls first pass, ~60 with rework; note in the record.
- **Content (2):** Christmas conflates Luke's shepherds and Matthew's wise men on one night in most children's books; the big text should say the wise men came later.
- **Verdict:** proceed-with-changes: 2K for backgrounds only, one subject per page, wise men "later".

### Task 1: pipeline `size`

- [ ] `gen_scene_layers.py` passes `size` from the manifest for the background and each cutout; `gen_character.py` accepts an optional `--size`.

### Task 2: sheets and manifests

- [ ] Sheets: `mary`, `joseph`, `shepherd`, `wise-men` (three in one sheet), `innkeeper`. Angel reused.
- [ ] Manifests `christmas-{angel,journey,stable,shepherds,visit,wisemen}.json` with rich detail lines, 2K backgrounds.
- [ ] Generate, review raw sheets and layers on green, regenerate misses.

### Task 3: data and scenes

- [ ] `src/data/stories/christmas.ts` (six scenes, hotspots, find-games, quiz with little and big questions, memory verse Luke 2:11 NIV, devotional).
- [ ] `src/scenes/christmas.tsx` compositions; register in `src/scenes/index.ts`; append to `STORIES`.
- [ ] `npm run compare` per page; `check:motion`; browser stills phone and tablet; `npm run perf`.

### Task 4: evidence and docs

- [ ] `docs/evidence/2026-09-18-christmas-story/record.md` with sizes, calls, rework, stills; roadmap phase 4 status; handoff; commit through the hook; push.
