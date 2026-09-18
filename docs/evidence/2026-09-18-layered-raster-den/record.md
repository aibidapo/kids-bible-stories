# Evidence record: Daniel den scene, layered raster

## Scope

Task: ship `daniel/den` as layered AI-generated raster art matching
`design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg`, with
hotspots, Calm mode, breathing and blinking intact, offline, inside a 450 KB
scene budget. Retires the ship-nothing-binary rule for artwork (user decision,
2026-09-18).

Spec: `docs/superpowers/specs/2026-09-18-layered-raster-scenes-design.md`
Plan: `docs/superpowers/plans/2026-09-18-layered-raster-den.md`
Previous slice (vector, superseded): `docs/evidence/2026-09-18-daniel-den-v2/record.md`

Gate inventory:

| Gate | Status |
|---|---|
| Pre-commit hook: `check:motion` + `build` | active, ran on every commit below |
| Comparison gate (T1–T11 at 1000 wide) | run, see cycles |
| Lint with security rules, format, unit tests, secret scan, dependency audit | not installed, unknown |
| Coverage, mutation | inapplicable, no test suite |

## Artifact identity

- Checkout `C:\Users\aibid\PROJECTS\KIDS BIBLE STORIES`, branch `main`
- Base for this slice: `5d578db` (end of the vector slice)
- Commits: `aa22b56` spec, `4c45dee` plan, `8dcbb09` compare tooling + webp precache, `773ffbc` pipeline core + sheets, `baa1b3f` assets, `26887f9` scene composition, then the docs commit that includes this record
- Browser evidence tested at `26887f9`; working tree then dirty only with this evidence folder
- Runtime: `dist/` built by the hook at commit `26887f9`, bundle `dist/assets/index-CrrrtTGR.js`, served by `vite preview --port 4173`. Confirmed in-page: `document.scripts` lists `index-CrrrtTGR.js`, six SVG `<image>` elements, two `.a-blink` lids.
- Shipped assets (sha256 first 16): `bg.webp 100425ddc807db17`, `daniel.webp 8e86c8197aaa3726`, `king.webp 6d643fb229a04d5c`, `lion-a.webp f39c308fd13581dd`, `lion-b.webp b5abddcdfe6907f7`
- Generation model: `gemini-3-pro-image-preview`, prompts and references in each asset's `.json` sidecar under `design/pipeline/raw/daniel/den/` (not committed) and `design/characters/*.json` (committed)

## Environment

- Windows 11 Pro 10.0.26200, Node v24.13.0, npm 11.6.2, Vite 8.3.0, esbuild 0.28.2, sharp 0.35.4
- Python 3.14.2, google-genai, Pillow 12.1.0, rembg 2.0.84 (`isnet-general-use`), onnxruntime
- Stills: sharp/librsvg via `scripts/compare.tsx` (WebP swapped to PNG data URIs first)
- Browser shots: headless Chrome/153.0.8010.52 via CDP (`scripts/shoot.mjs`), scratch profile, 390x844 and 1024x768
- Probes: Chrome DevTools MCP, isolated context `den-raster`, 1024x768 @2x, CPU throttling 4x

## Procedures and results

