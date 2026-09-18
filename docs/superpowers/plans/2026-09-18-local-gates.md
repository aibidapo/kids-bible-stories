# Local Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the standing standards gap: a pre-commit gate with lint (security rules), format check, unit tests, and a staged-secret scan, each proven to fail; a dependency audit script; first unit tests on the pure seams, written before the code they cover where the code is new.

**Architecture:** Flat ESLint config with `typescript-eslint`, `eslint-plugin-security` and `eslint-plugin-react-hooks`; Prettier for format; Vitest for tests (node environment, plus jsdom only where React rendering is needed via `react-dom/server`); `scripts/check-secrets.mjs` scans the staged diff for credential patterns with an inline `secret-ok` allowlist pragma; `npm audit --audit-level=high` as an on-demand script. The hook runs, in order: motion lint, eslint, prettier check, vitest, secret scan, build.

## Tasks

1. **Tooling**: install pinned devDependencies; `eslint.config.js`, `.prettierrc`, `.prettierignore`, `vitest.config.ts`; scripts `lint`, `format`, `format:check`, `test`, `secrets`, `audit`. One Prettier pass over `src/` and `scripts/` in its own commit ("mechanical").
2. **Quiz shuffle as a pure function (TDD)**: failing test for `shuffleChoices(q, rng)` in `src/lib/quiz.ts` (answer index follows the correct choice; all choices kept; deterministic under a seeded rng), then extract from `Quiz.tsx`.
3. **Tests on existing seams**: `tone.ts` (mix endpoints, clamping, 3-digit hex), `raster.tsx` geometry (Layer anchors bottom-centre, flip mirrors x, Eyelids convert cutout pixels to local space, nesting keeps transform and class on different elements), `inline-png.ts` (WebP data URI becomes PNG data URI, PNG left alone), story data invariants (every `art` key registered, hotspot x/y in 0–100, `answerIndex` within `choices`, both reading levels present, cover key registered).
4. **Secret scan**: `scripts/check-secrets.mjs` over `git diff --cached`; patterns for AWS keys, Google API keys, GitHub tokens, private key blocks, `sk-` style tokens, generic `password=`; `secret-ok` on the same line allowlists; exit 1 with file:line.
5. **Hook + proofs**: extend `.githooks/pre-commit`; prove each gate rejects (a lint error, an unformatted file, a failing test, a staged fake key) and that a clean commit passes; save outputs to the evidence folder.
6. **Docs + evidence**: `CLAUDE.md` commands and gate description; `docs/evidence/2026-09-18-local-gates/record.md`; handoff.

## Roast (inline)

- Prettier over 27 scene files is a big mechanical diff. Keep it in one commit with nothing else so review can skip it.
- ESLint on generated-looking scene code will flag unused imports and `any`-free but noisy rules; fix real findings, keep the config honest, do not disable security rules to get green.
- The secret scan is regex, not entropy; it catches the common shapes. Say so in the record.
- Vitest with jsdom would slow the hook; `react-dom/server` needs no DOM, so node environment only.
- Verdict: proceed.
