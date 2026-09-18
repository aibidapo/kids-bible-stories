# Tablet Letterbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** No story-critical art is cut off on height-limited frames (tablet landscape, 1024×768 and similar); hotspots stay glued to the art on every frame shape.

**Architecture:** The stage frame keeps the art's aspect ratio by giving up width when height-limited (letterbox), so `slice` never crops in landscape. Hotspots move into a layer sized to the art's rendered box, so their percentages are art coordinates whether the frame crops (portrait) or not. CSS only, plus one wrapper element in `Stage.tsx`. No scene changes.

**Tech Stack:** CSS container queries (`container-type: size`, `cqh` units; Chrome 105+, Safari 16+; older browsers keep today's behaviour), React.

**Spec:** roadmap phase 2b in `docs/roadmap.md`, letterbox option chosen by the owner on 2026-09-18.

## Global Constraints

- Portrait phones keep the taller 4:3 frame and crop the sky, never the ground (existing rule).
- Tap targets ≥ 64 px.
- Hook gates pass; `check:motion` unaffected (no scene edits).
- Acceptance gate is the 27-page tablet re-shoot, not the code change.

## Roast (before code)

- **Architect (3):** `cqh` needs `.stage` to be a size container with a definite height. `.stage` is a flex item (`min-height: 0`) in the player column; if the column does not give it a definite height the container has no height and `160cqh` resolves to 0, collapsing the frame. Verify in the browser at both orientations before committing; fallback `width: 100%` must stay first in the cascade so unsupported browsers are unchanged.
- **Architect (3):** moving hotspots into a new layer changes the DOM the DevTools shoot script and any selectors rely on (`.hotspot` stays; only the parent changes). The bubble (`.stage__bubble`) is positioned in the frame; leave it.
- **Buyer (2):** letterboxing shrinks the picture on a tablet; bars are the page background, so it reads as a smaller framed picture, not black bars. Acceptable; the alternative (cropping heads) is worse.
- **CFO (1):** zero cost.
- **Verdict:** proceed-with-changes: browser-verify the container height first, keep the fallback.

### Task 1: Letterbox frame

**Files:** `src/styles/app.css` (`.stage`, `.stage__frame`, portrait override).

- [ ] `.stage { container-type: size; }` and `.stage__frame { width: min(100%, 160cqh); }` after the existing `width: 100%`; portrait override `width: min(100%, 133.34cqh)` (4:3).
- [ ] Browser at 1024×768: frame box is 16:10 (width ≈ height × 1.6), the whole viewBox visible, hotspot on the den king rings his head.
- [ ] Browser at 390×844: unchanged from today (frame 4:3, sides cropped).

### Task 2: Hotspot layer glued to the art

**Files:** `src/components/Stage.tsx`, `src/styles/app.css`.

- [ ] Wrap the hotspot buttons in `<div className="stage__spots">`; `.stage__frame { container-type: size; }`, `.stage__spots { position:absolute; top:0; bottom:0; left:50%; transform:translateX(-50%); width:max(100%, 160cqh); }`.
- [ ] Browser at 390×844: `.stage__spots` width equals frame height × 1.6; the den king's ring sits on the king (today it sits ~4 % off-centre on pages where the hotspot is near an edge).
- [ ] Unit: `Stage` render test (react-dom/server) asserts hotspots render inside `.stage__spots` with their percentages.

### Task 3: Gate and evidence

- [ ] `STORY=<id> BASE=http://localhost:4173 node scripts/shoot.mjs` for all five stories; review every `21-*-tablet.png` for heads and key props; keep the sheet.
- [ ] Evidence record `docs/evidence/2026-09-18-tablet-letterbox/record.md`; roadmap 2b status; handoff; commit through the hook; push.
