"""Generate one concept image per candidate illustration style, same scene each time.

Scene held constant so only the style varies. Output: <scratchpad>/styles/<key>.jpg
"""
import os
import sys
from pathlib import Path

from google import genai
from google.genai import types

OUT = Path(__file__).parent / "style-samples"
OUT.mkdir(exist_ok=True)

# Same scene for every style: Daniel in the lions' den, from the app's Daniel story.
SCENE = (
    "Children's Bible storybook illustration for ages 3 to 12. "
    "Daniel, a man with a white headscarf and purple robe, kneels praying in a "
    "dark stone lions' den, calm and smiling. Three golden lions lie peacefully "
    "around him. A shaft of warm light falls from a round opening in the ceiling "
    "above. Daniel is large in the frame, about half the image height, centred. "
    "Lions overlap in foreground and midground for depth. No text, no watermark, "
    "no border. Wide landscape composition."
)

STYLES = {
    "1-soft-shaded-storybook": (
        "Style: soft shaded storybook. Rounded simplified shapes, gentle smooth "
        "gradients for volume, subtle paper grain texture, warm rim light on edges, "
        "no black outlines, big friendly faces with large eyes. Like a modern "
        "picture book. Flat enough to be reproduced as vector art."
    ),
    "2-paper-cutout": (
        "Style: layered paper cutout collage. Every element is a flat cut paper "
        "shape with a soft drop shadow beneath it, stacked in visible layers for "
        "depth, slight torn-paper and cardstock texture, bold simple silhouettes, "
        "no outlines, minimal facial features, like Eric Carle or Lotte Reiniger "
        "with colour."
    ),
    "3-bold-outline-cartoon": (
        "Style: bold outline cartoon. Thick dark uniform linework around every "
        "shape, flat cel colours with at most one shadow tone, big expressive "
        "faces, simple geometric bodies, high contrast, reads clearly on a small "
        "phone screen. Like Bluey or a modern preschool TV show."
    ),
    "4-painterly-watercolour": (
        "Style: painterly watercolour. Loose translucent washes, soft bleeding "
        "edges, visible brush texture and paper grain, muted but warm palette, "
        "light pencil underdrawing showing through, gentle and dreamy. Like a "
        "classic hand-painted children's book."
    ),
    "5-blend-cutout-watercolour": (
        "Style: paper cutout collage where every cut shape is made of hand-painted "
        "watercolour paper. Flat layered silhouettes stacked with soft drop shadows "
        "for depth, bold simple shapes, no black outlines, but each shape's fill is "
        "a loose translucent watercolour wash with visible bleeding, granulation and "
        "paper grain. Muted warm palette. Like a collage built from torn pieces of "
        "watercolour paintings."
    ),
    "6-blend-soft-shaded-cutout": (
        "Style: layered paper cutout construction with soft shaded rendering. "
        "Scene built from distinct stacked flat layers with gentle drop shadows "
        "between them for depth, but each layer is rendered with rounded forms, "
        "smooth soft gradients for volume, warm rim light and subtle paper grain. "
        "Big friendly faces with large expressive eyes, no black outlines. Like a "
        "diorama of a modern picture book."
    ),
}


def main() -> int:
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("GEMINI_API_KEY not set", file=sys.stderr)
        return 2
    client = genai.Client(api_key=key)
    # Pro image model has zero free-tier quota; flash image is the free fallback.
    model = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image-preview")
    print(f"model: {model}")
    for name, style in STYLES.items():
        target = OUT / f"{name}.jpg"
        if target.exists():
            print(f"skip {target.name} (exists)")
            continue
        print(f"generating {name} ...", flush=True)
        response = client.models.generate_content(
            model=model,
            contents=[SCENE + " " + style],
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
            ),
        )
        saved = False
        for part in response.parts:
            if part.inline_data:
                part.as_image().save(str(target))
                saved = True
                break
            elif part.text:
                print("  model text:", part.text[:200])
        print(f"  -> {target if saved else 'NO IMAGE RETURNED'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
