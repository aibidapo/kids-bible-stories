"""Locate eyes on a character cutout so the scene can place blink lids.

    python design/pipeline/find_eyes.py <story> <scene> <name> [max_eyes] [top_fraction]

Finds the near-white sclera blobs in the upper part of the cutout (teeth sit
lower and are wide, so they are filtered out), prints one line per eye with
its centre, a lid radius that covers the blob, and the skin tone sampled just
below it. Output is JSON on stdout; paste into the scene's Eyelids props.
"""
import json
import sys
from collections import deque

from PIL import Image

from gen import ROOT

if len(sys.argv) < 4:
    sys.exit("usage: find_eyes.py <story> <scene> <name> [max_eyes] [top_fraction]")
story, scene, name = sys.argv[1:4]
max_eyes = int(sys.argv[4]) if len(sys.argv) > 4 else 2
top_frac = float(sys.argv[5]) if len(sys.argv) > 5 else 0.45

img = Image.open(ROOT / f"src/assets/scenes/{story}/{scene}/{name}.webp").convert("RGBA")
w, h = img.size
px = img.load()
limit_y = int(h * top_frac)

def is_white(x, y):
    r, g, b, a = px[x, y]
    return a > 200 and r > 200 and g > 200 and b > 190 and max(r, g, b) - min(r, g, b) < 40

seen = set()
blobs = []
for y in range(limit_y):
    for x in range(w):
        if (x, y) in seen or not is_white(x, y):
            continue
        q = deque([(x, y)]); seen.add((x, y)); pts = []
        while q:
            cx, cy = q.popleft(); pts.append((cx, cy))
            for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
                if 0 <= nx < w and 0 <= ny < limit_y and (nx, ny) not in seen and is_white(nx, ny):
                    seen.add((nx, ny)); q.append((nx, ny))
        if len(pts) < 25:
            continue
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        bw = max(xs) - min(xs) + 1; bh = max(ys) - min(ys) + 1
        if bw / bh > 2.4 or bh / bw > 2.4:
            continue  # teeth, highlights on cloth
        blobs.append({"cx": sum(xs) // len(xs), "cy": sum(ys) // len(ys), "bw": bw, "bh": bh, "n": len(pts)})

blobs.sort(key=lambda b: -b["n"])
eyes = sorted(blobs[:max_eyes], key=lambda b: b["cx"])

def tone(cx, cy):
    box = [px[x, y][:3] for x in range(max(0, cx-6), min(w, cx+6)) for y in range(max(0, cy-4), min(h, cy+4)) if px[x, y][3] > 200]
    if not box:
        return "#c88a5e"
    return "#%02x%02x%02x" % tuple(sum(c[i] for c in box) // len(box) for i in range(3))

out = []
for e in eyes:
    rx = e["bw"] // 2 + 3; ry = e["bh"] // 2 + 3
    out.append({"point": [e["cx"], e["cy"]], "rx": rx, "ry": ry, "tone": tone(e["cx"], e["cy"] + ry + 6)})
print(json.dumps({"name": name, "w": w, "h": h, "eyes": out}))
