# Daniel Den Scene in Style 6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `daniel/den` scene with a new v2 SVG art kit that matches the soft-shaded cutout reference, animates, and holds a composed still under Calm mode.

**Architecture:** A parallel kit under `src/art/v2/` (effects, den, lion, person) composed by one scene. Depth comes from stacked layers with gradient shadow ellipses; form comes from bounding-box-relative radial gradients so one gradient serves every part of a figure. No SVG filter touches anything that moves.

**Tech Stack:** React 18, TypeScript 5.6, Vite 8, inline SVG, CSS animations in `src/styles/motion.css`, `sharp` for still renders, CDP for browser shots.

**Spec:** `docs/superpowers/specs/2026-09-18-daniel-den-style6-design.md`

## Global Constraints

- viewBox is `1000 x 625`. Hotspot `x`/`y` are percentages of that box.
- Hard constraint 1: never put an `a-*` class on an element that carries a `transform` attribute. Outer `<g transform>` positions, inner `<g className>` animates.
- Hard constraint 2: animation pivots live in `motion.css` as percentages; never user-space `transform-origin` in components.
- Ship-nothing-binary: no image, audio, or font files under `src/` or `public/`.
- Calm mode: every animated element needs a sensible rest state with animation removed. Rest opacity/position come from attributes, never from keyframes.
- Performance rule: no `filter` on any element inside an animated group. Grain filter sits on one static rect only.
- Portrait safe zone: stage frame is 4:3 in portrait with `slice`, so keep story-critical art between x=90 and x=910.
- Deterministic art: use `rand()` / `randIn()` from `src/art/palette.ts`, never `Math.random()`.
- No unit-test runner exists. Mechanical gate for every task is `npm run check:motion` (hard constraints 1 and 2, all scenes) then `npm run typecheck`. Visual check is the still render, then looking at the PNG. State this split honestly in evidence.
- No AI attribution in commits.
- Every task ends with an adversarial review of the diff (`roast` skill) before its commit. A finding left unaddressed blocks the commit.

---

## File map

| Path | Responsibility |
|---|---|
| `.githooks/pre-commit` | Local gate: motion lint + typecheck + build, blocks commit on failure |
| `scripts/check-motion.tsx` | Renders every scene's markup, fails on an `a-*` class with a `transform` attribute or an inline `transform-origin` |
| `src/art/v2/tone.ts` | Pure hex colour maths: `mix`, `lighten`, `darken` |
| `src/art/v2/effects.tsx` | `Shaded` (bbox radial gradient), `SoftShadow`, `LightShaft`, `Grain`, `Motes` |
| `src/art/v2/den.tsx` | `Den2`: stone wall, floor, opening, vignette |
| `src/art/v2/lion.tsx` | `Lion2`: lying lion, big face, tail, blink, `asleep` |
| `src/art/v2/person.tsx` | `Person2`: kneeling figure, poses `pray`/`kneel`, faces `calm`/`happy` |
| `src/scenes/daniel.tsx` | `IntoTheDen` recomposed from v2 |
| `src/data/stories/daniel.ts` | Hotspot coordinates for scene `den` |
| `src/styles/motion.css` | `.a-blink` |
| `scripts/shoot.mjs` | Five den screenshots |
| `docs/evidence/2026-09-18-daniel-den-v2/record.md` | Evidence record |
| `CLAUDE.md` | v2 kit, hook activation |
| `handoff.md` | Session handoff |

Render command used throughout (from repo root, Git Bash):

```bash
npx esbuild scripts/render-scenes.tsx --bundle --platform=node --format=esm \
  --jsx=automatic --packages=external --outfile=scratch/render.mjs \
  && OUT_DIR=scratch/scenes node scratch/render.mjs 2>&1 | tail -3
```

Then open `scratch/scenes/daniel-den.png` with the Read tool.

---

### Task 0: Local pre-commit gate

**Files:**
- Create: `.githooks/pre-commit`
- Modify: `CLAUDE.md` (Commands section)

**Interfaces:**
- Produces: a hook every later commit passes through.

- [ ] **Step 1: Write the hook**

```sh
#!/bin/sh
# Local pre-commit gate. CI is a mirror of this, never a replacement.
# Activate once per clone:  git config core.hooksPath .githooks
# `npm run build` runs `tsc -b` first, so this is typecheck + build in one.
set -e
echo "pre-commit: motion constraints"
npm run --silent check:motion
echo "pre-commit: typecheck + build"
npm run --silent build
```

Save as `.githooks/pre-commit`. `check:motion` is added in Task 0b; until then the hook fails on that line, which is expected and is why Task 0 and 0b commit together. Then:

```bash
git config core.hooksPath .githooks
git config core.hooksPath   # prints .githooks
git add .githooks/pre-commit
git update-index --chmod=+x .githooks/pre-commit   # NTFS has no exec bit; set it in the index for Linux clones
git ls-files -s .githooks/pre-commit                # mode must read 100755
```

- [ ] **Step 2: Continue to Task 0b**

The hook cannot pass until `check:motion` exists. Task 0b adds it, documents
activation, proves the gate in both directions, and commits both together.

---

### Task 0b: Motion-constraint lint

**Files:**
- Create: `scripts/check-motion.tsx`
- Modify: `package.json` (scripts)
- Modify: `CLAUDE.md` (Commands and Verifying changes)

**Interfaces:**
- Produces: `npm run check:motion`, exit 1 with a per-element report if any registered scene breaks hard constraint 1 or 2.

- [ ] **Step 1: Write the checker**

