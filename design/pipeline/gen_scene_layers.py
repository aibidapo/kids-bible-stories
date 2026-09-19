"""Generate every raw layer for one scene from its manifest.

    python design/pipeline/gen_scene_layers.py daniel den [layer ...]
Skips layers whose raw PNG already exists; delete a raw file to regenerate it.
"""
import json
import sys

from gen import ROOT, STYLE_REF, generate

if len(sys.argv) < 3:
    sys.exit("usage: gen_scene_layers.py <story> <scene> [layer ...]")
story, scene, *only = sys.argv[1:]
manifest = json.loads((ROOT / f"design/pipeline/scenes/{story}-{scene}.json").read_text(encoding="utf-8"))
raw = ROOT / f"design/pipeline/raw/{story}/{scene}"


def wanted(name: str) -> bool:
    return not only or name in only


if wanted("bg"):
    out = raw / "bg.png"
    if manifest["background"].get("reuse"):
        print(f"skip bg (reuse {manifest['background']['reuse']})")
    elif out.exists():
        print("skip bg (exists)")
    else:
        bg = manifest["background"]
        print(generate(bg["prompt"], [STYLE_REF], out, aspect=bg.get("aspect", "16:9"), size=bg.get("size", "1K")))

for name, spec in manifest["cutouts"].items():
    if not wanted(name):
        continue
    out = raw / f"{name}.png"
    if out.exists():
        print(f"skip {name} (exists)")
        continue
    # A layer with no character sheet (a bird, a prop) is styled by the
    # concept reference alone.
    refs = [STYLE_REF]
    if spec.get("sheet"):
        refs.append(ROOT / "design/characters" / f"{spec['sheet']}.png")
    print(generate(spec["prompt"], refs, out, aspect=spec.get("aspect", "3:4"), size=spec.get("size", "1K")))
