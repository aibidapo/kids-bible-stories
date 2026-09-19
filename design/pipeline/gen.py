"""Shared Gemini image generation for the scene pipeline.

Every call sends the style reference (concept 6) so all output stays in one
look, and writes a JSON sidecar with model, prompt, references and date so an
asset's provenance is never lost.
"""
from __future__ import annotations

import datetime as dt
import io
import json
import os
import sys
from pathlib import Path

from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
STYLE_REF = ROOT / "design/concept-art/style-samples/6-blend-soft-shaded-cutout.jpg"
MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image-preview")

# The look, in the words the model responds to; the full standard is design/style-bible.md.
STYLE_LINE = (
    "Match the illustration style of the first reference image exactly: a soft-shaded "
    "PAPER CUTOUT storybook. Every figure, prop and background plane is a cut piece of "
    "card with a crisp silhouette, a hairline of lighter paper thickness along its edge "
    "and a small soft contact shadow on the layer beneath; backgrounds are three to five "
    "stacked paper planes; textures are printed flat on the paper; fine paper grain "
    "overall. Rounded forms with gentle airbrushed shading, big round friendly eyes, "
    "simple mitten hands, no black outlines, no hard highlights, no photographic "
    "texture. One warm key light with a cool violet fill and a warm rim. "
    "Rich in detail, never realistic."
)

# Words that pull the model away from the paper look. A prompt using one is refused,
# so drift cannot come back quietly through a manifest edit.
FORBIDDEN_WORDS = (
    "realistic",
    "photoreal",
    "painterly",
    "3d render",
    "cgi",
    "cinematic",
    "depth of field",
    "no cartoon outlines",
)


def check_prompt(prompt: str) -> list[str]:
    """The forbidden words a prompt uses, lower-cased, in order of appearance."""
    low = prompt.lower()
    return [w for w in FORBIDDEN_WORDS if w in low]


_client: genai.Client | None = None


def client() -> genai.Client:
    """One client for the process. A throwaway client can be closed by the
    garbage collector while its request is still in flight."""
    global _client
    if _client is None:
        key = os.environ.get("GEMINI_API_KEY")
        if not key:
            sys.exit("GEMINI_API_KEY not set")
        _client = genai.Client(api_key=key)
    return _client


def generate(prompt: str, refs: list[Path], out: Path, aspect: str = "16:9", size: str = "1K") -> Path:
    bad = check_prompt(prompt)
    if bad:
        sys.exit(f"{out.name}: prompt uses {', '.join(bad)}; see design/style-bible.md")
    contents: list = [f"{STYLE_LINE}\n\n{prompt}"] + [Image.open(r) for r in refs]
    parts = None
    for attempt in range(3):
        response = client().models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(aspect_ratio=aspect, image_size=size),
            ),
        )
        parts = response.parts
        if parts:
            break
        # An empty response (safety block or transient) has no parts; say why and retry.
        reason = getattr(getattr(response, "candidates", [None])[0] if response.candidates else None, "finish_reason", None)
        print(f"empty response for {out.name} (attempt {attempt + 1}, finish_reason={reason}); retrying")
    if not parts:
        sys.exit(f"no image returned for {out.name} after 3 attempts")
    for part in parts:
        if part.inline_data:
            out.parent.mkdir(parents=True, exist_ok=True)
            # inline_data is JPEG/PNG bytes; decode with PIL so the file on
            # disk is really PNG whatever the model returned.
            Image.open(io.BytesIO(part.inline_data.data)).save(str(out), format="PNG")
            sidecar = {
                "model": MODEL,
                "prompt": prompt,
                "style_line": STYLE_LINE,
                "references": [str(r.relative_to(ROOT)).replace("\\", "/") for r in refs],
                "aspect": aspect,
                "size": size,
                "generated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
            }
            out.with_suffix(".json").write_text(json.dumps(sidecar, indent=2), encoding="utf-8")
            return out
        if part.text:
            print("model text:", part.text[:300])
    sys.exit(f"no image returned for {out.name}")