```tsx
/**
 * Mechanical check for the two hard constraints in CLAUDE.md, run on every
 * registered scene's static markup:
 *
 * 1. No element carries both an `a-*` class and a `transform` attribute
 *    (the CSS animation would override the attribute and collapse the element).
 * 2. No inline `transform-origin` (pivots live in motion.css as percentages).
 *
 * Exit 1 with one line per offence. No browser, no sharp: fast enough for a
 * pre-commit hook.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { SCENE_ART } from '../src/scenes/index'

const tag = /<([a-zA-Z][\w-]*)\b([^>]*)>/g
const offences: string[] = []

for (const key of Object.keys(SCENE_ART)) {
  const html = renderToStaticMarkup(
    createElement(SCENE_ART[key], { active: true, animate: true, found: [] }),
  )
  for (const m of html.matchAll(tag)) {
    const attrs = m[2]
    const cls = /\bclass="([^"]*)"/.exec(attrs)?.[1] ?? ''
    const animated = cls.split(/\s+/).some((c) => c.startsWith('a-'))
    if (animated && /\btransform="/.test(attrs)) {
      offences.push(`${key}: <${m[1]} class="${cls}"> also has a transform attribute`)
    }
    if (/transform-origin\s*:/.test(attrs)) {
      offences.push(`${key}: <${m[1]}> has an inline transform-origin`)
    }
  }
}

if (offences.length) {
  console.error(`check-motion: ${offences.length} offence(s)`)
  for (const o of offences) console.error(' -', o)
  process.exit(1)
}
console.log(`check-motion: ${Object.keys(SCENE_ART).length} scenes clean`)
```

- [ ] **Step 2: Wire the script**

In `package.json` `scripts`, add:

```json
    "check:motion": "esbuild scripts/check-motion.tsx --bundle --platform=node --format=esm --jsx=automatic --packages=external --outfile=scratch/check-motion.mjs --log-level=warning && node scratch/check-motion.mjs"
```

`esbuild` is already a transitive dependency of Vite and resolvable from `node_modules/.bin`; if `npm run check:motion` reports it missing, add `"esbuild": "^0.25.0"` to `devDependencies` and run `npm install`.

Run: `npm run check:motion`
Expected: `check-motion: 26 scenes clean`, exit 0.

- [ ] **Step 3: Prove the checker fails**

Temporarily edit `src/art/props.tsx` `PitLight`: change `<g className="a-pulse-soft">` to `<g className="a-pulse-soft" transform="translate(0 0)">`.

Run: `npm run check:motion`
Expected: exit 1, offence lines naming `daniel/den` and `daniel/angel` (both use `PitLight`). Save output to `docs/evidence/2026-09-18-daniel-den-v2/check-motion-reject.txt`. Revert the edit and confirm `git diff --stat src/art/props.tsx` is empty.

- [ ] **Step 4: Document in CLAUDE.md**

In `## Commands`, after the `npm run icons` line, add:

```
npm run check:motion   # hard-constraint lint: no a-* class on a transform'd element
git config core.hooksPath .githooks   # once per clone: pre-commit runs check:motion + build
```

After the paragraph "There is no test suite…", add:

```
`.githooks/pre-commit` runs `check:motion` and `build` and refuses the commit on
failure. Activate it once per clone with the command above. It does not lint,
format, unit-test, or secret-scan; those gates are not installed yet.
```

In `## Verifying changes`, after the sentence about `render-scenes.tsx` not catching constraint 1, add:

```
`npm run check:motion` does catch it, mechanically, for every registered scene.
```

- [ ] **Step 5: Prove the hook rejects**

```bash
printf 'export const probe: number = "not a number";\n' > src/_gate_probe.ts
git add src/_gate_probe.ts
git commit -m "probe" ; echo "exit=$?"
```

Expected: `check-motion` passes, then `tsc` error `Type 'string' is not assignable to type 'number'`, commit refused, `exit=1`. Save output to `docs/evidence/2026-09-18-daniel-den-v2/gate-reject.txt`. Then:

```bash
git reset -q src/_gate_probe.ts && rm src/_gate_probe.ts && git status --short
```

- [ ] **Step 6: Prove the hook passes and commit**

```bash
git add .githooks/pre-commit scripts/check-motion.tsx package.json CLAUDE.md
git commit -m "Add local pre-commit gate: motion-constraint lint plus typecheck and build"
```

Expected: both `pre-commit:` lines print, `26 scenes clean`, build succeeds, commit lands. Save output to `docs/evidence/2026-09-18-daniel-den-v2/gate-pass.txt`.

---


### Task 1: Colour tone helpers and shared effects

**Files:**
- Create: `src/art/v2/tone.ts`
- Create: `src/art/v2/effects.tsx`

**Interfaces:**
- Produces:
  - `mix(a: string, b: string, t: number): string`, `lighten(hex, t)`, `darken(hex, t)`; hex in `#rrggbb`, `t` in `[0,1]`.
  - `Shaded({ base, light?, dark?, children: (fill: string) => ReactNode })`
  - `SoftShadow({ x, y, rx, ry?, opacity? })`
  - `LightShaft({ x?, top?, topWidth?, bottomSpread?, floorY? })`
  - `Grain({ opacity? })`
  - `Motes({ x?, top?, bottom?, spread?, count?, seed? })`

- [ ] **Step 1: Write `tone.ts`**

```ts
/**
 * Pure colour maths for the v2 shading recipe. Hex in, hex out, no DOM.
 * Every shaded part is one base colour pushed toward cream for the lit side
 * and toward ink for the shadow side, so figures stay on the story palette.
 */

const CREAM = "#fff8ec";
const INK = "#2a2140";

function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channel(v: number): string {
  return Math.round(Math.max(0, Math.min(255, v)))
    .toString(16)
    .padStart(2, "0");
}

/** Linear blend from `a` (t=0) to `b` (t=1). */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const k = Math.max(0, Math.min(1, t));
  return `#${channel(ar + (br - ar) * k)}${channel(ag + (bg - ag) * k)}${channel(ab + (bb - ab) * k)}`;
}

export function lighten(hex: string, t: number): string {
  return mix(hex, CREAM, t);
}

export function darken(hex: string, t: number): string {
  return mix(hex, INK, t);
}
```

- [ ] **Step 2: Write `effects.tsx`**

```tsx
import { useId, type ReactNode } from "react";
import { C, rand } from "../palette";
import { VB } from "../base";
import { darken, lighten } from "./tone";

