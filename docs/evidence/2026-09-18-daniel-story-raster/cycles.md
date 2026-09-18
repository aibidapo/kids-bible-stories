# Composition cycles: remaining Daniel pages

Reference: design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg (style only; no per-scene mock).
Pass = characters match their sheets (T11), scene reads as the same book as the den, hotspots land on targets.

| Cycle | Scenes | Result | Image | Notes |
|---|---|---|---|---|
| 01 | all four | prays P, trap P, angel F, rejoice F | (four-scenes, not saved) | angel small and floating high, second lion hidden; crowd off the right edge |
| 02 | angel, rejoice | angel P, rejoice F | (two-scenes, not saved) | angel 0.52 at y 500, lion-b peeks behind lion-a; crowd inside frame but the man is a 60%-opaque ghost: rembg matting |
| 03 | all five | all P except angel oversized | story-sheet (pre-tune) | cutout.py switched to chroma-mask matte; crowd solid; angel cutout grew to full wing glow so scale needed lowering |
| 04 | angel | P | story-sheet.png | angel 0.45 at y 496 |
| 05 | den, angel (tails) | P | tails-mid-flick.png | lion cutouts split into body + tail with split_tail.py; rest frame diff 0.008% on angel; browser screenshot with tail animations scrubbed to 82% shows both den tails rotated at the root, no seams |
| 06 | prays (dove) | P | prays-bird-rest.png, prays-bird-frames.png | two dove frames (wings up/down) aligned on the eye, flipbook swap at 0.36 s, glide on the fly path, clipped to the window opening; frames land within ~3 viewBox units of each other; Calm frame shows wings-up dove mid-window |