| Check | Procedure | Result | Evidence |
|---|---|---|---|
| Comparison gate | `npm run compare -- daniel/den <concept 6>`, four cycles | T1–T9, T11 pass at cycle 04; T10 (grain at phone size) pass on the phone shot: background carries its own grain and it reads at 390 wide | `cycles.md`, `cycle-00.png`…`cycle-04.png`, `cycle-04-render.png` sha256 c96d626e7cc4b198 (vs_ref) |
| Cutout quality | dark-field composite of all cutouts | clean edges after matte-then-chroma-mask, 2 px erosion, despill | `cutouts-on-dark.png` |
| Size budget | `ls -l src/assets/scenes/daniel/den`; `du -sk dist`; gzip of JS | bg 63,926 B; daniel 50,070; king 23,436; lion-a 54,654; lion-b 51,192; scene total 243,278 B (budget 450 KB); dist 598 KB; JS gzip 76,282 B | this record |
| Precache | `grep webp dist/sw.js` | 5 webp entries in the precache manifest | this record |
| Motion constraints | `npm run check:motion` on every commit | 26 scenes clean | hook output |
| Typecheck + build | hook on every commit | exit 0 | commit history |
| Browser: phone | `browser/10-den-phone.png` | full scene, king in the opening, rings on king and left lion | sha256 042b6848b5020daa |
| Browser: tablet | `browser/11-den-tablet.png` | layers positioned, none collapsed; top ~225 units cropped (pre-existing) | 590dd7ff9141982c |
| Browser: Calm | `browser/12-den-calm.png` | identical composition to the compare still | 2a2d10d8730eb67c |
| Browser: hotspot | `browser/13-den-hotspot.png` | lions hotspot found, sticker toast, reward bubble | 0cac0dd228e375bc |
| Browser: big mode | `browser/14-den-big.png` | long text plus verse, art unchanged | 8b590158a7438d0c |
| Offline | isolated context, load once (SW active), `emulate networkConditions: Offline`, reload, screenshot; then probe every `<image>` href with `new Image()` and `fetch('/')` | scene renders offline; all 6 images load (natural widths 1600/323/688/409/825/688); `fetch('/')` returns 200 text/html from the SW | `browser/15-den-offline.png` 614d7e967b4edc0e |
| Frame cost | rAF sampler, 4x throttle, narration cancelled, production preview | 120 frames, avg 33.33 ms, p50 33.3, p95 33.7, max 33.8. Previous vector slice: avg 35.09, max 100.4. Same 4x-throttle floor, tighter tail | this record |
| Frame cost, narration on | same, before cancelling speech | avg 38.05, p95 66.9, max 199.6: word highlighting during narration costs frames; pre-existing, not from art | this record |

## Review

Automated: `check:motion`, `tsc -b`, Vite build on every commit. No other automated assertions exist.

Visual (agent, not human): the render matches the concept in style, proportions, lighting, layering and character design. Differences from the concept: lion poses (awake, lying) and Daniel's expression follow the story data rather than the concept's sleeping lions; the king is added at the opening for the `king-above` hotspot.

Roast findings and disposition: green fringe (despill added, then chroma mask intersected after the matte, then 2 px erosion: three cycles to get clean); eyelid tone sampled from the asset (#c68058 from Daniel's forehead) rather than guessed; grain set to 0.05 over a background that already carries grain; rembg model download noted in the pipeline README. Mid-task defects: rembg overrode my pre-key alpha and premultiplied pockets to black (fixed by keying after the matte); Gemini client garbage-collected mid-request (module-level singleton); SDK image wrapper is not PIL (decode bytes with PIL).

Human review: **not performed**. Next authorized step is the user's review of `cycle-04.png` and `browser/10-den-phone.png`.

## Gaps

- **No failing-test-first artifact**: no unit-test runner; the comparison checklist is the acceptance test and it is scored by the agent, not a machine.
- **Lint, format, secret scan, dependency audit**: unknown, tooling absent. `npm install` printed "found 0 vulnerabilities" during the esbuild install on 2026-09-18; not an independent audit.
- **Coverage, mutation**: inapplicable.
- **Performance emulated**, not a real phone. Under 4x throttle every route sits at the 33 ms floor.
- **Tablet-landscape crop** (pre-existing): opening, king and `king-above` hotspot off-screen at 1024x768. Needs a Stage layout decision.
- **Lion tails do not sway.** Blink: all four characters blink after the follow-up commit, offsets 0 / 1.3 / 2.6 / 3.9 s across the 5.2 s cycle so no two blink together. Placement verified by rendering with every lid forced visible (`lids-forced.png`, 8 lids in markup).
- **Style split**: den is raster, the other four Daniel pages are flat vector. Not for release until the story is migrated.
- **Licensing**: Gemini output with SynthID watermark; Google's terms permit commercial use, but this is the user's call to confirm for a published app.
- **Stale service worker** in the DevTools MCP default profile for `localhost:4173`; measurements use isolated contexts.
