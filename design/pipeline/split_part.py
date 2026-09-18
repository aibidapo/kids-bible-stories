"""Split any named part off a cutout so it can move on its own.

    python design/pipeline/split_part.py daniel angel angel wing-l tr "0,0 215,0 ..."

Generalises split_tail.py: the polygon (asset pixel coordinates) outlines the
part; pixels inside go to <name>-<part>.webp (cropped to its box), the rest
stays in <name>-body.webp. Splitting again for another part starts from the
current body, so several parts can be cut from one cutout. <root> is the
corner of the part's box that stays attached to the body ("tl" or "tr"); the
scene picks a pivot class to match. layers.json records each part under
cutouts.<name>.parts.<part> with its size and offset inside the original
cutout, so the scene draws it in the body's local space.
"""

import json
import sys

from PIL import Image, ImageDraw, ImageFilter

from gen import ROOT

if len(sys.argv) < 7:
    sys.exit('usage: split_part.py <story> <scene> <name> <part> <root tl|tr> "x,y x,y ..."')
story, scene, name, part, root, poly = sys.argv[1:7]
if root not in ("tl", "tr"):
    sys.exit("root must be tl or tr")
points = [tuple(int(v) for v in p.split(",")) for p in poly.split()]

dest = ROOT / f"src/assets/scenes/{story}/{scene}"
layers_path = dest / "layers.json"
layers = json.loads(layers_path.read_text(encoding="utf-8"))
if name not in layers["cutouts"]:
    sys.exit(f"{name} not in {layers_path}")
entry = layers["cutouts"][name]

body_out = dest / f"{name}-body.webp"
src_path = body_out if body_out.exists() else dest / f"{name}.webp"
src = Image.open(src_path).convert("RGBA")

mask = Image.new("L", src.size, 0)
ImageDraw.Draw(mask).polygon(points, fill=255)
soft = mask.filter(ImageFilter.GaussianBlur(1.2))
alpha = src.getchannel("A")

piece = src.copy()
piece.putalpha(Image.composite(alpha, Image.new("L", src.size, 0), soft))
body = src.copy()
body.putalpha(Image.composite(Image.new("L", src.size, 0), alpha, soft))

bbox = piece.getbbox()
if not bbox:
    sys.exit("polygon covers nothing")
piece = piece.crop(bbox)
part_out = dest / f"{name}-{part}.webp"
piece.save(part_out, format="WEBP", quality=85, method=6)
body.save(body_out, format="WEBP", quality=85, method=6)

entry["body"] = {"file": body_out.name, "bytes": body_out.stat().st_size}
entry.setdefault("parts", {})[part] = {
    "file": part_out.name,
    "w": piece.width,
    "h": piece.height,
    "ox": bbox[0],
    "oy": bbox[1],
    "root": root,
    "polygon": points,
    "bytes": part_out.stat().st_size,
}
layers_path.write_text(json.dumps(layers, indent=2), encoding="utf-8")
print(
    name, part, piece.size, "at", bbox[:2], f"{part_out.stat().st_size // 1024} KB;",
    "body", f"{body_out.stat().st_size // 1024} KB (from {src_path.name})",
)
