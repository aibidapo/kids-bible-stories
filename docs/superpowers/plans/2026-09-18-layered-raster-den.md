# Layered Raster Den Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `daniel/den` as layered AI-generated raster art (background + character cutouts) composed in the existing SVG stage, matching `design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`, with hotspots, Calm mode, breathing and blinking intact, offline, inside a 450 KB scene budget.

**Architecture:** A Python pipeline under `design/pipeline/` turns prompts plus reference images into WebP layers under `src/assets/scenes/daniel/den/`. A small `src/art/raster.tsx` helper renders each layer as a correctly nested `<image>` so constraint 1 cannot be violated. The scene keeps the v2 SVG light, motes and grain on top. Node scripts gain a WebP-to-PNG swap so sharp can still rasterise stills.

**Tech Stack:** Python 3.14 (`google-genai`, `Pillow`, `rembg`, `onnxruntime`), React 18, Vite 8, vite-plugin-pwa, esbuild, sharp.

**Spec:** `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md`

## Global Constraints

- viewBox 1000×625; hotspot `x`/`y` are percentages of it. Portrait safe zone x 90–910; tablet-landscape safe zone y ≥ 225.
- Hard constraint 1: no `a-*` class on an element with a `transform` attribute. `Layer` enforces the nesting. Hard constraint 2: pivots in `motion.css` only.
- Calm: every animated element rests at its own position with animation removed.
- No `filter` on anything that moves. Raster layers get no filter at all.
- Size budget: scene ≤ 450 KB (background ≤ 200 KB, each cutout ≤ 80 KB). Measured, not assumed.
- Provenance: every generated asset has a sibling JSON with model, prompt, reference images, date.
- Seeded `rand()` only for anything drawn. No AI attribution in commits.
- Every task ends with `npm run check:motion`, `npm run typecheck`, a roast of the diff, and a commit through the hook.
- Comparison gate: the compare image at 1000 wide, scored on traits T1–T11 (below). Any fail is named in the evidence, never silently passed.

## Trait checklist

| # | Trait |
|---|---|
| T1 | Stones irregular, not a grid |
| T2 | Mortar recesses and lit stone edges |
| T3 | Room falls to darkness at the corners |
| T4 | Wall casts onto the floor |
| T5 | Mane is many tufts in two tones |
| T6 | Lion has chest, belly, four paws |
| T7 | Head casts onto mane and body |
| T8 | Robe folds, cuffs, fingered hands |
| T9 | Scarf drapes and casts onto face and shoulders |
| T10 | Grain visible at phone size |
| T11 | Daniel and lions match their character sheets |

---

## File map

| Path | Responsibility |
|---|---|
| `design/pipeline/gen.py` | Gemini client, `generate(prompt, refs, out, aspect)`, provenance sidecar |
| `design/pipeline/gen_character.py` | One character sheet from a description |
| `design/pipeline/gen_scene_layers.py` | All layers for one scene from its manifest |
| `design/pipeline/cutout.py` | rembg + trim + WebP with alpha |
| `design/pipeline/pack.py` | Background crop/resize/WebP, writes `layers.json` |
| `design/pipeline/scenes/daniel-den.json` | Prompts per layer for this scene |
| `design/characters/*.png` | Character sheets (not shipped) |
| `src/assets/scenes/daniel/den/*.webp`, `layers.json` | Shipped layers |
| `src/art/raster.tsx` | `Layer`, `Eyelids` |
| `src/scenes/daniel.tsx` | `IntoTheDen` composed from layers |
| `scripts/lib/inline-png.ts` | swap WebP data URIs for PNG before sharp |
| `scripts/compare.tsx` | full-size render stacked over a reference |
| `scripts/render-scenes.tsx`, `scripts/check-motion.tsx`, `package.json` | loader flag, PNG swap |
| `vite.config.ts` | workbox glob adds `webp` |
| `docs/evidence/2026-09-18-layered-raster-den/` | cycles, shots, record |

---

### Task 0: Tooling for raster in scripts, compare tool, precache

**Files:**
- Create: `scripts/lib/inline-png.ts`, `scripts/compare.tsx`
- Modify: `scripts/render-scenes.tsx`, `package.json`, `vite.config.ts`, `CLAUDE.md` (render command)

