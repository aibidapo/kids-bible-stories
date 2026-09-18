# Component Coverage Implementation Plan (roadmap phase 2c, local half)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every component and the narration hook are covered by behaviour tests that run in the pre-commit hook, and the coverage thresholds include them. CI itself is blocked (GitHub Actions unavailable to the owner on 2026-09-18) and is recorded as such; the hook stays the enforcement.

**Architecture:** Interaction tests need a DOM, so component test files opt into `happy-dom` with a per-file `@vitest-environment` pragma; everything else stays in node. React Testing Library drives clicks and reads the DOM. The module-level store is reset in `beforeEach` through its own setters. Web Audio and speech are absent in happy-dom, so sound is a no-op and narration reports unsupported unless a test installs a fake `speechSynthesis`.

**Tech Stack:** Vitest 5, happy-dom, @testing-library/react 16, react-dom/server for pure renders.

**Spec:** roadmap phase 2c in `docs/roadmap.md`.

## Global Constraints

- No jsdom-wide default: node stays the default environment; only component files opt in.
- Thresholds raise in the same commit as the include set widens; never lower.
- No test may depend on `Math.random` outcomes: the quiz's correct choice is found by text.

## Roast (before code)

- **Architect (3):** the store is module state; RTL tests in one file share it. Every file resets it in `beforeEach` (`resetProgress`, `setMode`, `setNarrate`, `setMutedPref`, `setCalm`) or results depend on test order.
- **Architect (3):** `StoryPlayer` auto-narrates on a timer and registers keydown listeners; tests must `cleanup()` after each and keep narration off (`setNarrate(false)`) or timers leak between tests.
- **Architect (2):** happy-dom lacks `AudioContext`, `speechSynthesis` and `matchMedia`; `sound.ts` returns null and `useNarration` reports unsupported, which is the path to assert, not a failure.
- **CFO (1):** two dev dependencies, audit clean.
- **Buyer (1):** invisible to users; the value is that later phases stop re-verifying UI by screenshot.
- **Verdict:** proceed-with-changes: store reset and cleanup in every DOM test file.

### Task 1: Tests

- [ ] `NarrationText.test.tsx` (node): highlight follows `charIndex`, none at −1, mode class.
- [ ] `useNarration.test.tsx` (happy-dom): unsupported without `speechSynthesis`; with a fake, `speak` sets speaking and `charIndex` from boundary events, `stop` cancels, unmount cancels, `splitWords` offsets.
- [ ] `Quiz.test.tsx` (happy-dom): little mode asks only little questions; a wrong tap greys the choice and shows the nudge; the right tap advances; the done page shows stars, score, lesson, Family time and Back; `recordQuiz` stored; big mode shows the verse.
- [ ] `Stage.test.tsx` add (happy-dom): tapping a hotspot records it, shows the bubble, hands the sticker up once.
- [ ] `Library.test.tsx` (happy-dom): five cards, sticker count, done badge and best stars, callbacks.
- [ ] `StickerBook.test.tsx` (happy-dom): count, found vs outline, back.
- [ ] `Settings.test.tsx` (happy-dom): level buttons, three toggles, Escape closes, Clear progress asks first.
- [ ] `StoryPlayer.test.tsx` (happy-dom): text at the current level, quest prompt until found, Next/Back/Finish, arrow keys, dots.

### Task 2: Thresholds and docs

- [ ] `vitest.config.ts`: include `src/components/**`, `src/hooks/**`; thresholds at the new measured floor.
- [ ] Roadmap 2c: local half done, CI blocked with the reason and date; CLAUDE.md test notes; evidence record; handoff; commit; push.
