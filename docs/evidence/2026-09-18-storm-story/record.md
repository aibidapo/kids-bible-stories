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

## Roast round (owner: "roast all the scenes and fix all identified issues")

Findings and fixes, renders and stills in this folder replaced:

- **Page 2, Jesus half outside the hull (severity 4).** The sleeping figure
  extended past the stern into open water. Flipped so the body lies into
  the boat with the head at the stern, raised so the cushion shows above
  the rail (x 618, y 448, scale 0.42); John moved left so his face is not
  under the mantle. Cushion hotspot 67 %, 50 %.
- **Page 1, toy boat (3).** Boat 0.5 → 0.72 at x 710; Jesus moved left so
  his inviting hand clears John's nets; crew respaced. Boat hotspot 72 %.
- **Page 3, oversized vector bolt (3).** `Lightning` gained `y` and `s`;
  the bolt is now 0.55 scale, top left of the mast (x -120, y 30). The
  flash still covers the sky. Jonah unchanged at the defaults. Lightning
  hotspot 24 %, 20 %.
- **Page 5, bench legs above the rail (2).** Seated Jesus lowered 22 units.
- **All boat pages, mirrored identical side waves (2).** Left and right
  waves now differ in scale (0.6/0.42, 0.72/0.52) and height.

Checks after the round: 155 tests, `tsc -b` clean, 38 scenes motion-clean,
five renders re-read, 15 browser stills reshot (phone, tablet, first
hotspot). Budgets unchanged (no asset changed).

## Review round 2 (owner, 2026-09-19): pages 1 and 2

Page 1 (shore): "birds flying backwards, boat broken in the centre and too
small, richer environment and boats on the water".

- The gulls face left and the `fly` path runs left to right; both gulls
  now `flip`, so they fly beak first.
- The first boat cutout had a gap at the mast and a small hull; the second
  had a sail cut flat by the frame top. Third generation asks for a boat
  small in its frame with a furled sail and clear space above the mast;
  it came back whole (780×579, 50 KB) and sits at scale 0.68, hull as tall
  as the men. Sidecar `evening-boat-shore-v2.json`.
- Background regenerated at 2K with a stone jetty, a hillside village with
  lit windows, four moored and sailing boats with reflections, drying nets,
  jar, basket, oar and grass (`evening-bg-v2.json`). 150 KB after pack;
  scene 445 KB. Nets hotspot moved to the nets John carries (the drying
  nets are at the left edge, inside the phone crop line).

Page 2 (asleep): "Jesus cut in half, boat cut in half, waves and boat out
of sync, cloud and rocks unrealistic".

- Both cuts were frame edges: the near hull's stern and the lying figure's
  feet had overflowed their generation frames and ended in the same flat
  vertical line. The hull is now the calm page's whole hull (in the packed
  assets and the raw folder); Jesus regenerated at 16:9 with "the entire
  figure inside the frame" (866×420, 70 KB, `asleep-jesus-asleep-v2.json`),
  lying on the cushion inside the boat at scale 0.36. Cushion hotspot
  70 %, 58 %.
- Background regenerated: open water only, no rocks or shore, storm bank
  with volume and a distant rain curtain (`asleep-bg-v2.json`, 72 KB).
  Scene 385 KB.
- Wave sync: side waves on every boat page now share the boat's heave class
  and phase, and the front wave sits inside the boat's heave group so it
  rises and falls with the hull (`Ripple` gained a `cls` prop; `Wave`
  already had one). Applied to asleep, afraid, peace and calm.

Renders `storm-evening.png`, `storm-asleep.png` and the stills replaced;
cutout sheets `*-cutouts-on-green-v2.png`. Calls this round: 5 (one boat
attempt discarded). 155 tests, 38 scenes motion-clean.

## Review round 3 (owner, 2026-09-19): page 1 again

"Gulls still flying backwards; a disciple holds a broken piece of boat over
the main boat; houses more realistic; boat bigger relative to the men."

- **Gulls: component bug.** `Flipbook` applied `flip` on the outer
  positioning group, so the mirror also reversed the motion path: a
  flipped bird faced right and travelled left. The mirror now sits inside
  the motion group (`src/art/raster.tsx`), so every path keeps its own
  direction and `flip` only turns the bird. Every flight path in
  `motion.css` moves rightwards; checked each flipbook bird's facing after
  the fix: Christmas doves face right (no flip), creation red bird, blue
  bird and dove face right, the goldfinch cutout faces right (creation
  people page, fly path, no flip), David's bluebird faces right. The
  flipped goldfinches on creation creatures and David's hill are on the
  short `flutter` hover, where facing does not read as travel. Storm gulls
  face left in their cutouts and are flipped, so they now fly beak first.
- **Broken boat piece:** the first `peter-push` came with a fragment of
  bow in his hands. Regenerated with "both palms pressed forward, NO boat,
  NO object" (`evening-peter-push-v3.json`, 576×800, 55 KB); his palms
  now rest on the real boat's rail.
- **Houses:** background regenerated with a realistic first-century
  village brief (limestone walls, flat roofs with parapets and outside
  stairs, terraces, olive and fig trees, lamplight, painterly realism)
  (`evening-bg-v3.json`, 166 KB). Scene 449 KB.
- **Boat size:** scale 0.68 → 0.9, hull rail at the men's chest height,
  stern runs off the right edge on purpose. Gull rest positions moved to
  the clear sky above the yard; gull hotspot 38 %, 15 %.

