# Evidence record: NIV translation notice

## Scope

Owner decision 2026-09-18 on the finding in
`docs/evidence/2026-09-18-family-devotional/content-review.md`: keep the
NIV wording, add the notice to Settings and name the translation beside
each quoted verse.

## What changed

- `src/data/scripture.ts`: `SCRIPTURE_ABBREVIATION` ("NIV") and
  `SCRIPTURE_NOTICE` (Biblica's standard notice text).
- `Quiz.tsx` done page and `FamilyTime.tsx` Remember card: the cite now
  reads "`<reference> · NIV`".
- `Settings.tsx`: a "Scripture" section with the notice, above Clear
  progress; `.sheet__notice` styles.
- `CLAUDE.md` convention: verse text is NIV; name the translation beside
  any quoted verse and keep the notice in Settings; references alone need
  neither (the big-mode `verse` lines are references only).

## TDD

Tests first: quiz done-page cite contains the reference and "NIV"; Family
time cite matches `<reference>[^<]*NIV`; Settings shows "New International
Version" and "Biblica". Red: 3 failures (`tdd-red.txt`). Green after the
change: 19 files, 130 tests (`tdd-green.txt`).

## Browser (fresh isolated context, build `index-7sQxFND0.js`, 390×844)

- `family-niv-phone.png`: Remember card cite "Daniel 6:22 · NIV".
- `settings-notice-phone.png`: Scripture section with the notice.

## Gaps

- Biblica's permission terms should be re-read by the owner before any
  paid or institutional release (quotation limits, notice placement);
  this change follows the commonly published notice wording but is not
  legal advice.
- The notice is English only; localisation (roadmap phase 8) must carry
  it.
