# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

An interactive illustrated Bible storybook for children, as an installable,
offline-capable PWA. React + TypeScript + Vite. 5 stories, 27 animated scenes, all layered raster art.

The audience is 3–12 year olds, served by a single story set with a **Little /
Big** reading-level switch. Every piece of prose has to work at both levels.

## Commands

```bash
npm run dev        # dev server
npm run build      # typecheck + production build into dist/
npm run preview    # serve the built output
npm run typecheck  # tsc -b
npm test           # vitest: pure seams (quiz shuffle, tone maths, raster geometry, inline-png, store) and story-data invariants
npm run coverage   # the same with v8 coverage; fails below the thresholds in vitest.config.ts (ratchet: only ever raised)
npm run lint       # eslint incl. security rules; errors block, warnings are reviewed per site (see below)
npm run format     # prettier --write over src, scripts and root configs
npm run format:check
npm run secrets    # staged-diff credential scan (scripts/check-secrets.mjs)
npm run audit      # npm audit --audit-level=high; needs the network, "unreachable" means unknown, never clean
npm run icons      # regenerate public/icons/*.png from scripts/generate-icons.mjs
npm run check:motion   # hard-constraint lint: no a-* class on a transform'd element
git config core.hooksPath .githooks   # once per clone: activates the pre-commit gate
```

`.githooks/pre-commit` runs, in order, `secrets`, prettier on the staged files,
`lint`, `check:motion`, `coverage`, `build`, and refuses the commit if any fails.
When a commit adds tests, raise the thresholds to the new measured floor in
the same commit; never lower them.
Activate it once per clone with the command above and check
`git config core.hooksPath` prints `.githooks` at the start of a session. The
tree-wide format check is `npm run format:check`; the hook checks only what is
being committed. `npm audit` is on demand before a push, not in the hook.

Lint notes: `security/detect-object-injection` is syntactic and flags every
`obj[key]`, so it stays a warning. Each warning is reviewed: keys that come from
outside static data are guarded (`getSceneArt` uses an own-property check; story
ids reach the store only after `getStory` has matched them). Do not turn the
rule off; fix a real finding or leave the warning. A confirmed false positive
in the secret scan is marked with `secret-ok` on the same line, never in a
baseline file.

Test files live next to the code (`*.test.ts`, `*.test.tsx`) and run in node
by default. Pure renders use `react-dom/server`. A test that needs clicks
opts into a DOM with `// @vitest-environment happy-dom` on its first line
and drives the component with Testing Library; the store is module state,
so such files reset it in `beforeEach` through its setters. happy-dom has
no `AudioContext`, `speechSynthesis` or `confirm`: sound is a no-op there,
narration reports unsupported unless the test installs a fake, and
`window.confirm` must be assigned before spying. Coverage thresholds in
`vitest.config.ts` cover `src/lib`, `src/components`, `src/hooks` and the
raster seams. Unit tests do not replace the browser checks below: motion,
layering and Calm mode only show in a real browser.

## Hard constraints

These are not style preferences. Breaking either one produces bugs that look
fine in code review and in static rendering, and only appear in a browser.

### 1. Never put a CSS transform animation on an element that carries a `transform` attribute

A CSS `transform` animation **overrides** an SVG `transform` presentation
attribute. An element that is both positioned by an attribute and animated by a
class loses its positioning entirely and collapses to the scene origin.

This bug hid a whole cast of characters once. It did not show up in
`render-scenes.tsx` (no CSS there), only in a real browser.

```tsx
// WRONG — the figure will vanish into the top-left corner
<g transform={`translate(${x} ${y})`} className="a-breathe">{body}</g>

// RIGHT — one group positions, an inner group animates
<g transform={`translate(${x} ${y})`}>
  <g className="a-breathe">{body}</g>
</g>
```

### 2. Animation pivots live in `motion.css`, as percentages of the element's own box

`src/styles/motion.css` sets `transform-box: fill-box` on every `.a-*` class, so
`transform-origin` is resolved against the element's own bounding box. Declare
pivots there as percentages (`50% 100%` for something that sways from its base),
never as user-space coordinates in a component's inline `style`. A pivot in user
units breaks the moment a scene places the part somewhere else.

## Layout

```
src/
  types.ts      Story / Scene / Hotspot shapes — read this first
  art/          what scenes compose from
    palette.ts  colour tokens plus seeded rand()
    base.tsx    VB (the viewBox), Sky, Sun, Stars, Sparkle, HolyGlow, Rain, Lightning: vector overlays
    raster.tsx  Backdrop / Layer / Part / Tail / Flipbook / Eyelids: raster cutouts inside the SVG stage
    v2/effects.tsx  LightShaft, Motes, Grain, SoftShadow (tone.ts backs its gradients)
  assets/scenes/<story>/<scene>/   bg.webp, <layer>.webp, layers.json (shipped)
  scenes/       27 scenes across five stories; index.ts maps string key -> component
  data/
    stories.ts        library order + derived sticker total
    stories/*.ts      one file per story: prose, hotspots, quiz, memory verse
  components/   Library, StoryPlayer, Stage, Quiz, FamilyTime, StickerBook, Settings, NarrationText
  hooks/        useNarration (speechSynthesis + word highlighting)
  lib/
    sound.ts    every sound effect, synthesised with Web Audio
    store.ts    progress in localStorage, via useSyncExternalStore
  styles/
    motion.css  every animation + the Calm-mode kill switch
    app.css     design tokens and UI
```

All art uses a **1000 x 625 viewBox**. Hotspot `x`/`y` are percentages of that,
so `x: 50` is SVG x=500. The stage renders with `preserveAspectRatio="xMidYMax
slice"`; landscape frames letterbox to 16:10, portrait frames crop the sides
(see Verifying changes).

