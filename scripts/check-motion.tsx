/**
 * Mechanical check for the two hard constraints in CLAUDE.md, run on every
 * registered scene's static markup:
 *
 * 1. No element carries both an `a-*` class and a `transform` attribute
 *    (the CSS animation would override the attribute and collapse the element).
 * 2. No inline `transform-origin` (pivots live in motion.css as percentages).
 *
 * Exit 1 with one line per offence. No browser, no sharp: fast enough for a
 * pre-commit hook.
 */
import { createElement } from "react";
import { SCENE_ART } from "../src/scenes/index";

// Production React skips the dev-only casing warnings for SVG elements like
// <linearGradient>, which would otherwise drown the report. react-dom picks
// its build when it loads, so set the flag before importing it.
process.env.NODE_ENV = "production";
const { renderToStaticMarkup } = await import("react-dom/server");

const tag = /<([a-zA-Z][\w-]*)\b([^>]*)>/g;
const offences: string[] = [];

for (const key of Object.keys(SCENE_ART)) {
  const html = renderToStaticMarkup(
    createElement(SCENE_ART[key], { active: true, animate: true, found: [] }),
  );
  for (const m of html.matchAll(tag)) {
    const attrs = m[2];
    const cls = /\bclass="([^"]*)"/.exec(attrs)?.[1] ?? "";
    const animated = cls.split(/\s+/).some((c) => c.startsWith("a-"));
    if (animated && /\btransform="/.test(attrs)) {
      offences.push(`${key}: <${m[1]} class="${cls}"> also has a transform attribute`);
    }
    if (/transform-origin\s*:/.test(attrs)) {
      offences.push(`${key}: <${m[1]}> has an inline transform-origin`);
    }
  }
}

if (offences.length) {
  console.error(`check-motion: ${offences.length} offence(s)`);
  for (const o of offences) console.error(" -", o);
  process.exit(1);
}
console.log(`check-motion: ${Object.keys(SCENE_ART).length} scenes clean`);
