import { afterEach, describe, expect, it, vi } from "vitest";

function fakeStorage(initial: Record<string, string> = {}, throwOnSet = false) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (throwOnSet) throw new Error("QuotaExceededError");
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
    data,
  };
}

async function fresh(storage?: ReturnType<typeof fakeStorage>) {
  vi.resetModules();
  if (storage) vi.stubGlobal("localStorage", storage);
  return import("./pilotLog");
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("pilotLog", () => {
  it("is off by default and records nothing until enabled", async () => {
    const storage = fakeStorage();
    const log = await fresh(storage);
    expect(log.isEnabled()).toBe(false);
    log.record("page", "daniel/0");
    expect(log.summary()).toEqual([]);
    expect(storage.data.size).toBe(0);
  });

  it("counts events per kind, key and day once enabled", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-04T10:00:00Z"));
    const log = await fresh(fakeStorage());
    log.setEnabled(true);
    log.record("page", "daniel/0");
    log.record("page", "daniel/0");
    log.record("hotspot", "daniel/den/king");
    vi.setSystemTime(new Date("2026-10-05T10:00:00Z"));
    log.record("quiz", "daniel");
    expect(log.summary()).toEqual([
      { day: "2026-10-04", kind: "page", key: "daniel/0", count: 2 },
      { day: "2026-10-04", kind: "hotspot", key: "daniel/den/king", count: 1 },
      { day: "2026-10-05", kind: "quiz", key: "daniel", count: 1 },
    ]);
  });

  it("persists across a reload and exports plain text a leader can paste", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-04T10:00:00Z"));
    const storage = fakeStorage();
    let log = await fresh(storage);
    log.setEnabled(true);
    log.record("family", "noah");
    log = await fresh(storage);
    expect(log.isEnabled()).toBe(true);
    const text = log.exportText();
    expect(text).toContain("Bible Adventures group pilot log");
    expect(text).toContain("2026-10-04\tfamily\tnoah\t1");
    expect(text).not.toMatch(/\d{2}:\d{2}/);
  });

  it("clear empties the log and switches it off", async () => {
    const storage = fakeStorage();
    const log = await fresh(storage);
    log.setEnabled(true);
    log.record("page", "david/1");
    log.clear();
    expect(log.summary()).toEqual([]);
    expect(log.isEnabled()).toBe(false);
    expect(storage.data.size).toBe(0);
  });

  it("never throws when storage is missing or full", async () => {
    let log = await fresh();
    expect(() => {
      log.setEnabled(true);
      log.record("page", "x/0");
      log.exportText();
    }).not.toThrow();
    log = await fresh(fakeStorage({}, true));
    expect(() => {
      log.setEnabled(true);
      log.record("page", "x/0");
    }).not.toThrow();
  });
});

describe("pilotLog with a damaged save", () => {
  it("starts empty and off when the stored JSON is unreadable", async () => {
    const log = await fresh(fakeStorage({ "bible-adventures:pilot-log:v1": "{not json" }));
    expect(log.isEnabled()).toBe(false);
    expect(log.summary()).toEqual([]);
  });
});
