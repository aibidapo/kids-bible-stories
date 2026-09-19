import type { SceneArt } from "../types";

type SceneModule = { SCENES: Record<string, SceneArt> };

/**
 * One loader per story. Each is a dynamic import, so Vite emits one chunk per
 * story and the story's art only reaches the device when the story is opened
 * or downloaded (see `src/lib/downloads.ts`). A new story is one line here
 * plus a `SCENES` export in its module.
 */
const STORY_MODULES: Record<string, () => Promise<SceneModule>> = {
  creation: () => import("./creation"),
  noah: () => import("./noah"),
  david: () => import("./david"),
  jonah: () => import("./jonah"),
  daniel: () => import("./daniel"),
  christmas: () => import("./christmas"),
  storm: () => import("./storm"),
};

/** Art by key, filled as story modules load. Story data refers to art by these string keys. */
export const SCENE_ART: Record<string, SceneArt> = {};

const loaded = new Map<string, Promise<void>>();

/** Loads a story's scene module once and registers its art. Rejects for an unknown story or when the chunk cannot be fetched. */
export function loadStory(storyId: string): Promise<void> {
  const pending = loaded.get(storyId);
  if (pending) return pending;
  const loader = Object.prototype.hasOwnProperty.call(STORY_MODULES, storyId)
    ? STORY_MODULES[storyId]
    : undefined;
  if (!loader) return Promise.reject(new Error(`unknown story: ${storyId}`));
  const p = loader().then((m) => {
    Object.assign(SCENE_ART, m.SCENES);
  });
  p.catch(() => loaded.delete(storyId));
  loaded.set(storyId, p);
  return p;
}

/** Every story at once, for scripts and tests. */
export async function loadAllStories(): Promise<void> {
  await Promise.all(Object.keys(STORY_MODULES).map(loadStory));
}

export function getSceneArt(key: string): SceneArt | undefined {
  // Own-property check so a key like "constructor" cannot reach the prototype.
  return Object.prototype.hasOwnProperty.call(SCENE_ART, key) ? SCENE_ART[key] : undefined;
}