/**
 * One radial gradient in bounding-box units, so every shape that uses the
 * returned fill is lit from its own top-left. A whole figure shares one of
 * these per base colour.
 */
export function Shaded({
  base,
  light = 0.28,
  dark = 0.38,
  children,
}: {
  base: string;
  light?: number;
  dark?: number;
  children: (fill: string) => ReactNode;
}) {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={id} cx="0.35" cy="0.28" r="0.85">
          <stop offset="0%" stopColor={lighten(base, light)} />
          <stop offset="55%" stopColor={base} />
          <stop offset="100%" stopColor={darken(base, dark)} />
        </radialGradient>
      </defs>
      {children(`url(#${id})`)}
    </>
  );
}

/** Gradient ellipse, not a filter, so it costs nothing when things move above it. */
export function SoftShadow({
  x,
  y,
  rx,
  ry = rx * 0.28,
  opacity = 0.42,
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
          <stop offset="65%" stopColor={C.ink} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.ink} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id})`} opacity={opacity} />
    </g>
  );
}

/** Warm wedge of light from an opening above, plus its pool on the floor. */
export function LightShaft({
  x = 500,
  top = 40,
  topWidth = 90,
  bottomSpread = 250,
  floorY = 575,
}: {
  x?: number;
  top?: number;
  topWidth?: number;
  bottomSpread?: number;
  floorY?: number;
}) {
  const wedge = useId();
  const pool = useId();
  return (
    <g>
      <defs>
        <linearGradient id={wedge} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.sunCore} stopOpacity="0.6" />
          <stop offset="100%" stopColor={C.glow} stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id={pool}>
          <stop offset="0%" stopColor={C.glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx={x}
        cy={floorY}
        rx={bottomSpread}
        ry={bottomSpread * 0.22}
        fill={`url(#${pool})`}
      />
      <g className="a-pulse-soft">
        <path
          d={`M${x - topWidth},${top} L${x + topWidth},${top} L${x + bottomSpread},${floorY} L${x - bottomSpread},${floorY} Z`}
          fill={`url(#${wedge})`}
        />
      </g>
    </g>
  );
}

/**
 * Paper grain over the whole frame. The filter lives on one static rect and
 * is rasterised once; nothing animated is inside it.
 */
export function Grain({ opacity = 0.06 }: { opacity?: number }) {
  const id = useId();
  return (
    <g pointerEvents="none">
      <defs>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width={VB.w} height={VB.h} filter={`url(#${id})`} opacity={opacity} />
    </g>
  );
}

/**
 * Dust drifting in the light. Each mote is positioned by its own translate so
 * Calm mode leaves it exactly where it sits; motion is on inner elements only.
 */
