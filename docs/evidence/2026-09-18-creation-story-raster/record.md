# Evidence record: Creation story, layered raster (six pages), and vector kit removal

## Scope

Task: migrate `creation/*` (last story) to layered raster art, then delete
the vector figure/animal/prop kit that no scene uses. Plan:
`docs/superpowers/plans/2026-09-18-creation-story-raster.md`. Machinery and
gate inventory as the earlier records.

## Artifact identity

- Branch `main`. Commits: `05489d0` plan + manifests + shoot loop,
  `d724a52` assets, `0e59dcc` compositions + hotspots, then the kit removal
  commit and this record's commit.
- Browser evidence tested at `0e59dcc`: `dist/assets/index-CHKf4rLD.js`,
  served by `vite preview --port 4173`.
- Story assets (shipped bytes per `layers.json`, split tree counted as
  trunk + canopy): light 86,916; sky-water 71,216; land 219,600; lights
  93,812; creatures 68,738; people 170,300. Every scene under 450 KB. `dist`
  6,094 KB with all five stories migrated (26 story pages + the David strike page).
- Generation: `gemini-3-pro-image-preview`; 6 backgrounds + 8 sheet-less
  layers, 14 calls, none rejected. Heavy reuse: David birds and tree, Daniel
  dove, Jonah sea life, Noah animal pairs, David lamb.

## Procedures and results

| Check | Procedure | Result | Evidence |
|---|---|---|---|
| Raw layer review | one sheet | 14/14 accepted (cloud and flowers came back with faces; kept) | `raw-all.png` |
| Composition gate | `npm run compare` per scene, two cycles | all six pass | `cycles.md`, `story-sheet.png`, `*-render.png` |
| Blink lids | Adam and Eve, dolphin, turtle rendered with lids forced | lids on eyes | `lids-forced-people.png`, `lids-forced-creatures.png` |
| Motion constraints | `npm run check:motion` | 27 scenes clean on every commit | hook |
| Typecheck + build | hook | green | commit history |
| Browser: phone ×6 | `STORY=creation node scripts/shoot.mjs` 20-* | every page renders; rings on targets | a5691335f67870ab, 2141e3401b5b3f81, 37840cbfa855b64a, 69a448786d9f4ccb, de048b197e9f8f5a, f0466be0919e9297; `phones.png` |
| Browser: tablet ×6 | 21-* | layers positioned; sun and moon cropped off the top on the lights page by the known tablet crop | bca308c66e2ed1fb, 843f2f72a6048c84, 01830cb519ed0e7b, b3d4e4ee17390224, dfed80b6ff4642ca, 246779d426f4dece |
| Browser: first hotspot ×6 | 22-* | every page's first hotspot fires its sticker or bubble | 283783a9089d7b43, 3a5ff7c2f2f569d8, 119b971e13ef837b, 72043a2d7fb08a76, e2bbf9d5d226d956, 3dda637291bd49ad; `hotspots.png` |
| Frame cost, creatures (13 images; fly 1, frame-a/b 4+4, flutter 3, float 2, blink 2, swim 2) | rAF sampler, 4x throttle, fresh isolated context on `index-CHKf4rLD.js` | 117 frames, avg 34.19 ms, p95 33.8, max 99.8 (one hitch) | this record |
| Vector kit removal | `git rm` figures/animals/props and v2 den/lion/person; typecheck, `check:motion`, build | six files deleted; `tsc -b` exit 0; `check-motion: 27 scenes clean`; Vite build ok, `index-*.js` 245.18 kB / 76.29 kB gzip (was 258 kB / 79.6 kB); `dist` 6,094 KB | kit-removal commit; this record |

## Review

Automated: `check:motion`, `tsc -b`, Vite build per commit.

Findings and disposition: clouds half off the left edge (moved to x 300 and
700); fruit tree oversized and cropped (0.42); Adam and Eve overlapped the
giraffes and lions (animals spread to the edges). The first forced-lid crop
of the people page missed Adam and Eve's faces; the markup was checked
directly (four lids at the head height) and a tighter crop confirms them.

Human review: pending on these pages.

## Gaps

- All gaps from earlier records still apply (no unit-test runner; lint,
  format, secret scan, dependency audit unknown; emulated perf; tablet crop;
  licensing).
- The lights page's sun and moon sit above y=225 and are cropped on tablet
  landscape; the hotspots still work by percentage but the targets are
  off-screen there. Same class of defect as the den king.
- `src/art/base.tsx` still carries vector exports no scene uses (Moon,
  Clouds, Hills, Sea, Rainbow, LightRays, GrassTufts, Rocks); left in place,
  cheap to prune later.
