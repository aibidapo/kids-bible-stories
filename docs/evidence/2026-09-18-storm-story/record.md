# Evidence record: Jesus Calms the Storm (Life of Jesus, story 2)

## Scope

Roadmap phase 4, second story. Owner: "1 default" (Jesus drawn face-on in
the book's style, `docs/decisions/2026-09-18-jesus-depiction.md`) and,
mid-build, "Going forward, I want each scene to be very rich, detailed and
as realistic as possible while still keeping with the theme of the
project" (recorded in `CLAUDE.md`, the roadmap and project memory). Spec
`docs/superpowers/specs/2026-09-18-life-of-jesus-design.md`, plan
`docs/superpowers/plans/2026-09-18-storm-story.md` (roast inline).

## Artifact identity

- Base commit `3fdd291`, working tree of 2026-09-18 evening (this record
  is committed with the story).
- Five pages: `storm/evening`, `asleep`, `afraid`, `peace`, `calm`. Story
  data `src/data/stories/storm.ts` (both levels, hotspots, find-games,
  five quiz questions, Mark 4:41 NIV, devotional). Scenes
  `src/scenes/storm.tsx`. Registered in `src/scenes/index.ts` and
  `STORIES`; the library lists seven stories, 38 pages.
- Character sheets (new): `jesus`, `peter`, `john` under
  `design/characters/`. `character-sheets.png`.
- Generation: `gemini-3-pro-image-preview`; backgrounds at 2K, cutouts at
  1K. Manifests `design/pipeline/scenes/storm-*.json`. Background sidecars
  under `sidecars/`; every asset has one under
  `design/pipeline/raw/storm/` (gitignored).
- Calls: 3 sheets + 5 backgrounds + 25 cutouts = 33 first pass, plus one
  regeneration (`boat-back-tilt`, the model gave the hull a face; prompt
  now says "inanimate object with NO face"; raw kept as
  `boat-back-tilt-v1-face.png`). 34 calls.

## Boat construction

Each boat page is two cutouts, the far gunwale with mast and sail
(`boat-back`) drawn before the crew and the near hull (`boat-hull`) drawn
after, so the crew sits inside. All three are inside one `a-heave` group
with `a-rock` (and `a-shake` on the wild page). The `asleep` and `peace`
far-boat generations had their sails cut flat by the frame edge, so they
reuse the `calm` page's far boat (same prompt, whole sail); no extra call.
Waves are the Jonah storm wave and the creation calm wave, heaving.
`Lightning` gained an `x` offset so the bolt can sit left of the mast
while the flash still covers the sky (Jonah unchanged at `x=0`).

## Sizes (`layers.json`)

| Page | background | cutouts | scene |
|---|---|---|---|
| evening | 123 KB (re-encoded q74 from 158 KB) | 6 | 420 KB |
| asleep | 71 KB | 5 | 385 KB |
| afraid | 162 KB | 5 | 408 KB |
| peace | 86 KB | 5 | 377 KB |
| calm | 61 KB | 4 | 303 KB |

Story total 1893 KB; every scene under 450 KB, every background under
250 KB. `john-nets.webp` is 82 KB, 2 KB over the per-cutout guideline;
accepted. Precache after this story: 194 entries, 9.92 MB (budget 12 MB).
JS bundle 88.1 KB gzip (budget 100 KB).

## Richness recipe applied

2K backgrounds with named materials (wet pebbles, weathered planks, wet
rope, coarse sail cloth), incidental props (nets on posts, clay jar, fish
basket, lantern, coiled rope), two-part boats, Jonah and creation waves,
rain, lightning, light shaft and motes, gulls as a two-frame flipbook, and
blink lids on every open-eyed face (12 cutouts, eye positions read off
gridded crops because `find_eyes.py` missed shadowed eyes and hit white
tunics).

## Review of the raw layers

All figures accepted first pass for likeness to the sheets and chroma key.
Misses: `boat-back-tilt` with a face (regenerated, `afraid-cutouts-on-green.png`);
`asleep` and `peace` far boats with the sail cropped (replaced by the calm
far boat). First composition had the crew hidden behind the hulls; crew
scaled 0.34–0.40 → 0.42–0.50 and raised so heads and shoulders clear the
rail.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Story data invariants | 44 tests incl. the new story (art keys registered, hotspots on stage, both levels, devotional question ends in "?", no em-dash) | `vitest run src/data` |
| Full suite, typecheck, lint | 155 tests pass; `tsc -b` clean; lint 0 errors, 51 warnings (one new, the static `EYES[name]` lookup, keys are literals in the scene file) | this session |
| `check:motion` | 38 scenes clean | this session |
| Full-size renders | five pages `storm-*.png`; hotspots retuned to rendered positions (nets are on the right of the shore background; the two `gull` hotspots are per page) | this folder |
| Browser, phone | afraid page mid-flash with rain and hotspot rings; peace page | `afraid-phone.png`, `peace-phone.png` |
| Browser, tablet | asleep page letterboxed; evening and calm with the sticker hotspot found | `asleep-tablet.png`, `evening-hotspot-tablet.png`, `calm-hotspot-tablet.png` |
| Bundle budgets | 88.1 KB gzip, 9.92 MB precache | `check:bundle` in the hook |
| Performance budgets | **not verified**: both runs (`perf-run1.txt`, `perf-run2.txt`) ran with the host at 100 % CPU from unrelated applications; frame median on the unchanged heaviest page doubled (16.7 → 33 ms), first tap 338/367 ms and page turn 407/416 ms over budget, cold LCP 2632 ms then 568 ms. Run 3 after the push (`perf-run3.txt`, load still 51–99 %): LCP 484 ms, page turn 196 ms, quiz tap 126 ms, warm tap 79 ms within budget; first tap 276 ms (budget 250) still over; frame median 33.3 ms with p95 33.8 ms, a flat 30 fps that looks like a vsync cap of this headless Chrome instance rather than paint work (the baseline 16.7 ms came from a different launch). Rerun on an idle host from the documented launch line before claiming the budgets hold; nothing in this story touches the JS bundle beyond one scene module | `perf-run1.txt`, `perf-run2.txt`, `perf-run3.txt` |

## Gaps

- Performance budgets unverified (above). The 9.92 MB precache means
  download-a-story is the next roadmap item, before story 3.
- No human review of the five pages yet.
- Real-device check open, as for every story.
- `scripts/shoot.mjs` page map now includes `christmas` and `storm`; it is
  hand-maintained (parity debt noted in the roadmap review findings).