export function Motes({
  x = 500,
  top = 110,
  bottom = 540,
  spread = 200,
  count = 14,
  seed = 3,
}: {
  x?: number;
  top?: number;
  bottom?: number;
  spread?: number;
  count?: number;
  seed?: number;
}) {
  return (
    <g pointerEvents="none">
      {Array.from({ length: count }, (_, i) => {
        const t = rand(seed + i);
        const y = top + t * (bottom - top);
        const halfW = 40 + (spread - 40) * t;
        const mx = x + (rand(seed + i + 50) * 2 - 1) * halfW;
        const r = 1.6 + rand(seed + i + 100) * 2.2;
        return (
          <g key={i} transform={`translate(${mx.toFixed(1)} ${y.toFixed(1)})`}>
            <g className="a-float" style={{ animationDelay: `${(-t * 6).toFixed(2)}s` }}>
              <circle
                r={r.toFixed(1)}
                fill={C.sunCore}
                opacity="0.55"
                className="a-twinkle"
                style={{ animationDelay: `${(-t * 3.4).toFixed(2)}s` }}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 4: Review gate**

Invoke `roast` on the diff. Address every finding or record why not in the evidence record.

- [ ] **Step 5: Commit**

```bash
git add src/art/v2/tone.ts src/art/v2/effects.tsx
git commit -m "Add v2 art effects: bbox shading, soft shadow, light shaft, grain, motes"
```

---

### Task 2: Den background and first scene swap

**Files:**
- Create: `src/art/v2/den.tsx`
- Modify: `src/scenes/daniel.tsx` (`IntoTheDen`, lines 207–247, and imports)

**Interfaces:**
- Consumes: `Shaded`, `SoftShadow`, `LightShaft`, `Grain` from Task 1.
- Produces: `Den2()` with no props. Draws the full 1000×625 background including the opening at `(500, 42)`, floor from `y=478`.

- [ ] **Step 1: Write `den.tsx`**

```tsx
import { useId } from "react";
import { randIn } from "../palette";
import { VB } from "../base";
import { Shaded } from "./effects";

const WALL = "#6f5f57";
const FLOOR = "#5c4c46";
const OPENING = "#ffe9b8";

/**
 * Stone wall as rounded cut-paper blocks, a floor, the round opening the king
 * looks through, and a vignette so the edges fall away. Nothing here moves.
 */
export function Den2() {
  const edge = useId();
  const vignette = useId();
  const rows = 7;
  const blockW = 124;
  const blockH = 66;

  return (
    <g>
      <rect width={VB.w} height={VB.h} fill="#3a2f2b" />

      <Shaded base={WALL} light={0.22} dark={0.42}>
        {(fill) => (
          <g>
            {Array.from({ length: rows }, (_, r) => {
              const y = 4 + r * (blockH + 4);
              const offset = r % 2 === 0 ? 0 : blockW / 2;
              const cols = Math.ceil(VB.w / blockW) + 1;
              return Array.from({ length: cols }, (_, c) => {
                const seed = r * 31 + c;
                const x = c * blockW - offset + randIn(seed, -6, 6);
                const w = blockW - 8 + randIn(seed + 0.3, -10, 10);
                const h = blockH + randIn(seed + 0.6, -6, 4);
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={x.toFixed(1)}
                    y={y}
                    width={w.toFixed(1)}
                    height={h.toFixed(1)}
                    rx="20"
                    fill={fill}
                  />
                );
              });
            })}
          </g>
        )}
      </Shaded>

      {/* the opening, lit from the day above */}
      <ellipse cx="500" cy="42" rx="92" ry="26" fill={OPENING} />

      <Shaded base={FLOOR} light={0.18} dark={0.45}>
        {(fill) => (
          <path
            d={`M0,478 Q250,462 500,470 Q750,462 1000,478 L1000,${VB.h} L0,${VB.h} Z`}
            fill={fill}
          />
        )}
      </Shaded>

      {/* cut-paper edge: the wall layer casts onto the floor layer */}
      <defs>
        <linearGradient id={edge} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1218" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a1218" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={vignette} cx="0.5" cy="0.45" r="0.72">
          <stop offset="60%" stopColor="#1a1218" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a1218" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <path
        d="M0,478 Q250,462 500,470 Q750,462 1000,478 L1000,512 Q750,496 500,504 Q250,496 0,512 Z"
        fill={`url(#${edge})`}
      />
      <rect width={VB.w} height={VB.h} fill={`url(#${vignette})`} />
    </g>
  );
}
```

- [ ] **Step 2: Swap the scene background, keep v1 figures for now**

In `src/scenes/daniel.tsx`, add imports:

```tsx
import { Den2 } from "../art/v2/den";
import { Grain, LightShaft } from "../art/v2/effects";
```

Replace the body of `IntoTheDen` so it reads:

```tsx
export function IntoTheDen() {
  return (
    <>
      <Den2 />
      <LightShaft x={500} top={42} topWidth={90} bottomSpread={250} floorY={578} />
      <Person
        x={500}
        y={520}
        scale={1.2}
        robe={C.robe[2]}
        sash={C.sun}
        skin={C.skin[2]}
        hair={C.hair[1]}
        beard
        headscarf
        pose="pray"
        face="calm"
      />
      <Lion x={200} y={560} scale={0.62} />
      <Lion x={820} y={572} scale={0.58} flip />
      <Lion x={330} y={604} scale={0.48} />
      <Lion x={700} y={610} scale={0.46} flip />
      {/* the king's face at the opening, far above */}
      <Person
        x={500}
        y={62}
        scale={0.28}
        robe="#f0c97a"
        skin={C.skin[3]}
        hair={C.hair[1]}
        beard
        pose="fear"
        face="sad"
        idle={false}
      />
      <Grain />
    </>
  );
}
```

`DenInterior` and `PitLight` stay imported because other Daniel scenes still use them. If `tsc` reports either as unused, remove only that import.

- [ ] **Step 3: Typecheck and render**

Run: `npm run typecheck`, then the render command from the file map.
Expected: `rendered daniel/den` in output. Open `scratch/scenes/daniel-den.png`. Check: stone blocks visible with light top-left shading, lit opening at top centre, floor darker than wall base with a shadow band, grain visible but faint, wedge of light down to the floor pool.

- [ ] **Step 3b: Probe the grain filter's frame cost now, not in Task 6**

Inline SVG animations paint on the main thread and the grain rect overlaps every animated region, so the filter may re-run per frame. Measure before building on it. With `npm run dev` running (background runner, port 5173), use the Chrome DevTools MCP tools: open `http://localhost:5173/#/story/daniel/2`, emulate 1024x768, `performance_start_trace` with reload, wait 5 s, `performance_stop_trace`, note the frame summary. Then comment out `<Grain />` in `IntoTheDen`, save, and trace again.

Decision rule: if grain adds sustained frames over 16 ms, or more than doubles average frame time, remove `<Grain />` from the scene and record why in the evidence record. Otherwise restore it. Save both summaries to `docs/evidence/2026-09-18-daniel-den-v2/perf-grain.txt`. If the MCP tools are unavailable, record that and keep `<Grain />` out until Task 6 can measure.

- [ ] **Step 4: Review gate**

Invoke `roast` on the diff. Address findings.

- [ ] **Step 5: Commit**

```bash
git add src/art/v2/den.tsx src/scenes/daniel.tsx
git commit -m "Add Den2 background and use it in the Daniel den scene"
```

---

### Task 3: Lion2 and blink

**Files:**
- Create: `src/art/v2/lion.tsx`
- Modify: `src/styles/motion.css` (append before the Calm block, around line 440)
- Modify: `src/scenes/daniel.tsx` (`IntoTheDen`)

**Interfaces:**
- Consumes: `Shaded`, `SoftShadow` from Task 1.
- Produces: `Lion2({ x, y, scale?, flip?, asleep? })`. Local coordinates: ground at `y=0`, faces right, roughly 215 wide and 140 tall at scale 1.

- [ ] **Step 1: Add `.a-blink` to `motion.css`**

Insert immediately before the `/* * Calm mode.` comment:

```css
/*
 * Eyelids. Drawn with opacity="0" so eyes rest open; the lid only appears for
 * a moment near the end of each cycle. Calm mode drops the animation and the
 * attribute value keeps the eyes open.
 */
@keyframes blink {
  0%,
  93%,
  100% {
    opacity: 0;
  }
  95%,
  97% {
    opacity: 1;
  }
}
.a-blink {
  animation: blink 5.2s linear infinite;
}
```

- [ ] **Step 2: Write `lion.tsx`**

```tsx
import { C } from "../palette";
import { Shaded, SoftShadow } from "./effects";

const BODY = "#dea84c";
const MANE = "#b06d28";
const FACE = "#f2c470";
const MUZZLE = "#f8dfa8";
const IRIS = "#c0741f";

export interface Lion2Props {
  x: number;
  /** Ground line the lion lies on. */
  y: number;
  scale?: number;
  /** Mirrors the lion so it faces left. */
  flip?: boolean;
  /** Closed eyes and a softer smile; no blink. */
  asleep?: boolean;
}

function Eye({ cx, cy, asleep }: { cx: number; cy: number; asleep: boolean }) {
  if (asleep) {
    return (
      <path
        d={`M${cx - 8},${cy} q8,7 16,0`}
        stroke={C.ink}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="9" ry="10.5" fill={C.white} />
      <circle cx={cx + 1} cy={cy + 1} r="6.5" fill={IRIS} />
      <circle cx={cx + 1.5} cy={cy + 1.5} r="4" fill={C.ink} />
      <circle cx={cx - 1.5} cy={cy - 2.5} r="2.2" fill={C.white} />
      <circle cx={cx + 3} cy={cy + 3} r="1.1" fill={C.white} opacity="0.8" />
      {/* eyelid: rests invisible, appears for a blink */}
      <ellipse cx={cx} cy={cy} rx="9.5" ry="11" fill={FACE} opacity="0" className="a-blink" />
    </g>
  );
}

/**
 * A lying lion built from stacked rounded layers: haunch, body, paws, mane
 * tufts, head, muzzle. Feet sit on y=0 inside the group so callers position
 * the ground line only.
 */
export function Lion2({ x, y, scale = 1, flip = false, asleep = false }: Lion2Props) {
  const sx = flip ? -scale : scale;
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${scale})`}>
      <SoftShadow x={-10} y={2} rx={118} ry={16} />

      {/* tail first so it sits behind the body; it hinges at its root on the haunch */}
      <g transform="translate(-118 -40)">
        <g className="a-tail">
          <path
            d="M0,0 q-34,-6 -40,-40"
            stroke={MANE}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="-42" cy="-44" r="11" fill={MANE} />
        </g>
      </g>

      {/* one breathing group for body and head, so they scale from one origin */}
      <g className="a-breathe-slow">
        <Shaded base={BODY}>
          {(fill) => (
            <g>
              <circle cx="-84" cy="-46" r="42" fill={fill} />
              <ellipse cx="-18" cy="-44" rx="100" ry="44" fill={fill} />
              <rect x="6" y="-26" width="46" height="24" rx="12" fill={fill} />
              <rect x="40" y="-22" width="46" height="22" rx="11" fill={fill} />
            </g>
          )}
        </Shaded>
        {/* rim light along the back */}
        <path
          d="M-108,-60 Q-60,-92 20,-84"
          stroke={C.cream}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />

        <Shaded base={MANE} light={0.2} dark={0.4}>
          {(fill) => (
            <g>
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={(60 + Math.cos(a) * 58).toFixed(1)}
                    cy={(-78 + Math.sin(a) * 58).toFixed(1)}
                    r="23"
                    fill={fill}
                  />
                );
              })}
              <circle cx="60" cy="-78" r="60" fill={fill} />
            </g>
          )}
        </Shaded>

        <Shaded base={FACE} light={0.22} dark={0.3}>
          {(fill) => (
            <g>
              <circle cx="28" cy="-114" r="13" fill={fill} />
              <circle cx="92" cy="-114" r="13" fill={fill} />
              <circle cx="60" cy="-78" r="45" fill={fill} />
            </g>
          )}
        </Shaded>
        <circle cx="28" cy="-114" r="6" fill="#e69b8b" />
        <circle cx="92" cy="-114" r="6" fill="#e69b8b" />

        <ellipse cx="60" cy="-58" rx="24" ry="16" fill={MUZZLE} />
        <path d="M52,-70 L68,-70 L60,-61 Z" fill="#5a3a2a" />
        <path
          d={asleep ? "M48,-54 q12,8 24,0" : "M46,-56 q14,14 28,0"}
          stroke="#5a3a2a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="34" cy="-64" r="6" fill="#e69b8b" opacity="0.45" />
        <circle cx="86" cy="-64" r="6" fill="#e69b8b" opacity="0.45" />

        <Eye cx={44} cy={-86} asleep={asleep} />
        <Eye cx={76} cy={-86} asleep={asleep} />
        <path
          d="M34,-102 q10,-6 20,-2 M66,-104 q10,-4 20,2"
          stroke="#8a5a2a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}
