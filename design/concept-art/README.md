# Concept art

Reference images for the graphics upgrade. **Nothing in this folder ships.**
The app's ship-nothing-binary rule (see `CLAUDE.md`) still applies: final art
is inline SVG in `src/art/`, and these images only guide what that SVG should
look like.

## style-samples/

Four candidate illustration styles, generated 2026-09-18 with Gemini
`gemini-3-pro-image-preview`. Same scene and prompt for all four (Daniel praying
in the lions' den); only the style paragraph changed, so differences are style,
not subject.

| File | Style | SVG feasibility |
|---|---|---|
| `1-soft-shaded-storybook.jpg` | Rounded shapes, smooth gradients, rim light, no outlines | Medium: radial gradients + blur shadows, ~70% match |
| `2-paper-cutout.jpg` | Flat layered shapes, drop shadows, paper texture | High: maps directly to stacked `<g>` layers |
| `3-bold-outline-cartoon.jpg` | Thick linework, flat cel colour, big faces | High: cheapest, add `stroke` + one shadow tone |
| `4-painterly-watercolour.jpg` | Loose washes, bleeds, pencil line | Low: needs bitmap texture, breaks no-binary rule |
| `5-blend-cutout-watercolour.jpg` | Cutout layering, each shape a watercolour wash | Medium-low: layering is easy, wash fills need `feTurbulence` tricks and still fall short |
| `6-blend-soft-shaded-cutout.jpg` | Cutout layering, soft-shaded rounded forms, big faces | Medium-high: layers + gradients + blur shadows, ~75% match |

`_style-sheet.jpg` is the 2x2 comparison of the above.

## gen_styles.py

Regenerates the samples. Needs `GEMINI_API_KEY` in the environment and a
Google AI Studio project with billing enabled (image models have zero
free-tier quota). Skips files that already exist; delete one to regenerate it.

```bash
pip install google-genai pillow
python design/concept-art/gen_styles.py
```

Set `GEMINI_IMAGE_MODEL` to override the model.
