"""Checks every scene manifest against the style bible's forbidden words.

    python design/pipeline/check_prompts.py

No API call. Exit 1 with one line per offending prompt.
"""
import json
import sys
from pathlib import Path

from gen import ROOT, check_prompt

bad = 0
for path in sorted((ROOT / "design/pipeline/scenes").glob("*.json")):
    m = json.loads(path.read_text(encoding="utf-8"))
    prompts = [
        (name, spec["prompt"])
        for name, spec in [("background", m.get("background", {})), *m.get("cutouts", {}).items()]
        if "prompt" in spec
    ]
    for name, prompt in prompts:
        words = check_prompt(prompt)
        if words:
            bad += 1
            print(f"{path.name} {name}: {', '.join(words)}")
print(f"check_prompts: {bad} offending prompt(s)" if bad else "check_prompts: all manifests clean")
sys.exit(1 if bad else 0)