```

- [ ] **Step 3: Swap the lions in `IntoTheDen`**

Add import `import { Lion2 } from "../art/v2/lion";`. Replace the four `<Lion …/>` lines with three lions in depth order. The far lion goes **before** the Daniel `<Person>`; the two near lions go **after** it:

```tsx
      <Lion2 x={760} y={552} scale={0.8} flip />
      {/* ...Daniel <Person> stays here... */}
      <Lion2 x={255} y={602} scale={1.12} />
      <Lion2 x={735} y={612} scale={1.02} flip />
```

- [ ] **Step 4: Typecheck and render**

Run: `npm run typecheck`, then the render command.
Expected: three lions, big faces with white eyes and two highlights, mane tufts, tails resting, near lions overlapping the floor pool. Eyes open in the still (blink lid invisible).

Tune against the reference image: adjust numbers, re-render, at most three cycles. If it still reads wrong after three, stop, save the PNG to `docs/evidence/2026-09-18-daniel-den-v2/wip/`, and show the user before continuing.

- [ ] **Step 5: Review gate**

Run `npm run check:motion` (must print 26 scenes clean). Invoke `roast` on the diff. Check specifically: eyelid `opacity="0"` attribute present; exactly one `a-breathe-slow` group per lion; tail drawn before the body; tail pivot matches `.a-tail`'s `100% 100%` origin (tail extends up-left from its root, so the bbox bottom-right is the root).

- [ ] **Step 6: Commit**

```bash
git add src/art/v2/lion.tsx src/styles/motion.css src/scenes/daniel.tsx
git commit -m "Add Lion2 with layered mane, big eyes and blink; use in den scene"
```

---

### Task 4: Person2 and the Daniel swap

**Files:**
- Create: `src/art/v2/person.tsx`
- Modify: `src/scenes/daniel.tsx` (`IntoTheDen`)

**Interfaces:**
- Consumes: `Shaded`, `SoftShadow` from Task 1.
- Produces: `Person2({ x, y, scale?, robe, sash?, skin, hair, pose?, face? })`. Local coordinates: knees on the ground at `y=0`, head top at about `y=-250`, so ~250 tall at scale 1.

- [ ] **Step 1: Write `person.tsx`**

```tsx
import { C } from "../palette";
import { darken } from "./tone";
import { Shaded, SoftShadow } from "./effects";

