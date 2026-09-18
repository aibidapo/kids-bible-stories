# Evidence record: component and hook tests (roadmap phase 2c, local half)

## Scope

Plan `docs/superpowers/plans/2026-09-18-component-coverage.md` (roast
inline). CI is blocked: the owner has no GitHub Actions available
(2026-09-18). The local half is done: behaviour tests for every component
and the narration hook, and the coverage include set widened to them.

## What changed

- Dev dependencies: `happy-dom` 20.14.5, `@testing-library/react` 16.3.3
  (`npm audit --audit-level=high`: 0 vulnerabilities after install).
- New tests (per-file `// @vitest-environment happy-dom` where clicks are
  needed; node otherwise): `NarrationText.test.tsx`,
  `useNarration.test.tsx`, `Quiz.test.tsx`, `Stage.dom.test.tsx`,
  `Library.test.tsx`, `StickerBook.test.tsx`, `Settings.test.tsx`,
  `StoryPlayer.test.tsx`, `FamilyTime.dom.test.tsx`. Each DOM file resets
  the module-level store in `beforeEach` and calls `cleanup` after each.
- The quiz test finds the right answer by text from story data, so it does
  not depend on the shuffle.
- `vitest.config.ts`: include set now `src/lib/**`, `src/components/**`,
  `src/hooks/**`, `src/art/raster.tsx`, `src/art/v2/tone.ts`,
  `scripts/lib/**`; thresholds lines 98 / branches 91 / functions 96 /
  statements 97 (measured 98.9 / 91.3 / 96.0 / 97.7 over 431 statements).
  Branch and function floors are lower than the previous pure-seam floors
  because the set grew; that is the only case in which a number may drop.
- `CLAUDE.md` documents the DOM test setup and its gaps.

## Runs

- Before the tests, with components and hooks included: lines 56.0 %,
  components 10.2 %.
- After: 19 files, 129 tests; lines 98.9 %, branches 91.3 %, functions
  96.0 %, statements 97.7 %. Remaining uncovered: `StoryPlayer` auto-narration
  timer path (narration is off in tests), `useNarration` voice-refresh
  listener body, `Stage` bubble-timer cleanup, a `Library` null-art guard.
- Fixes on the way: `window.confirm` does not exist in happy-dom (assigned a
  mock instead of spying); the stage bubble is also `role="status"` (banner
  queried by class); the den page has no find-game (player tests use the
  prays page); fake utterance callbacks needed an event argument for
  `tsc -b`.
- Lint: 0 errors, 40 warnings (6 new `detect-object-injection` in tests).

## Gaps

- **No CI.** The pre-commit hook is the only enforcement and is per-clone.
  When GitHub Actions becomes available, the workflow runs the hook's
  commands plus `npm run audit`.
- Browser smoke remains manual (`scripts/shoot.mjs` plus DevTools checks
  recorded per feature).
- happy-dom is not a browser: layout, CSS, container queries and real
  speech are not exercised here.
