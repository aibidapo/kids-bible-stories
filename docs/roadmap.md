# Product roadmap

Tracking document for the improvement phases. One section per phase: goal,
scope, out of scope, dependencies and decisions, cost, done-when, status.
Update the status lines and the log at the bottom as work lands; each phase
links its spec, plan and evidence record once they exist.

Revised 2026-09-18 after an adversarial review (see "Review findings" at the
end): discovery and distribution are now phases of their own, every phase
carries a cost line, and nothing paid is scheduled before a buyer has been
found.

Standing instruction from the owner (2026-09-18): every scene very rich,
detailed and as realistic as possible within the storybook style; see the
richness standard in `CLAUDE.md`. Applies to every phase that makes art.

Constraints every phase inherits (from `CLAUDE.md`): offline PWA, no network
calls, no accounts, no analytics, progress in localStorage only; stories are
data and the player is generic; every piece of prose at both reading levels;
art is layered raster within 450 KB per scene and ~12 MB total precache;
sound synthesised, narration by device speech, no font files; Calm mode
honest; the quiz cannot be failed. Performance budgets (`CLAUDE.md`,
"Performance and load"): JS gzip <= 100 KB, precache <= 12 MB in the hook;
interaction budgets on demand with `npm run perf`; hosting is static, so
scaling with users is the host's property, not the app's.

## How costs are written

Every phase has a **Cost** line in three parts:

- **Hours × R.** Engineering and content hours at the owner's hourly rate
  `R` (not written here; multiply at planning time). Hours include the
  review rounds this project actually needs: Daniel page 2 took five
  regeneration rounds this week, so art estimates carry a **×2 rework
  factor** on the first-pass figure.
- **Gemini calls × P.** Image generations at the current per-image price
  `P` from the Google AI pricing page (check the date; it changes). Known
  rates from this codebase: ~15 calls per five-page story first pass,
  ~30 with rework.
- **Third-party.** Quotes needed before the phase starts (narrator, TTS,
  print, store fees, legal).

A phase with an unfilled cost line is not scheduled.

## Order

0. Discovery: who pays, for what (one week, no code)
1. Family Devotional mode (built; review open)
2. Blockers: art licensing, tablet-landscape crop, CI and component coverage
3. Distribution model (a decision phase)
4. Life of Jesus collection, with download-a-story
5. Church and homeschool pilot, then edition
6. Family profiles and parent PIN (plus name personalisation)
7. Narration: loved-one recordings first, professional later
8. Smaller additions
9. Identity and keepsakes (style bible, print pages, gift editions, Spanish)

Approved order after the 2026-09-19 outside review (owner: "approved"):
style bible, loved-one narration, print stylesheet, name personalisation
(inside 6), Life of Jesus stories 3 to 5, then export package, Spanish and
gift editions after the pilot and the distribution decision. Each of these
is roasted in phase 9 before it is built.

