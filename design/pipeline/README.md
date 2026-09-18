# Scene pipeline

Turns prompts plus reference images into the layered WebP art the app ships.
Developer tooling only; nothing here runs in the app.

## Setup

```bash
pip install -r design/pipeline/requirements.txt
```

`GEMINI_API_KEY` must be set, on a Google AI Studio project with billing
enabled (image models have zero free-tier quota).

## Order

1. `gen_character.py <name> "<description>"` — one character sheet into
   `design/characters/<name>.png`. Generated once per character; every scene
   passes it as a reference image so the cast stays consistent.
2. `gen_scene_layers.py <story> <scene> [layer ...]` — raw PNGs for every
   layer in `design/pipeline/scenes/<story>-<scene>.json`, written to
   `design/pipeline/raw/<story>/<scene>/`. Skips existing files; delete a raw
   PNG to regenerate it.
3. `cutout.py <story> <scene>` — chroma-keys the flat green field from each
   character (no learned matte: rembg ghosted figures standing behind others),
   softens and despills the edge, trims, caps height, writes WebP with alpha
   into `src/assets/scenes/<story>/<scene>/`.
4. `pack.py <story> <scene>` — background cropped to 16:10, resized to
   1600×1000, WebP q80, plus `layers.json` with sizes, byte counts and sources.
   A manifest may set `"background": {"reuse": "<story>/<scene>/bg.webp"}` to
   share another scene's background; the scene file imports it directly.
5. `split_tail.py <story> <scene> <name> <tl|tr> "<polygon>"` — optional: cuts
   a tail (or any part that should move on its own) out of a cutout into
   `<name>-tail.webp` and `<name>-body.webp`, records its box and root corner
   in `layers.json`. The scene renders `Tail` before the body `Layer`. The
   original `<name>.webp` stays as the split's source and is not imported.
   Works for any part with its own motion (a tree canopy on `a-sway-slow`);
   the scene uses `Part` with the class it wants.
6. `find_eyes.py <story> <scene> <name> [max_eyes] [top_fraction]` — locates
   the eyes on a cutout (near-white sclera blobs in the upper part, teeth
   filtered by aspect) and prints lid centres, radii and skin tone for
   `Eyelids`. Three-quarter faces may need the far eye mirrored by hand;
   always verify by rendering with the lids forced visible.

## What gets committed

- `design/characters/*.png` and sidecars: yes.
- `src/assets/scenes/**`: yes, these ship.
- `design/pipeline/raw/`: no (gitignored). Regenerate from the sidecars.

Every generated image has a `.json` sidecar with model, prompt, references
and date. Keep them; they are the provenance record.

## Budget

A scene is at most 450 KB: background ≤ 200 KB, each cutout ≤ 80 KB. `pack.py`
prints the total. Lower `quality` before touching dimensions.
