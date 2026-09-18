# Composition cycles: Jonah story

Reference: design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg (style only).
Pass = characters match the Jonah sheet, scene reads as the same book, hotspots on targets, lids on eyes.

| Cycle | Scenes | Result | Image | Notes |
|---|---|---|---|---|
| 00 | raw review | 16/16 accepted | raw-*.png | |
| 01 | all five | running P, storm F, swallowed P, prayer P, nineveh P | lids-forced.png | storm: sailors' lids floated in the sky (eyelid group not scaled with the raw image), ship small, Jonah on the gunwale |
| 02 | storm | P | storm-render.png, storm-lids-forced.png, story-sheet.png | sailors' lids in a scaled group, ship 0.62, Jonah inboard at (578,452) |
| 03 | user review: running, storm, swallowed, nineveh | all P | story-sheet.png | harbour background regenerated with a full-width quay and realistic water; ship 0.62 on the water, sailors 0.5 on the stone beside Jonah 0.4; storm: four heaving wave layers, ship 0.8 inside the same heave as the near swell, crew 0.3 and Jonah 0.26 inside the hull; swallowed: Jonah drawn in the mouth with a one-shot drift into it, turtle, fish school, jellyfish, 14 rising bubbles; nineveh crowd 0.48 to match Jonah |
| 04 | swallowed | P | swallowed-render.png, swallowed-mouth-zoom.png | Jonah drawn in front of the fish, head-first in the mouth, legs out; the drift replays from up-left |
