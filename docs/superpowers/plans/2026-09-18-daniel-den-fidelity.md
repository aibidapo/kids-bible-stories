# Daniel Den Fidelity Pass Implementation Plan (SHELVED 2026-09-18: superseded by docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Push the v2 Daniel den scene materially closer to `design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`, judged by a side-by-side comparison at full render size against a fixed trait checklist, not by the implementer's impression.

**Architecture:** Same `src/art/v2/` kit and same scene. Adds a comparison tool, a richer shading vocabulary in `effects.tsx` (shadow, highlight, occlusion shapes), and rebuilds `Den2`, `Lion2`, `Person2` part by part with more geometry. Static layers may use SVG filters; animated groups may not.

**Tech Stack:** as before. `sharp` for full-size renders and the side-by-side composite.

**Spec:** `docs/superpowers/specs/2026-09-18-daniel-den-style6-design.md` (style contract still applies; this plan raises fidelity within it). Prior slice evidence: `docs/evidence/2026-09-18-daniel-den-v2/record.md`.

## Global Constraints

- All constraints from `docs/superpowers/plans/2026-09-18-daniel-den-style6.md` Global Constraints still apply: viewBox 1000×625, hard constraints 1 and 2, ship-nothing-binary, Calm rest states from attributes, no `filter` inside an animated group, portrait safe zone x 90–910, tablet safe zone y ≥ 225, seeded `rand()` only, no AI attribution.
- **Comparison gate.** No figure task is done until its checklist rows pass in the side-by-side at 1000×625, or six render cycles have been spent, in which case the task stops and the current side-by-side is shown to the user with the failing rows named.
- **Filters:** `feGaussianBlur` and `feTurbulence` are allowed on static groups only (wall, floor, light, grain). `Lion2` and `Person2` internals stay filter-free.
- Every task ends with `npm run check:motion`, `npm run typecheck`, a roast of the diff, and a commit through the hook.

## Trait checklist (the gate)

Scored per cycle in `docs/evidence/2026-09-18-daniel-den-fidelity/cycles.md`, one row per trait, pass/fail, with the cycle's side-by-side filename. A trait passes when the render shows the trait clearly at 1000×625 without knowing what to look for.

| # | Trait | Owner task |
|---|---|---|
| T1 | Stones are irregular in shape and size, not a grid | Task 2 |
| T2 | Mortar gaps read as dark recesses; stones have a lit top-left edge | Task 2 |
| T3 | Room falls into darkness at the corners; only the shaft region is bright | Task 2 |
| T4 | Wall casts a visible soft shadow onto the floor along its base | Task 2 |
| T5 | Lion mane is many tapered tufts in two tones, not a ring of circles | Task 3 |
| T6 | Lion body has a chest, a belly curve, and four visible paws with toes | Task 3 |
| T7 | Lion head casts an occlusion shadow onto the mane and body | Task 3 |
| T8 | Daniel's robe shows folds; sleeves have cuffs; hands have fingers | Task 4 |
| T9 | Scarf drapes with a visible fold and casts a shadow onto the face and shoulders | Task 4 |
| T10 | Grain is visible at phone size (390 wide) without zooming | Task 2 |

---

## File map

| Path | Responsibility |
|---|---|
| `scripts/compare.tsx` | Render one scene at 1000×625, composite it under/next to a reference image, write both PNGs |
| `package.json` | `npm run compare -- <sceneKey> <referencePath>` |
| `src/art/v2/effects.tsx` | Add `Shadow`, `Highlight`, `Occlusion` primitives |
| `src/art/v2/den.tsx` | Irregular stones, room light, base shadow, blur depth |
| `src/art/v2/lion.tsx` | Anatomy and mane rebuild |
| `src/art/v2/person.tsx` | Robe, sleeves, hands, scarf rebuild |
| `docs/evidence/2026-09-18-daniel-den-fidelity/` | `cycles.md`, side-by-sides per cycle, final record |

Compare command used throughout:

```bash
npm run --silent compare -- daniel/den design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg
```

Writes `scratch/compare/daniel-den.png` (1000×625) and `scratch/compare/daniel-den_vs_ref.png` (render on top, reference below, both 1000 wide). Read the `_vs_ref` image with the Read tool, score the checklist, copy the image into the evidence folder as `cycle-NN.png`.

---

### Task 1: Comparison tool

**Files:**
- Create: `scripts/compare.tsx`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: `npm run compare -- <sceneKey> <referencePath>`; exit 1 if the scene key is unknown or the reference cannot be read.

- [ ] **Step 1: Write the tool**

```tsx
/**
 * Side-by-side for reference-driven art work: renders one registered scene at
 * full 1000x625 (animations frozen, same still Calm mode shows) and stacks it
 * above a reference image scaled to the same width. Judge the art from this
 * image, never from the 500px contact sheet.
 *
 *   npm run compare -- daniel/den design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { createElement } from 'react'
import sharp from 'sharp'
import { SCENE_ART } from '../src/scenes/index'

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

const inner = renderToStaticMarkup(createElement(Art, { active: true, animate: false, found: [] }))
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inner}</svg>`
const render = await sharp(Buffer.from(svg)).png().toBuffer()
writeFileSync(`${OUT}/${name}.png`, render)

const reference = await sharp(ref).resize({ width: W }).png().toBuffer()
const refMeta = await sharp(reference).metadata()
const refH = refMeta.height ?? H
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

- [ ] **Step 2: Wire the script**

In `package.json` `scripts`:

```json
    "compare": "esbuild scripts/compare.tsx --bundle --platform=node --format=esm --jsx=automatic --packages=external --outfile=scratch/compare.mjs --log-level=warning && node scratch/compare.mjs"
```

- [ ] **Step 3: Run it on the current scene**

Run the compare command. Expected: two files written. Read `scratch/compare/daniel-den_vs_ref.png`. This is cycle 00. Create `docs/evidence/2026-09-18-daniel-den-fidelity/`, copy the image as `cycle-00.png`, and start `cycles.md`:

```markdown
# Fidelity cycles: daniel/den vs concept 6

Scored from scratch/compare/daniel-den_vs_ref.png at 1000x625. Pass = trait visible without being told where to look.

| Cycle | Task | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | Image | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 00 | baseline (628e08b) | F | F | F | F | F | F | F | F | F | F | cycle-00.png | starting point |
```

- [ ] **Step 4: Review gate and commit**

`npm run typecheck`. Roast the tool (does it render the same markup the app uses? does it fail loudly on a bad key?). Then:

```bash
git add scripts/compare.tsx package.json docs/evidence/2026-09-18-daniel-den-fidelity
git commit -m "Add compare script: full-size scene render stacked over a reference image"
```

---

### Task 2: Shading primitives and the den rebuild (T1–T4, T10)

**Files:**
- Modify: `src/art/v2/effects.tsx` (append)
- Modify: `src/art/v2/den.tsx` (rewrite `Den2`)

**Interfaces:**
- Produces in `effects.tsx`:
  - `Occlusion({ x, y, rx, ry, opacity? })` — a radial ink gradient ellipse for contact shadow where one part sits on another. Same shape as `SoftShadow`, different defaults (`ry = rx * 0.5`, `opacity = 0.35`).
  - `Highlight({ d, width?, opacity? })` — a cream stroke path with round caps for a lit edge.
  - `RoomLight({ x, y, r, warm?, dark? })` — full-frame radial gradient: warm transparent centre falling to a dark edge, laid over a background to make corners recede.
- Produces in `den.tsx`: `Den2()` unchanged signature.

- [ ] **Step 1: Add the primitives to `effects.tsx`**

