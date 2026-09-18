# Product roadmap

Tracking document for the improvement phases. One section per phase: goal,
scope, out of scope, dependencies and decisions, cost, done-when, status.
Update the status lines and the log at the bottom as work lands; each phase
links its spec, plan and evidence record once they exist.

Revised 2026-09-18 after an adversarial review (see "Review findings" at the
end): discovery and distribution are now phases of their own, every phase
carries a cost line, and nothing paid is scheduled before a buyer has been
found.

Constraints every phase inherits (from `CLAUDE.md`): offline PWA, no network
calls, no accounts, no analytics, progress in localStorage only; stories are
data and the player is generic; every piece of prose at both reading levels;
art is layered raster within 450 KB per scene and ~12 MB total precache;
sound synthesised, narration by device speech, no font files; Calm mode
honest; the quiz cannot be failed.

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
6. Family profiles and parent PIN
7. Professional narration
8. Smaller additions

Rationale: no build phase after 1 starts until phase 0 has named a buyer
and a price; the blockers gate anything paid or classroom-facing; the
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
- **Status:** not started. **Blocks every phase from 3 onward.**

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
- **Status:** built 2026-09-18; human review of content and screen open.

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
- **Status:** open. **Every later phase depends on it**; do before phase 4.

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
- **Status:** not started.

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
- **Status:** not started.

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
- **Dependencies:** phase 0 (asked for?), phase 2c.
- **Cost:** ~2 days × R. Gemini 0.
- **Done when:** migration tested both ways, profiles switch without
  reload, PIN gate rendered and tested.
- **Status:** not started.

## Phase 7: Professional narration

- **Goal:** a warm human narrator with word highlighting, device speech as
  the fallback.
- **Scope:** narrator recording or licensed TTS; forced alignment for word
  timestamps; audio as a downloadable pack (reuses phase 4's
  download-a-story) cached at runtime, never precached; `useNarration`
  gains a second engine driven by timestamps, and `NarrationText`
  highlighting must behave identically under both engines (one shared
  highlight model, two drivers).
- **Dependencies and decisions:** phase 0 (asked for, and would they
  download a pack?); phase 4's download feature; a narrator contract or a
  TTS licence; format choice (Opus plus AAC for Safari).
- **Cost:** engineering ~4–5 days × R. Audio: ~25 minutes of finished
  narration for the current ten reading-level variants; get a narrator
  quote per finished minute and a TTS quote per character before
  scheduling. Storage roughly 10 MB per pack.
- **Done when:** a story plays with the pack offline after download and
  falls back to device speech without it; highlighting identical under
  both engines in a test.
- **Status:** not started, lowest priority.

## Phase 8: Smaller additions

- Spanish localisation. Cheaper than most, not free: hotspot labels, quiz
  choices, devotionals and UI strings all need a locale key the story
  files do not have today, and `speechSynthesis` Spanish voices vary by
  device. ~3 days × R plus translation. Not started.
- Scripture text in-app from a public-domain translation for big readers.
  ~1 day × R. Not started.
- Printable sticker sheet from the sticker book. ~1 day × R. Not started.
- First-run parent tour and install prompt. ~1 day × R. Not started.
- More Old Testament stories (Moses, Joseph, Esther): same cost line as a
  phase-4 story each. Catalogue size is the first thing a buyer compares;
  phase 0 decides whether these come before or after the Jesus stories.

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
