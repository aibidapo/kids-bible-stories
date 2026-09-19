"""Generate one character sheet: the consistency anchor for every scene.

    python design/pipeline/gen_character.py daniel "a kind man in his forties ..." [--size=2K]
"""
import sys

from gen import ROOT, STYLE_REF, generate

FLAT_BG = "on a flat, solid, bright green background (#00ff00), no floor, no shadow, no other objects"

if len(sys.argv) < 3:
    sys.exit("usage: gen_character.py <name> <description>")
args = [a for a in sys.argv[1:] if not a.startswith("--size=")]
size = next((a.split("=", 1)[1] for a in sys.argv[1:] if a.startswith("--size=")), "1K")
name, description = args[0], " ".join(args[1:])
out = ROOT / "design/characters" / f"{name}.png"
if out.exists():
    sys.exit(f"{out} exists; delete it to regenerate")
prompt = (
    f"Character sheet for {name}: {description}. Full figure, standing, facing the "
    f"viewer, neutral friendly expression, arms relaxed, centred, {FLAT_BG}."
)
print(generate(prompt, [STYLE_REF], out, aspect="3:4", size=size))
