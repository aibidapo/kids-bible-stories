# Composition cycles: Creation story

Reference: design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg (style only).

| Cycle | Scenes | Result | Image | Notes |
|---|---|---|---|---|
| 00 | raw review | 14/14 accepted | raw-all.png | cloud and flowers came back with faces; kept, suits the audience |
| 01 | all six | light P, sky-water F, land F, lights P, creatures P, people F | — | clouds half off the left edge; fruit tree oversized and cropped; Adam and Eve overlapped the giraffes and lions |
| 02 | sky-water, land, people | all P | story-sheet.png, lids-forced-*.png | clouds at x 300/700; fruit tree 0.42; animals spread to the edges, people centred |
| 03 | creatures (user review) | P | creatures-render.png | fish school replaced by five individual fish crossing on `a-swim-across` (flipped ones the other way); dolphin leaps on `a-leap`; two cloud cutouts drift; seahorse, crab, octopus added; 12 rising bubbles. fish-green regenerated once: first came on a white card |
| 04 | creatures (user review) | P | creatures-render.png, creatures-plunge-splash.png | leap lowered to break the surface (peak -60, base y 400, 0.4 scale) so the dolphin stays under the birds; two splash groups on `a-splash` timed to the launch (delay 0) and the plunge (delay -0.55 s); scrubbed at 95.5%: leap at translate(236,78) rotate 30°, plunge splash opacity 0.99 scale 0.99, launch splash 0 |
| 05 | creatures (user review, second pass) | P | creatures-render.png, creatures-plunge-splash.png | leap base raised to y 350 (the water line), peak -40 so the dolphin tops out at ~y 246, under every bird; splashes at y 352 |
| 06 | people (user review) | P | people-render.png, people-wander-mid.png | olive and fruit trees with swaying canopies at the edges, four swaying tufts; giraffes, elephants, zebras, lions and the lamb on `a-wander`/`a-wander-slow` with `a-walk-bob`; scrubbed at 70%: transforms translate 92/102/48 px or scaleX(-1) on the way back; animation names on the page: sway 6, wander 5, walk-bob 5 |
