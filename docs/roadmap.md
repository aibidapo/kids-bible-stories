# Product roadmap

Tracking document for the improvement phases agreed on 2026-09-18. One
section per phase: goal, scope, out of scope, dependencies and decisions,
effort, done-when, status. Update the status lines and the log at the bottom
as work lands; each phase links its spec, plan and evidence record once they
exist. Effort figures are estimates from this codebase's history (a raster
story took ~15 Gemini calls and 2–3 hours plus review rounds).

Constraints every phase inherits (from `CLAUDE.md`): offline PWA, no network
calls, no accounts, no analytics, progress in localStorage only; stories are
data and the player is generic; every piece of prose at both reading levels;
art is layered raster within 450 KB per scene and ~12 MB total precache;
sound synthesised, narration by device speech, no font files; Calm mode
honest; the quiz cannot be failed.

## Order

1. Family Devotional mode
2. Blockers: art licensing stance, tablet-landscape crop
3. Life of Jesus collection
4. Church and homeschool pilot
5. Family profiles and parent PIN
6. Professional narration
7. Smaller additions (Spanish, scripture text, printable stickers, first-run tour, more Old Testament)

Rationale: the devotional is a day of work and improves every story already
shipped; the two blockers gate anything paid or classroom-facing; churches
will ask for Jesus stories, so those precede the pilot; profiles and
narration are the costliest for the least teaching value.

## Phase 1: Family Devotional mode

- **Goal:** each story ends with a short Family time for a parent and child:
  one talk-about question, a short prayer, the memory verse, one real-world
  activity.
- **Scope:** `devotional` data on every story at both reading levels; a
  Family time screen reached from the quiz's "Well done" page and from a
  route (`#/story/<id>/family`); content for the five existing stories;
  read-aloud through the existing narration hook; tests for data invariants
  and the rendered screen; docs.
- **Out of scope:** timers, streaks, reminders, any persistence of answers.
- **Dependencies and decisions:** none. Content written in-house; a
  theological read-through is a human review item.
- **Effort:** ~1 day.
- **Done when:** every story has devotional content at both levels
  (test-enforced), the screen renders on phone and tablet, Calm mode and
  narration behave, evidence record written.
- **Spec:** `docs/superpowers/specs/2026-09-18-family-devotional-design.md`
- **Plan:** `docs/superpowers/plans/2026-09-18-family-devotional.md`
- **Evidence:** `docs/evidence/2026-09-18-family-devotional/record.md`
- **Status:** built 2026-09-18; awaiting human review of content and screen.

## Phase 2: Blockers before paid or classroom use

### 2a. Art licensing stance

- **Goal:** a written position on shipping Gemini-generated art in a
  published, possibly paid, product, and on what rights (e.g. classroom
  display) can be granted downstream.
- **Scope:** read the current Gemini API terms for generated output;
  decide whether to keep, replace with commissioned art, or mix; record the
  decision and its date in `docs/decisions/`.
- **Dependencies:** owner decision; not a code task.
- **Effort:** an hour of reading plus the decision.
- **Done when:** the decision file exists and `CLAUDE.md` media rule cites it.
- **Status:** open. Blocks phases 3 (paid) and 4.

### 2b. Tablet-landscape crop

- **Goal:** no story-critical art cut off at 1024×768 and similar frames.
- **Scope:** decide letterbox vs a vertical safe zone; implement in
  `Stage` (`preserveAspectRatio` or a padded frame); re-shoot the 27 pages
  at tablet; adjust the few pages whose subjects sit above y=225 (den
  king, sun/moon pages, the trap king's head).
- **Effort:** half a day plus review.
- **Done when:** every page's tablet shot shows heads and key props.
- **Status:** open. Blocks phase 4 (classrooms run tablets landscape).

## Phase 3: Life of Jesus collection

- **Goal:** five New Testament stories: Christmas, a miracle, the Good
  Samaritan, Easter, Pentecost.
- **Scope:** character sheets for Jesus, Mary, disciples; ~28 scenes of
  layered raster art through the existing pipeline; prose at both levels;
  hotspots, find-games, quizzes, memory verses, devotionals; workbox
  switched to precache the first story and runtime-cache the rest (the
  media rule's ~12 MB line will be crossed).
- **Dependencies and decisions:** how Jesus is depicted (several traditions
  avoid a face; decide before generating sheets); phase 2a if sold; the
  distribution model for anything paid (a paid app SKU or store in-app
  purchase through a native wrapper; in-app entitlements are impossible
  under the no-network rule).
- **Effort:** 15–20 hours of generation and composition plus review rounds
  per story as with Daniel.
- **Done when:** five stories pass the same evidence gates as the current
  five; first-load on Fast 3G measured after the caching switch.
- **Status:** not started.

## Phase 4: Church and homeschool pilot, then edition

- **Goal:** learn what two or three churches or homeschool groups actually
  use before building an institutional product.
- **Scope, pilot:** free access, a one-page "how to use in a group" note,
  the tablet crop fixed, a feedback form outside the app.
- **Scope, edition (after the pilot):** printable colouring sheets and a
  printable sticker sheet (print stylesheet or PDF export), lesson plans
  and discussion guides per story, seasonal packs, licence terms for
  classroom display.
- **Dependencies:** 2a and 2b; phase 3 helps.
- **Effort:** pilot a day of prep; edition several days of content plus the
  print work.
- **Done when (pilot):** written findings from each pilot group.
- **Status:** not started.

## Phase 5: Family profiles and parent PIN

- **Goal:** several children on one device, each with their own stickers,
  quiz bests and reading level; grown-up settings behind a PIN.
- **Scope:** `store.ts` becomes profiles plus an active id with a v1 → v2
  save migration (tests first; the store is 95 % covered); a profile picker
  on the library; per-child mode; a four-digit PIN for the settings sheet,
  stored locally, described honestly as a speed bump (clearing site data
  removes it), no lockout, no recovery.
- **Dependencies:** none.
- **Effort:** ~2 days.
- **Done when:** migration tested both ways, profiles switch without
  reload, PIN gate rendered and tested.
- **Status:** not started.

## Phase 6: Professional narration

- **Goal:** a warm human narrator with word highlighting, device speech as
  the fallback.
- **Scope:** narrator recording or licensed TTS; forced alignment for word
  timestamps; audio as a downloadable pack cached at runtime (not
  precached); player changes in `useNarration`.
- **Dependencies and decisions:** this ends the "no other media" rule and
  roughly doubles the install if precached, so it ships as an optional
  pack; narrator contract or TTS licence; format choice (Opus plus AAC for
  Safari).
- **Effort:** several days of engineering plus recording.
- **Done when:** a story plays with the pack offline after download and
  falls back to device speech without it.
- **Status:** not started, lowest priority.

## Phase 7: Smaller additions

- Spanish localisation (stories are data; `speechSynthesis` takes a
  language). Not started.
- Scripture text in-app from a public-domain translation for big readers.
  Not started.
- Printable sticker sheet from the sticker book. Not started.
- First-run parent tour and install prompt. Not started.
- More Old Testament stories (Moses, Joseph, Esther). Not started.

## Log

- 2026-09-18: roadmap written; phase 1 started.
- 2026-09-18: phase 1 built (type, content for five stories, Family time screen, route, tests); human review open.
