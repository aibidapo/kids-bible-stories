# Evidence record: local pre-commit gates and first unit tests

## Scope

Task: close the standing standards gap recorded in earlier handoffs. Install
lint (with security rules), format, unit tests, a staged-secret scan and an
on-demand dependency audit; wire them into `.githooks/pre-commit`; prove every
gate rejects and passes; extract the quiz shuffle as a pure function under TDD;
add first tests on the existing pure seams. Plan:
`docs/superpowers/plans/2026-09-18-local-gates.md`.

## Artifact identity

- Branch `main`. Commits: `56bd1a5` gates, tests, quiz extraction, docs;
  `c67fc5b` Prettier over `src/` and `scripts/` (mechanical, 28 files); then
  the record commit (this file, the positive hook proof, and `vite.config.ts`
  formatted, which the mechanical commit missed because only `src` and
  `scripts` were staged).
- Tooling versions (from `package-lock.json` at `56bd1a5`): eslint 9.39.5,
  typescript-eslint 8.70.0, eslint-plugin-security 3.0.1,
  eslint-plugin-react-hooks 5.2.0, prettier 3.9.8, vitest 5.0.1,
  @vitest/coverage-v8 5.0.1, vite 8.3.0, typescript as before.
- Vitest was installed at 3.2.7 first; `npm audit` reported two moderate
  findings in `@vitest/mocker` (GHSA-82fw-gwwq-j7x9) with the fix in vitest 5.
  Upgraded to 5.0.1 before the commit; the suite ran unchanged.

## Environment

Windows 11 Pro 10.0.26200, Git Bash, Node v24.13.0, npm 11.6.2. Hooks path
`.githooks` (checked with `git config core.hooksPath`). No CI exists for this
repository; every result below is local.

## Chronology of the TDD cycle (quiz shuffle)

1. `src/lib/quiz.test.ts` written against a `shuffleChoices(q, rng)` that did
   not exist. First run failed with `Failed to load url ./quiz` (module
   missing). **Gap:** that output was captured to `tdd-red-quiz.txt` and then
   overwritten by step 2; only the summary line survives in the session log.
2. A stub returning the question unshuffled was added so the assertions
   themselves would run. Result: 3 passed, 1 failed with
   `expected +0 not to be +0` on "actually moves the answer for some rng
   values". Captured in `tdd-red-quiz.txt`.
3. Fisher–Yates over an index permutation with `answerIndex` remapped. Result:
   4 passed. Captured in `tdd-green-quiz.txt`.
4. `Quiz.tsx` now calls `shuffleChoices(q)`; the inline loop is gone.

The other new tests (tone maths, raster geometry, inline-png, story-data
invariants) cover code that already existed, so they were green on first run.
They are characterisation tests, not TDD, and are recorded as such.

## Procedures and results