```tsx
/** Contact shadow where one part rests on another. Gradient ellipse, no filter. */
export function Occlusion({
  x,
  y,
  rx,
  ry = rx * 0.5,
  opacity = 0.35,
}: {
  x: number;
  y: number;
  rx: number;
  ry?: number;
  opacity?: number;
}) {
  const id = useId();
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={C.ink} stopOpacity="1" />
          <stop offset="55%" stopColor={C.ink} stopOpacity="0.6" />
          <stop offset="100%" stopColor={C.ink} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id})`} opacity={opacity} />
    </g>
  );
}

/** Lit edge: a cream stroke along the side facing the light. */
export function Highlight({
  d,
  width = 4,
  opacity = 0.35,
}: {
  d: string;
  width?: number;
  opacity?: number;
}) {
  return (
    <path
      d={d}
      stroke={C.cream}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
      opacity={opacity}
    />
  );
}

/**
 * Room-wide light falloff: warm and clear where the light lands, dark at the
 * edges. Laid over the background, under the figures.
 */
export function RoomLight({
  x = 500,
  y = 520,
  r = 620,
  warm = "#ffd98a",
  dark = "#120c14",
}: {
  x?: number;
  y?: number;
  r?: number;
  warm?: string;
  dark?: string;
}) {
  const id = useId();
  return (
    <g pointerEvents="none">
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={x} cy={y} r={r}>
          <stop offset="0%" stopColor={warm} stopOpacity="0.18" />
          <stop offset="35%" stopColor={warm} stopOpacity="0" />
          <stop offset="70%" stopColor={dark} stopOpacity="0.45" />
          <stop offset="100%" stopColor={dark} stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <rect width={VB.w} height={VB.h} fill={`url(#${id})`} />
    </g>
  );
}
```

- [ ] **Step 2: Rewrite `Den2`**

Replace the whole file:

```tsx
import { useId } from "react";
import { rand, randIn } from "../palette";
import { VB } from "../base";
import { Shaded, RoomLight, Highlight } from "./effects";
import { darken, lighten } from "./tone";

const WALL = "#8a6f5f";
const MORTAR = "#2a1d1c";
const FLOOR = "#6d574d";
const OPENING = "#ffe9b8";

/**
 * One stone: an irregular rounded polygon (8 jittered corners), its own
 * gradient, a lit top-left edge and a dark bottom-right edge. Static, so the
 * whole wall can sit under a blur for depth.
 */
function stonePath(x: number, y: number, w: number, h: number, seed: number): string {
  // 8 points around the rect, each nudged inward/outward by up to 9% so no two
  // stones share a silhouette. Rounded via quadratic joins.
  const pts: [number, number][] = [
    [x + w * 0.08, y],
    [x + w * 0.55, y],
    [x + w, y + h * 0.1],
    [x + w, y + h * 0.6],
    [x + w * 0.92, y + h],
    [x + w * 0.4, y + h],
    [x, y + h * 0.88],
    [x, y + h * 0.35],
  ].map(([px, py], i) => [
    px + randIn(seed + i * 0.13, -w * 0.06, w * 0.06),
    py + randIn(seed + i * 0.29, -h * 0.09, h * 0.09),
  ]);
  const mid = (a: [number, number], b: [number, number]): [number, number] => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];
  let d = `M${mid(pts[7], pts[0]).map((v) => v.toFixed(1)).join(",")}`;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const n = pts[(i + 1) % pts.length];
    const m = mid(p, n);
    d += ` Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`;
  }
  return d + " Z";
}

