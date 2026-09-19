# Evidence record: download-a-story

## Scope

Roadmap phase 4, the feature that ships before Life of Jesus story 3.
Owner: "download a story" (2026-09-19). Spec
`docs/superpowers/specs/2026-09-19-download-a-story-design.md`, plan
`docs/superpowers/plans/2026-09-19-download-a-story.md` (roast inline).

## Artifact identity

Five commits on `main` after `7171953`, each through the pre-commit
hook: `cb07ed5` lazy registry and cover stills, `76b2041` build plugin,
folders and service worker, `e2f5780` downloads store, `0815f70` library
rows and player gate, and the final commit carrying the Vary fix, the
rescan, the online hook and this record. Working tree of 2026-09-19.

## What was built

- `src/scenes/index.ts` loads a story's module on demand (`loadStory`,
  `loadAllStories`); each scene module exports `SCENES`. Main bundle
  88.6 to 68.8 KB gzip.
- `scripts/lib/story-assets.ts` (plus test) reads the bundle graph for
  each story chunk, transitively through shared chunks, and lists the
  files under `assets/stories/`; `vite.config.ts` emits
  `story-assets.json`, routes chunks and art into `assets/stories/<id>/`
  (first story stays with the shell), precaches everything else, and
  runtime-caches `assets/stories/**` (CacheFirst, cache `stories`,
  `ignoreVary`).
- `src/lib/downloads.ts` (plus 15 tests): manifest read once, cache scan
  (builtin / none / partial / ready / unsupported), download four files
  at a time with progress, quota check, persist request, no-space and
  error states, synchronous in-flight guard, `rescan` for the library.
- Library: rendered cover stills (`npm run covers`, `public/covers/`,
  203 KB for seven) instead of live scenes; a download row per card as a
  separate button at least 64 px tall; rescan on mount. Player: waits
  for the story's chunk, shows `StoryUnavailable` when the chunk cannot
  be fetched or the device is offline with the story not fully cached;
  `useOnline` hook so the gate follows connection changes without a
  reload.
- `check-bundle`: precache line 12 to 6 MB, new blocking line for the
  largest downloadable story (3 MB).

## Defects found by the checks

- **Vary: Origin.** A chunk requested as a module carries an Origin
  header; the server answers `Vary: Origin`; a bare-URL `cache.match`
  then misses although `keys()` lists the file (seen as "30 of 31 files
  here" for a fully downloaded story). Fixed with `ignoreVary` on both
  the page's matches and the service worker's route. Found in the
  browser, not by the unit tests, which fake the cache.
- **Shared chunks counted as partial downloads.** Story lists included
  precached shared chunks, so a story never opened showed "1 of 27 files
  here" after another story's download. Lists now hold only files under
  `assets/stories/`.
- **Rows stale after reading online.** The cache was scanned only at app
  start; the library now rescans on mount.
- **Gate blind to connection changes.** `navigator.onLine` was read once;
  a CDP viewport call flipped it and the stage came back on an offline
  page. `useOnline` subscribes to the online and offline events.
- **Double download on a second tap** during the quota check: caught by
  the store test, fixed with a synchronous in-flight set.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Unit and component tests | 192 pass; coverage lines 100, branches above 94, functions above 99, statements above 99 (thresholds raised to 100 / 94 / 98.8 / 99) | hook |
| Typecheck, lint, motion | clean; 0 lint errors; 38 scenes clean | hook |
| Build | `story-assets.json` lists six stories; precache 52 entries, 1.32 MB, none under `assets/stories/`; `sw.js` carries the `stories` route with `ignoreVary` | `dist/` |
| Bundle budgets | JS 68.8 KB; precache 1.32 MB of 6; largest story Christmas 2.19 MB of 3 | hook |
| Browser, fresh context, online | library rows: Creation on this device, six Download buttons with sizes; reading Noah page 1 then returning shows "4 of 22 files here"; Download on Daniel ends "On this device" with all 31 files in the `stories` cache (`library-rows.png`, `library-rows-phone.png`) | CDP |
| Browser, offline (CDP emulation) | with Noah's page open the connection drops: the stage is replaced by the not-on-this-device page without a reload (`offline-noah-unavailable.png`); Daniel page 3 opens with all 9 pictures loading from cache (`offline-daniel-plays.png`) | CDP |
| Offline reload | the CDP tool resets emulation on reload, so the reload itself ran online; instead verified that the precache holds `index.html`, all seven covers and `story-assets.json`, which is what serves the library offline | CDP |
| Performance budgets | all within budget on a 36 percent loaded host: LCP 464 ms, first tap 211 ms, warm tap 84 ms, page turn 193 ms, quiz tap 70 ms, frame median 33.4 ms, p95 33.7 ms (`perf.txt`); the Daniel page in this run is a downloadable story fetched at runtime | `perf.txt` |

## Gaps

- **Real devices.** iPhone and Android checks, including iOS Safari
  evicting inactive site data and its optimistic storage estimate, are
  the owner's step; the code treats a missing or failing estimate as
  "allow" and a short one as "no space".
- Missing pictures inside a partly cached story are not detected image
  by image; offline the whole story is gated on `ready`.
- No remove-a-story action yet; space is freed only by the browser.
- The library cards no longer animate; accepted in the roast.
- The "Downloading, n of N" state was seen only in the component test;
  in the browser at localhost speed the download finishes inside the
  first poll.
