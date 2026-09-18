# Evidence record: Jonah story, layered raster (five pages after one review round)

## Scope

Task: migrate `jonah/*` to layered raster art with blinks from the start,
then the user's review: everyone on the quay with a ship and people in
proportion and a realistic harbour and water; waves that move and carry the
boat with the crew inside it; Jonah visibly being swallowed with other sea
life and bubbles; the Nineveh crowd scaled to Jonah.

Plan: `docs/superpowers/plans/2026-09-18-jonah-story-raster.md`. Machinery
and gate inventory as the earlier records.

## Artifact identity

- Branch `main`. Commits: `babbf54` sheet + manifests + 16 layers + plan,
  `8dcbf63` first compositions, `0fa70e6` review round (harbour rebuilt,
  heaving storm, swallow beat, sea life, crowd scale), `b4611a5` Jonah
  head-first in the mouth, `edf0ae7` harbour figures on the quay + quiz shuffle, then the record commits.
- Browser evidence tested at `b4611a5`: `dist/assets/index-BeGgKjfC.js`,
  served by `vite preview --port 4173`.
- Story assets (bytes per `layers.json`): running 293,168; storm 303,808;
  swallowed 300,044; prayer 147,662; nineveh 222,176. Every scene under
  450 KB. `dist` 5,366 KB with four stories migrated.
- Generation: `gemini-3-pro-image-preview`. Sheet: jonah. Layers: 16 first
  pass, then a second harbour background, a storm wave, a turtle, a fish
  school and a jellyfish. No layer rejected.
- New motion classes: `a-heave` / `a-heave-slow` (sea swell; the boat sits
  in the same heave group as the near wave), `a-swallow` (one-shot drift
  into the mouth, rest at the mouth), `a-bubble` (rise and fade, rest at the
  start point). All added with `Edit` on a unique anchor, and the page's
  running animation names were listed afterwards.

## Procedures and results

| Check | Procedure | Result | Evidence |
|---|---|---|---|
| Raw layer review | review sheets | 21/21 accepted | `raw-*.png`, `raw-harbour-wave.png`, `raw-creatures.png` |
| Composition gate | `npm run compare` per scene, four cycles | all five pass | `cycles.md`, `story-sheet.png`, `*-render.png`, `swallowed-mouth-zoom.png` |
| Blink lids | every face rendered with lids forced; storm crew re-checked after the fix | lids on eyes, incl. the great fish and the little fish | `lids-forced.png`, `storm-lids-forced.png` |
| Motion constraints | `npm run check:motion` | 27 scenes clean on every commit | hook |
| Typecheck + build | hook | green | commit history |
| Browser: phone ×5 | `STORY=jonah node scripts/shoot.mjs` 20-* | every page renders; rings on targets. The swallowed shot catches Jonah mid-drift (the one-shot is 1.5 s in when the shot is taken); Calm rests him in the mouth | 4ba60ee2a3ac1254, 102eaa04814bf2f7, 77df19fdeb072da9, 08ee2b11fed82e5a, 7060e0492f24e747; `phones.png` |
| Browser: tablet ×5 | 21-* | layers positioned; sail top cropped on the storm | 282d8e916043f272, 02affa75ee147a3d, 5b61b7a309cf49c1, 4881a33f9bd51968, 1d2f37ae18d7ac4e |
| Browser: first hotspot ×5 | 22-* | every page's first hotspot fires its sticker or bubble | 7a201a53057f45cd, d4a611f81c35fa10, 1da5b012dc16f023, da45ee8d5f103cab, 59b56ab5313681fe; `hotspots.png` |
| Frame cost, storm (rain overlay, lightning, 4 heaving waves, rock, shake, 7 images) | rAF sampler, 4x throttle, single page, fresh isolated context on `index-BeGgKjfC.js` | 8 images; animations flash 1, heave 5, rock-boat 1, shake 1, blink 8, breathe 1, rainfall 1; 120 frames, avg 33.33 ms, p95 33.7, max 34.1. A first probe in an older context hit the stale service-worker build and was discarded. | this record |
| Harbour, second review | user: figures floating, ship small | feet moved onto the quay top, ship 0.88 moored at the edge; commit `edf0ae7` | `running-render.png`, `browser/20-jonah-0-running-phone.png` badba296ffb2d89b |
| Quiz shuffle | `Quiz.tsx` shuffles each question's choices once per mount; checked on `index-C22RKXah.js` by reading the first question's choices on five stories' quiz pages | right answer at position 3 (david), 3 (noah), 1 (jonah), 3 (daniel), 1 (creation): no longer always first | `browser/6-quiz.png` 9562314703974fb6; this record |
| Offline | not repeated this story (precache strategy unchanged since the Daniel check) | — | — |

## Review

Automated: `check:motion`, `tsc -b`, Vite build per commit.

Findings and disposition: storm crew's eyelids floated in the sky (eyelid
group not scaled with the raw image; fixed by nesting `Eyelids` in the same
scaled group as the image, the pattern now used for every raw `<image>`);
first harbour had a narrow quay with people in the water and a small ship
(background regenerated with a full-width quay, ship 0.62, sailors 0.5);
storm sea was a static background (four wave layers on `a-heave`, ship in
the near swell's group); Jonah was hidden behind the fish (now in front,
head-first in the mouth); Nineveh crowd was two-thirds Jonah's height (0.48).

Human review: the user reviewed the story once; the changes above are their
requests. Final approval of the current state is pending.

## Gaps

- All gaps from earlier records still apply (no unit-test runner; lint,
  format, secret scan, dependency audit unknown; emulated perf; tablet crop;
  licensing).
- The vector `Lightning` bolt from the original kit reads as a flat white
  slab over the raster sail; a raster bolt would match better.
- Storm Jonah is partly behind the loose sail.