Rationale (phase 0 skipped 2026-09-18, buyer = local churches by the
owner's statement): the pilot should come before new content so the
churches' asks shape it, hence the recommendation below to run 5 before 4; the blockers gate anything paid or classroom-facing; the
distribution decision decides whether "paid" exists at all; Jesus stories
precede the pilot because churches will ask for them; profiles and
narration are the costliest for the least teaching value. Phases 4–7 are
**reordered from phase 0's answers**, not fixed.

## Phase 0: Discovery

- **Goal:** find out who would pay, what they use today, and what they
  would pay for, before more art is generated.
- **Scope:** ten conversations with parents of 3–12 year olds and three
  with church children's-work or homeschool leaders. Fixed questions:
  what they use now (apps, books, YouTube, curriculum), what it costs them,
  what a good bedtime or lesson looks like, whether they would pay once,
  monthly, or not at all, and for which of: more stories, Jesus stories,
  Family time, printables, narration, profiles. Show the current app on a
  phone and watch one page and one quiz without helping.
- **Out of scope:** any code. Any promise of features.
- **Dependencies and decisions:** none.
- **Cost:** ~12 hours × R (interviews, notes, synthesis). Gemini 0.
  Third-party none.
- **Done when:** a one-page findings note in `docs/decisions/` with: the
  named buyer segments, what each pays today, the top three requested
  items, and the price points heard. Phases 4–7 reordered from it.
- **Kit:** `docs/discovery/interview-kit.md` (scripts, write-up template,
  findings note format).
- **Status:** **skipped by the owner 2026-09-18** (local churches have already
  requested the product); see `docs/decisions/2026-09-18-phase-0-skipped.md`.
  Buyer segment: local churches. Price and feature ranking unknown. The kit
  is kept for the pilot's observed sessions.

## Phase 1: Family Devotional mode

- **Goal:** each story ends with a short Family time for a parent and child:
  one talk-about question, a short prayer, the memory verse, one real-world
  activity.
- **Scope:** `devotional` data on every story at both reading levels; a
  Family time screen reached from the quiz's "Well done" page and from
  `#/story/<id>/family`; content for the five existing stories; read-aloud
  through the existing narration hook; tests for data invariants and the
  rendered screen; docs.
- **Out of scope:** timers, streaks, reminders, any persistence of answers.
- **Dependencies and decisions:** none. Content written in-house; a
  theological read-through is a human review item. Phase 0 should also
  test whether parents open it at all.
- **Cost:** spent, ~1 day × R. Gemini 0.
- **Done when:** every story has devotional content at both levels
  (test-enforced), the screen renders on phone and tablet, narration
  behaves, evidence record written, content reviewed by a human.
- **Spec:** `docs/superpowers/specs/2026-09-18-family-devotional-design.md`
- **Plan:** `docs/superpowers/plans/2026-09-18-family-devotional.md`
- **Evidence:** `docs/evidence/2026-09-18-family-devotional/record.md`
- **Status:** built 2026-09-18. Author's content review pass done
  (`docs/evidence/2026-09-18-family-devotional/content-review.md`): all
  items check out against the stories and references; **one finding for
  the owner: the memory verses are NIV wording and the app shows no
  translation notice; choose notice, public-domain translation, or
  paraphrase before release.** NIV notice added 2026-09-18 (Settings and
  beside each verse, `docs/evidence/2026-09-18-niv-notice/record.md`).
  Owner's read-through still open; checklist in the review note.

## Phase 2: Blockers before paid or classroom use

### 2a. Art licensing stance

- **Goal:** a written position on shipping Gemini-generated art in a
  published, possibly paid, product, and on what rights (e.g. classroom
  display) can be granted downstream.
- **Scope:** read the current Gemini API terms for generated output;
  decide whether to keep, replace with commissioned art, or mix; record
  the decision and its date in `docs/decisions/`.
- **Dependencies:** owner decision; possibly legal advice. Not a code task.
- **Cost:** ~2 hours × R to read and decide. Third-party: a legal opinion if
  the terms are unclear (get a quote). **If the answer is "commission art",
  the cost of goods for the whole catalogue changes: 27 scenes today plus
  every future story; that outcome must be priced before phase 4 starts.**
- **Done when:** the decision file exists and the `CLAUDE.md` media rule
  cites it.
- **Status:** open. Blocks phases 4 (if paid) and 5.

### 2b. Tablet-landscape crop

- **Goal:** no story-critical art cut off at 1024×768 and similar frames.
- **Scope:** decide letterbox vs a vertical safe zone; implement in
  `Stage`; re-shoot all 27 pages at tablet as the acceptance test; if safe
  zone, re-compose every page whose subject sits above y=225 (known so far:
  den king, sun and moon pages, the trap king's head, the angel's head).
- **Dependencies:** owner decision on letterbox vs safe zone.
- **Cost:** letterbox ~1 day × R; safe zone ~2 days × R plus rework on
  five or more pages (Gemini 0 unless a background must move). Gate is the
  27-page tablet re-shoot, not a code change.
- **Done when:** every page's tablet shot shows heads and key props.
- **Evidence:** `docs/evidence/2026-09-18-tablet-letterbox/record.md`
- **Status:** done 2026-09-18 (owner chose letterbox); hotspot layer glued to the art as part of it; 27-page tablet re-shoot passed.

### 2c. CI and component coverage

- **Goal:** the gates survive a second machine, and UI changes are
  verified by tests, not only by screenshots.
- **Scope:** GitHub Actions running the identical hook commands plus
  `npm run audit`; the coverage include set widened to components rendered
  through `react-dom/server` (`Quiz`, `FamilyTime`, `NarrationText`,
  `StoryPlayer`), thresholds raised in the same commits; a browser
  smoke (Playwright or the existing DevTools script) for the story, quiz
  and family routes at phone and tablet.
- **Dependencies:** none.
- **Cost:** ~2 days × R. Third-party: CI minutes (free tier likely enough).
- **Done when:** a pull request fails on a broken test or an unformatted
  file without any local hook; component coverage in the thresholds.
- **Evidence:** `docs/evidence/2026-09-18-component-coverage/record.md`
- **Status:** local half done 2026-09-18: every component and the narration
  hook have behaviour tests (happy-dom per file, Testing Library), the
  coverage include set now spans `src/lib`, `src/components`, `src/hooks`
  and the raster seams with thresholds at the measured floor. **CI blocked:**
  GitHub Actions is unavailable to the owner (stated 2026-09-18); the
  pre-commit hook remains the enforcement, per the local-first rule. Revisit
  when CI is available; the hook's commands are the workflow's commands.
  Browser smoke stays manual (`scripts/shoot.mjs`).

## Phase 3: Distribution model

- **Goal:** decide whether "paid" exists, and how.
- **Options:**
  1. **Free PWA, forever.** Drop "paid" from phases 4 and 5; income, if
     any, from the church edition's printables and guides sold outside the
     app. Zero engineering.
  2. **Wrapped store app** (Capacitor or a Trusted Web Activity) sold once
     on the stores. New build and signing pipeline, store accounts and
     fees, review cycles, privacy declarations; still no in-app
     entitlements, the purchase is the app.
  3. **In-app purchases** through the store's billing in a wrapper. Breaks
     the no-network rule at purchase time; adds receipt handling and
     restore-purchases flows.
- **Dependencies:** phase 0 (what buyers said), phase 2a.
- **Cost:** option 1 zero. Option 2 ~3–5 days × R plus store fees
  (developer accounts, per-year) and a signing setup. Option 3 adds
  ~3 days × R and ongoing support. Get the fee figures before deciding.
- **Done when:** a decision file in `docs/decisions/` names the option, its
  costs and what it removes from later phases.
- **Status:** not started. Blocks any "paid" wording elsewhere.

**Recommended order after the phase 0 decision:** 2a → 5 (pilot with the
current five stories) → 4 → 6 → 7. Owner to confirm.

## Phase 4: Life of Jesus collection, with download-a-story

- **Goal:** five New Testament stories: Christmas, a miracle, the Good
  Samaritan, Easter, Pentecost. And, because the catalogue will pass the
  precache line, a real per-story download feature instead of a config
  switch.
- **Scope, feature first:** the media rule's "precache the first story,
  runtime-cache the rest" becomes a **download-a-story** feature: a
  library card state (not downloaded, downloading, ready), an explicit
  download tap, storage-quota checks, an offline message when a page's
  assets are missing, and tested behaviour under iOS Safari's eviction of
  inactive site data. Tested on a real iPhone and Android phone before any
  Jesus art is generated.
- **Scope, content:** character sheets for Jesus, Mary, disciples; ~28
  scenes of layered raster art through the pipeline; prose at both levels;
  hotspots, find-games, quizzes, memory verses, devotionals.
- **Dependencies and decisions:** phase 0 (are Jesus stories the top
  ask?); how Jesus is depicted (several traditions avoid a face; decide
  before generating sheets); phase 2a and 3 if sold; phase 2c.
- **Cost:** feature ~3 days × R plus two test phones. Content: first pass
  ~15–20 hours × R, with the ×2 rework factor **30–40 hours × R**; Gemini
  ~150 calls × P first pass, ~300 × P with rework. Third-party: none.
- **Done when:** download-a-story passes on both phones offline; five
  stories pass the same evidence gates as the current five; first-load on
  Fast 3G measured.
- **Spec:** `docs/superpowers/specs/2026-09-18-life-of-jesus-design.md`
- **Evidence:** `docs/evidence/2026-09-18-christmas-story/record.md`
- **Status:** started 2026-09-18 on the owner's instruction ("very rich and
  detailed"). Story 1, The First Christmas, built: six pages, 2K
  backgrounds, 25 cutouts, five new character sheets; in the app and under
  the hook; credit ran out after the first pass, was topped up, and the two
  pending regenerations landed; one owner review round applied (angel
  wings, blinks, richer backgrounds on three pages, flock, campfire,
  swaying tree, flying doves, baby on the last page). Order changed on purpose: two
  stories before download-a-story so the richness is reviewable early;
  the feature ships before story 3. Jesus depicted face-on in the book's
  style (`docs/decisions/2026-09-18-jesus-depiction.md`). Story 2, Jesus
  Calms the Storm, built 2026-09-18: five pages, three new sheets (Jesus,
  Peter, John), two-part boats so the crew sits inside, lightning, rain,
  heaving waves, blinks; evidence
  `docs/evidence/2026-09-18-storm-story/record.md`. **Download-a-story
  built 2026-09-19** (`docs/evidence/2026-09-19-download-a-story/record.md`):
  the shell, covers and Creation precache (1.32 MB); each other story is
  its own chunk and folder, fetched on demand or by the Download button,
  with an honest offline page. Real-phone checks (iOS eviction) are the
  owner's step. Story 3 next.

## Phase 5: Church and homeschool pilot, then edition

- **Goal:** learn what two or three churches or homeschool groups actually
  use before building an institutional product.
- **Measurement decision (make before the pilot):** the app has no
  analytics by rule. Choose one: (a) a **local usage log** (pages opened,
  quiz finished, Family time opened, per session, no identities) that the
  leader exports by hand from Settings and sends back, or (b) accept a
  **qualitative** pilot: a leader diary and one observed session per group,
  and say so in the findings. Without (a) or (b) written down the pilot is
  a demo.
- **Scope, pilot:** free access, a one-page "how to use in a group" note,
  the tablet crop fixed, the measurement choice implemented, a feedback
  form outside the app.
- **Scope, edition (only if the pilot asks for it):** printable colouring
  sheets and a printable sticker sheet (print stylesheet or PDF export),
  lesson plans and discussion guides per story, seasonal packs, licence
  terms for classroom display. **Guides are recurring content work per
  story forever, not a one-off**; budget them per story.
- **Dependencies:** phases 0, 2a, 2b, 3; phase 4 helps.
- **Cost:** pilot ~1 day × R prep, plus ~1 day × R if the local usage log
  is chosen. Edition: print tooling ~2 days × R; guides ~4 hours × R per
  story, ongoing. Third-party: printing if physical, licence wording.
- **Done when (pilot):** written findings from each group with the
  measurement chosen above.
- **Evidence:** `docs/evidence/2026-09-18-church-pilot-prep/record.md`
- **Status:** pilot prep built 2026-09-18 on the owner's "proceed":
  measurement option (a) implemented as the opt-in Group pilot log in
  Settings (counts per day, copy-out only); leader documents in
  `docs/pilot/` (README, one page for the room, feedback form). Licensing
  (2a) still parked, so the pilot runs as free access with a
  no-redistribution note. Not yet started with a group.

## Phase 6: Family profiles and parent PIN

- **Goal:** several children on one device, each with their own stickers,
  quiz bests and reading level; grown-up settings behind a PIN.
- **Scope:** `store.ts` becomes profiles plus an active id with a v1 → v2
  save migration (tests first; the store is 95 % covered); a profile
  picker on the library; per-child mode; a four-digit PIN for the settings
  sheet, stored locally, described honestly as a speed bump (clearing site
  data removes it), no lockout, no recovery.
- **Shared-device note:** a classroom is many children on one tablet with
  no parent. Profiles as designed here are a family model (a handful of
  named children). If phase 5 shows classroom use, that needs a separate
  "class mode" (no profiles, no stickers persisted, a leader reset), not
  this phase stretched.
- **Name personalisation (approved 2026-09-19):** the child's first name,
  typed once by a grown-up, stored locally, used in the Family time
  question and prayer and on the sticker book. Name only: no avatar art,
  no photo, and never inside a Bible scene. Folds into this phase's
  profile record; until profiles exist it is one field in `store.ts`.
- **Dependencies:** phase 0 (asked for?), phase 2c.
- **Cost:** ~2 days × R, plus half a day for the name. Gemini 0.
- **Done when:** migration tested both ways, profiles switch without
  reload, PIN gate rendered and tested.
- **Status:** not started.

## Phase 7: Narration, loved-one recordings first

- **Goal, part A (loved-one narration):** a parent or grandparent records
  each page on the device; the child hears that voice on page open instead
  of the device speech. Nothing leaves the device, no account, no upload.
- **Scope A:** a record button per page in the player behind the grown-up
  gate; `MediaRecorder` (Opus in Chrome and Android, AAC in Safari), one
  clip per story page per voice stored in IndexedDB with a name for the
  voice ("Grandma"); playback through an `<audio>` element on page open,
  replacing `speechSynthesis` for that page; word highlighting off for
  recorded pages (a recording has no timings), the text shown plainly;
  Calm mode unaffected; delete and re-record; a size line in Settings.
  Roughly 30 s per page at 32 kbps is about 120 KB, under 1 MB a story.
- **Goal, part B (professional narration):** as before, a warm human
  narrator with word highlighting, device speech as the fallback, audio as
  a download pack. Kept as the later step; part A gives most of the
  emotional value at a fraction of the cost.
- **Dependencies and decisions:** part A needs only a voice name string
  to start (profiles from phase 6 can own it later); microphone permission
  wording; iOS `MediaRecorder` format check on a real phone. Part B
  unchanged: narrator contract or TTS licence, forced alignment, format.
- **Cost:** part A about 3 to 4 days of engineering, Gemini 0, no third
  party. Part B as before (4 to 5 days plus audio).
- **Done when (A):** record, play, delete on a page in Chrome and Safari;
  the recording survives a reload and plays offline; speech falls back
  when no recording exists; storage shown; tests cover the store and the
  player switch with a fake recorder.
- **Status:** part A approved 2026-09-19, roasted in phase 9, not started.

## Phase 8: Smaller additions

- Spanish localisation: moved into phase 9, after the pilot.
- Scripture text in-app from a public-domain translation for big readers.
  ~1 day × R. Not started.
- Printable sticker sheet from the sticker book: moved into phase 9's print pages.
- First-run parent tour and install prompt. ~1 day × R. Not started.
- More Old Testament stories (Moses, Joseph, Esther): same cost line as a
  phase-4 story each. Catalogue size is the first thing a buyer compares;
  phase 0 decides whether these come before or after the Jesus stories.

## Phase 9: Identity and keepsakes

Added 2026-09-19 from an outside review of the art and of ToonyStory
(`docs/decisions/2026-09-19-identity-review.md`). The review's finding:
the product's uniqueness is the whole interactive book, not any single
picture, and the pictures were drifting from the paper-cutout reference
toward generic 3D. The owner approved keeping richness and detail while
pinning the paper style, and the feature order below. The roast of these
plans is at the end of this phase.

### 9a. Style bible (built 2026-09-19)

- **Goal:** one look on every page, machine-enforced where it can be.
- **Built:** `design/style-bible.md` (paper edges, grain, contact shadows,
  one warm light, palette on the app's purple and gold, face and hand
  rules, prompt vocabulary); a stronger style line in `gen.py`; `gen.py`
  refuses a prompt that asks for realism, and
  `python design/pipeline/check_prompts.py` checks every manifest (all
  clean after a scrub of ten manifests). Existing pages stay until they
  are regenerated for another reason; a style pass over Christmas and the
  storm is the owner's call, about 40 Gemini calls.
- **Interaction with the richness standard:** richness now means more
  pieces and more printed detail; "as realistic as possible" is retired
  by the owner's approval. `CLAUDE.md` updated.

### 9b. Print pages

- **Goal:** a memory-verse card and a story certificate a family can print
  from the app, later a coloring page per scene.
- **Scope:** a print stylesheet and a Print action on the quiz-done card
  and the sticker book; verse card and certificate laid out from data
  (story, verse, NIV notice, child's name when set, date); no new art.
  Coloring pages wait for phase 2a (licensing) and cost one Gemini call
  per scene for a line-art version.
- **Cost:** about a day for cards and certificate; coloring pages about
  38 calls plus a day.
- **Done when:** both pages print at A4 and Letter from Chrome and Safari
  with the NIV notice, and the sticker sheet prints from the book.
- **Status:** approved, not started.

### 9c. Family package export

- **Goal:** move a child's progress and the family's recordings to a
  grandparent's device without an account.
- **Scope:** a single file (JSON plus audio, zipped) written through the
  share sheet or a download, and an import on the settings sheet; local
  only, no encryption claims beyond what the file system gives.
- **Dependencies:** phase 7 part A (the recordings are the point); iOS
  file handling checked on a real phone.
- **Cost:** about 2 days.
- **Status:** approved for after narration, not started.

### 9d. Spanish

- **Goal:** the whole experience in Spanish: prose at both levels,
  hotspots, quizzes, devotionals, verse text (a licensed Spanish
  translation to choose), device speech in Spanish.
- **Scope:** a locale key on story data and UI strings; translation by a
  person with theological review; per story, so it ships story by story.
- **Dependencies:** the pilot's answer on which stories families use;
  verse licensing for the Spanish text.
- **Cost:** about 3 days plus translation and review per story.
- **Status:** approved for after the pilot, not started.

### 9e. Gift editions

- **Goal:** packaging with a clear buying occasion: Christmas, Easter,
  baptism, birthday, bedtime.
- **Scope:** curated story sets on the library and a landing page; no new
  code beyond a collection label on story data and a filter.
- **Dependencies:** phase 3 (whether anything is sold) and the pilot.
- **Cost:** about a day plus copy.
- **Status:** approved for after the distribution decision, not started.

### Not adopted from the review

Fifteen selectable art styles (one look is the point); AI-written Bible
retellings without human review; uploading children's photos; putting the
child inside a Bible scene.

### Roast of the phase 9 plans (2026-09-19)

**Loved-one narration (7A)**

- Buyer (4): a grandparent will not find a record button hidden behind a
  grown-up gate on each page. Pivot: one "Record this story" flow from
  the story's library card that walks through the pages, with the page
  text on screen to read from; the per-page button stays as the
  re-record path.
- Architect (4): iOS Safari's `MediaRecorder` produces `audio/mp4`, Chrome
  produces `audio/webm;codecs=opus`, and a recording made on one device
  must play on the other for the export package to mean anything. Pivot:
  store the blob with its MIME type, play through `<audio>` which decodes
  both, and test both formats on real devices before 9c.
- Architect (3): a recording, device speech and the sound effects can
  overlap. The narration hook already cancels speech on unmount and page
  change; the audio engine must join that same lifecycle (one narration
  controller with two engines), or a voice keeps talking over the next
  page, the bug the codebase already names.
- Architect (3): IndexedDB, not `localStorage`, for blobs; private
  browsing and full quotas must fail softly as the store already does.
  Storage is reported in Settings so a full phone is explainable.
- Buyer (2): word highlighting off on recorded pages loses the read-along
  cue for early readers. Accepted for part A; part B's forced alignment
  is the fix, and a per-page sentence highlight driven by the clip's
  duration is a cheap middle step to try.
- CFO (1): no cost beyond engineering.
- Verdict: proceed-with-changes (story-level record flow, MIME kept, one
  narration controller).

**Print pages (9b)**

- Architect (3): printing from a PWA on iOS goes through the share sheet
  and loses `@page` sizes; the layout must survive both A4 and Letter
  with generous margins rather than pixel-fit. Pivot: one print stylesheet
  tested in Chrome and Safari at both sizes, no absolute positioning.
- Buyer (2): a certificate with no name on it is weak; ship it after the
  name field, or with a blank line to hand-write. Pivot: blank line until
  the name exists.
- Content (3): the verse card shows NIV text, so the Biblica notice must
  print with it; the same rule as on screen.
- Verdict: proceed-with-changes (after the name field or with a blank
  line; NIV notice on the card).

**Name personalisation (in 6)**

- Buyer (3): the name lands in prayers, so a typo or a nickname a child
  dislikes reads out loud every night. Pivot: editable from Settings, and
  the device voice's pronunciation of the name previewed there.
- Architect (2): one field in `store.ts` now becomes a profile field
  later; write the migration test when profiles land, not now.
- Verdict: proceed.

**Family package export (9c)**

- Architect (4): a file with audio in it can reach tens of megabytes; iOS
  share-sheet limits and the download path differ by browser. Pivot: cap
  the package at the recordings for one voice, stream the zip, and test
  on real phones before calling it done.
- Buyer (3): "encrypted" would be an overclaim; say "a file on your
  phone, share it as you would a photo". Pivot: no encryption claim.
- Verdict: proceed-with-changes, only after 7A ships and real-device
  checks exist.

**Spanish (9d)**

- CFO (4): the translation, not the code, is the cost: 38 pages at two
  levels, hotspots, quizzes, devotionals, plus a licensed Spanish verse
  text. Pivot: one story first, priced, before the rest.
- Content (4): human translation with theological review, never machine
  output shipped as-is.
- Verdict: rethink until the pilot names the audience; then one story.

**Gift editions (9e)**

- Buyer (3): a "collection" is only a buying occasion if something is
  sold; until phase 3 decides, it is a library filter. Pivot: wait for
  phase 3.
- Verdict: proceed later.

## Review findings (2026-09-18 roast of the first draft)

Kept here so the reasoning survives.

- No buyer, price or measurement was named; three build phases preceded
  any evidence that anyone pays. → Phase 0 added and made blocking.
- The paid model was contradicted by the no-network rule and parked. →
  Phase 3 added as a decision with costed options.
- "Precache the first story, runtime-cache the rest" was written as a
  config switch; it is an offline-guarantee change with quota and iOS
  eviction behaviour. → Phase 4 now starts with a download-a-story feature
  tested on real phones.
- Effort had no rates, no Gemini price, no third-party quotes, and no
  rework allowance. → Cost lines on every phase, ×2 rework factor from
  this week's Daniel page 2.
- The pilot could not measure anything under the no-analytics rule. →
  Measurement decision written into phase 5.
- Tablet crop was priced at half a day; the gate is a 27-page re-shoot
  and possibly five re-compositions. → Re-estimated.
- No CI and no component coverage; every later phase would re-verify by
  screenshot. → Phase 2c added before phase 4.
- Profiles and classroom use collide. → Shared-device note in phase 6.
- Spanish and narration were under-described. → Costs and the
  two-engine highlighting risk written in.

## Log

- 2026-09-18: roadmap written; phase 1 started.
- 2026-09-18: phase 1 built (type, content for five stories, Family time
  screen, route, tests); human review open.
- 2026-09-18: roadmap revised after the adversarial review; phases 0, 2c
  and 3 added, costs and measurement added, order changed.
- 2026-09-18: phase 2b built (letterbox on landscape frames, hotspot layer
  sized to the art).
- 2026-09-18: phase 2c local half built (component and hook tests, include
  set widened); CI blocked, owner has no GitHub Actions for now.
- 2026-09-18: phase 1 content review pass written (NIV notice finding);
  phase 0 interview kit written.
- 2026-09-18: phase 0 skipped by the owner (churches requested the product);
  NIV notice added to Settings and beside each verse.
- 2026-09-18: performance budgets: bundle gate in the hook, `npm run perf`
  interaction budgets, baseline recorded.
- 2026-09-18: church pilot prep: Group pilot log (opt-in), leader documents.
- 2026-09-18: phase 4 started; The First Christmas built (36 Gemini calls);
  Gemini credit exhausted after the first pass.
- 2026-09-18: story 2, Jesus Calms the Storm, built (23 Gemini calls);
  owner's richness standard recorded in `CLAUDE.md`.
- 2026-09-19: download-a-story built; precache line lowered to 6 MB, per-story
  line 3 MB; library cards are rendered stills.
- 2026-09-19: outside review of art and ToonyStory; owner approved keeping
  richness while pinning the paper style, and the order style bible,
  loved-one narration, print pages, name, stories 3 to 5, then export,
  Spanish, gift editions. Phase 9 added and roasted; style bible built.