**Interfaces:**
- Produces: `inlinePng(svg: string): Promise<string>`; `npm run compare -- <sceneKey> <refPath>`; render and check scripts accept `.webp` imports.

- [ ] **Step 1: `scripts/lib/inline-png.ts`**

```ts
import sharp from 'sharp'

/**
 * sharp rasterises SVG through librsvg, which decodes embedded PNG but not
 * WebP. Scene modules import .webp assets (bundled as data URIs by esbuild), so
 * swap each WebP data URI for a PNG one before handing the markup to sharp.
 */
export async function inlinePng(svg: string): Promise<string> {
  const re = /data:image\/webp;base64,([A-Za-z0-9+/=]+)/g
  const cache = new Map<string, string>()
  for (const m of svg.matchAll(re)) {
    if (cache.has(m[1])) continue
    const png = await sharp(Buffer.from(m[1], 'base64')).png().toBuffer()
    cache.set(m[1], `data:image/png;base64,${png.toString('base64')}`)
  }
  return svg.replace(re, (_, b64: string) => cache.get(b64) ?? '')
}
```

- [ ] **Step 2: `scripts/compare.tsx`**

```tsx
/**
 * Side-by-side for reference-driven art work: renders one registered scene at
 * full 1000x625 (animations frozen, the still Calm mode shows) and stacks it
 * above a reference image scaled to the same width.
 *
 *   npm run compare -- daniel/den design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { createElement } from 'react'
import sharp from 'sharp'
import { SCENE_ART } from '../src/scenes/index'
import { inlinePng } from './lib/inline-png'

process.env.NODE_ENV = 'production'
const { renderToStaticMarkup } = await import('react-dom/server')

const [key, ref] = process.argv.slice(2)
if (!key || !ref) {
  console.error('usage: compare <sceneKey> <referencePath>')
  process.exit(1)
}
const Art = SCENE_ART[key]
if (!Art) {
  console.error(`unknown scene key: ${key}`)
  process.exit(1)
}

const W = 1000
const H = 625
const OUT = 'scratch/compare'
mkdirSync(OUT, { recursive: true })
const name = key.replace('/', '-')

const inner = await inlinePng(
  renderToStaticMarkup(createElement(Art, { active: true, animate: false, found: [] })),
)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inner}</svg>`
const render = await sharp(Buffer.from(svg)).png().toBuffer()
writeFileSync(`${OUT}/${name}.png`, render)

const reference = await sharp(ref).resize({ width: W }).png().toBuffer()
const refH = (await sharp(reference).metadata()).height ?? H
const gap = 12
const sheet = await sharp({
  create: { width: W, height: H + gap + refH, channels: 3, background: '#111111' },
})
  .composite([
    { input: render, left: 0, top: 0 },
    { input: reference, left: 0, top: H + gap },
  ])
  .png()
  .toBuffer()
writeFileSync(`${OUT}/${name}_vs_ref.png`, sheet)
console.log(`wrote ${OUT}/${name}.png and ${OUT}/${name}_vs_ref.png`)
```

- [ ] **Step 3: Patch `render-scenes.tsx`**

Add `import { inlinePng } from './lib/inline-png'` and change the `inner` line to:

```ts
  const inner = await inlinePng(
    renderToStaticMarkup(createElement(Art, { active: true, animate: false, found: [] })),
  )
```

- [ ] **Step 4: `package.json` scripts**

Add the loader to `check:motion` and add `compare` and `render`:

```json
    "check:motion": "esbuild scripts/check-motion.tsx --bundle --platform=node --format=esm --jsx=automatic --packages=external --loader:.webp=dataurl --outfile=scratch/check-motion.mjs --log-level=warning && node scratch/check-motion.mjs",
    "compare": "esbuild scripts/compare.tsx --bundle --platform=node --format=esm --jsx=automatic --packages=external --loader:.webp=dataurl --outfile=scratch/compare.mjs --log-level=warning && node scratch/compare.mjs",
    "render": "esbuild scripts/render-scenes.tsx --bundle --platform=node --format=esm --jsx=automatic --packages=external --loader:.webp=dataurl --outfile=scratch/render.mjs --log-level=warning && node scratch/render.mjs"
