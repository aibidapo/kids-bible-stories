# Church Pilot Prep Implementation Plan (roadmap phase 5, pilot half)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Two or three local churches can run a four-week pilot with the current five stories and send back something measurable, without the app gaining a network call, an account or any tracking a family did not switch on.

**Architecture:** A small pure module `src/lib/pilotLog.ts` keeps per-event counts in its own localStorage key, only while a leader has switched "Group pilot" on in Settings. Four call sites record events (page viewed, hotspot found, quiz finished, Family time opened). Settings gets a Group pilot section: the switch, a Copy log button (plain text the leader pastes into an email), and Clear. Leader-facing documents live in `docs/pilot/`.

**Tech Stack:** React, TypeScript, localStorage, `navigator.clipboard` with a textarea fallback, Vitest (happy-dom for Settings).

**Spec:** roadmap phase 5, measurement option (a); owner said "proceed" on 2026-09-18 with the order 2a → 5 → 4 → 6 → 7; 2a (licensing) parked, so the pilot is free access with a no-redistribution note.

## Global Constraints

- Off by default. Nothing is recorded until a grown-up switches it on; the switch text says what is counted and that nothing leaves the device unless they copy it.
- Counts only: no timestamps finer than the day, no identities, no free text, no device ids.
- No network. Export is copy-to-clipboard.
- Hook gates, coverage thresholds (log module and Settings are in the include set).

## Roast (before code)

- **Buyer (3):** a leader will not find a switch buried in Settings. The pilot README tells them exactly where it is and to switch it on before the first session; the section is at the top of Settings under the reading level, not under Clear progress.
- **Architect (3):** the log must never throw into the app. Every read and write is try/catch like the store; a full quota drops the write silently.
- **Architect (2):** recording "page viewed" on every render would inflate counts. Record in an effect keyed on story id and page index, once per page arrival.
- **Architect (2):** a family device could inherit the switch if a leader's export is followed by handing the tablet over; Clear log also switches it off, and the README says to switch off after the pilot.
- **CFO (1):** zero cost.
- **Verdict:** proceed-with-changes: switch near the top of Settings, effect-keyed page counts, Clear turns it off.

### Task 1: `pilotLog` module (TDD)

- [ ] Test: disabled by default, `record` is a no-op; `enable(true)` then `record("page", "daniel/2")` counts; per-day buckets; `exportText()` lists counts in a stable order with a header; `clear()` empties and disables; survives a throwing storage.
- [ ] Implement.

### Task 2: call sites and Settings

- [ ] `StoryPlayer`: effect on `[story.id, index]` → `record("page", "<story>/<index>")`.
- [ ] `Stage.tap`: `record("hotspot", "<story>/<scene>/<hotspot>")`.
- [ ] `Quiz` finish: `record("quiz", "<story>")`.
- [ ] `FamilyTime` mount: `record("family", "<story>")`.
- [ ] `Settings`: Group pilot section (switch, Copy log, Clear log), copy via clipboard with textarea fallback, "Copied" flash.
- [ ] Tests: Settings switch and copy (clipboard mocked); one event test per call site added to the existing component tests.

### Task 3: pilot documents and record

- [ ] `docs/pilot/README.md` (what the pilot is, four weeks, two or three groups, install on a tablet, switch the log on, what to send back and when, no redistribution while licensing is open).
- [ ] `docs/pilot/how-to-use-in-a-group.md` (one page for the leader in the room).
- [ ] `docs/pilot/feedback-form.md` (the questions, filled in outside the app).
- [ ] Evidence record, roadmap phase 5 status, `CLAUDE.md` privacy convention updated, handoff, commit, push.