| Check | Procedure | Result | Evidence |
|---|---|---|---|
| Unit tests | `npx vitest run` | 5 files, 52 tests passed, ~0.8 s | `tdd-green-quiz.txt`, `gate-proof-positive.txt` |
| Tests can fail | three mutations, each restored: Layer `y={-h}`→`y={h}`; a David hotspot `x: 150`; `answerIndex` not remapped | 1, 1 and 2 tests failed respectively; `git status` clean after restore | `test-mutation-sanity.txt` |
| Lint | `npx eslint .` | 0 errors, 24 warnings, all `security/detect-object-injection` (policy below) | `gate-proof-positive.txt` |
| Lint rejects | temp file with a ternary used as a statement | 1 error, exit 1 | `gate-proofs-negative.txt` C |
| Format rejects | temp unformatted file staged, hook's staged check | exit 123 | `gate-proofs-negative.txt` B |
| Secret scan rejects | staged file containing an AWS-shaped key (`AKIA` + 16 chars, not a real credential) | 1 finding, exit 1 | `gate-proofs-negative.txt` A |
| Secret scan passes | real staged set | clean, exit 0 | `gate-proofs-negative.txt` A2 |
| Hook blocks on failing test | prettier-clean failing test staged, `git commit` | blocked at `pre-commit: tests`, HEAD unchanged | `gate-proofs-negative.txt` D (redo) |
| Hook blocks on format | first attempt at D used an unformatted fixture | blocked at `pre-commit: format`, before tests | `gate-proofs-negative.txt` D |
| Hook blocks the real commit, twice | (1) `eslint.config.js` line over print width after a sed edit; (2) `Object.hasOwn` rejected by `tsc -b` (lib below ES2022; vitest does not typecheck) | both blocked; fixed and retried | `gate-proof-positive.txt` |
| Hook passes | `git commit` of the real increment | secrets, format, lint, motion (27 scenes clean), tests (52), typecheck + build (PWA precache 125 entries); 11.8 s wall | `gate-proof-positive.txt` |
| Mechanical format commit | `npm run format`, `git add -u src scripts`, commit through the hook | 28 files, 1132+/482−, hook green | `c67fc5b` |
| Dependency audit | `npm audit --audit-level=high` after the vitest upgrade | `found 0 vulnerabilities`, exit 0 | `audit.txt` |
| Coverage baseline | `npx vitest run --coverage` (v8, include set in `vitest.config.ts`) | lines 21.46 % (38/177), branches 25.27 %, over `src/lib/**`, `src/art/raster.tsx`, `src/art/v2/tone.ts`, `scripts/lib/**`; `raster.tsx` and `inline-png.ts` at 100 % lines; `sound.ts` and `store.ts` at 0 %. `quiz.ts` and `tone.ts` are absent from the text table because vitest 5's text reporter omits files at 100 % on every metric; the `json-summary` reporter shows both at 100 % lines, branches and functions | `coverage-baseline.txt` |

## Lint policy decided here

`security/detect-object-injection` is syntactic: it flags every `obj[key]`,
including numeric array indexing. It stays at `warn`; the hook blocks on
errors only. Each of the 24 sites was read:

- `scripts/*`, `NarrationText.tsx`, `Quiz.tsx`, `StoryPlayer.tsx`, `sound.ts`,
  `quiz.ts`, `creation.tsx`, `noah.tsx`: numeric indices or keys typed as
  `keyof` a static object. No external input.
- `src/scenes/index.ts` `getSceneArt(key)`: key comes from static story data,
  but the lookup now uses an own-property check so `"constructor"` cannot
  return `Object`. `Object.hasOwn` was rejected by the typecheck gate (lib
  target); `Object.prototype.hasOwnProperty.call` is used.
- `src/lib/store.ts`: keyed by story id. Ids reach the store only after
  `getStory` has matched them against the static list, and computed keys in
  object literals do not invoke the `__proto__` setter. Left as is.

`security/detect-unsafe-regex` flagged the hunk-header regex in
`check-secrets.mjs`; rewritten to `^@@ -[\d,]+ \+(\d+)` (star height 1), no
pragma needed.

## Gaps and what this record does not claim

- **Coverage** is far below the 95 % line / 90 % branch floors. Baseline
  recorded above; no threshold is enforced yet. Ratchet plan: add
  `coverage.thresholds` at the current numbers in the next increment and raise
  them with each test-adding commit; `store.ts` and `sound.ts` are the largest
  uncovered seams. Owner: next session. First review of the ratchet: 2026-10-02.
- **No mutation testing tool** is installed; the three hand mutations above are
  a sanity check, not a mutation score.
- **No CI.** The hook is the only enforcement and is per-clone; a clone without
  `core.hooksPath` set has no gate. `CLAUDE.md` says to check it at session
  start.
- **Format gate checks working copies**, not the index. A partially staged file
  is judged on its unstaged content. Acceptable while commits are whole-file;
  noted.
- **Secret scan is regex-only** (eight shapes). It does not detect
  high-entropy strings in general.
- **Warnings never block.** A new, real object-injection finding would land as
  a warning; review of lint output is still a human step.