export type Pose2 = "pray" | "kneel";
export type Face2 = "calm" | "happy";

export interface Person2Props {
  x: number;
  /** Ground line the knees rest on. */
  y: number;
  scale?: number;
  robe: string;
  sash?: string;
  skin: string;
  hair: string;
  pose?: Pose2;
  face?: Face2;
}

const SCARF = "#fbf4e6";

/**
 * A kneeling storybook figure in the soft-shaded cutout style: big head, big
 * eyes, rounded layered body, one gradient per material. Knees sit on y=0.
 */
export function Person2({
  x,
  y,
  scale = 1,
  robe,
  sash = C.sun,
  skin,
  hair,
  pose = "pray",
  face = "calm",
}: Person2Props) {
  const sleeves =
    pose === "pray"
      ? {
          left: "M-40,-138 Q-64,-100 -22,-96 L-6,-100 L-6,-120 Z",
          right: "M40,-138 Q64,-100 22,-96 L6,-100 L6,-120 Z",
        }
      : {
          left: "M-40,-138 Q-66,-90 -46,-40 L-24,-44 L-18,-120 Z",
          right: "M40,-138 Q66,-90 46,-40 L24,-44 L18,-120 Z",
        };
  const hands =
    pose === "pray" ? (
      <g>
        <ellipse cx="-6" cy="-112" rx="9" ry="16" transform="rotate(-8 -6 -112)" />
        <ellipse cx="6" cy="-112" rx="9" ry="16" transform="rotate(8 6 -112)" />
      </g>
    ) : (
      <g>
        <circle cx="-44" cy="-38" r="11" />
        <circle cx="44" cy="-38" r="11" />
      </g>
    );

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <SoftShadow x={0} y={2} rx={78} ry={14} />
      <g className="a-breathe">
        <Shaded base={robe}>
          {(fill) => (
            <g>
              {/* kneeling skirt, then torso */}
              <path d="M-64,0 Q-72,-42 -48,-80 L48,-80 Q72,-42 64,0 Z" fill={fill} />
              <rect x="-46" y="-152" width="92" height="82" rx="32" fill={fill} />
              <path d={sleeves.left} fill={fill} />
              <path d={sleeves.right} fill={fill} />
            </g>
          )}
        </Shaded>
        <rect x="-46" y="-88" width="92" height="14" rx="7" fill={sash} opacity="0.9" />
        {/* rim light down the lit side of the torso */}
        <path
          d="M-38,-146 Q-48,-110 -40,-82"
          stroke={C.cream}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.32"
        />

        <Shaded base={skin} light={0.24} dark={0.34}>
          {(fill) => (
            <g fill={fill}>
              {hands}
              <rect x="-12" y="-166" width="24" height="24" rx="8" />
              <circle cx="0" cy="-198" r="42" />
            </g>
          )}
        </Shaded>

        {/* beard under the chin, then the mouth over it */}
        <path
          d="M-30,-186 Q-36,-150 0,-146 Q36,-150 30,-186 Q15,-176 0,-178 Q-15,-176 -30,-186 Z"
          fill={hair}
        />
        {face === "happy" ? (
          <path d="M-13,-180 q13,20 26,0 Z" fill="#5a2a2a" />
        ) : (
          <path
            d="M-12,-178 q12,12 24,0"
            stroke={C.ink}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* eyes: sclera, iris, pupil, two highlights */}
        {[-15, 15].map((ex) => (
          <g key={ex}>
            <ellipse cx={ex} cy={-200} rx="8.5" ry="10" fill={C.white} />
            <circle cx={ex + 1} cy={-199} r="5.5" fill="#4a2f1d" />
            <circle cx={ex + 1.5} cy={-198.5} r="3.2" fill={C.ink} />
            <circle cx={ex - 1.5} cy={-202.5} r="2" fill={C.white} />
            <circle cx={ex + 3} cy={-196} r="1" fill={C.white} opacity="0.8" />
          </g>
        ))}
        <path
          d="M-24,-214 q9,-6 18,-2 M6,-216 q9,-4 18,2"
          stroke={darken(hair, 0.1)}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="-26" cy="-188" r="6" fill="#e88b7d" opacity="0.45" />
        <circle cx="26" cy="-188" r="6" fill="#e88b7d" opacity="0.45" />

        {/* headscarf over the crown, falling to the shoulders */}
        <Shaded base={SCARF} light={0.05} dark={0.3}>
          {(fill) => (
            <path
              d="M-46,-206 Q-54,-256 0,-250 Q54,-256 46,-206 L54,-150 Q34,-166 22,-172 L22,-206 Q0,-232 -22,-206 L-22,-172 Q-34,-166 -54,-150 Z"
              fill={fill}
            />
          )}
        </Shaded>
        <rect x="-44" y="-226" width="88" height="10" rx="5" fill={darken(robe, 0.25)} />
        <path
          d="M-36,-236 Q-46,-210 -40,-186"
          stroke={C.cream}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
      </g>
    </g>
  );
}
```

- [ ] **Step 2: Swap Daniel in `IntoTheDen`**

Add import `import { Person2 } from "../art/v2/person";`. Replace the first `<Person …/>` (Daniel, the one at `y={520}`) with:

```tsx
      <Person2
        x={500}
        y={565}
        scale={1.1}
        robe={C.robe[2]}
        sash={C.sun}
        skin={C.skin[2]}
        hair={C.hair[1]}
        pose="pray"
        face="calm"
      />
