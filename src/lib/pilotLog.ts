/**
 * Group pilot usage counts. Off unless a grown-up switches it on in
 * Settings. Counts only: which pages were opened, which hotspots found,
 * which quizzes finished, which Family time cards opened, per day. No
 * identities, no times of day, no free text, and nothing leaves the device
 * unless the leader copies the export text out by hand. Separate storage
 * key from progress so clearing one never touches the other.
 */

export type PilotEvent = "page" | "hotspot" | "quiz" | "family";

export interface PilotCount {
  day: string;
  kind: PilotEvent;
  key: string;
  count: number;
}

const KEY = "bible-adventures:pilot-log:v1";
const KINDS: PilotEvent[] = ["page", "hotspot", "quiz", "family"];

interface Stored {
  enabled: boolean;
  /** day -> kind -> key -> count, in insertion order. */
  days: Record<string, Partial<Record<PilotEvent, Record<string, number>>>>;
}

function load(): Stored {
  try {
    const raw = typeof localStorage === "undefined" ? null : localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stored>;
      return { enabled: !!parsed.enabled, days: parsed.days ?? {} };
    }
  } catch {
    // Unreadable or missing storage: start empty, never throw into the app.
  }
  return { enabled: false, days: {} };
}

let state: Stored = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Full quota or private browsing: the count is kept for this session only.
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isEnabled(): boolean {
  return state.enabled;
}

export function setEnabled(enabled: boolean) {
  state = { ...state, enabled };
  save();
}

export function record(kind: PilotEvent, key: string) {
  if (!state.enabled) return;
  const day = today();
  const byKind = (state.days[day] ??= {});
  const byKey = (byKind[kind] ??= {});
  byKey[key] = (byKey[key] ?? 0) + 1;
  save();
}

/** Every count, oldest day first, kinds in a fixed order, keys as first seen. */
export function summary(): PilotCount[] {
  const out: PilotCount[] = [];
  for (const day of Object.keys(state.days).sort()) {
    const byKind = state.days[day];
    for (const kind of KINDS) {
      const byKey = byKind[kind];
      if (!byKey) continue;
      for (const [key, count] of Object.entries(byKey)) out.push({ day, kind, key, count });
    }
  }
  return out;
}

/** Tab-separated text a leader can paste into an email. */
export function exportText(): string {
  const lines = ["Bible Adventures group pilot log", "day\tevent\twhat\tcount"];
  for (const c of summary()) lines.push(`${c.day}\t${c.kind}\t${c.key}\t${c.count}`);
  return lines.join("\n");
}

/** Empties the log and switches recording off. */
export function clear() {
  state = { enabled: false, days: {} };
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to remove, or no storage.
  }
}