export function Den2() {
  const blur = useId();
  const edge = useId();
  const rows = 6;
  const blockH = 78;

  const stones: { d: string; x: number; y: number; w: number; h: number; seed: number }[] = [];
  for (let r = 0; r < rows; r++) {
    const y = -10 + r * (blockH + 6);
    let x = r % 2 === 0 ? -30 : -90;
    let c = 0;
    while (x < VB.w + 40) {
      const seed = r * 53 + c * 7;
      const w = randIn(seed, 110, 190);
      const h = blockH + randIn(seed + 0.5, -10, 8);
      stones.push({ d: stonePath(x, y, w, h, seed), x, y, w, h, seed });
      x += w + 8;
      c++;
    }
  }

  return (
    <g>
      <rect width={VB.w} height={VB.h} fill={MORTAR} />

      <defs>
        <filter id={blur} x="-2%" y="-2%" width="104%" height="104%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <linearGradient id={edge} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0a0c" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0f0a0c" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* wall: every stone gets its own tone so the surface isn't uniform */}
      <g filter={`url(#${blur})`}>
        {stones.map((s) => {
          const tone = rand(s.seed + 0.7);
          const base = tone < 0.33 ? darken(WALL, 0.12) : tone < 0.66 ? WALL : lighten(WALL, 0.08);
          return (
            <Shaded key={s.seed} base={base} light={0.2} dark={0.5}>
              {(fill) => (
                <g>
                  <path d={s.d} fill={fill} />
                  <Highlight
                    d={`M${(s.x + s.w * 0.1).toFixed(1)},${(s.y + s.h * 0.14).toFixed(1)} Q${(s.x + s.w * 0.45).toFixed(1)},${(s.y + s.h * 0.04).toFixed(1)} ${(s.x + s.w * 0.85).toFixed(1)},${(s.y + s.h * 0.12).toFixed(1)}`}
                    width={3}
                    opacity={0.22}
                  />
                  <path
                    d={`M${(s.x + s.w * 0.18).toFixed(1)},${(s.y + s.h * 0.92).toFixed(1)} Q${(s.x + s.w * 0.6).toFixed(1)},${(s.y + s.h * 1.0).toFixed(1)} ${(s.x + s.w * 0.94).toFixed(1)},${(s.y + s.h * 0.8).toFixed(1)}`}
                    stroke={MORTAR}
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.55"
                  />
                </g>
              )}
            </Shaded>
          );
        })}
      </g>

      {/* the opening, lit from the day above */}
      <ellipse cx="500" cy="42" rx="92" ry="26" fill={OPENING} />

      <Shaded base={FLOOR} light={0.16} dark={0.5}>
        {(fill) => (
          <path
            d={`M0,478 Q250,462 500,470 Q750,462 1000,478 L1000,${VB.h} L0,${VB.h} Z`}
            fill={fill}
          />
        )}
      </Shaded>
      {/* wall base casts onto the floor */}
      <path
        d="M0,478 Q250,462 500,470 Q750,462 1000,478 L1000,530 Q750,514 500,522 Q250,514 0,530 Z"
        fill={`url(#${edge})`}
      />

      <RoomLight x={500} y={540} r={640} />
    </g>
  );
}
```

- [ ] **Step 3: Raise grain visibility**

In `src/scenes/daniel.tsx`, change `<Grain />` to `<Grain opacity={0.11} />`. In `effects.tsx` `Grain`, change `baseFrequency="0.9"` to `baseFrequency="0.65"` so the grain is coarser and survives downscaling to a phone.

- [ ] **Step 4: Compare loop**

Run typecheck, `check:motion`, then the compare command. Read `_vs_ref`. Score T1–T4 and T10. Copy to `cycle-01.png`, append a row to `cycles.md`. If any of T1–T4, T10 fail: adjust numbers (stone jitter, tone spread, `RoomLight` stops, mortar stroke width, grain opacity), re-run, `cycle-02.png`, and so on. Stop at six cycles for this task.

- [ ] **Step 5: Review gate and commit**

Roast the diff. Confirm: no filter inside an animated group (`Den2` has none); `check:motion` clean. Then:

```bash
git add src/art/v2/effects.tsx src/art/v2/den.tsx src/scenes/daniel.tsx docs/evidence/2026-09-18-daniel-den-fidelity
git commit -m "Den2 fidelity: irregular stones, mortar recesses, room light falloff, visible grain"
```

---

### Task 3: Lion2 anatomy and mane (T5–T7)

**Files:**
- Modify: `src/art/v2/lion.tsx` (rewrite body and mane; keep `Eye`, props, blink)

**Interfaces:**
- `Lion2Props` unchanged. Local coordinates unchanged: ground y=0, faces right, head centre stays near (60,-78) so scene placements still work.

- [ ] **Step 1: Rewrite the body, paws and mane**

Replace everything inside `<g className="a-breathe-slow">` with:

```tsx
        {/* body: haunch, barrel with belly curve, chest */}
        <Shaded base={BODY} light={0.26} dark={0.42}>
          {(fill) => (
            <g>
              <circle cx="-88" cy="-48" r="44" fill={fill} />
              <path
                d="M-120,-30 Q-110,-96 -20,-92 Q60,-92 70,-40 Q60,-4 -10,-2 Q-100,0 -120,-30 Z"
                fill={fill}
              />
              <ellipse cx="34" cy="-52" rx="40" ry="36" fill={fill} />
            </g>
          )}
        </Shaded>
        {/* belly is lighter */}
        <path d="M-96,-14 Q-30,10 40,-8 Q-20,-2 -96,-14 Z" fill={lighten(BODY, 0.28)} opacity="0.8" />
        <Highlight d="M-112,-58 Q-60,-98 20,-86" width={5} opacity={0.3} />
        <Occlusion x={-88} y={-6} rx={44} ry={10} opacity={0.3} />

        {/* four paws with toe lines: back pair further back, front pair forward */}
        <Shaded base={BODY} light={0.3} dark={0.3}>
          {(fill) => (
            <g>
              <rect x="-124" y="-22" width="44" height="24" rx="12" fill={fill} />
              <rect x="-70" y="-18" width="44" height="20" rx="10" fill={fill} />
              <rect x="0" y="-26" width="50" height="26" rx="13" fill={fill} />
              <rect x="42" y="-22" width="50" height="24" rx="12" fill={fill} />
            </g>
          )}
        </Shaded>
        {[-104, -50, 24, 66].map((px, i) => (
          <path
            key={i}
            d={`M${px - 8},-4 v-8 M${px},-4 v-9 M${px + 8},-4 v-8`}
            stroke={darken(BODY, 0.35)}
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.7"
          />
        ))}

        {/* mane: back layer dark tufts, front layer mid tufts, each a tapered leaf */}
        {[
          { tone: darken(MANE, 0.25), count: 16, r1: 44, r2: 84, phase: 0 },
          { tone: MANE, count: 14, r1: 40, r2: 72, phase: 0.5 },
        ].map((layer, li) => (
          <Shaded key={li} base={layer.tone} light={0.18} dark={0.4}>
            {(fill) => (
              <g>
                {Array.from({ length: layer.count }, (_, i) => {
                  const a = ((i + layer.phase) / layer.count) * Math.PI * 2;
                  const len = layer.r2 + randIn(li * 100 + i, -8, 10);
                  const x1 = 60 + Math.cos(a) * layer.r1;
                  const y1 = -78 + Math.sin(a) * layer.r1;
                  const x2 = 60 + Math.cos(a) * len;
                  const y2 = -78 + Math.sin(a) * len;
                  const nx = -Math.sin(a) * 16;
                  const ny = Math.cos(a) * 16;
                  return (
                    <path
                      key={i}
                      d={`M${(x1 + nx).toFixed(1)},${(y1 + ny).toFixed(1)} Q${x2.toFixed(1)},${y2.toFixed(1)} ${(x1 - nx).toFixed(1)},${(y1 - ny).toFixed(1)} Z`}
                      fill={fill}
                    />
                  );
                })}
                <circle cx="60" cy="-78" r={layer.r1 + 8} fill={fill} />
              </g>
            )}
          </Shaded>
        ))}
        {/* head rests in the mane: occlusion ring */}
        <Occlusion x={60} y={-78} rx={52} ry={52} opacity={0.22} />
