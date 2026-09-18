# Family Devotional Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Family time screen after each story's quiz with a question, a prayer, the memory verse and an activity, at both reading levels, for all five stories.

**Architecture:** Devotional content is story data (`Story.devotional`), the screen is a generic component fed by it, the read-aloud script is a pure function, routing is one more hash route. Nothing persists.

**Tech Stack:** React 18, TypeScript, Vitest 5 (node, `react-dom/server`), existing `useNarration` hook, `app.css` tokens.

**Spec:** `docs/superpowers/specs/2026-09-18-family-devotional-design.md`

## Global Constraints

- Both reading levels for every piece of prose (`CLAUDE.md`).
- Tap targets ≥ 64 px (`--tap`).
- No network, no persistence of answers, no timers.
- Hash routing; the phone back button must walk back.
- Pre-commit hook must pass: secrets, prettier on staged files, lint, `check:motion`, `coverage` thresholds, build.
- Coverage thresholds raise, never lower, when tests are added (`vitest.config.ts`).

## Roast (adversarial, before code)

- **Buyer skeptic (3):** a bedtime parent will not read four sections. Keep each to one to three sentences; the little prayer under 25 words. Put Done and Read to me in view without scrolling on a phone.
- **Buyer skeptic (2):** "Family time" as a button label on the child's quiz page may confuse a child playing alone. Accept; the secondary button still goes home and the screen is harmless alone.
- **CFO (1):** zero running cost; a few KB of text. No concern.
- **Architect (3):** making `devotional` required breaks any story without it at compile time, which is the point, but `CLAUDE.md` "Adding a story" must list it or the next author trips. Update the doc in the same increment.
- **Architect (2):** speaking the whole card in one utterance means one long `SpeechSynthesisUtterance`; Chrome on Android has a known cut-off around 15 s for long utterances on some voices. Keep the script short (the content limits above) and accept; device narration is the fallback tier anyway.
- **Architect (2):** `Route` union grows; `href` uses a `switch` with a `default`, so a missing case would silently route home. Add the `family` case explicitly and a test for `parse`/`href` if they are exported; they are not today, so cover via the browser check and keep them private.
- **Verdict:** proceed-with-changes: length limits in the content, CLAUDE.md updated, keep the script short.

---

### Task 1: Type, story-data invariants, content

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/stories/{creation,noah,david,jonah,daniel}.ts`
- Test: `src/data/stories.test.ts`

- [ ] **Step 1: Write the failing test** (in the per-story `describe`):

```ts
it("has a devotional at both levels and a memory verse", () => {
  const d = story.devotional;
  expect(d, "devotional").toBeDefined();
  for (const level of ["little", "big"] as const) {
    expect(d.question[level].trim().endsWith("?"), `${level} question`).toBe(true);
    expect(d.prayer[level].trim(), `${level} prayer`).not.toBe("");
  }
  expect(d.activity.trim()).not.toBe("");
  expect(story.memoryVerse?.text.trim()).not.toBe("");
});
```

- [ ] **Step 2: Run it**: `npx vitest run src/data/stories.test.ts` → fails: `devotional` undefined (and a type error).
- [ ] **Step 3: Add `Devotional` to `types.ts`, `devotional: Devotional` on `Story`, content for five stories.**
- [ ] **Step 4: Run it** → 5 new tests pass.
- [ ] **Step 5: Commit** after Task 3 (one increment).

### Task 2: Read-aloud script (pure)

**Files:**
- Create: `src/lib/devotional.ts`
- Test: `src/lib/devotional.test.ts`

**Interfaces:** `readAloudScript(story: Story, mode: AgeMode): string`.

- [ ] **Step 1: Failing test**: order of headings, level text, verse text and reference present, no "undefined".
- [ ] **Step 2: Run** → module missing.
- [ ] **Step 3: Implement** with a fixed heading list.
- [ ] **Step 4: Run** → green.

### Task 3: Screen, route, quiz button, styles, docs

**Files:**
- Create: `src/components/FamilyTime.tsx`
- Test: `src/components/FamilyTime.test.tsx`
- Modify: `src/components/Quiz.tsx`, `src/App.tsx`, `src/styles/app.css`, `CLAUDE.md`

- [ ] **Step 1: Failing render test** with `renderToStaticMarkup`: headings, little vs big text, verse, Done button.
- [ ] **Step 2: Implement** component and styles; wire route and quiz button.
- [ ] **Step 3: Run** all tests, lint, typecheck, `check:motion`, build.
- [ ] **Step 4: Browser**: `npm run preview`, fresh isolated context, `#/story/daniel/quiz` done page and `#/story/daniel/family` at 390×844 and 1024×768; tap Read to me; back button.
- [ ] **Step 5: Evidence** `docs/evidence/2026-09-18-family-devotional/record.md`; roadmap status; handoff.
- [ ] **Step 6: Roast the diff**, then commit through the hook, push.
