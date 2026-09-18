# Layered raster scenes — design

Date: 2026-09-18
Status: approved direction in chat ("A, or anything that gets us to the mock"); spec for review
Target look: `design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`
Supersedes: `2026-09-18-daniel-den-style6-design.md` (vector slice, kept as history) and
the shelved plan `docs/superpowers/plans/2026-09-18-daniel-den-fidelity.md`

## Goal

Make the storybook look like the concept image, on a phone, offline, with the
existing interactivity intact: hotspots, Calm mode, breathing/blinking
characters, hash routing, quiz, stickers. Prove it on one scene
(`daniel/den`) before touching the other 25.

## The decision

Hand-built SVG tops out well short of the concept. The concept's quality is
raster. So scenes become **layered raster art** (AI-generated with reference
images for consistency, background-stripped into cutouts), composed and
animated inside the existing 1000×625 SVG stage.

This **retires the ship-nothing-binary rule** for artwork. Sound stays Web
Audio, narration stays `speechSynthesis`, no fonts. The rule is replaced by a
size budget and a caching strategy (below). This change is deliberate and is
the user's call.

## Non-goals

- Migrating any scene other than `daniel/den` in this slice.
- Commissioned art. AI generation with human curation; can be swapped later.
- Changing the stage, hotspot, or routing model.

## Layer model

Each scene ships as layers, back to front, all drawn into the same 1000×625
viewBox with `<image>` elements:

| Layer | Source | Animation |
|---|---|---|
| Background | one WebP, 1600×1000, no characters | none (static) |
| Far character(s) | WebP cutout with alpha | `a-breathe-slow` |
| Hero | WebP cutout with alpha | `a-breathe` |
| Near characters | WebP cutouts with alpha | `a-breathe-slow` |
| Light shaft, motes, grain | existing v2 SVG effects on top | as before |

Positioning: `<g transform="translate(x y) scale(s)">` outside, `<g className="a-…">` inside, `<image>` innermost. Hard constraints 1 and 2 apply unchanged. Calm mode removes animation; the `<image>` sits at its own position. `check:motion` still enforces this.

Blink: eyelids cannot be raster-and-consistent cheaply. Option: a small SVG
eyelid ellipse over each eye position in the cutout, coloured from the
cutout's face tone, `a-blink` as today. Eye coordinates are per character
asset, recorded in the scene file. Tail sway: dropped for raster lions unless
the tail is its own cutout; out of this slice.

## Asset pipeline (`design/pipeline/`)

Python, run by the developer, outputs committed to `src/assets/scenes/<story>/<scene>/`.

1. `gen_scene_layers.py <story> <scene>`: for each layer in a per-scene JSON
   manifest, calls Gemini image generation with:
   - the style reference (concept 6) as a reference image every time,
   - for characters, the **character sheet** image as a second reference so
     Daniel is the same Daniel on every page,
   - a prompt that asks for the character alone on a flat solid background
     (`#00ff00`) in the pose the scene needs, or the background alone with
     "no people, no animals".
   Writes raw PNGs to `design/pipeline/raw/<story>/<scene>/`.
2. `cutout.py`: runs `rembg` on each character PNG, trims to content, records
   the trim box, writes WebP with alpha at the scene's target size.
3. `pack.py`: converts the background to WebP (q≈80), writes the layer
   manifest `layers.json` next to the assets: file, natural size, suggested
   viewBox placement (x, y, scale), eye positions if any.
4. Character sheets live in `design/characters/<name>.png` and are generated
   once with `gen_character.py <name> "<description>"`, front view, neutral
   pose, on the flat background. They are the consistency anchor.

Generated images carry a SynthID watermark; Google's terms permit commercial
use of Gemini outputs. Record the model id and prompt per asset in
`layers.json` for provenance.

## App changes

- `vite.config.ts`: workbox `globPatterns` gains `webp` so scenes precache.
- `src/scenes/daniel.tsx` `IntoTheDen`: imports the layer assets and composes
  them per the layer model; keeps `LightShaft`, `Motes`, `Grain` and the
  hotspot ids.
- `src/art/raster.tsx`: `Layer({ src, x, y, w, h, scale?, className? })`
  helper that renders the positioned/animated `<image>` triple correctly, so
  scene files cannot get constraint 1 wrong. `Eyelids({ points, tone })` for
  blink over a cutout.
- Asset types: `vite/client` already declares `*.webp` imports.

## Size budget and caching

- Per scene: ≤ 450 KB total across layers (background ≤ 200 KB, each cutout ≤ 80 KB).
- Full book at 26 scenes: ≤ 12 MB. Precache stays on for everything for now;
  if first-load time on a phone exceeds 8 s on Fast 3G, switch the workbox
  strategy to precache the first story and runtime-cache the rest (a
  follow-up, not this slice).
- Library thumbnails keep using the scene art, so they get the raster look too.

## Still-render and compare tooling

`scripts/render-scenes.tsx`, `scripts/check-motion.tsx`, `scripts/compare.tsx`
bundle with esbuild `--loader:.webp=dataurl`. Before rasterising with sharp,
a helper swaps every `data:image/webp;base64,…` in the markup for a PNG data
URI (sharp decodes WebP; its SVG rasteriser does not). `check:motion` needs no
raster decode and only needs the loader so imports resolve.

## Verification (evidence plan)

Record at `docs/evidence/2026-09-18-layered-raster-den/`.

| Requirement | Procedure | Evidence |
|---|---|---|
| Looks like the concept | `npm run compare -- daniel/den <concept 6>` side by side at 1000 wide, scored on the same 10-trait checklist as the shelved fidelity plan, plus T11 "characters match the character sheet" | `cycle-NN.png`, `cycles.md` |
| Interactivity intact | `scripts/shoot.mjs` shots 10–14: phone, tablet, Calm, hotspot tap, big mode | PNGs + hashes |
| Constraint 1 | `npm run check:motion` | output |
| Size budget | `ls -l src/assets/scenes/daniel/den`, `gzip` of bundle, `dist/` total | numbers in record |
| Offline | build, preview, load once, go offline (DevTools MCP `emulate networkConditions: Offline`), reload the den route | screenshot |
| Frame cost | rAF sampler, 4x throttle, vs previous 35.09 ms | numbers |
| Provenance | `layers.json` per asset: model, prompt, reference images, date | file |

Gaps carried forward: no unit-test runner, no lint/format/secret-scan/audit,
performance emulated. TDD not satisfiable for image assets; the compare
checklist is the acceptance test.

## Risks

- **rembg edges on fur and cloth.** Soft edges may halo. Mitigation: alpha
  matting on, or generate characters on the scene's own dark tone instead of
  green to hide fringe. Judge in compare.
- **Character drift across scenes.** Mitigation: character sheets as
  reference images every call; regenerate outliers; human curation.
- **Bundle growth.** Budget above; measured in evidence.
- **Style split mid-migration.** Same as before: not for release until a
  whole story is migrated.
- **Model output size/aspect.** Gemini returns 16:9 at 1K; backgrounds need
  16:10 (1000×625). Generate 16:9 and crop the sky band, or prompt for extra
  headroom. Judge in compare.
