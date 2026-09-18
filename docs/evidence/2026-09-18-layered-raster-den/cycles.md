# Fidelity cycles: daniel/den vs concept 6

Scored from scratch/compare/daniel-den_vs_ref.png at 1000 wide. Pass = trait visible without being told where to look.

| Cycle | Task | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | Image | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 00 | vector baseline (5d578db) | F | F | F | F | F | F | F | F | F | F | F | cycle-00.png | starting point, hand-built SVG |
| 01 | raster layers, first composition | P | P | P | P | P | P | P | P | P | ? | P | cycle-01.png | assets accepted; Daniel ~30% too small, lions slightly small, no contact shadows, king not placed; T10 judged on the phone shot later |
| 02 | scale up Daniel 0.41 and lions 0.5, contact shadows, king placed | P | P | P | P | P | P | P | P | P | ? | P | (not saved) | composition matches mock proportions; dark green matte slivers on lion tail edges; king slightly large |
| 03 | tighter chroma key + 1px alpha erosion, king 0.22 | P | P | P | P | P | P | P | P | P | ? | P | cycle-03.png | slivers thinner but still visible at tail bases; key threshold too bright, erosion too small |
| 04 | matte first, then intersect chroma mask; 2px erosion | P | P | P | P | P | P | P | P | P | P | P | cycle-04.png | pockets and slivers gone; accepted for the slice |
