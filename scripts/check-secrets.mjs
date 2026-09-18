/**
 * Staged-secret scan for the pre-commit hook. Reads the added lines of the
 * staged diff and refuses the commit if any match a credential shape. A line
 * that is a known false positive carries the pragma `secret-ok` and is
 * skipped; the pragma must be on the same line, never in a baseline file.
 *
 * Regex shapes only: this catches the common token formats, not high-entropy
 * strings in general. Say so wherever this gate is cited as evidence.
 */
import { execFileSync } from "node:child_process";

const PATTERNS = [
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["GitHub token", /\bgh[pousr]_[0-9A-Za-z]{36,}\b/],
  ["Slack token", /\bxox[abpr]-[0-9A-Za-z-]{10,}\b/],
  ["OpenAI-style key", /\bsk-[0-9A-Za-z]{20,}\b/],
  ["private key block", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["password assignment", /\b(?:password|passwd|pwd)\s*[:=]\s*["'][^"']{6,}["']/i],
  ["bearer token", /\bBearer\s+[0-9A-Za-z._-]{20,}\b/],
];

const diff = execFileSync("git", ["diff", "--cached", "--unified=0", "--no-color"], {
  encoding: "utf8",
});
const findings = [];
let file = "";
let line = 0;
for (const raw of diff.split("\n")) {
  if (raw.startsWith("+++ b/")) {
    file = raw.slice(6);
    continue;
  }
  const hunk = /^@@ -[\d,]+ \+(\d+)/.exec(raw);
  if (hunk) {
    line = Number(hunk[1]);
    continue;
  }
  if (!raw.startsWith("+") || raw.startsWith("+++")) continue;
  const text = raw.slice(1);
  const current = line++;
  if (text.includes("secret-ok")) continue;
  for (const [name, re] of PATTERNS) {
    if (re.test(text)) findings.push(`${file}:${current}: ${name}`);
  }
}

if (findings.length) {
  console.error(`check-secrets: ${findings.length} finding(s) in staged changes`);
  for (const f of findings) console.error(" -", f);
  console.error("Mark a confirmed false positive with `secret-ok` on the same line.");
  process.exit(1);
}
console.log("check-secrets: staged changes clean");
