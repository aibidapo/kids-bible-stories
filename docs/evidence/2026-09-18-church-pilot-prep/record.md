# Evidence record: church pilot prep (roadmap phase 5, pilot half)

## Scope

Owner: "proceed" on 2026-09-18 with the order 2a → 5 → 4 → 6 → 7; 2a parked.
Plan `docs/superpowers/plans/2026-09-18-church-pilot-prep.md` (roast
inline). Measurement option (a) from the roadmap: a local usage count the
leader exports by hand.

## What changed

- `src/lib/pilotLog.ts`: opt-in, off by default; counts per day by kind
  (`page`, `hotspot`, `quiz`, `family`) and key; own storage key
  `bible-adventures:pilot-log:v1`; every storage access in try/catch;
  `exportText()` is tab-separated text with a header; `clear()` empties
  and switches off.
- Call sites: `StoryPlayer` (effect on story id and page index),
  `Stage.tap`, `Quiz` on finishing, `FamilyTime` on mount.
- `Settings`: a Group pilot fieldset above the Scripture notice: the
  switch with plain wording of what is counted and that nothing leaves the
  device unless copied; Copy log (clipboard, textarea fallback, "Copied"
  flash) and Clear log appear only while on.
- `docs/pilot/README.md`, `how-to-use-in-a-group.md`, `feedback-form.md`.
- `CLAUDE.md`: the privacy convention names the log and its limits.

## TDD

`src/lib/pilotLog.test.ts` first (off by default, per-day counts,
persistence and export text, clear switches off, never throws without or
with a full storage): red, module missing (`tdd-red.txt`); green after the
module (`tdd-green-lib.txt`, 5 tests). Settings and StoryPlayer tests
added for the switch, copy, clear and the page count. The coverage ratchet
then blocked the first commit (lines 97.6 %, functions 95.8 % against 98 /
96): the clipboard fallback, the damaged-save guard and three timer
callbacks in the player and stage were untested. Tests added for each
(fallback copy, unreadable JSON, bubble timeout, auto-narration timer,
speaker button with a fake engine). Full suite 20 files, 142 tests
(`tdd-green-all.txt`): lines 100 %, branches 93.0 %, functions 98.6 %,
statements 99.0 %; thresholds raised to 99 / 93 / 98 / 98. Test-side
fixes: happy-dom's `navigator.clipboard` is getter-only (defined with
`defineProperty`); unmount before removing a fake speech engine, since the
hook removes its listener on teardown.

## Checks

- `tsc -b` clean; lint 0 errors, 47 warnings (6 new object-injection on
  typed keys in `pilotLog.ts`); motion 27 clean; coverage thresholds
  raised and hold through the hook.
- Browser, fresh context, phone viewport: Settings shows the Group pilot
  switch off; switching on reveals Copy log and Clear log
  (`settings-pilot-phone.png`).

## Privacy statement for the pilot

Counts only, per day, per tablet. No names, no times of day, no device
identifiers, no free text. Nothing is transmitted; the leader copies the
text out. Clear log removes everything and switches the count off. A
family device that inherits a tablet cannot be counted unless a grown-up
switches it on again.

## Gaps

- Licensing (2a) parked: the pilot note asks groups not to copy or print
  pictures; classroom display rights are not granted in writing.
- No group has started; the findings note does not exist yet.
- Real-device performance and the phone-safe crop are checked in emulation
  only; the pilot tablets are the first real devices.
