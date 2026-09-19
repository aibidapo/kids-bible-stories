# Jesus Calms the Storm Implementation Plan (Life of Jesus, story 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A five-page story of Mark 4:35–41 in the app at the Christmas level of richness, with the same data completeness, blinks, moving water and weather.

**Architecture:** Same pipeline as Christmas (sheets → manifests → generate at 2K for backgrounds → cutout → pack), scenes in `src/scenes/storm.tsx`, data in `src/data/stories/storm.ts`. Water reuses the Jonah wave cutouts on `a-heave`; rain and lightning reuse the `Rain` and `Lightning` overlays; gulls are a two-frame flipbook on the fly path. Jesus per `docs/decisions/2026-09-18-jesus-depiction.md`.

**Tech Stack:** as Christmas.

**Spec:** `docs/superpowers/specs/2026-09-18-life-of-jesus-design.md`, story 2.

## Global Constraints

- 450 KB per scene, background ≤ 250 KB, cutouts ≤ 80 KB; never green props.
- Both reading levels; little sentences short; hotspots on story objects.
- Story-critical art inside x 90–910.
- Precache stays under 12 MB (8.2 MB now; this story ≈ +2 MB).

## Pages

1. `evening`: the shore of Galilee at sunset; Jesus invites the disciples to cross; boat at the water's edge; gulls.
2. `asleep`: out on the lake, the wind rising; Jesus asleep on a cushion in the stern; disciples rowing and bailing; waves heaving.
3. `afraid`: the storm at full force, lightning and rain; the boat tilted; the disciples wake him: "Teacher, don't you care if we drown?"
4. `peace`: Jesus stands and speaks, "Quiet! Be still!"; the wind drops; light breaks through; the waves flatten.
5. `calm`: a flat sea under clearing sky; the disciples amazed, "Who is this? Even the wind and the waves obey him!"

## Roast (before code)

- **Architect (3):** a boat with people inside is the hard layering problem, as Jonah's storm was: the hull must cover the crew's lower halves. Use a `boat-hull` cutout drawn after the crew, and a `boat-back` (far gunwale, mast, sail) drawn before them, so the crew sits inside. Two cutouts per boat page.
- **Architect (3):** four water-heavy pages plus rain and lightning overlays push animation count; the creatures page holds 43 at 16.7 ms median. Keep wave layers to three per page and run `npm run perf` after.
- **Buyer (3):** page 3 must be dramatic without frightening a three-year-old: the little text says "very scared" not "drown", the big text quotes the verse. Keep Jesus visible and calm on every page.
- **Content (2):** Mark says other boats were with them; ignore for clarity. Mark 4:41 is the memory verse (NIV, notice already in place).
- **CFO (2):** 3 sheets + 5 backgrounds + ~18 cutouts ≈ 26 calls first pass, ~50 with rework.
- **Verdict:** proceed-with-changes: two-part boat, three waves per page, gentle little text.

### Tasks

- [ ] Sheets: `jesus`, `peter` (older, bearded, brown robe), `john` (younger, clean-shaven, blue robe).
- [ ] Manifests `storm-{evening,asleep,afraid,peace,calm}.json`; generate; review on green; regenerate misses.
- [ ] `src/data/stories/storm.ts`; `src/scenes/storm.tsx`; register; hotspots tuned to renders; blinks.
- [ ] Renders, browser stills phone and tablet, `npm run perf`, evidence record, roadmap, handoff, commit, push.