```

Then keep the existing head block (`Shaded base={FACE}` onwards) unchanged, and add after the ears' pink inner circles:

```tsx
        <Occlusion x={60} y={-36} rx={40} ry={8} opacity={0.3} />
        <Highlight d="M28,-108 Q50,-124 84,-112" width={4} opacity={0.3} />
```

Add `import { darken, lighten } from "./tone";` and extend the effects import to `{ Shaded, SoftShadow, Occlusion, Highlight }`.

- [ ] **Step 2: Compare loop**

Typecheck, `check:motion`, compare. Score T5–T7. Iterate up to six cycles: tuft length/width, layer tones, paw placement, occlusion strength. Log each cycle.

- [ ] **Step 3: Review gate and commit**

Roast. Confirm one breathe group per lion, eyelids unchanged, tail unchanged. Then:

```bash
git add src/art/v2/lion.tsx docs/evidence/2026-09-18-daniel-den-fidelity
git commit -m "Lion2 fidelity: layered tapered mane, chest and belly, four paws, contact shadows"
```

---

### Task 4: Person2 robe, hands and scarf (T8–T9)

**Files:**
- Modify: `src/art/v2/person.tsx`

**Interfaces:**
- `Person2Props` unchanged. Ground and head positions unchanged.

- [ ] **Step 1: Rebuild robe, sleeves, hands, scarf**

Inside `<g className="a-breathe">`, replace the robe `Shaded` block and the sash with:

```tsx
        <Shaded base={robe} light={0.26} dark={0.42}>
          {(fill) => (
            <g>
              {/* kneeling skirt with a knee bulge each side, then torso */}
              <path d="M-66,0 Q-76,-30 -60,-60 Q-52,-84 -46,-88 L46,-88 Q52,-84 60,-60 Q76,-30 66,0 Z" fill={fill} />
              <path d="M-46,-90 Q-48,-150 -30,-158 L30,-158 Q48,-150 46,-90 Z" fill={fill} />
              <path d={sleeves.left} fill={fill} />
              <path d={sleeves.right} fill={fill} />
            </g>
          )}
        </Shaded>
        {/* folds: darker creases falling from the waist, and a shadow under the sash */}
        {["M-30,-70 Q-34,-40 -40,-4", "M-8,-70 Q-6,-40 -10,-4", "M22,-70 Q28,-40 34,-4"].map((d) => (
          <path key={d} d={d} stroke={darken(robe, 0.35)} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.35" />
        ))}
        <Occlusion x={0} y={-72} rx={48} ry={9} opacity={0.35} />
        <rect x="-47" y="-92" width="94" height="14" rx="7" fill={sash} opacity="0.95" />
        <path d="M-47,-85 h94" stroke={darken(sash, 0.3)} strokeWidth="3" opacity="0.5" />
        {/* cuffs */}
        <path d="M-30,-104 q10,8 22,4" stroke={darken(robe, 0.4)} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M30,-104 q-10,8 -22,4" stroke={darken(robe, 0.4)} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
        <Highlight d="M-40,-150 Q-50,-110 -44,-80" width={4} opacity={0.32} />
