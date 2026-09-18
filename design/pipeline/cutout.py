"""Strip the flat background from raw character PNGs and write WebP cutouts.

    python design/pipeline/cutout.py daniel den
rembg (isnet-general-use) does the matte; the green field makes it easy. Then
despill the edges, trim to content, cap the height, and save WebP with alpha.
"""
import json
import sys

from PIL import Image, ImageChops
from rembg import new_session, remove

from gen import ROOT

if len(sys.argv) < 3:
    sys.exit("usage: cutout.py <story> <scene>")
story, scene = sys.argv[1:3]
manifest = json.loads((ROOT / f"design/pipeline/scenes/{story}-{scene}.json").read_text(encoding="utf-8"))
raw = ROOT / f"design/pipeline/raw/{story}/{scene}"
dest = ROOT / f"src/assets/scenes/{story}/{scene}"
dest.mkdir(parents=True, exist_ok=True)
session = new_session("isnet-general-use")  # first run downloads the model (~170 MB)


def chroma_mask(img: Image.Image) -> Image.Image:
    """Mask (L) that is 0 wherever the raw pixel is plainly the green field and
    255 elsewhere. rembg keeps green islands enclosed by a tail or an arm; this
    mask, intersected with rembg's alpha, removes them wherever they are.
    Nothing in the cast is green-dominant."""
    px = img.load()
    w, h = img.size
    mask = Image.new("L", (w, h), 255)
    mp = mask.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if g > 40 and g > r * 1.25 and g > b * 1.25:
                mp[x, y] = 0
    return mask


def erode_alpha(img: Image.Image) -> Image.Image:
    """Pull the alpha edge in by one pixel so the last ring of matte residue
    (dark, green-tinged) disappears. Two pixels; nothing visible at stage size."""
    from PIL import ImageFilter
    a = img.getchannel("A").filter(ImageFilter.MinFilter(5))
    img.putalpha(a)
    return img


def despill(img: Image.Image) -> Image.Image:
    """Kill green spill on edges: where a visible pixel is greener than both
    red and blue, clamp green to the larger of the two."""
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0 and g > max(r, b):
                px[x, y] = (r, max(r, b), b, a)
    return img


report = {}
for name, spec in manifest["cutouts"].items():
    src = raw / f"{name}.png"
    img = Image.open(src).convert("RGBA")
    cut = remove(
        img,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=8,
    )
    cut.putalpha(ImageChops.multiply(cut.getchannel("A"), chroma_mask(img)))
    bbox = cut.getbbox()
    if not bbox:
        sys.exit(f"{name}: nothing left after matting")
    cut = despill(erode_alpha(cut.crop(bbox)))
    max_h = spec.get("max_h", 900)
    if cut.height > max_h:
        cut = cut.resize((round(cut.width * max_h / cut.height), max_h), Image.LANCZOS)
    out = dest / f"{name}.webp"
    cut.save(out, format="WEBP", quality=88, method=6)
    report[name] = {
        "file": out.name,
        "w": cut.width,
        "h": cut.height,
        "trim": list(bbox),
        "source": str(src.relative_to(ROOT)).replace("\\", "/"),
        "bytes": out.stat().st_size,
    }
    print(name, cut.size, f"{out.stat().st_size // 1024} KB")

(dest / "cutouts.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
