# Bible Adventures for Kids

An interactive, illustrated Bible storybook for children. Five stories, twenty-six
hand-drawn animated scenes, read-along narration, tap-to-explore pictures and
collectible stickers — as an installable web app that works offline.

The same story set serves a wide age range through a **Little / Big** switch:
Little mode is short sentences read aloud for pre-readers; Big mode is the fuller
narrative with scripture references, memory verses and harder quiz questions.

## Stories

| Story | Reference | Scenes |
| --- | --- | --- |
| In the Beginning | Genesis 1 – 2 | 6 |
| Noah's Big Boat | Genesis 6 – 9 | 5 |
| David and the Giant | 1 Samuel 17 | 5 |
| Jonah and the Big Fish | Jonah 1 – 3 | 5 |
| Daniel and the Lions | Daniel 6 | 5 |

## Running it

Requires Node 18 or newer.

```bash
npm install
npm run dev      # development server with hot reload
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Then open the printed URL. On a phone or tablet, use the browser's
"Add to Home Screen" to install it — after the first load it runs offline.

Other scripts:

```bash
npm run icons      # regenerate the app icons from scripts/generate-icons.mjs
npx tsc -b         # typecheck
```

## How it is built

- **Vite + React + TypeScript**, no UI framework.
- **All artwork is code.** Every scene is an inline SVG composed from a shared art
  kit, so the whole app is a few hundred kilobytes, scales to any screen without
  a single bitmap, and has no image licensing to worry about.
- **All sound is synthesised** with the Web Audio API (`src/lib/sound.ts`). There
  are no audio files either.
- **Narration uses the device's own speech synthesiser**, with `onboundary` events
  driving word-by-word highlighting. Nothing is recorded and nothing is uploaded.
- **No account, no network, no analytics.** Progress lives in `localStorage` on
  the one device.

### Layout

```
src/
  art/          the shared art kit — sky, sea, rain, people, animals, props
    palette.ts  one colour system for every scene
    base.tsx    skies, light, water, weather
    figures.tsx people, crowds, the giant, the angel
    animals.tsx lions, sheep, birds, fish, the great fish
    props.tsx   trees, the ark, ships, cities, the den
  scenes/       the 26 scenes, composed from the art kit
    index.ts    string key -> scene component registry
  data/
    stories.ts          the library, in order
    stories/*.ts        one file per story: text, hotspots, quiz, memory verse
  components/   Library, StoryPlayer, Stage, Quiz, StickerBook, Settings
  hooks/        useNarration
  lib/          sound.ts (Web Audio), store.ts (progress)
  styles/
    motion.css  every animation, and the Calm-mode switch that stops them all
    app.css     design tokens and UI
```

### Two rules the art depends on

1. **A CSS `transform` animation beats an element's `transform` attribute.** So an
   animated SVG element must never be the one carrying its own positioning. Art
   components wrap a positioned `<g>` around an animated `<g>`. Getting this wrong
   makes figures collapse to the top-left corner of the scene.
2. **Pivots are declared in `motion.css`** as percentages of each element's own
   bounding box (`transform-box: fill-box`), not as user-space coordinates, so a
   part rotates around its own hinge wherever a scene places it.

## Accessibility

- Calm mode holds every picture still, and turns itself on automatically when the
  device asks for reduced motion.
- Every tap target is at least 64px across.
- Hotspots, page dots and controls are labelled for screen readers; each scene's
  SVG carries a text description.
- The quiz cannot be failed — a wrong answer is greyed out with a gentle sound and
  the child tries again. Only first-time-right answers count towards the score.
- Routing lives in the URL hash, so the phone's back button walks back through the
  book instead of leaving the app.

## Adding a story

1. Write the scene art in `src/scenes/<story>.tsx`, composing from `src/art/`.
2. Register each scene under a string key in `src/scenes/index.ts`.
3. Write `src/data/stories/<story>.ts` — text at both reading levels, hotspots,
   find-games, quiz questions and a memory verse.
4. Add it to the `STORIES` array in `src/data/stories.ts`. Nothing else needs
   wiring; sticker totals and the library grid follow from the data.

## Checking the artwork

Two development aids, both in `scripts/`:

```bash
# Render all 26 scenes to PNGs plus a contact sheet, with animations frozen —
# this is exactly the still frame Calm mode shows.
npx esbuild scripts/render-scenes.tsx --bundle --platform=node --format=esm \
  --jsx=automatic --packages=external --outfile=scratch/render.mjs
OUT_DIR=scratch/scenes node scratch/render.mjs

# Screenshot the running app across phone and tablet sizes (needs a Chromium on
# --remote-debugging-port=9222 and `npm run preview` on :4173).
node scripts/shoot.mjs
```

## Deploying

`npm run build` produces a fully static `dist/`. Drop it on any static host —
Netlify, Vercel, GitHub Pages, Cloudflare Pages — with no server and no
configuration. Because routing is hash-based, no rewrite rules are needed.

## A note on the content

Story text is an original retelling written for this app. Memory verses are short
quotations given with their references.