```

Replace the `sleeves` for `pray` with fuller shapes:

```tsx
          left: "M-42,-150 Q-70,-118 -50,-92 Q-28,-84 -8,-98 L-6,-124 Z",
          right: "M42,-150 Q70,-118 50,-92 Q28,-84 8,-98 L6,-124 Z",
```

Replace the `pray` hands with fingered hands:

```tsx
      <g>
        <path d="M-14,-96 Q-16,-126 -4,-130 L4,-130 Q16,-126 14,-96 Q0,-90 -14,-96 Z" />
        <path d="M-9,-104 v-18 M-3,-102 v-22 M3,-102 v-22 M9,-104 v-18" stroke={darken(skin, 0.35)} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>
```

Scarf: replace the scarf `Shaded` block, band and rim with:

```tsx
        <Shaded base={SCARF} light={0.05} dark={0.34}>
          {(fill) => (
            <g>
              <path
                d="M-48,-206 Q-56,-258 0,-252 Q56,-258 48,-206 L58,-140 Q40,-150 30,-160 Q26,-176 26,-206 Q0,-234 -26,-206 Q-26,-176 -30,-160 Q-40,-150 -58,-140 Z"
                fill={fill}
              />
              {/* drape fold on the right fall */}
              <path d="M38,-200 Q44,-170 46,-146" stroke={darken(SCARF, 0.3)} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
              <path d="M-38,-200 Q-44,-170 -46,-146" stroke={darken(SCARF, 0.3)} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
            </g>
          )}
        </Shaded>
        {/* scarf casts onto the forehead and the shoulders */}
        <path d="M-26,-206 Q0,-226 26,-206 Q0,-214 -26,-206 Z" fill={C.ink} opacity="0.28" />
        <Occlusion x={-40} y={-146} rx={16} ry={10} opacity={0.3} />
        <Occlusion x={40} y={-146} rx={16} ry={10} opacity={0.3} />
        <rect x="-46" y="-228" width="92" height="10" rx="5" fill={darken(robe, 0.25)} />
        <Highlight d="M-38,-238 Q-48,-212 -42,-188" width={4} opacity={0.4} />
