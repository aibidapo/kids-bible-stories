# Download-a-story design

Roadmap phase 4, the feature that ships before Life of Jesus story 3.
The precache is 9.79 MB of a 12 MB line and each new story costs about
2 MB, so the app stops precaching every story and lets a grown-up
download stories one at a time.

## What the child and the grown-up see

- The library always opens, online or offline, with every story card and
  its cover picture. The first story (Creation) is always on the device.
- Under each other story's card a small row shows one of: **Download**
  (with its size), **Downloading, 12 of 30**, **On this device**,
  **Not enough space on this device**, or **Download failed, try again**.
  The row is a separate button from the card, at least 64 px tall.
- Online, any story opens whether or not it is downloaded; pages viewed
  online are kept, so a story read online once is partly on the device.
- Offline, a story that is not fully on the device shows a page saying
  "This story is not on this device yet. Connect to the internet, or
  download it from the library." with a Back button. No broken pictures.
- Downloading asks the browser to keep the site's storage (persist), and
  refuses to start when the reported free quota is smaller than the
  story.

## How it is built

- **Per-story chunks.** Each scene module exports its `SCENES` map and the
  registry loads a story's module on demand (`loadStory(id)`). Vite emits
  one chunk per story and lists every asset that chunk uses, including
  art borrowed from other stories, in `viteMetadata.importedAssets`
  (verified by a spike on Vite 8). Shared art modules become small shared
  chunks; the collector follows `imports` transitively.
- **Per-story folders.** `assetFileNames` and `chunkFileNames` put a
  story's files under `assets/stories/<id>/`; the first story's files
  stay in `assets/` and are precached like the app shell.
- **`story-assets.json`.** A build plugin (`scripts/lib/story-assets.ts`,
  pure collector plus a thin Vite wrapper) emits `{ [storyId]: { files:
  string[], bytes: number } }` for every downloadable story. It is
  precached, so the list is always the one that matches the build.
- **Service worker.** Workbox precaches everything except
  `assets/stories/**`; a `CacheFirst` runtime route caches that folder
  into a cache named `stories`.
- **Downloads.** `src/lib/downloads.ts` owns a module store read through
  `useSyncExternalStore`: per story `{ status, done, total }` with status
  `builtin | unknown | none | partial | downloading | ready | no-space |
  error | unsupported`. `refresh()` matches every file against the
  `stories` cache; `download(id)` checks `navigator.storage.estimate()`,
  requests `persist()`, then fetches each file into the same cache with
  four in flight, updating `done`. Pure helpers (`summarize`,
  `hasSpace`) are unit-tested; the cache and fetch are faked in DOM tests.
- **Player.** `StoryPlayer` awaits `loadStory(id)` before rendering the
  stage; if the import rejects, or the device is offline and the story
  is not `ready`, it shows the offline page. Missing pictures inside a
  partly cached story are not detected image by image; the status row
  and the offline page cover the common case and the gap is recorded.
- **Covers.** The library stops mounting seven live scenes. `npm run
  covers` renders each story's cover scene to `public/covers/<id>.webp`
  (640x400, committed); a story-data test checks the file exists. The
  cards lose their idle animation and the library's first paint gets
  cheaper.
- **Budgets.** `check:bundle` keeps the JS gzip line, lowers the precache
  line to 6 MB (shell plus one story), and adds a blocking line for the
  largest downloadable story, 3 MB.

## Out of scope

Removing a downloaded story, background sync, download-all, and
per-image fallbacks. Real-device tests on iPhone and Android, including
iOS Safari's eviction of inactive site data, are the owner's step and
stay open in the evidence record until done.
