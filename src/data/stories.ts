import type { Story } from "../types";
import { creation } from "./stories/creation";
import { noah } from "./stories/noah";
import { david } from "./stories/david";
import { jonah } from "./stories/jonah";
import { daniel } from "./stories/daniel";
import { christmas } from "./stories/christmas";

/** Library order. New stories are added here and nowhere else. */
export const STORIES: Story[] = [creation, noah, david, jonah, daniel, christmas];

export function getStory(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}

/** Total stickers available across the whole library, for the progress ring. */
export const TOTAL_STICKERS = STORIES.reduce(
  (n, s) =>
    n + s.scenes.reduce((m, sc) => m + (sc.hotspots?.filter((h) => h.sticker).length ?? 0), 0),
  0,
);
