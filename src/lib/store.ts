import { useSyncExternalStore } from "react";
import type { AgeMode } from "../types";

const KEY = "bible-adventures:v1";

export interface Progress {
  mode: AgeMode;
  /** Reduced motion, chosen explicitly by a grown-up or inherited from the OS. */
  calm: boolean;
  muted: boolean;
  /** Narration on by default for little readers, off for big ones. */
  narrate: boolean;
  /** storyId -> sceneId -> hotspot ids the child has tapped. */
  found: Record<string, Record<string, string[]>>;
  /** Sticker names, in the order they were earned. */
  stickers: string[];
  /** Story ids the child has read all the way to the end. */
  completed: string[];
  /** storyId -> best number of quiz questions answered right first time. */
  quizBest: Record<string, number>;
}

function systemPrefersCalm(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function blank(): Progress {
  return {
    mode: "little",
    calm: systemPrefersCalm(),
    muted: false,
    narrate: true,
    found: {},
    stickers: [],
    completed: [],
    quizBest: {},
  };
}

function load(): Progress {
  if (typeof localStorage === "undefined") return blank();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    // Merge onto a blank record so a save written by an older version still loads.
    return { ...blank(), ...(JSON.parse(raw) as Partial<Progress>) };
  } catch {
    return blank();
  }
}

let state: Progress = load();
const listeners = new Set<() => void>();

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private browsing, or a full quota. The app keeps working for this session.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return state;
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

export function setMode(mode: AgeMode) {
  state = { ...state, mode };
  emit();
}

export function setCalm(calm: boolean) {
  state = { ...state, calm };
  emit();
}

export function setMutedPref(muted: boolean) {
  state = { ...state, muted };
  emit();
}

export function setNarrate(narrate: boolean) {
  state = { ...state, narrate };
  emit();
}

/** Records a tap and returns the sticker earned, if this was the first time. */
export function recordFound(
  storyId: string,
  sceneId: string,
  hotspotId: string,
  sticker?: string,
): string | null {
  const story = state.found[storyId] ?? {};
  const scene = story[sceneId] ?? [];
  if (scene.includes(hotspotId)) return null;

  const isNewSticker = !!sticker && !state.stickers.includes(sticker);
  state = {
    ...state,
    found: {
      ...state.found,
      [storyId]: { ...story, [sceneId]: [...scene, hotspotId] },
    },
    stickers: isNewSticker ? [...state.stickers, sticker] : state.stickers,
  };
  emit();
  return isNewSticker ? sticker : null;
}

export function foundIn(p: Progress, storyId: string, sceneId: string): string[] {
  return p.found[storyId]?.[sceneId] ?? [];
}

export function markCompleted(storyId: string) {
  if (state.completed.includes(storyId)) return;
  state = { ...state, completed: [...state.completed, storyId] };
  emit();
}

export function recordQuiz(storyId: string, score: number) {
  if ((state.quizBest[storyId] ?? -1) >= score) return;
  state = { ...state, quizBest: { ...state.quizBest, [storyId]: score } };
  emit();
}

export function resetProgress() {
  state = {
    ...blank(),
    mode: state.mode,
    calm: state.calm,
    muted: state.muted,
    narrate: state.narrate,
  };
  emit();
}
