"""Split a lion cutout into body and tail so the tail can move on its own.

    python design/pipeline/split_tail.py daniel den lion-a tr "740,395 824,420 824,560 450,560 450,485 600,500 700,500 730,440"

The polygon (asset pixel coordinates) outlines the tail. Everything inside it
goes to <name>-tail.webp (cropped to its box), everything outside stays in
<name>-body.webp. <root> is the corner of the tail box where it joins the
body: "tr" (top-right) or "tl" (top-left); the scene uses it to pick the
matching pivot class. layers.json records the tail's size and offset inside
the original cutout so the scene can place it in the same local space.
"""
import json
import sys

from PIL import Image, ImageDraw, ImageFilter

from gen import ROOT

if len(sys.argv) < 6:
    sys.exit("usage: split_tail.py <story> <scene> <name> <root tl|tr> \"x,y x,y ...\"")
story, scene, name, root, poly = sys.argv[1:6]
if root not in ("tl", "tr"):
    sys.exit("root must be tl or tr")
points = [tuple(int(v) for v in p.split(",")) for p in poly.split()]

dest = ROOT / f"src/assets/scenes/{story}/{scene}"
layers_path = dest / "layers.json"
layers = json.loads(layers_path.read_text(encoding="utf-8"))
if name not in layers["cutouts"]:
    sys.exit(f"{name} not in {layers_path}")

src = Image.open(dest / f"{name}.webp").convert("RGBA")
mask = Image.new("L", src.size, 0)
ImageDraw.Draw(mask).polygon(points, fill=255)
soft = mask.filter(ImageFilter.GaussianBlur(1.2))

alpha = src.getchannel("A")
tail = src.copy()
tail_alpha = Image.composite(alpha, Image.new("L", src.size, 0), soft)
tail.putalpha(tail_alpha)
body = src.copy()
body_alpha = Image.composite(Image.new("L", src.size, 0), alpha, soft)
body.putalpha(body_alpha)

bbox = tail.getbbox()
if not bbox:
    sys.exit("polygon covers nothing")
tail = tail.crop(bbox)
tail_out = dest / f"{name}-tail.webp"
body_out = dest / f"{name}-body.webp"
tail.save(tail_out, format="WEBP", quality=85, method=6)
body.save(body_out, format="WEBP", quality=85, method=6)

entry = layers["cutouts"][name]
entry["body"] = {"file": body_out.name, "bytes": body_out.stat().st_size}
entry["tail"] = {
    "file": tail_out.name,
    "w": tail.width,
    "h": tail.height,
    "ox": bbox[0],
    "oy": bbox[1],
    "root": root,
    "polygon": points,
    "bytes": tail_out.stat().st_size,
}
layers_path.write_text(json.dumps(layers, indent=2), encoding="utf-8")
print(name, "body", body.size, f"{body_out.stat().st_size // 1024} KB;", "tail", tail.size, "at", bbox[:2], f"{tail_out.stat().st_size // 1024} KB")