```

Extend the imports: `import { Shaded, SoftShadow, Occlusion, Highlight } from "./effects";`.

- [ ] **Step 2: Compare loop**

Typecheck, `check:motion`, compare. Score T8–T9. Iterate up to six cycles. Log each cycle.

- [ ] **Step 3: Review gate and commit**

Roast. Confirm hands carry no class, scarf still covers the crown, `check:motion` clean. Then:

```bash
git add src/art/v2/person.tsx docs/evidence/2026-09-18-daniel-den-fidelity
git commit -m "Person2 fidelity: robe folds, cuffs, fingered hands, draped scarf with shadows"
```

---

### Task 5: Whole-scene pass, browser check, evidence, handoff

**Files:**
- Modify: `src/scenes/daniel.tsx` if placement needs it
- Create: `docs/evidence/2026-09-18-daniel-den-fidelity/record.md`
- Modify: `handoff.md`

- [ ] **Step 1: Final compare and full checklist**

Run compare. Score all ten traits. Copy to `cycle-final.png`. Any remaining fails are listed by number in the record; the task does not silently pass them.

- [ ] **Step 2: Browser shots and motion**

`npm run build`, preview on 4173 (background runner), headless Chrome on 9222 with a scratch profile, `BASE=http://localhost:4173 OUT=docs/evidence/2026-09-18-daniel-den-fidelity/browser node scripts/shoot.mjs`. Read shots 10–12 (phone, tablet, Calm). Confirm figures positioned, Calm still identical to the compare render, grain visible on the phone shot (T10).

- [ ] **Step 3: Frame probe**

Same rAF sampler as the previous slice, isolated context, 4x throttle, production preview. Compare against the previous slice's 35.09 ms. Blur on the wall group is the suspect if it regresses; if avg rises more than 20%, drop the `feGaussianBlur` and re-measure.

- [ ] **Step 4: Record and handoff**

`record.md` follows the previous slice's record layout: scope, identity, environment, procedures/results, review, gaps. Include the final checklist scores. Update `handoff.md` sections 2–5. Commit:

```bash
git add src/scenes/daniel.tsx docs/evidence/2026-09-18-daniel-den-fidelity handoff.md
git commit -m "Record den fidelity pass evidence and update handoff"
```

Then send the user `cycle-final.png` and the phone shot.

---

## Self-review

**Spec coverage.** Style contract items (layers, forms, rim light, faces, light, grain) all still implemented; this plan raises fidelity on layers (T4, T7, T9), forms (T6, T8), light (T3), grain (T10), plus wall irregularity (T1, T2) and mane (T5). Every trait has an owning task. Comparison gate is Task 1's tool used in Tasks 2–5.

**Placeholders.** None. Cycle logging rows are filled per cycle from actual scores.

**Type consistency.** `Occlusion` and `Highlight` signatures match every use in Tasks 3 and 4. `RoomLight` used only in Task 2. `Lion2Props`, `Person2Props` unchanged so `daniel.tsx` needs no edit unless placement is tuned in Task 5.