```

The king at the opening stays on v1 `Person`.

- [ ] **Step 3: Typecheck and render**

Run: `npm run typecheck`, then the render command.
Expected: Daniel about 40% of frame height, centred, praying hands at chest, white headscarf with purple band, big eyes with highlights, beard, blush. Near lions overlap his skirt edges. Compare with `design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`.

Tune against the reference: adjust path numbers, re-render, at most three cycles. If it still reads wrong after three, stop, save the PNG to `docs/evidence/2026-09-18-daniel-den-v2/wip/`, and show the user before continuing.

- [ ] **Step 4: Review gate**

Run `npm run check:motion`. Invoke `roast` on the diff. Check: headscarf path closes cleanly around the face opening; the hand ellipses carry `rotate` but no class, which is allowed.

- [ ] **Step 5: Commit**

```bash
git add src/art/v2/person.tsx src/scenes/daniel.tsx
git commit -m "Add Person2 kneeling figure and use it for Daniel in the den"
```

---

### Task 5: Motes, hotspots, composition pass

**Files:**
- Modify: `src/scenes/daniel.tsx` (`IntoTheDen`)
- Modify: `src/data/stories/daniel.ts` (scene `den`, hotspots)

**Interfaces:**
- Consumes: `Motes` from Task 1.

- [ ] **Step 1: Add motes and finalise order**

`IntoTheDen` final body:

```tsx
export function IntoTheDen() {
  return (
    <>
      <Den2 />
      <LightShaft x={500} top={42} topWidth={90} bottomSpread={250} floorY={578} />
      <Lion2 x={760} y={552} scale={0.8} flip />
      <Person2
        x={500}
        y={565}
        scale={1.1}
        robe={C.robe[2]}
        sash={C.sun}
        skin={C.skin[2]}
        hair={C.hair[1]}
        pose="pray"
        face="calm"
      />
      <Lion2 x={255} y={602} scale={1.12} />
      <Lion2 x={735} y={612} scale={1.02} flip />
      <Motes x={500} top={110} bottom={540} spread={200} />
      {/* the king's face at the opening, far above */}
      <Person
        x={500}
        y={62}
        scale={0.28}
        robe="#f0c97a"
        skin={C.skin[3]}
        hair={C.hair[1]}
        beard
        pose="fear"
        face="sad"
        idle={false}
      />
      <Grain />
    </>
  );
}
```

- [ ] **Step 2: Move the hotspots**

In `src/data/stories/daniel.ts`, scene `den`, change only the numbers:

```ts
        {
          id: "lions-awake",
          x: 25,
          y: 88,
          size: 24,
          // label, reward, sound, sticker unchanged
```

```ts
        {
          id: "king-above",
          x: 50,
          y: 8,
          size: 18,
          // label, reward, sound unchanged
```

- [ ] **Step 3: Typecheck and render**

Run: `npm run typecheck`, then the render command.
Expected: motes visible as faint dots inside the light wedge. Composition: Daniel centre, lions left/right/back, nothing important outside x 90–910.

- [ ] **Step 4: Compare stills**

Read `docs/evidence/2026-09-18-daniel-den-v2/baseline/daniel-den.png`, `scratch/scenes/daniel-den.png`, and the reference. Copy the new still to `docs/evidence/2026-09-18-daniel-den-v2/after/daniel-den.png` and record its `sha256sum`.

- [ ] **Step 5: Review gate**

Invoke `roast` on the diff.

- [ ] **Step 6: Commit**

```bash
git add src/scenes/daniel.tsx src/data/stories/daniel.ts
git commit -m "Finish den composition: dust motes and hotspot positions"
```

---

### Task 6: Browser evidence and performance

**Files:**
- Modify: `scripts/shoot.mjs` (append after the `9-calm-storm` shot, before `if (errors.length)`)
- Create: `docs/evidence/2026-09-18-daniel-den-v2/record.md`

**Interfaces:**
- Consumes: the running preview build of the committed revision.

- [ ] **Step 1: Add den shots**

```js
await shot({ path: `${D}/10-den-phone.png`, route: '#/story/daniel/2', width: 390, height: 844 })
await shot({ path: `${D}/11-den-tablet.png`, route: '#/story/daniel/2', width: 1024, height: 768 })
await shot({
  path: `${D}/12-den-calm.png`,
  route: '#/story/daniel/2',
  width: 1024,
  height: 768,
  progress: { calm: true },
})
await shot({
  path: `${D}/13-den-hotspot.png`,
  route: '#/story/daniel/2',
  width: 1024,
  height: 768,
  before: `document.querySelectorAll('.hotspot')[0].click(); true`,
})
await shot({
  path: `${D}/14-den-big.png`,
  route: '#/story/daniel/2',
  width: 1024,
  height: 768,
  progress: { mode: 'big' },
})
```

- [ ] **Step 2: Build, serve, shoot**

```bash
npm run build 2>&1 | tail -3
npm run preview -- --port 4173     # start with the Bash tool's background runner, not `&`
```

Start a Chromium with `--remote-debugging-port=9222 --headless=new about:blank`. On this machine Chrome is at `C:\Program Files\Google\Chrome\Application\chrome.exe`; if not, find it with `where chrome`. Then:

```bash
OUT=docs/evidence/2026-09-18-daniel-den-v2/browser node scripts/shoot.mjs
```

Expected: five `10-` to `14-` PNGs written, `PAGE ERRORS` absent. Read each PNG. Checks:
- 10, 11: figures present and positioned (constraint 1 would show as figures piled at top-left).
- 12: identical composition to the still render, no motion artefacts.
- 13: the lions hotspot shows its tick over the near-left lion, and the reward bubble is visible.
- 14: big-mode text shown, art unchanged.

- [ ] **Step 3: Performance trace**

Use the Chrome DevTools MCP tools against `http://127.0.0.1:4173/#/story/daniel/2` with tablet emulation (1024×768): `performance_start_trace` with reload, wait 5 s, `performance_stop_trace`. Record the frame summary. Threshold from the spec: sustained frames over 16 ms on tablet emulation means jank; if hit, remove `<Grain />` first and re-trace. Save the summary text to `docs/evidence/2026-09-18-daniel-den-v2/perf.txt`. If the MCP tools are unavailable, record the attempt and the gap; do not fabricate a number.

- [ ] **Step 4: Write the evidence record**

`docs/evidence/2026-09-18-daniel-den-v2/record.md` with these sections filled from actual output, unknowns marked:

```markdown
# Evidence record: Daniel den scene, style 6

## Scope
Task: rebuild `daniel/den` in the v2 kit. Spec: docs/superpowers/specs/2026-09-18-daniel-den-style6-design.md
Gate inventory: pre-commit typecheck+build (installed this task). Lint, format, tests, secret scan, dependency audit: not installed, not run.

## Artifact identity
Checkout: C:\Users\aibid\PROJECTS\KIDS BIBLE STORIES, branch main
Baseline commit: d567255 (dirty: package-lock.json, unrelated)
Tested commit: <git rev-parse HEAD>, status: <git status --short>
package-lock.json sha256 (first 16): 4b6174b6b9ecb54a

## Environment
Windows 11 Pro 10.0.26200, Node v24.13.0, npm 11.6.2, Vite 8.3.0
Browser for shots: <chrome --version>, viewports 390x844 and 1024x768

## Procedures and results
| Check | Command | UTC start | Exit | Result |
|---|---|---|---|---|
| typecheck | npm run typecheck | | | |
| build | npm run build | | | |
| still render | render command | | | scratch/scenes/daniel-den.png sha256 <…> |
| browser shots | OUT=… node scripts/shoot.mjs | | | 5 PNGs, page errors: <none|list> |
| perf trace | DevTools MCP | | | <summary or "unavailable: reason"> |
| gate reject | probe commit | | 1 | gate-reject.txt |
| gate pass | real commit | | 0 | gate-pass.txt |

## Evidence files
baseline/daniel-den.png 9189fe6f…, baseline/_contact-sheet.png c7c14c49…, after/daniel-den.png <sha>, browser/10-14 <shas>, perf.txt, gate-*.txt

## Review
Automated: typecheck, build. Visual: <observations per PNG>. Roast findings per task and disposition: <list>.
Human review: not yet performed.

## Gaps
- No failing-test-first artifact: no test runner in the repo. Visual baseline is not a regression test.
- Lint/format/secret-scan/dependency audit: unknown, tooling absent.
- Coverage/mutation: inapplicable, no test suite.
- Performance measured under emulation, not on a real phone.
```

- [ ] **Step 5: Review gate**

Invoke `roast` on the record and the screenshots. Any visual defect found here goes back to the owning task before commit.

- [ ] **Step 6: Commit**

```bash
git add scripts/shoot.mjs docs/evidence/2026-09-18-daniel-den-v2
git commit -m "Add den screenshots to shoot script and record slice evidence"
```

---

### Task 7: Docs and handoff

**Files:**
- Modify: `CLAUDE.md` (Layout and Conventions)
- Create: `handoff.md`

- [ ] **Step 1: Document the v2 kit in CLAUDE.md**

In the `## Layout` tree, after the `props.tsx` line, add:

```
    v2/         soft-shaded cutout kit: tone.ts, effects.tsx, den.tsx, lion.tsx, person.tsx
```

In `## Conventions`, add a bullet:

```
- **Two art kits, temporarily.** `src/art/v2/` is the new soft-shaded cutout
  style; `src/art/*.tsx` is the original flat style. A scene uses one or the
  other; the only exception is a tiny background figure where v2 has no pose
  yet. When every scene has migrated, delete v1 and fold v2 into `src/art/`.
  New style work goes in v2 only.
```

In `## Verifying changes`, after the `node scripts/shoot.mjs` block, add:

```
Shots 10–14 cover the Daniel den scene at phone, tablet, Calm, hotspot-found
and big mode; they are the reference for the v2 style.
```

- [ ] **Step 2: Write handoff.md**

Use the `handoff` skill. It must link `docs/evidence/2026-09-18-daniel-den-v2/record.md`, list the commits of this slice, state the gaps verbatim from the record, and name the next authorized step: user review of the rendered scene, then decision on migrating the next scene.

It must also state two things plainly:

1. **Not for release.** Page 3 of the Daniel story is in the new style while pages 1, 2, 4, 5 are flat v1. Do not deploy until the whole Daniel story is migrated.
2. **Effort estimate for the other 25 scenes**, from what this slice actually took: hours per new figure pose, per new animal, per new prop, per scene composition. List which v1 parts (poses, faces, animals, props) still have no v2 equivalent. This is the input for the go/no-go on full migration.

- [ ] **Step 3: Review gate and commit**

Invoke `roast` on the CLAUDE.md diff (does it contradict the hard constraints or the ship-nothing-binary rule? It must not). Then:

```bash
git add CLAUDE.md handoff.md
git commit -m "Document the v2 art kit and hand off the Daniel den slice"
```

---

## Self-review

**Spec coverage.** Layers: Task 2 (den), 3, 4, 5 (order). Forms/rim light/faces: Tasks 3, 4. Light: Task 1 `LightShaft`, Task 2. Grain: Task 1, used Task 2. Animation table: `a-breathe` (Task 4), `a-breathe-slow` and `a-tail` (Task 3), `a-blink` (Task 3), `a-pulse-soft` (Task 1), motes via `a-float` + `a-twinkle` (Task 1, Task 5; spec's `a-mote` replaced by two existing classes, fewer CSS changes, same rest behaviour). Performance rule: Task 1 design, Task 6 trace. Hotspots: Task 5. Increment 0 gate: Task 0. Evidence plan rows: Task 6. CLAUDE.md: Tasks 0, 7. Open risk "king at 0.28 scale": king stays v1, decided in Task 4.

**Placeholders.** Record template in Task 6 uses `<…>` markers for values that only exist after running; those are fill-from-output fields, not design gaps.

**Type consistency.** `Shaded` children signature `(fill: string) => ReactNode` used identically in Tasks 2, 3, 4. `SoftShadow` props `x, y, rx, ry?, opacity?` match uses. `Lion2Props` and `Person2Props` match the scene calls in Task 5. `Motes` defaults match the Task 5 call.
