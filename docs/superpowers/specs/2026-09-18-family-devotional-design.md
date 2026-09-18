# Family Devotional mode: design

Roadmap phase 1 (`docs/roadmap.md`). Date 2026-09-18.

## Purpose

After a story and its quiz, give a parent and child a short Family time:
one question to talk about, a short prayer, the memory verse, one thing to
do together. Teaching, not more screen time: the screen is a prompt card
the grown-up reads from, not a game.

## What the child and parent see

From the quiz's "Well done!" page a primary button **Family time** opens a
new screen; **Back to the stories** stays as the secondary button. The
screen is also reachable at `#/story/<id>/family`, so the phone back button
works and a parent can jump straight there.

The screen, top to bottom:

1. Story title, small: "Family time · Daniel and the Lions".
2. **Talk about it**: one question.
3. **Pray together**: a prayer of one to three sentences.
4. **Remember**: the memory verse and its reference, at both reading levels
   (today the verse shows only in big mode after the quiz).
5. **Try this**: one activity for the week, the same at both levels.
6. A round **Read to me** button that speaks the whole card through the
   existing narration hook, and a **Done** button back to the library.

Little and Big reading levels get their own question and prayer. The
activity is written once, for the grown-up.

No timers, streaks, reminders or saved answers. Nothing is persisted.

## Data

`src/types.ts`:

```ts
export interface Devotional {
  /** One question to talk about together, per reading level. */
  question: Record<AgeMode, string>;
  /** A short prayer to say together, per reading level. */
  prayer: Record<AgeMode, string>;
  /** One thing to do together this week, written for the grown-up. */
  activity: string;
}
```

`Story.devotional: Devotional` (required, so a new story cannot ship
without one; the story-data test enforces it). `memoryVerse` stays optional
in the type but the test now requires it too, since the card shows it.

## Code

- `src/lib/devotional.ts`: `readAloudScript(story, mode): string`, pure.
  Joins the four parts in reading order with the headings, so the narrator
  says "Talk about it. … Pray together. …". Unit-tested.
- `src/components/FamilyTime.tsx`: the screen. Props `story`, `onDone`.
  Reads `mode` from the store, uses `useNarration` for Read to me (the hook
  already cancels speech on unmount). Rendered-output test with
  `react-dom/server`.
- `src/components/Quiz.tsx`: new prop `onFamily`; the done page gets the
  Family time primary button.
- `src/App.tsx`: route `{ view: "family"; storyId }`, hash
  `#/story/<id>/family`, parse and href, content branch.
- `src/styles/app.css`: `.family` block, reusing quiz tokens (card, heading
  sizes, tap targets ≥ 64 px). No motion, so Calm mode needs nothing.
- Content for the five stories in `src/data/stories/*.ts`.

## Tests

- Story data: every story has `devotional` with non-empty `question` and
  `prayer` at both levels, the question ends with `?`, `activity` non-empty,
  `memoryVerse` present.
- `readAloudScript`: order, both levels, verse included, no `undefined`.
- `FamilyTime` render: four headings, level-specific text, verse and
  reference, Done button; big vs little swaps the question.
- Browser: phone and tablet stills of the screen and the quiz-done page
  with the new button; Read to me toggles; back button returns to the quiz.

## Out of scope

Persisting anything, per-child state (phase 5), translations (phase 7),
printable cards (phase 4).
