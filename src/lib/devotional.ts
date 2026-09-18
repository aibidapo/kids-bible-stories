import type { AgeMode, Story } from "../types";

/** Section headings of the Family time card, in reading order. */
export const FAMILY_HEADINGS = {
  talk: "Talk about it",
  pray: "Pray together",
  remember: "Remember",
  activity: "Try this",
} as const;

/**
 * The whole Family time card as one spoken script, headings included, so a
 * grown-up can press Read to me once. Pure: no DOM, no store.
 */
export function readAloudScript(story: Story, mode: AgeMode): string {
  const d = story.devotional;
  const parts: string[] = [
    `${FAMILY_HEADINGS.talk}. ${d.question[mode]}`,
    `${FAMILY_HEADINGS.pray}. ${d.prayer[mode]}`,
  ];
  if (story.memoryVerse) {
    parts.push(
      `${FAMILY_HEADINGS.remember}. ${story.memoryVerse.text} ${story.memoryVerse.reference}.`,
    );
  }
  parts.push(`${FAMILY_HEADINGS.activity}. ${d.activity}`);
  return parts.join(" ");
}
