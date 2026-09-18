import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NarrationText } from "./NarrationText";

const text = "Daniel loved God. He prayed.";

function activeWord(html: string): string | null {
  const m = /<span class="narration__word is-active">([^<]*)<\/span>/.exec(html);
  return m ? m[1].trim() : null;
}

describe("NarrationText", () => {
  it("lights the word the narrator has reached", () => {
    // "He" starts at offset 18; a boundary event lands on a word's first char.
    expect(
      activeWord(renderToStaticMarkup(<NarrationText text={text} charIndex={18} mode="big" />)),
    ).toBe("He");
    // Mid-word offsets still map to the word that has started.
    expect(
      activeWord(renderToStaticMarkup(<NarrationText text={text} charIndex={9} mode="big" />)),
    ).toBe("loved");
  });

  it("highlights nothing while silent", () => {
    expect(
      activeWord(renderToStaticMarkup(<NarrationText text={text} charIndex={-1} mode="big" />)),
    ).toBeNull();
  });

  it("carries the reading level as a class and keeps every word", () => {
    const html = renderToStaticMarkup(<NarrationText text={text} charIndex={-1} mode="little" />);
    expect(html).toContain('class="narration narration--little"');
    expect((html.match(/narration__word/g) ?? []).length).toBe(5);
  });
});
