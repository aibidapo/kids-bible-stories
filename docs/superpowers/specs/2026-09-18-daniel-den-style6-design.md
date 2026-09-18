# Daniel den scene in style 6 (soft-shaded cutout) — design

Date: 2026-09-18
Status: approved in chat, spec written for review
Reference art: `design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`
Baseline art: `scratch/scenes/daniel-den.png` rendered at commit `d567255` (dirty:
`package-lock.json` only, unrelated)

## Goal

Prove the chosen illustration style inside the app's SVG constraints on one
scene before restyling the other 25. Output is a rebuilt `daniel/den` scene
that reads like the reference image at phone and tablet sizes, animates, and
holds an honest still under Calm mode.

## Non-goals

- Restyling any other scene, or the library thumbnails.
- Deleting or changing the v1 art kit (`src/art/*.tsx`).
- Adding image, audio, or font files. The ship-nothing-binary rule holds.
- Lint, format, or secret-scan tooling. Named as a gap, not delivered here.

## Style contract (what "style 6" means in SVG)

1. **Layers.** Scene is stacked flat layers, back to front: wall, floor, far
   lion, Daniel, near lions, light shaft, dust motes, grain. Depth comes from
   a soft shadow under the edge of each layer.
2. **Forms.** Rounded, no strokes. Each body part is one radial gradient, two
   stops, light from top-left.
3. **Rim light.** Thin light path along the top-left silhouette of each
   figure, ~35% opacity.
4. **Faces.** Eyes ~20% of head width: sclera, iris, pupil, two specular dots.
   Brows, cheek blush, wide mouth. Lions get the same treatment.
5. **Light.** Warm key from the opening above as a gradient wedge, plus a
   spotlight ellipse on the floor.
6. **Grain.** One `feTurbulence` filter on a full-frame static rect, ~6%
   opacity, topmost layer.

## Architecture

### New: `src/art/v2/`

| File | Owns |
|---|---|
| `effects.tsx` | Shared `<defs>` (gradients, grain filter) and `SoftShadow` ellipse. No figures. |
| `person.tsx` | `Person2`. Layered body, gradient shading, big-eye face. Poses: `pray`, `kneel`. Faces: `calm`, `happy`. Nothing more until another scene needs it. |
| `lion.tsx` | `Lion2`. Tufted mane layers, big eyes, `asleep` flag, tail. |
| `den.tsx` | `Den2`. Stone wall (far), floor, round opening. |

Why a parallel kit: `Person`, `Lion`, `DenInterior` serve 25 other scenes.
Restyling in place changes all 26 at once with no review. Two kits coexist
until every scene migrates, then v1 is deleted and v2 folds into `src/art/`.
This is recorded debt; remediation milestone is the end of the graphics
upgrade.

### Modified

- `src/scenes/daniel.tsx`: `IntoTheDen` composes from v2 only. Other Daniel
  scenes unchanged.
- `src/data/stories/daniel.ts`: hotspot `x`/`y` for `lions-awake` and
  `king-above` move to the new composition. Ids unchanged so saved progress
  still resolves.
- `src/styles/motion.css`: add `.a-blink` (eyelid `scaleY`, ~6 s period) and
  `.a-mote` (slow float). Both `transform-box: fill-box`. Both stop under
  `.calm` by the existing `[class^="a-"]` rule.
- `CLAUDE.md`: document `src/art/v2/`, the coexistence rule, the hook
  activation command.

### Animation

| Element | Class | Rest position under Calm |
|---|---|---|
| Daniel body | `a-breathe` | full height |
| Lions body | `a-breathe-slow` | full height |
| Lion tails | `a-tail` | resting curl |
| Lion eyelids | `a-blink` | open |
| Light shaft | `a-pulse-soft` | full opacity |
| Dust motes | `a-mote` | at their own `x`/`y` |

Hard constraint 1 applies everywhere: the positioning `<g transform>` is the
parent, the animated `<g className>` is the child.

### Performance rule

No SVG filter on anything that moves. A filter on an animated group repaints
its whole region every frame. Shadows are gradient ellipses, not
`feDropShadow`. The grain filter sits on a static rect only. If phone
screenshots or the DevTools frame profile show jank, grain goes first.

## Increment 0: local gate

The repo has no pre-commit gate. Before feature code:

- `.githooks/pre-commit` runs `npm run typecheck` then `npm run build`, and
  blocks the commit on failure.
- Activation: `git config core.hooksPath .githooks`, documented in `CLAUDE.md`.
- Proof both ways: one green run, one demonstrated rejection (a staged file
  with a deliberate type error is refused).

What this gate does not cover, stated plainly: lint with security rules,
format check, tests, secret scan, dependency audit. None of that tooling is
installed. That is a separate task and this slice is not "gate-compliant".

## Evidence plan

Record lives at `docs/evidence/2026-09-18-daniel-den-v2/` with a `record.md`
following the evidence contract's minimum record. Baseline captured before
any behaviour change.

| Requirement | Procedure | Expected evidence |
|---|---|---|
| Typecheck, build | `npm run typecheck`, `npm run build` | exit code, output tail |
| Calm still composes | `render-scenes.tsx` → `scratch/scenes/daniel-den.png` | PNG, hash, side by side with baseline and reference |
| Motion works, no collapse (constraint 1) | `scripts/shoot.mjs` on `npm run preview` :4173 + Chromium :9222, phone and tablet | PNGs at two viewports |
| Hotspots land on their targets | tap both hotspots in the browser shot | screenshot showing found state |
| Both reading levels | toggle Little/Big on the scene | two screenshots |
| Hook works both ways | green commit; refused commit with a type error | terminal output of both |
| Performance | Chrome DevTools performance trace on the scene, 5 s | frame time summary; jank threshold: sustained >16 ms frames on tablet emulation |

Applicability decisions:

- **TDD.** No test runner in the repo. The behaviour change is visual and has
  no unit-testable seam beyond hotspot coordinates. Failing-test-first cannot
  be satisfied without adding a runner, which is out of this slice's scope.
  Gap recorded. Visual baseline stands in as the "before" artifact but is not
  a regression test.
- **Coverage, mutation.** Inapplicable: no test suite exists to measure.
- **Threat model.** No trust boundary, identity, data class, provider,
  upload, or privileged operation changes. No network, no account, no new
  storage key. Hotspot ids unchanged so `localStorage` progress shape is
  unchanged. Existing model needs no update.
- **Migration.** Inapplicable: no schema, no persisted shape change.
- **Accessibility.** Hotspot `aria-label`s come from data and are unchanged.
  Tap targets stay ≥64px via existing CSS. No new interactive element.
- **Live target.** The app is local-only with no backend. Browser run of the
  built app is the live target; there is no staging.

## Open risks

- Radial gradients per part may cost paint time on low-end phones with three
  lions on screen. Mitigation: profile early, drop to linear gradients if
  needed.
- Big-eye faces at 0.28 scale (king at the opening) may read as noise.
  Mitigation: king keeps a simplified face variant, or v1 `Person` for that
  one figure. Decide in review of the first render.
- Hotspot percentages are eyeballed. Verified only by the browser tap shot.
