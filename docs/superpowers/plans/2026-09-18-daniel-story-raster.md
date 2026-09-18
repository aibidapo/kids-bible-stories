# Daniel Story Raster Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the remaining four Daniel pages (`prays`, `trap`, `angel`, `rejoice`) to layered raster art with the proven pipeline, so the whole story is one style and can be released.

**Architecture:** Same machinery as the den slice: manifests under `design/pipeline/scenes/`, `gen_scene_layers.py` → `cutout.py` → `pack.py`, `Backdrop`/`Layer`/`Eyelids` composition, v2 `LightShaft`/`Motes`/`Grain`/`SoftShadow` on top. One addition: a manifest may `reuse` another scene's background so the angel scene shares the den room.

**Tech Stack:** unchanged from `docs/superpowers/plans/2026-09-18-layered-raster-den.md`.

**Spec:** `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md`

## Global Constraints

- All constraints from the den plan apply: viewBox, hard constraints 1 and 2, Calm rest states, no filter on moving elements, safe zones (x 90–910; y ≥ 225 for anything that must survive tablet landscape), seeded `rand()`, 450 KB per scene, provenance sidecars, no AI attribution, `check:motion` + `typecheck` + roast + hook commit per task.
- Comparison gate per scene: `npm run compare -- daniel/<scene> design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`. There is no per-scene mock; the reference is for style consistency. Pass criteria: T11 (characters match their sheets) plus "reads as the same book as the den" plus the scene's own hotspots landing on their targets. Max four cycles per scene, then show the user.
- Hotspot ids never change. Coordinates move to the new composition.
- Blink: Daniel and the king get lids wherever their eyes are visible and open; sleeping lions and the angel do not. Offsets differ within a scene.

## File map

| Path | Responsibility |
|---|---|
| `design/pipeline/scenes/daniel-{prays,trap,angel,rejoice}.json` | prompts per layer (written) |
| `design/pipeline/gen_scene_layers.py`, `pack.py` | support `background.reuse` |
| `design/characters/{angel,official}.png` | new sheets |
| `src/assets/scenes/daniel/{prays,trap,angel,rejoice}/` | shipped layers |
| `src/scenes/daniel.tsx` | four scenes recomposed |
| `src/data/stories/daniel.ts` | hotspot coordinates |
| `docs/evidence/2026-09-18-daniel-story-raster/` | cycles, shots, record |

---

### Task 1: Pipeline `reuse` and the two new sheets

- [ ] **Step 1: `background.reuse`.** In `gen_scene_layers.py`, if `manifest["background"].get("reuse")`, print `skip bg (reuse)` and do not generate. In `pack.py`, if `reuse` is set, skip the crop/convert, and write `layers.json` with `"background": {"reuse": "<path>", "w": 1600, "h": 1000}`; total excludes it.
- [ ] **Step 2: Sheets.**

```bash
python design/pipeline/gen_character.py angel "a gentle angel with warm light-brown skin, long dark curly hair, a simple cream robe with a soft gold sash, and large soft white feathered wings, glowing faintly"
python design/pipeline/gen_character.py official "a sly Persian court official with pale skin, a pointed black beard, a tall dark blue hat, and a dark blue and silver robe"
```

Read both. Accept or regenerate at most twice each.

- [ ] **Step 3: Commit.** `git add design/pipeline design/characters` → "Add reuse support to the pipeline and angel and official character sheets".

---

### Task 2: Generate all four scenes' layers

- [ ] For each scene: `python design/pipeline/gen_scene_layers.py daniel <scene>`, then `cutout.py`, then `pack.py`. Read every raw PNG and the dark-field cutout sheet. Regenerate a layer at most twice. Note byte totals.
- [ ] Commit per scene: `git add src/assets/scenes/daniel/<scene>` → "Generate layered raster assets for daniel/<scene>".

---

### Task 3: Compose the four scenes

Starting compositions (viewBox units; tune in the compare loop). Each `Layer` sits on a `SoftShadow`. Import pattern as in `IntoTheDen`.

**prays** (`DanielPrays`): `Backdrop` prays bg; `Layer daniel-kneel` at (330, 590) scale ≈ 0.38, `a-breathe`, `Eyelids` if the eyes read; keep `Sparkle` at the window on `found.includes("window")`; `Grain 0.05`. Hotspots: `window` on the window's centre in the new bg (read off the compare render), `daniel` on Daniel's chest.

**trap** (`TheTrap`): `Backdrop` trap bg; `Layer king-throne` at the dais (≈ (650, 470), scale ≈ 0.45); `Layer official-scroll` at (300, 600) scale ≈ 0.42; `Layer official-point` at (470, 606) scale ≈ 0.42; `Grain 0.05`. Hotspots: `scroll` on the scroll, `king` on the king.

**angel** (`AngelShutsTheMouths`): `Backdrop` den bg (import from `../assets/scenes/daniel/den/bg.webp`); `LightShaft` at 0.45 as in the den; `Layer angel` at (500, 520) scale ≈ 0.42 with `a-float`; `HolyGlow` from base behind the angel; `Layer daniel` (den's cutout) at (300, 600) scale 0.36 `a-breathe` + den `Eyelids`; `Layer lion-asleep-a` at (720, 612) scale 0.5 `a-breathe-slow`; `Layer lion-asleep-b` at (880, 600) scale 0.4 flip; `Motes`; `Sparkle`s as now; `Grain 0.05`. Hotspots: `angel` at the angel's chest, `lions` on the near sleeping lion.

**rejoice** (`TheKingRejoices`): `Backdrop` rejoice bg; `Layer daniel-raise` beside the pit (≈ (430, 560) scale 0.36) `a-breathe` + `Eyelids`; `Layer king-run` at (230, 600) scale 0.4 `a-breathe`; `Layer crowd` at (820, 600) scale 0.4; `Layer lion-asleep-a` (angel scene's cutout) peeking at the pit edge optional; `Sparkle` on `found.includes("king")`; `Grain 0.05`. Hotspots: `king` on the king, `daniel-out` on Daniel.

- [ ] Per scene: typecheck, `check:motion`, compare loop (≤ 4 cycles), log to `cycles.md`, hotspot coordinates updated, commit "Compose daniel/<scene> from layered raster assets".
- [ ] After all four: `npm run render`, read the contact sheet, confirm the five Daniel tiles read as one book. Remove now-unused v1 imports from `daniel.tsx`.

---

### Task 4: Evidence and handoff

- [ ] Browser shots for all five Daniel pages at phone and tablet (extend `scripts/shoot.mjs` with a loop over `#/story/daniel/0..4` at 390×844 and 1024×768, plus one hotspot tap per page), offline reload on one page, frame probe on the heaviest page (angel: five layers plus glow).
- [ ] `record.md` in the den record's layout; sizes per scene and total for the story; gaps.
- [ ] `handoff.md`: story-level status, "releasable" only if every page passed; the next story to migrate and the observed cost per scene.
- [ ] Commit "Record Daniel story raster evidence and update handoff".

## Self-review

Every scene has a manifest, a composition sketch, hotspot handling and a commit. `reuse` is the only pipeline change and is covered in Task 1. Blink rule stated. No placeholders: numbers are starting values the compare loop tunes, and the loop's cap and logging are defined.