```

In `CLAUDE.md` **Verifying changes**, replace the two-line `npx esbuild … render.mjs` block with `npm run render` and add `npm run compare -- <sceneKey> <referencePath>` with one sentence: "full-size render stacked over a reference; judge art from this, not the contact sheet."

- [ ] **Step 5: `vite.config.ts`**

`globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}']`

- [ ] **Step 6: Verify and commit**

```bash
npm run --silent check:motion && npm run --silent render | tail -1
npm run --silent compare -- daniel/den design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg
```

Expected: 26 clean; contact sheet written; compare files written. Read `_vs_ref` once (this is the vector baseline, cycle 00). Create `docs/evidence/2026-09-18-layered-raster-den/`, copy as `cycle-00.png`, start `cycles.md` with a header row for T1–T11 and a row for cycle 00 (all F except T10 at the implementer's judgement). Roast the diff, then:

```bash
git add scripts/lib/inline-png.ts scripts/compare.tsx scripts/render-scenes.tsx package.json vite.config.ts CLAUDE.md docs/evidence/2026-09-18-layered-raster-den
git commit -m "Add compare script, WebP-aware still renders, and webp precache"
```

---

### Task 1: Pipeline core and character sheets

**Files:**
- Create: `design/pipeline/gen.py`, `design/pipeline/gen_character.py`, `design/pipeline/requirements.txt`, `design/pipeline/README.md`
- Create (generated): `design/characters/daniel.png`, `design/characters/lion.png` and their `.json` sidecars

**Interfaces:**
- Produces: `gen.generate(prompt: str, refs: list[Path], out: Path, aspect: str = "16:9", size: str = "1K") -> Path`; `STYLE_REF: Path`.

- [ ] **Step 1: `requirements.txt`**

```
google-genai
pillow
rembg
onnxruntime
```

- [ ] **Step 2: `gen.py`**

```python
"""Shared Gemini image generation for the scene pipeline.

Every call sends the style reference (concept 6) so all output stays in one
look, and writes a JSON sidecar with model, prompt, references and date so an
asset's provenance is never lost.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import sys
from pathlib import Path

from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
STYLE_REF = ROOT / "design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg"
MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image-preview")

STYLE_LINE = (
    "Match the illustration style of the first reference image exactly: soft "
    "shaded rounded forms, layered paper-cutout depth, warm rim light, subtle "
    "paper grain, big friendly eyes, no black outlines. Children's storybook."
)


def client() -> genai.Client:
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.exit("GEMINI_API_KEY not set")
    return genai.Client(api_key=key)


def generate(prompt: str, refs: list[Path], out: Path, aspect: str = "16:9", size: str = "1K") -> Path:
    contents: list = [f"{STYLE_LINE}\n\n{prompt}"] + [Image.open(r) for r in refs]
    response = client().models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
            image_config=types.ImageConfig(aspect_ratio=aspect, image_size=size),
        ),
    )
    for part in response.parts:
        if part.inline_data:
            out.parent.mkdir(parents=True, exist_ok=True)
            part.as_image().save(str(out), format="PNG")
            sidecar = {
                "model": MODEL,
                "prompt": prompt,
                "style_line": STYLE_LINE,
                "references": [str(r.relative_to(ROOT)) for r in refs],
                "aspect": aspect,
                "size": size,
                "generated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
            }
            out.with_suffix(".json").write_text(json.dumps(sidecar, indent=2), encoding="utf-8")
            return out
        if part.text:
            print("model text:", part.text[:300])
    sys.exit(f"no image returned for {out.name}")
```

- [ ] **Step 3: `gen_character.py`**

```python
"""Generate one character sheet: the consistency anchor for every scene.

    python design/pipeline/gen_character.py daniel "a kind man in his forties ..."
"""
import sys
from pathlib import Path

from gen import ROOT, STYLE_REF, generate

FLAT_BG = "on a flat, solid, bright green background (#00ff00), no floor, no shadow, no other objects"

if len(sys.argv) < 3:
    sys.exit("usage: gen_character.py <name> <description>")
name, description = sys.argv[1], " ".join(sys.argv[2:])
out = ROOT / "design/characters" / f"{name}.png"
if out.exists():
    sys.exit(f"{out} exists; delete it to regenerate")
prompt = (
    f"Character sheet for {name}: {description}. Full figure, standing, facing the "
    f"viewer, neutral friendly expression, arms relaxed, centred, {FLAT_BG}."
)
print(generate(prompt, [STYLE_REF], out, aspect="3:4"))
```

- [ ] **Step 4: Generate the two sheets**

```bash
python design/pipeline/gen_character.py daniel "Daniel, a kind man in his forties with warm brown skin, a short dark beard, a white headscarf with a purple band, and a purple robe with a gold sash"
python design/pipeline/gen_character.py lion "a big friendly golden lion with a thick two-tone amber mane, large expressive eyes, pink inner ears and a soft cream muzzle"
```

Read both PNGs. Accept if they read as the intended character in the concept style on a flat green field. Regenerate (delete first) at most twice each; then stop and show the user.

- [ ] **Step 5: `README.md`, roast, commit**

`design/pipeline/README.md`: what each script does, the order (`gen_character` → `gen_scene_layers` → `cutout` → `pack`), `pip install -r requirements.txt`, `GEMINI_API_KEY` with billing enabled, and "outputs under `src/assets/scenes/` are committed; `raw/` is not". Add `design/pipeline/raw/` to `.gitignore`.

```bash
git add design/pipeline design/characters .gitignore
git commit -m "Add Gemini scene pipeline core and Daniel and lion character sheets"
```

---

### Task 2: Den layers: generate, cut out, pack

**Files:**
- Create: `design/pipeline/scenes/daniel-den.json`, `design/pipeline/gen_scene_layers.py`, `design/pipeline/cutout.py`, `design/pipeline/pack.py`
- Create (generated): `src/assets/scenes/daniel/den/bg.webp`, `daniel.webp`, `lion-a.webp`, `lion-b.webp`, `layers.json`

**Interfaces:**
- `layers.json` shape consumed by Task 3:

```json
{
  "background": { "file": "bg.webp", "w": 1600, "h": 1000 },
  "cutouts": {
    "daniel": { "file": "daniel.webp", "w": 620, "h": 900, "trim": [x0, y0, x1, y1], "source": "raw/daniel.png" },
    "lion-a": { "file": "lion-a.webp", "w": 900, "h": 560, "trim": [..], "source": "raw/lion-a.png" },
    "lion-b": { "file": "lion-b.webp", "w": 900, "h": 560, "trim": [..], "source": "raw/lion-b.png" }
  }
}
```

- [ ] **Step 1: Scene manifest `design/pipeline/scenes/daniel-den.json`**

```json
{
  "story": "daniel",
  "scene": "den",
  "background": {
    "aspect": "16:9",
    "prompt": "The lions' den from the reference image, exactly the same room, camera angle, stone wall, floor, round opening in the ceiling with a warm shaft of light falling to the floor, but completely EMPTY: no people, no animals, no figures, nothing on the floor. Keep the centre of the floor clear and lit."
  },
  "cutouts": {
    "daniel": {
      "sheet": "daniel",
      "aspect": "3:4",
      "max_h": 900,
      "prompt": "The character from the second reference image, Daniel, kneeling on both knees facing the viewer, hands pressed together in prayer at his chest, eyes open, calm gentle smile, lit warmly from above. Full figure including knees, centred, on a flat solid bright green background (#00ff00), no floor, no cast shadow, no other objects."
    },
    "lion-a": {
      "sheet": "lion",
      "aspect": "4:3",
      "max_h": 560,
      "prompt": "The lion from the second reference image, lying down at rest, body facing right with the head turned toward the viewer, eyes open, content closed-mouth smile, front paws stretched forward, tail curled behind. Whole animal visible, centred, on a flat solid bright green background (#00ff00), no floor, no cast shadow, no other objects."
    },
    "lion-b": {
      "sheet": "lion",
      "aspect": "4:3",
      "max_h": 560,
      "prompt": "The lion from the second reference image, lying down at rest, body facing right, head up and looking slightly to the left, eyes open, relaxed smile, one front paw over the other. Whole animal visible, centred, on a flat solid bright green background (#00ff00), no floor, no cast shadow, no other objects."
    }
  }
}
```

- [ ] **Step 2: `gen_scene_layers.py`**

```python
"""Generate every raw layer for one scene from its manifest.

    python design/pipeline/gen_scene_layers.py daniel den [layer ...]
Skips layers whose raw PNG already exists; delete a raw file to regenerate it.
"""
import json
import sys
from pathlib import Path

from gen import ROOT, STYLE_REF, generate

if len(sys.argv) < 3:
    sys.exit("usage: gen_scene_layers.py <story> <scene> [layer ...]")
story, scene, *only = sys.argv[1:]
manifest = json.loads((ROOT / f"design/pipeline/scenes/{story}-{scene}.json").read_text(encoding="utf-8"))
raw = ROOT / f"design/pipeline/raw/{story}/{scene}"

def wanted(name: str) -> bool:
    return not only or name in only

if wanted("bg"):
    out = raw / "bg.png"
    if out.exists():
        print("skip bg (exists)")
    else:
        bg = manifest["background"]
        print(generate(bg["prompt"], [STYLE_REF], out, aspect=bg.get("aspect", "16:9")))

for name, spec in manifest["cutouts"].items():
    if not wanted(name):
        continue
    out = raw / f"{name}.png"
    if out.exists():
        print(f"skip {name} (exists)")
        continue
    sheet = ROOT / "design/characters" / f"{spec['sheet']}.png"
    print(generate(spec["prompt"], [STYLE_REF, sheet], out, aspect=spec.get("aspect", "3:4")))
```

- [ ] **Step 3: `cutout.py`**

```python
"""Strip the flat background from raw character PNGs and write WebP cutouts.

    python design/pipeline/cutout.py daniel den
rembg (isnet-general-use) does the matte; the green field makes it easy. Then
trim to content, cap the height, and save WebP with alpha.
"""
import json
import sys
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

from gen import ROOT

if len(sys.argv) < 3:
    sys.exit("usage: cutout.py <story> <scene>")
story, scene = sys.argv[1:3]
manifest = json.loads((ROOT / f"design/pipeline/scenes/{story}-{scene}.json").read_text(encoding="utf-8"))
raw = ROOT / f"design/pipeline/raw/{story}/{scene}"
dest = ROOT / f"src/assets/scenes/{story}/{scene}"
dest.mkdir(parents=True, exist_ok=True)
session = new_session("isnet-general-use")  # first run downloads the model (~170 MB)


def despill(img: Image.Image) -> Image.Image:
    """Kill green spill on soft edges: where a pixel is greener than both red
    and blue, clamp green to the larger of the two. Only semi-transparent
    pixels are touched so solid green clothing (none here) would survive."""
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if 0 < a < 255 and g > max(r, b):
                px[x, y] = (r, max(r, b), b, a)
    return img


report = {}
for name, spec in manifest["cutouts"].items():
    src = raw / f"{name}.png"
    img = Image.open(src).convert("RGBA")
    cut = remove(img, session=session, alpha_matting=True, alpha_matting_foreground_threshold=240,
                 alpha_matting_background_threshold=15, alpha_matting_erode_size=8)
    bbox = cut.getbbox()
    if not bbox:
        sys.exit(f"{name}: nothing left after matting")
    cut = despill(cut.crop(bbox))
    max_h = spec.get("max_h", 900)
    if cut.height > max_h:
        cut = cut.resize((round(cut.width * max_h / cut.height), max_h), Image.LANCZOS)
    out = dest / f"{name}.webp"
    cut.save(out, format="WEBP", quality=88, method=6)
    report[name] = {"file": out.name, "w": cut.width, "h": cut.height, "trim": list(bbox),
                    "source": str(src.relative_to(ROOT)), "bytes": out.stat().st_size}
    print(name, cut.size, f"{out.stat().st_size // 1024} KB")

(dest / "cutouts.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
```

- [ ] **Step 4: `pack.py`**

```python
"""Background to WebP at 1600x1000 (16:10, the stage's viewBox ratio) and the
combined layers.json the scene file reads.

    python design/pipeline/pack.py daniel den
Gemini returns 16:9; the extra width is cropped equally from both sides so the
opening stays centred.
"""
import json
import sys

from PIL import Image

from gen import ROOT

if len(sys.argv) < 3:
    sys.exit("usage: pack.py <story> <scene>")
story, scene = sys.argv[1:3]
raw = ROOT / f"design/pipeline/raw/{story}/{scene}"
dest = ROOT / f"src/assets/scenes/{story}/{scene}"

img = Image.open(raw / "bg.png").convert("RGB")
target_ratio = 1.6
w, h = img.size
if w / h > target_ratio:
    new_w = round(h * target_ratio)
    x0 = (w - new_w) // 2
    img = img.crop((x0, 0, x0 + new_w, h))
else:
    new_h = round(w / target_ratio)
    y0 = (h - new_h) // 2
    img = img.crop((0, y0, w, y0 + new_h))
img = img.resize((1600, 1000), Image.LANCZOS)
out = dest / "bg.webp"
img.save(out, format="WEBP", quality=80, method=6)
print("bg", img.size, f"{out.stat().st_size // 1024} KB")

cutouts = json.loads((dest / "cutouts.json").read_text(encoding="utf-8"))
layers = {"background": {"file": "bg.webp", "w": 1600, "h": 1000, "bytes": out.stat().st_size,
                         "source": "design/pipeline/raw/%s/%s/bg.png" % (story, scene)},
          "cutouts": cutouts}
(dest / "layers.json").write_text(json.dumps(layers, indent=2), encoding="utf-8")
(dest / "cutouts.json").unlink()
total = out.stat().st_size + sum(c["bytes"] for c in cutouts.values())
print(f"scene total {total // 1024} KB (budget 450 KB)")
```

- [ ] **Step 5: Run the pipeline**

```bash
python design/pipeline/gen_scene_layers.py daniel den
python design/pipeline/cutout.py daniel den
python design/pipeline/pack.py daniel den
```

Read every raw PNG and every WebP. Accept a layer when: background is empty of figures and keeps the opening centred; each cutout has clean edges (no green fringe, no missing paws); each character matches its sheet (T11). Regenerate a single layer with `gen_scene_layers.py daniel den <name>` after deleting its raw file, at most twice per layer; then stop and show the user. If the scene total exceeds 450 KB, lower `quality` in `cutout.py`/`pack.py` before touching dimensions.

- [ ] **Step 6: Roast and commit**

Check: sidecars present for every raw; `layers.json` byte counts match `ls -l`; nothing under `raw/` staged.

```bash
git add design/pipeline src/assets/scenes/daniel/den
git commit -m "Generate layered raster assets for the Daniel den scene"
```

---

### Task 3: Raster layer helper and scene composition

**Files:**
- Create: `src/art/raster.tsx`
- Modify: `src/scenes/daniel.tsx` (`IntoTheDen` and imports)

**Interfaces:**
- `Layer({ src, w, h, x, y, scale?, className?, opacity? })`: draws `<image>` anchored at bottom-centre on `(x, y)` in viewBox units, natural size `w`×`h` scaled by `scale`. Nesting: `<g transform>` → `<g className>` → `<image>`.
- `Eyelids({ points, rx, ry, tone })`: `points` in the same local space as the image (after anchoring), one `a-blink` ellipse each, `opacity="0"` at rest.

- [ ] **Step 1: `src/art/raster.tsx`**

```tsx
/**
 * Raster layers inside the SVG stage. A scene is a background image plus
 * character cutouts with alpha, each positioned by an outer <g transform>
 * and animated, if at all, by an inner <g className>. The <image> itself
 * never carries either, so hard constraint 1 cannot be broken from here.
 */
import { VB } from "./base";

export interface LayerProps {
  src: string;
  /** Natural pixel size of the asset. */
  w: number;
  h: number;
  /** Ground point in viewBox units: the image's bottom-centre lands here. */
  x: number;
  y: number;
  /** viewBox units per asset pixel. */
  scale?: number;
  className?: string;
  opacity?: number;
  children?: React.ReactNode;
}

export function Layer({ src, w, h, x, y, scale = 1, className, opacity, children }: LayerProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={className}>
        <image href={src} x={-w / 2} y={-h} width={w} height={h} opacity={opacity} />
        {children}
      </g>
    </g>
  );
}

/** Full-frame background image. */
export function Backdrop({ src }: { src: string }) {
  return (
    <image href={src} x="0" y="0" width={VB.w} height={VB.h} preserveAspectRatio="xMidYMid slice" />
  );
}

/**
 * Blink lids over a cutout's eyes. Points are in the cutout's own pixel
 * space measured from its top-left; they are converted to the Layer's local
 * space (bottom-centre origin) here.
 */
export function Eyelids({
  points,
  w,
  h,
  rx,
  ry,
  tone,
}: {
  points: [number, number][];
  w: number;
  h: number;
  rx: number;
  ry: number;
  tone: string;
}) {
  return (
    <g>
      {points.map(([px, py], i) => (
        <ellipse
          key={i}
          cx={px - w / 2}
          cy={py - h}
          rx={rx}
          ry={ry}
          fill={tone}
          opacity="0"
          className="a-blink"
        />
      ))}
    </g>
  );
}
```

- [ ] **Step 2: Compose `IntoTheDen`**

Imports:

```tsx
import { Backdrop, Eyelids, Layer } from "../art/raster";
import denLayers from "../assets/scenes/daniel/den/layers.json";
import denBg from "../assets/scenes/daniel/den/bg.webp";
import denDaniel from "../assets/scenes/daniel/den/daniel.webp";
import denLionA from "../assets/scenes/daniel/den/lion-a.webp";
import denLionB from "../assets/scenes/daniel/den/lion-b.webp";
```

Body (numbers are the starting composition; the compare loop tunes them):

```tsx
export function IntoTheDen() {
  const L = denLayers.cutouts;
  return (
    <>
      <Backdrop src={denBg} />
      <LightShaft x={500} top={42} topWidth={90} bottomSpread={250} floorY={578} />
      {/* far lion, behind Daniel's shoulder */}
      <Layer src={denLionB} w={L["lion-b"].w} h={L["lion-b"].h} x={640} y={548} scale={0.38} className="a-breathe-slow" />
      <Layer src={denDaniel} w={L.daniel.w} h={L.daniel.h} x={500} y={585} scale={0.36} className="a-breathe">
        <Eyelids points={[[250, 300], [370, 300]]} w={L.daniel.w} h={L.daniel.h} rx={26} ry={30} tone="#c88a5e" />
      </Layer>
      <Layer src={denLionA} w={L["lion-a"].w} h={L["lion-a"].h} x={250} y={610} scale={0.5} className="a-breathe-slow" />
      <Layer src={denLionB} w={L["lion-b"].w} h={L["lion-b"].h} x={760} y={618} scale={0.48} className="a-breathe-slow" />
      <Motes x={500} top={110} bottom={540} spread={200} />
      <Grain opacity={0.08} />
    </>
  );
}
```

The king at the opening: the background prompt asked for an empty den; if the generated background shows the opening clearly, keep the v1 `Person` king at `(500, 62)` as before; if the opening is off-frame after the 16:10 crop, drop the king and move hotspot `king-above` onto the opening's visible position, or onto the light shaft top. Decide from the compare image and record it.

Eye points for `Eyelids`: open `src/assets/scenes/daniel/den/daniel.webp`, read the pixel coordinates of both pupils, and put those numbers in. Lid tone: sample it from the asset, never guess. One-liner, then paste the hex with a comment naming the sample point:

```bash
python -c "from PIL import Image; im=Image.open('src/assets/scenes/daniel/den/daniel.webp').convert('RGB'); x,y=250,300; box=im.crop((x-40,y-70,x+40,y-40)); print('#%02x%02x%02x' % tuple(int(sum(c)/len(c)) for c in zip(*box.getdata())))"
```

Start grain at `opacity={0.05}`: the generated background already carries grain. Same for the lions only if their eyes are open and large enough (rx ≥ 18 px in asset space); otherwise leave lions without blink and note it.

Remove the now-unused v2 imports (`Den2`, `Lion2`, `Person2`) from `daniel.tsx` if `tsc` flags them. Keep the v2 files: they are not deleted in this slice.

- [ ] **Step 3: Compare loop**

```bash
npm run --silent typecheck && npm run --silent check:motion
npm run --silent compare -- daniel/den design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg
```

Read `_vs_ref`. Score T1–T11. Tune `x`, `y`, `scale`, grain opacity, light shaft; regenerate a layer only if the cutout itself is the problem. Log every cycle in `cycles.md` with its image. Cap: six cycles, then show the user.

- [ ] **Step 4: Roast and commit**

Check: every `<image>` is inside a `Layer`/`Backdrop`; `check:motion` clean; eyelid opacity attribute present; hotspot ids untouched; `layers.json` import typed (`resolveJsonModule` is on in Vite's default tsconfig; if `tsc` complains, add `"resolveJsonModule": true` to `tsconfig.json`).

```bash
git add src/art/raster.tsx src/scenes/daniel.tsx tsconfig.json docs/evidence/2026-09-18-layered-raster-den
git commit -m "Compose the Daniel den scene from layered raster assets"
```

---

### Task 4: Browser, offline, size, perf evidence; docs; handoff

**Files:**
- Create: `docs/evidence/2026-09-18-layered-raster-den/record.md`
- Modify: `CLAUDE.md` (rule rewrite), `handoff.md`

- [ ] **Step 1: Build and measure size**

```bash
npm run build 2>&1 | tail -4
ls -l src/assets/scenes/daniel/den
du -sk dist
```

Record: per-file bytes, scene total vs 450 KB, `dist` total, JS gzip.

- [ ] **Step 2: Browser shots**

Preview on 4173 (background runner), headless Chrome on 9222 with a scratch profile (as in the previous slice), then `BASE=http://localhost:4173 OUT=docs/evidence/2026-09-18-layered-raster-den/browser node scripts/shoot.mjs`. Read 10–14. Checks: layers positioned (no collapse), Calm identical to compare render, hotspot tap works, big mode fine, phone shows the scene at full height.

- [ ] **Step 3: Offline check**

DevTools MCP, isolated context: open `http://localhost:4173/#/story/daniel/2`, wait 3 s (service worker installs and precaches), `emulate networkConditions: "Offline"`, reload, screenshot. Expected: scene renders from cache. Save as `browser/15-den-offline.png`. If it fails, check the workbox glob and the `dist/sw.js` precache manifest for the `.webp` entries.

- [ ] **Step 4: Frame probe**

rAF sampler, 4x throttle, isolated context, production preview. Compare with 35.09 ms.

- [ ] **Step 5: Rewrite the rule in `CLAUDE.md`**

Replace the **Ship-nothing-binary rule** section with:

```
## Media rule

Artwork is layered raster (WebP background + character cutouts with alpha)
generated by `design/pipeline/` and composed inside the SVG stage through
`src/art/raster.tsx`. Sound is still synthesised in `src/lib/sound.ts`,
narration still uses `speechSynthesis`, and there are no font files.

Budget: a scene is at most 450 KB (background ≤ 200 KB, each cutout ≤ 80 KB),
recorded in its `layers.json`. Everything precaches for offline use; if the
book outgrows ~12 MB, switch workbox to precache the first story and
runtime-cache the rest.

Every asset has a JSON sidecar with model, prompt, references and date. Raw
generations under `design/pipeline/raw/` are not committed.
```

Update the **Layout** tree (`art/raster.tsx`, `assets/scenes/`), the **Adding a story** steps (generate layers via the pipeline before writing the scene file), and mark `src/art/v2/` as "vector kit from the first slice; superseded, delete when no scene uses it".

- [ ] **Step 6: Record, handoff, commit**

`record.md` in the previous slice's layout, including the final T1–T11 scores, size numbers, offline result, perf numbers, and gaps. `handoff.md` sections 2–5 updated: not for release until the Daniel story is migrated; per-scene pipeline cost from actual timings; `src/art/v2/` cleanup pending.

```bash
git add CLAUDE.md handoff.md docs/evidence/2026-09-18-layered-raster-den
git commit -m "Record layered raster den evidence, rewrite the media rule, update handoff"
```

Send the user `cycle-final.png` and `browser/10-den-phone.png`.

---

## Self-review

**Spec coverage.** Layer model → Task 3. Pipeline steps 1–4 → Tasks 1–2. App changes (vite glob, scene, raster helper) → Tasks 0, 3. Size budget → Task 4. Still-render tooling (loader, PNG swap) → Task 0. Verification table: compare (Task 3), shots (Task 4), check:motion (all), size (Task 4), offline (Task 4), frame cost (Task 4), provenance (Tasks 1–2 sidecars). Blink via `Eyelids` (Task 3). Tail sway dropped (spec says so).

**Placeholders.** Eye pixel coordinates in Task 3 are read from the actual asset; the plan gives starting numbers and says how to replace them. `layers.json` `trim` values are produced by `cutout.py`.

**Type consistency.** `Layer` props match the Task 3 uses. `layers.json` shape from Task 2 matches `denLayers.cutouts[...]` reads in Task 3. `generate()` signature identical between `gen.py`, `gen_character.py`, `gen_scene_layers.py`.
