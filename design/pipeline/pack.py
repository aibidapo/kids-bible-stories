"""Background to WebP at 1600x1000 (16:10, the stage's viewBox ratio) and the
combined layers.json the scene file reads.

    python design/pipeline/pack.py daniel den
Gemini returns 16:9; the extra width is cropped equally from both sides so the
opening stays centred.
"""
import json
import sys

from PIL import Image

from gen import ROOT

if len(sys.argv) < 3:
    sys.exit("usage: pack.py <story> <scene>")
story, scene = sys.argv[1:3]
raw = ROOT / f"design/pipeline/raw/{story}/{scene}"
dest = ROOT / f"src/assets/scenes/{story}/{scene}"

img = Image.open(raw / "bg.png").convert("RGB")
target_ratio = 1.6
w, h = img.size
if w / h > target_ratio:
    new_w = round(h * target_ratio)
    x0 = (w - new_w) // 2
    img = img.crop((x0, 0, x0 + new_w, h))
else:
    new_h = round(w / target_ratio)
    y0 = (h - new_h) // 2
    img = img.crop((0, y0, w, y0 + new_h))
img = img.resize((1600, 1000), Image.LANCZOS)
out = dest / "bg.webp"
img.save(out, format="WEBP", quality=80, method=6)
print("bg", img.size, f"{out.stat().st_size // 1024} KB")

cutouts = json.loads((dest / "cutouts.json").read_text(encoding="utf-8"))
layers = {
    "background": {
        "file": "bg.webp",
        "w": 1600,
        "h": 1000,
        "bytes": out.stat().st_size,
        "source": f"design/pipeline/raw/{story}/{scene}/bg.png",
    },
    "cutouts": cutouts,
}
(dest / "layers.json").write_text(json.dumps(layers, indent=2), encoding="utf-8")
(dest / "cutouts.json").unlink()
total = out.stat().st_size + sum(c["bytes"] for c in cutouts.values())
print(f"scene total {total // 1024} KB (budget 450 KB)")