Render `storm-evening.png` and the two stills replaced. Calls this round:
2. 155 tests, `tsc -b` clean, 38 scenes motion-clean.

## Review round 4 (owner, 2026-09-19): page 3

"Jesus not properly situated in the boat; items in the image not
realistic; the mast not properly situated."

- The page had its own separately generated tilted halves
  (`boat-back-tilt`, `boat-hull-tilt`), whose mast, bow post and rail
  never lined up with each other, and Jesus sat past the near hull's
  stern. Both tilt cutouts are dropped from the manifest and the assets.
  The page now uses the same whole two-part boat as the other pages (calm
  far side and hull, copied into the raw folder) inside one positioning
  group `rotate(-7 500 600)`, with the heave, rock and shake classes on
  groups inside it (constraint 1 holds; `check:motion` 38 clean). Jesus
  seated at x 640 inside the hull.
- Background regenerated with "NO wood, NO planks, NO rope, NO debris":
  water, rain, volumetric cloud and one painted fork of lightning
  (`afraid-bg-v2.json`, 104 KB). Scene 372 KB.
- Peter and Jesus hotspots retuned to the faces (46 %, 46 % and 61 %,
  46 %).

Render `storm-afraid.png`, stills `afraid-phone.png` and
`afraid-hotspot-tablet.png` replaced. Calls this round: 1.

## Review round 5 (owner, 2026-09-19): page 4

"Waves superimposed on rocks and wood, not the water; make the raindrops
look like they are still falling."

- The background had painted rocks, planks and a coil of rope along the
  bottom and static teardrop raindrops. Regenerated with "NO raindrops in
  the foreground, NO rocks, NO wood, NO shore: only water, cloud, light
  and sky" (`peace-bg-v2.json`, 63 KB). Scene 354 KB. The ripples now
  sit on water.
- The rain is the animated `Rain` overlay (45 drops, opacity 0.4, the
  `rainfall` keyframes), so it falls in the browser and rests as a still
  in Calm mode, like the wild-night page.

Render `storm-peace.png` and `peace-phone.png` replaced. Calls: 1.

## Review round 6 (owner, 2026-09-19): page 5

"Waves superimposed on rocks and wood; only one bird flying, the others
static; make the background more realistic; other coloured birds flying
through, some flying towards Jesus and the disciples."

- Background regenerated with "NO birds, NO rocks, NO wood, NO shore":
  glassy dawn water with long reflections, lifting mist, layered hills
  with olive groves and a stone village, clearing sky with fading stars
  (`calm-bg-v2.json`, 52 KB). Scene 294 KB. The painted static birds are
  gone with it; every bird on the page is now animated.
- Birds: the gull and a bluebird cross on the `fly` path; a red bird and a
  goldfinch arrive from far off toward the boat on two new paths
  (`swoop-l`, `swoop-r` in `motion.css`): they fade in small and distant,
  grow to full size as they reach the men, then pass behind and fade.
  The goldfinch is flipped so it faces the boat from the right. The bird
  frames are David's hill songbirds (`SongBird` helper in `storm.tsx`,
  eye anchors as in `david.tsx`). In Calm mode each bird rests at full
  size at its arrival point.

Render `storm-calm.png` and the stills replaced. Calls: 1.

## Review round 7 (owner, 2026-09-19): page 5 again

"Background more realistic and detailed; some birds flying towards Jesus
and the disciples from behind."

- Background regenerated with a painterly-realism brief: mirror
  reflections, fine ripples, mist, terraced hills with olive groves and
  cypress, a limestone village with a jetty and a smoke column, rays
  through the mist, no foreground objects (`calm-bg-v3.json`, 64 KB).
  Scene 306 KB.
- New path `swoop-far` in `motion.css`: the bird starts as a speck over
  the far hills behind the boat (scale 0.1, above and slightly right of
  its rest point), flies out toward the men growing to full size, passes
  on and fades, then repeats. The red bird and the goldfinch ride it, drawn
  behind the boat group so they arrive from behind the figures; a
  bluebird still arrives from the right on `swoop-r`; another bluebird and
  the gull cross on `fly`. Rest points sit beside the heads, not on them.

Render `storm-calm.png` and the stills replaced. Calls: 1.

## Review round 8 (owner, 2026-09-19): page 5, birds facing forward

"The birds flying towards should be facing forward. What we have now is
birds dropping down."

- Side-view frames on a descending path read as falling. Four new frames
  generated: a bluebird and a red cardinal each seen head-on with wings
  up and wings down (`calm-*-front-*.json`, 17–23 KB each,
  `calm-front-birds-on-green.png`). `FrontBird` in `storm.tsx` flips
  between them on the head anchor.
- `swoop-far` flattened: the bird now starts as a speck almost at its
  rest point (40 units higher, scale 0.08) and grows to full size, then
  passes at 1.3 and fades, so the motion is toward the viewer rather than
  down. The goldfinch side-view arrival is replaced by the head-on
  bluebird; the red cardinal arrives head-on at the left; the side-view
  bluebird still arrives from the right; the gull and another bluebird
  cross. Gull rest point and hotspot moved to 14 %, 18 % clear of the
  cardinal. Scene 390 KB.

Render `storm-calm.png` and stills replaced. Calls: 4.
