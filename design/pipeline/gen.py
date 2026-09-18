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

STYLE_LINE = (
    "Match the illustration style of the first reference image exactly: soft "
    "shaded rounded forms, layered paper-cutout depth, warm rim light, subtle "
    "paper grain, big friendly eyes, no black outlines. Children's storybook."
)


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
