# Evidence record: David story, layered raster (six pages after two review rounds)

## Scope

Task: migrate `david/*` to layered raster art, then the user's review rounds:
slain Goliath in victory, soldiers taller than David, blinks on every face,
richer shepherd hill (more sheep, swaying tree and grass, coloured birds), a
new strike page showing the stone hit and the giant going down, Goliath
bigger and fiercer, the flock on the meadow, a natural blink for David,
blinking sheep, Goliath at full size in the strike page, soldiers running
down the hill in victory.

Plan: `docs/superpowers/plans/2026-09-18-david-story-raster.md` (with
addendum). Machinery and gate inventory as the Daniel and Noah records.

## Artifact identity

- Branch `main`. Commits: `8eb18a8` sheets + layers + plan, `ad679d7` first
  compositions, `d087bd1` first record, `0219027` regenerated Goliath + new
  layers + `find_eyes.py`, `8273eb5` review round one (strike page, blinks,
  shepherd hill), `7e3072d` **stylesheet restoration** (see Review),
  `0a938a7` round two (David lids, sheep lids, full-size Goliath in strike),
  `062b3f4` sheep lids resized, `ceef0fd` victory runners, then the record
  commit.
- Browser evidence tested at `ceef0fd`: `dist/assets/index-CPwN_5Gg.js`,
  served by `vite preview --port 4173`.
- Shipped bytes per scene (background + cutouts actually imported; the
  split tree counts trunk + canopy, not the unsplit original): shepherd
  430,504; taunt 213,558; volunteers 214,090; stones 242,154; strike 0
  (reuses stones and victory assets); victory 333,550. Every scene under
  450 KB. `dist` 4,086 KB with three stories migrated.
- Generation: `gemini-3-pro-image-preview`. Sheets: david, goliath (×2: the
  second bulkier and scowling), saul. Layers: 17 original + tree, grass
  tuft, 6 bird frames, fallen Goliath, running soldiers, 3 regenerated
  Goliath poses, 3 shepherd/victory backgrounds (victory twice: the first
  new one carried a stray helmet). One rejected layer: the first armour
  pile had a face inside the helmet.

## Environment

As the Noah record. DevTools MCP probes in fresh isolated contexts, one page
open at a time (a second open page halves the frame rate of the first).

## Procedures and results

| Check | Procedure | Result | Evidence |
|---|---|---|---|
| Raw layer review | review sheets | all accepted except armour pile (regenerated) and first victory-hill background (helmet, regenerated) | `raw-*.png`, `raw-shepherd-additions.png`, `raw-goliath-v2.png`, `raw-victory-runners.png`, `character-sheets.png` |
| Composition gate | `npm run compare` per scene, six cycles across the rounds | all six pages pass | `cycles.md`, `story-sheet.png`, `*-render.png` |
| Blink lids | every David-story face (incl. sheep and lamb) rendered with lids forced visible | lids cover the eyes; David's shepherd lids and the sheep lids were re-measured by hand on a 10 px grid after the detector sized them on the white crescents | `lids-forced.png`, `shepherd-lids-forced.png`, `flock-lids-forced.png` |
| Motion constraints | `npm run check:motion` | 27 scenes clean on every commit | hook |
| Typecheck + build | hook | green | commit history |
| Browser: phone ×6 | `STORY=david node scripts/shoot.mjs` 20-* | every page renders; rings on targets | sha256: shepherd 474a58fa21f1e3ce, taunt 99abd4c04ea3c803, volunteers afe94ad1b728c71e, stones 5007bda3598c1cbe, strike 0d6d0b1d1daa45a7, victory 3783c23198ce6aac; `phones.png` |
| Browser: tablet ×6 | 21-* | layers positioned; Goliath's crest cropped at the top | aa617b9893ccfdc2, 8616074d40b66ae2, e8026a11eed57542, 35214b16c092facb, 2db9532ad9730e06, cbe671bdc70f4f05 |
| Browser: first hotspot ×6 | 22-* | every page's first hotspot fires its sticker and bubble | c70922f45003fde4, a3a7f9d57381f79b, 8a7c6312b0ea6a42, 01a07c14e5f6e0d2, 037515b14f1214a4, 58e2f8d3219f2e15; `hotspots.png` |
| Strike beat | Web Animations API scrub in the browser, computed styles read back | at 63–64%: stone group opacity 1 at translate (245,-43) / (276,-48); at 79–80%: `.a-topple` matrix rotation −18° to −21°, stand-out opacity 1, land-in 0; at 99.5%: standing 0, fallen 1 | `strike-stone.png` (stone mid-flight, 0.45-scale version), `strike-collapsed.png`; this record |
| Flap/blink/sway running | `document.getAnimations()` by name on the shepherd page after `7e3072d` | sway 6, fly 1, frame-a 3, frame-b 3, flutter 2, breathe 9, blink 2 | this record |
| Frame cost, shepherd (21 images, 18+ animations) | rAF sampler, 4x throttle, single open page | avg 34.4 ms, p95 ~35; identical with each animated group hidden | this record |
| Frame cost, contaminated | same with a second page open | 66.7 ms avg; discarded, cause was the second page | this record |
| Offline | (not repeated this round; the app's precache strategy is unchanged) | see the first David record run | — |

## Review

Automated: `check:motion`, `tsc -b`, Vite build per commit.

**Defect shipped and fixed in the same session.** Commit `8273eb5` replaced a
block of `motion.css` by string slicing from the first occurrence of
`@keyframes stone-fly`. The old vector David scene had its own keyframe of
that name earlier in the file, so the slice removed every rule between it
and the Calm block: blinks, wing flips, tail flicks. The user noticed the
birds not flapping. `7e3072d` restores the file from `d087bd1` and places the
strike beat over the old stone block. Lesson recorded in the handoff: never
slice a stylesheet by first-match; anchor on a unique comment.

Other findings and disposition: enlarged soldiers hid the fallen giant
(reordered); the strike-scene Goliath was 0.45 to fit the fall, the user
saw the size drop, now 0.6 with a 30° stagger and crossfade; the detector
missed the far eye on two three-quarter faces (mirrored by hand); the
browser scrub of the 0.6 stagger could not be photographed because the
page re-rendered between scrub and capture (computed styles cited instead).

Human review: the user reviewed the story twice in this session and the
changes above are their requests; final approval of the current state is
pending.

## Gaps

- All gaps from earlier records still apply (no unit-test runner; lint,
  format, secret scan, dependency audit unknown; emulated perf; tablet crop;
  licensing).
- The sling does not spin.
- No blinks for Saul's far eye beyond the detector's output; no blinks on
  the running soldiers.
- The victory page has two soldier groups drawn from different generations
  (cheering trio, running four); they read as the same army but are not the
  same men.
