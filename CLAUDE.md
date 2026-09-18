# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

An interactive illustrated Bible storybook for children, as an installable,
offline-capable PWA. React + TypeScript + Vite. 5 stories, 26 animated scenes.

The audience is 3–12 year olds, served by a single story set with a **Little /
Big** reading-level switch. Every piece of prose has to work at both levels.

## Commands

```bash
npm run dev        # dev server
npm run build      # typecheck + production build into dist/
npm run preview    # serve the built output
npm run typecheck  # tsc -b
npm run icons      # regenerate public/icons/*.png from scripts/generate-icons.mjs
npm run check:motion   # hard-constraint lint: no a-* class on a transform'd element
git config core.hooksPath .githooks   # once per clone: pre-commit runs check:motion + build
```

There is no test suite. Verification is visual — see **Verifying changes** below.
`npm run build` runs `tsc -b` first, so a type error fails the build.

`.githooks/pre-commit` runs `check:motion` and `build` and refuses the commit on
failure. Activate it once per clone with the command above. It does not lint,
format, unit-test, or secret-scan; those gates are not installed yet.

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
  art/          the shared art kit; scenes compose from it, never draw from scratch
    palette.ts  one colour system for all 26 scenes, plus seeded rand()
    base.tsx    skies, sun/moon/stars, clouds, land, sea, rain, light, rainbow
    figures.tsx Person (poses + expressions), Crowd, Giant, Angel
    animals.tsx lions, sheep, birds, fish, the great fish, etc.
    props.tsx   trees, ark, ship, city, den, throne, sling
    v2/         soft-shaded cutout kit: tone.ts, effects.tsx, den.tsx, lion.tsx, person.tsx
  scenes/       the 26 scenes; index.ts maps string key -> component
  data/
    stories.ts        library order + derived sticker total
    stories/*.ts      one file per story: prose, hotspots, quiz, memory verse
  components/   Library, StoryPlayer, Stage, Quiz, StickerBook, Settings, NarrationText
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
slice"` — tight frames crop the **sky**, never the ground, because that is where
the characters stand.

## Ship-nothing-binary rule

The app deliberately contains no media files:

- **Artwork** is inline SVG composed in code. No bitmaps, no icon fonts.
- **Sound** is synthesised in `src/lib/sound.ts` with the Web Audio API.
- **Narration** uses the device's own `speechSynthesis`.

This is what keeps the build ~76 KB gzipped, fully offline on first load, and
free of asset licensing. Do not add image, audio or font files without raising
it first — it would undo all three properties at once.

## Adding a story

1. Write scenes in `src/scenes/<story>.tsx`, composing from `src/art/`. Add new
   reusable parts to the art kit rather than inlining one-off shapes.
2. Register each scene under a string key in `src/scenes/index.ts`.
3. Write `src/data/stories/<story>.ts` — prose at **both** reading levels,
   hotspots, optional find-game, quiz questions tagged `little` or `big`, and a
   memory verse.
4. Append it to `STORIES` in `src/data/stories.ts`.

Nothing else needs wiring. Sticker totals, the library grid and progress all
derive from the data.

## Verifying changes

There is no test suite, so **look at the result** — do not assume a change
worked because it compiled.

```bash
# All 26 scenes to PNGs + a contact sheet, with motion frozen. This is exactly
# the still frame Calm mode shows, so it catches art that only composes while
# it is moving.
npx esbuild scripts/render-scenes.tsx --bundle --platform=node --format=esm \
  --jsx=automatic --packages=external --outfile=scratch/render.mjs
OUT_DIR=scratch/scenes node scratch/render.mjs

# Screenshot the running app across phone and tablet layouts.
# Needs `npm run preview` on :4173 and a Chromium on --remote-debugging-port=9222.
# `vite preview` binds to localhost (IPv6), so pass BASE explicitly.
BASE=http://localhost:4173 node scripts/shoot.mjs
```

Both write to `scratch/`, which is gitignored. Shots 10–14 cover the Daniel
den scene at phone, tablet, Calm, hotspot-found and big mode; they are the
reference for the v2 style. Known layout limit: at 1024x768 the stage frame
is height-limited and `slice` crops the top ~225 viewBox units, so keep
story-critical art below y=225 and inside x=90–910.

`render-scenes.tsx` renders without CSS, so it **cannot** catch constraint 1
above. `npm run check:motion` does catch it, mechanically, for every registered
scene. Any change touching transforms or animation still needs the browser
screenshots too.

## Conventions

- **Data-driven.** Stories are data; the player is generic. Resist adding
  per-story branches in components.
- **Two art kits, temporarily.** `src/art/v2/` is the new soft-shaded cutout
  style (reference: `design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`);
  `src/art/*.tsx` is the original flat style. A scene uses one or the other;
  the only exception is a tiny background figure where v2 has no pose yet.
  When every scene has migrated, delete v1 and fold v2 into `src/art/`. New
  style work goes in v2 only. v2 rules: one bbox-relative `Shaded` gradient
  per material, gradient-ellipse shadows (never `filter` on anything that
  moves), rest state from attributes so Calm mode holds a composed still.
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
- **Routing is hash-based** (`#/story/<id>/<n>`) so the phone back button pages
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
