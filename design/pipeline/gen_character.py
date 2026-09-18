"""Generate one character sheet: the consistency anchor for every scene.

    python design/pipeline/gen_character.py daniel "a kind man in his forties ..."
"""
import sys

from gen import ROOT, STYLE_REF, generate

FLAT_BG = "on a flat, solid, bright green background (#00ff00), no floor, no shadow, no other objects"

if len(sys.argv) < 3:
    sys.exit("usage: gen_character.py <name> <description>")
name, description = sys.argv[1], " ".join(sys.argv[2:])
out = ROOT / "design/characters" / f"{name}.png"
if out.exists():
    sys.exit(f"{out} exists; delete it to regenerate")
prompt = (
    f"Character sheet for {name}: {description}. Full figure, standing, facing the "
    f"viewer, neutral friendly expression, arms relaxed, centred, {FLAT_BG}."
)
print(generate(prompt, [STYLE_REF], out, aspect="3:4"))