- **Unit tests run in node** with `react-dom/server`. They prove geometry and
  data invariants, not motion, layering, Calm mode or offline behaviour; those
  remain browser checks (`npm run render`, `scripts/shoot.mjs`, DevTools
  probes) as in the story records.
- **Original red artifact** for step 1 was overwritten (see chronology).
- **No human review** of this increment beyond the author's inline roast; no
  live target applies (offline PWA, no backend).

## Follow-up: coverage ratchet and `store.ts` tests

- `src/lib/store.test.ts`: 12 characterisation tests over a fake
  `localStorage` (blank start, merge of an old save, corrupt JSON, OS
  reduced-motion, setter persistence, write failure tolerated, `recordFound`
  sticker rules, `foundIn`, `markCompleted` idempotent, `recordQuiz` best-only,
  `resetProgress` keeps grown-up settings). Module state is isolated with
  `vi.resetModules()` and a dynamic import per test; `useProgress` is read by
  rendering a probe through `react-dom/server`.
- Mutation `>=` → `>` in `recordQuiz` **survived** the first version of the
  test (an equal score rewrote the same value). The test now counts storage
  writes and the mutation is caught. Both runs are in
  `test-mutation-sanity.txt`.
- Coverage after: lines 45.14 %, branches 56.04 %, functions 67.34 %,
  statements 44.55 % (`coverage-after-store.txt`); `store.ts` 95 % lines, the
  gap is the unsubscribe closure only React exercises. `sound.ts` remains 0 %
  (Web Audio, needs a fake `AudioContext`; next candidate).
- `vitest.config.ts` now carries `coverage.thresholds` at lines 45, branches
  56, functions 67, statements 44. The hook's test step runs `npm run coverage`
  so the thresholds block. Proven: a temporary lines threshold of 90 fails
  with `ERROR: Coverage for lines (45.14%) does not meet global threshold
  (90%)`, exit 1; the baseline passes (`gate-proofs-negative.txt` E, E2).
- Rule recorded in `CLAUDE.md`: a commit that adds tests raises the thresholds
  to the new floor in the same commit; thresholds are never lowered.

## Follow-up 2: `sound.ts` tests, thresholds raised, dead exports pruned

- `src/lib/sound.test.ts`: 20 tests over a recording fake of the Web Audio
  graph (nodes, edges, parameter automation, start/stop). The fake throws on
  an exponential ramp to a non-positive value, as a browser does. Checks: no
  window / no `AudioContext` / `webkitAudioContext` fallback, one context
  reused, suspended context resumed, mute silences all three entry points,
  every `SoundName` builds sources that start, stop later and reach the
  destination with a two-ramp envelope and positive frequencies, sparkle's
  five staggered notes, noise vs tone composition, the rising correct
  flourish, the gentle two-note dip under 0.25 peak.
- Mutations (`test-mutation-sanity.txt`): decay ramp to 0 → 18 failures;
  mute guard removed from `play` → 1 failure.
- Coverage over the include set (`coverage-after-sound.txt`): lines 98.85 %,
  branches 95.6 %, functions 93.87 %, statements 97.02 %. Uncovered:
  `store.ts` unsubscribe closure (React-only), `sound.ts` two early returns
  in `playCorrect`/`playTryAgain` for a missing context (same guard as `play`,
  tested there), `inline-png.ts` unreachable `?? ''`, `raster.tsx` one
  default-parameter branch.
- Thresholds raised to lines 98 / branches 95 / functions 93 / statements 97.
  The include set is the pure seams only; components and scenes are outside
  it, so these numbers are not repository-wide coverage.
- `src/art/base.tsx`: `Hills`, `GrassTufts`, `Rainbow`, `LightRays` had no
  callers (grep over `src` and `scripts`); removed, 450 → 345 lines. Motion
  check 27 clean, build green.
- `scripts/shoot.mjs`: the numbered routes were resolved against story data
  (noah/4 rainbow, creation/5 people with three hotspots, jonah/1 storm) and
  annotated; all valid.
