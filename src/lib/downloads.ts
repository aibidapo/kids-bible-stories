import { useSyncExternalStore } from "react";

/**
 * Which stories are on this device.
 *
 * The first story ships with the app shell; every other story's chunk and art
 * live under assets/stories/<id>/ and reach the device either as pages are
 * viewed online (the service worker keeps them) or through the library's
 * Download button, which fetches the whole list here. Both write to the same
 * cache, named below, so the service worker serves downloaded files offline.
 * The list of files per story comes from story-assets.json, written by the
 * build from the bundle graph.
 */

/** Must match the runtime cache name in vite.config.ts. */
export const STORIES_CACHE = "stories";
/**
 * A chunk fetched by the browser as a module carries an Origin header and the
 * server answers with `Vary: Origin`; a bare-URL match would then miss it. The
 * files are immutable and hashed, so the URL alone identifies them. The
 * service worker's route ignores Vary for the same reason.
 */
const MATCH: CacheQueryOptions = { ignoreVary: true };
const IN_FLIGHT = 4;

export interface StoryAssets {
  files: string[];
  bytes: number;
}
export type StoryAssetsManifest = Record<string, StoryAssets>;

export type DownloadStatus =
  | "builtin"
  | "unknown"
  | "none"
  | "partial"
  | "downloading"
  | "ready"
  | "no-space"
  | "error"
  | "unsupported";

export interface DownloadState {
  status: DownloadStatus;
  /** Files on the device, out of `total`. */
  done: number;
  total: number;
}

let state: Record<string, DownloadState> = {};
let manifest: StoryAssetsManifest = {};
let builtin = "";
let manifestPromise: Promise<StoryAssetsManifest> | undefined;
/** Stories with a download running, held synchronously so a second tap during the checks is ignored. */
const inFlight = new Set<string>();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function set(storyId: string, next: DownloadState) {
  state = { ...state, [storyId]: next };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const snapshot = () => state;

export function useDownloads(): Record<string, DownloadState> {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** Test seam. */
export function resetDownloads() {
  state = {};
  manifest = {};
  builtin = "";
  manifestPromise = undefined;
  inFlight.clear();
}

/** none / partial / ready from which of a story's files the cache holds. */
export function summarize(hits: boolean[]): "none" | "partial" | "ready" {
  const n = hits.filter(Boolean).length;
  if (n === hits.length) return "ready";
  return n === 0 ? "none" : "partial";
}

/** True unless the browser reports less free space than the story needs. A missing estimate allows the download. */
export function hasSpace(estimate: StorageEstimate | undefined, bytes: number): boolean {
  if (!estimate || estimate.quota === undefined || estimate.usage === undefined) return true;
  return estimate.quota - estimate.usage >= bytes;
}

function cacheApi(): CacheStorage | undefined {
  return typeof caches === "undefined" ? undefined : caches;
}

function entry(storyId: string): StoryAssets | undefined {
  return Object.prototype.hasOwnProperty.call(manifest, storyId) ? manifest[storyId] : undefined;
}

/** Reads story-assets.json once. An unreadable file (offline on a stale shell) yields an empty list. */
export function loadManifest(): Promise<StoryAssetsManifest> {
  if (!manifestPromise) {
    manifestPromise = fetch(`${import.meta.env.BASE_URL}story-assets.json`)
      .then((r) => (r.ok ? (r.json() as Promise<StoryAssetsManifest>) : {}))
      .catch(() => ({}));
  }
  return manifestPromise;
}

/** Re-reads the cache for every story in the manifest. `firstStory` is always built in. */
export async function refresh(next: StoryAssetsManifest, firstStory: string): Promise<void> {
  manifest = next;
  builtin = firstStory;
  const api = cacheApi();
  const cache = api ? await api.open(STORIES_CACHE) : undefined;
  const result: Record<string, DownloadState> = {
    [firstStory]: { status: "builtin", done: 0, total: 0 },
  };
  for (const [id, story] of Object.entries(manifest)) {
    if (!cache) {
      result[id] = { status: "unsupported", done: 0, total: story.files.length };
      continue;
    }
    const hits = await Promise.all(
      story.files.map(async (f) => Boolean(await cache.match(f, MATCH))),
    );
    result[id] = {
      status: summarize(hits),
      done: hits.filter(Boolean).length,
      total: story.files.length,
    };
  }
  state = result;
  emit();
}

/** Re-reads the cache with the manifest already loaded; the library calls this when it opens, since pages read online land in the cache too. */
export function rescan(): Promise<void> {
  return builtin ? refresh(manifest, builtin) : Promise.resolve();
}

async function fetchInto(cache: Cache, url: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  await cache.put(url, res);
}

/** Fetches every file the story needs into the stories cache, a few at a time, updating progress. */
export async function download(storyId: string): Promise<void> {
  const story = entry(storyId);
  const current = state[storyId];
  if (!story || !current || inFlight.has(storyId) || current.status === "builtin") return;
  inFlight.add(storyId);
  try {
    await run(storyId, story, current);
  } finally {
    inFlight.delete(storyId);
  }
}

async function run(storyId: string, story: StoryAssets, current: DownloadState): Promise<void> {
  const api = cacheApi();
  if (!api) {
    set(storyId, { ...current, status: "unsupported" });
    return;
  }
  const storage = navigator.storage;
  const estimate = storage?.estimate ? await storage.estimate().catch(() => undefined) : undefined;
  if (!hasSpace(estimate, story.bytes)) {
    set(storyId, { ...current, status: "no-space" });
    return;
  }
  // Ask the browser to keep the site's storage; a refusal is not an error.
  void storage?.persist?.().catch(() => false);

  const cache = await api.open(STORIES_CACHE);
  const missing: string[] = [];
  for (const f of story.files) if (!(await cache.match(f, MATCH))) missing.push(f);
  let done = story.files.length - missing.length;
  set(storyId, { status: "downloading", done, total: story.files.length });

  const queue = [...missing];
  const worker = async () => {
    for (let url = queue.shift(); url !== undefined; url = queue.shift()) {
      await fetchInto(cache, url);
      done += 1;
      set(storyId, { status: "downloading", done, total: story.files.length });
    }
  };
  try {
    await Promise.all(Array.from({ length: Math.min(IN_FLIGHT, queue.length) }, worker));
    set(storyId, { status: "ready", done, total: story.files.length });
  } catch {
    set(storyId, { status: "error", done, total: story.files.length });
  }
}
