# Evidence record: Family Devotional mode (roadmap phase 1)

## Scope

Spec `docs/superpowers/specs/2026-09-18-family-devotional-design.md`, plan
`docs/superpowers/plans/2026-09-18-family-devotional.md` (roast inline).
After a story's quiz, a Family time card: one question, a short prayer, the
memory verse, one activity, at both reading levels, for all five stories.
Nothing persisted.

## Artifact identity

Branch `main`; commit hash in the log below. Tested build
`dist/assets/index-B253isCS.js` served by `vite preview` on :4173, Chrome
DevTools in a fresh isolated context `family-check`.

## TDD chronology

1. `src/data/stories.test.ts` gained "has a devotional at both levels and a
   memory verse"; `src/lib/devotional.test.ts` written against a missing
   module. Run: 5 data failures (`devotional` undefined) and the module
   error. `tdd-red.txt`.
2. `Devotional` type, `Story.devotional`, content for five stories,
   `src/lib/devotional.ts`. Run: 34 passed across the two files.
   `tdd-green-data-script.txt`.
3. `src/components/FamilyTime.test.tsx` written against a missing
   component. Run: 3 failures, module missing. `tdd-red-screen.txt`.
4. Component, quiz button, route, styles. Full run: 9 files, 95 tests
   passed. `tdd-green-screen.txt`.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Story data invariants | every story: question ends with `?` at both levels, prayer non-empty at both, activity non-empty, memory verse present | suite |
| `readAloudScript` | headings and parts in order, level swap, no verse handled, no `undefined` | suite |
| `FamilyTime` render (`react-dom/server`) | four headings, level-specific text, verse and reference, Done; Read button only when `speechSynthesis` exists | suite |
| Typecheck, lint, motion | `tsc -b` clean; lint 0 errors, 34 warnings (6 new, all `detect-object-injection` on `AgeMode`-keyed lookups, reviewed); 27 scenes clean | hook output |
| Quiz done page, phone 390×844 | "Family time" primary and "Back to the stories" secondary | `quiz-done-phone.png` |
| Family card, phone | all four cards, Read to me and Done visible without scrolling | `family-phone.png` |
| Family card, tablet 1024×768 | | `family-tablet.png` |
| Read to me | button toggles to "Stop reading"; speech queued (headless has no audible voice) | evaluate output in session |
| Back button | `history.back()` from the card returns to `#/story/daniel/quiz` | evaluate output in session |

## Content

Written in-house at both levels for Creation, Noah, David, Jonah, Daniel:
little questions under ten words, little prayers under 25 words, one
activity each for the grown-up. **Human theological review is still open.**

## Gaps

- No human review of the content or the screen yet.
- Read to me is one utterance; some Android voices cut long utterances off
  around 15 s. The cards are short enough; not measured on a device.
- Coverage include set is unchanged (`src/lib/**` covers `devotional.ts`);
  `FamilyTime.tsx` is tested but outside the coverage include set, as are
  all components.