## Media rule

Artwork is **layered raster**: a WebP background plus character cutouts with
alpha, generated by `design/pipeline/` and composed inside the SVG stage
through `src/art/raster.tsx` (`Backdrop`, `Layer`, `Eyelids`). The stage,
hotspots, Calm mode and the motion rules are unchanged; a cutout is just an
`<image>` inside the same positioned/animated group nesting as any figure.

Still no other media: **sound** is synthesised in `src/lib/sound.ts`,
**narration** uses the device's `speechSynthesis`, and there are no font files.

Budget: a scene is at most **450 KB** (background ≤ 200 KB, each cutout
≤ 80 KB), recorded in its `layers.json`. Everything precaches for offline use.
If the book outgrows ~12 MB, switch workbox to precache the first story and
runtime-cache the rest.

Every generated asset has a JSON sidecar (model, prompt, references, date).
Raw generations under `design/pipeline/raw/` are not committed; regenerate
from the sidecars. The pipeline README is `design/pipeline/README.md`.

Every story is raster now. The vector figure, animal and prop kits are gone;
`src/art/base.tsx` keeps the overlay primitives scenes still use.

## Adding a story

0. Generate the art: a character sheet per new character
   (`design/pipeline/gen_character.py`), a scene manifest under
   `design/pipeline/scenes/`, then `gen_scene_layers.py`, `cutout.py`,
   `pack.py`. Judge every scene with `npm run compare -- <key> <reference>`.
1. Write scenes in `src/scenes/<story>.tsx`, composing `Backdrop` and `Layer`
   from `src/art/raster.tsx` with light, motes and grain from
   `src/art/v2/effects.tsx`.
2. Register each scene under a string key in `src/scenes/index.ts`.
3. Write `src/data/stories/<story>.ts` — prose at **both** reading levels,
   hotspots, optional find-game, quiz questions tagged `little` or `big`, a
   memory verse, and a `devotional` (question and prayer at both levels, one
   activity) for the Family time card after the quiz. `npm test` enforces all
   of these.
4. Append it to `STORIES` in `src/data/stories.ts`.

Nothing else needs wiring. Sticker totals, the library grid and progress all
derive from the data.

## Verifying changes

Unit tests cover the pure seams only, so **look at the result** — do not assume a change
worked because it compiled.

```bash
# All 27 scenes to PNGs + a contact sheet, with motion frozen. This is exactly
# the still frame Calm mode shows, so it catches art that only composes while
# it is moving.
npm run render                                   # OUT_DIR=… to change the folder

# Full-size render of one scene stacked over a reference image. Judge art
# from this, not from the 500px contact sheet.
npm run compare -- daniel/den design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg

# Screenshot the running app across phone and tablet layouts.
# Needs `npm run preview` on :4173 and a Chromium on --remote-debugging-port=9222.
# `vite preview` binds to localhost (IPv6), so pass BASE explicitly.
BASE=http://localhost:4173 node scripts/shoot.mjs
```

Both write to `scratch/`, which is gitignored. Shots 10–14 cover the Daniel
den scene at phone, tablet, Calm, hotspot-found and big mode; they are the
reference for the v2 style.

Frame shapes: on a landscape frame (tablet, desktop) the stage keeps 16:10
by giving up width (letterbox, `min(100%, 160cqh)`), so nothing is cropped.
On a portrait phone the frame is 4:3 and `slice` crops the sides evenly, so
keep story-critical art inside x=90–910. Hotspots sit in `.stage__spots`, a
layer sized to the art's rendered box, so hotspot percentages are always art
coordinates; never position a hotspot against the frame.

`render-scenes.tsx` renders without CSS, so it **cannot** catch constraint 1
above. `npm run check:motion` does catch it, mechanically, for every registered
scene. Any change touching transforms or animation still needs the browser
screenshots too.

## Conventions

- **Data-driven.** Stories are data; the player is generic. Resist adding
  per-story branches in components.
- **Both reading levels, always.** A `Scene` needs `text.little` and `text.big`.
  Little: short sentences, concrete words, pre-reader. Big: fuller narrative,
  richer vocabulary, plus `verse`.
- **Tap targets are >= 64px** (`--tap`). Small fingers aim badly.
- **Calm mode must stay honest.** It disables all motion, so anything positioned
  only by its animation is invisible there. Elements need a sensible resting
  position of their own. (This is why birds take a real `x` and the rain tiles.)
- **The quiz cannot be failed.** Wrong answers grey out with a gentle sound; only
  first-time-right answers score. Never add a fail state or a buzzer.
- **No network calls, no analytics, no account.** Progress is localStorage only.
  Keep it that way — the users are children.
- **Routing is hash-based** (`#/story/<id>/<n>`, `/quiz`, `/family`) so the phone back button pages
  back through the book. Do not swap in a history router without solving that.

## Gotchas

- `store.ts` is a module-level store read through `useSyncExternalStore`. Mutate
  it only via its exported setters; they persist and notify.
- `localStorage` reads and writes are wrapped in try/catch — private browsing and
  full quotas must not break the app.
- Seeded `rand()` / `randIn()` in `palette.ts` keep stars, flowers and raindrops
  from reshuffling on every re-render. Use them for anything drawn — never
  `Math.random()`. (The one legitimate `Math.random()` is the noise buffer in
  `sound.ts`, which must not be seeded. Leave it alone.)
- `useNarration` cancels speech on unmount; a voice left talking over a page the
  child has navigated away from is a real bug.
- `sharp` is used only by `scripts/`. It is not a runtime or build dependency.
