import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { daniel } from "../data/stories/daniel";

async function render(mode: "little" | "big") {
  vi.resetModules();
  const store = await import("../lib/store");
  store.setMode(mode);
  const { FamilyTime } = await import("./FamilyTime");
  return renderToStaticMarkup(<FamilyTime story={daniel} onDone={() => {}} />);
}

afterEach(() => vi.unstubAllGlobals());

describe("FamilyTime", () => {
  it("shows the four sections with the little-level text and the verse", async () => {
    const html = await render("little");
    for (const h of ["Talk about it", "Pray together", "Remember", "Try this"]) {
      expect(html, h).toContain(h);
    }
    expect(html).toContain(daniel.devotional.question.little);
    expect(html).toContain(daniel.devotional.prayer.little);
    expect(html).not.toContain(daniel.devotional.question.big);
    expect(html).toContain(daniel.memoryVerse!.text);
    expect(html).toContain(daniel.memoryVerse!.reference);
    expect(html).toContain(daniel.devotional.activity);
    expect(html).toContain(daniel.title);
    expect(html).toMatch(/Done/);
  });

  it("swaps to the big-level question and prayer", async () => {
    const html = await render("big");
    expect(html).toContain(daniel.devotional.question.big);
    expect(html).toContain(daniel.devotional.prayer.big);
    expect(html).not.toContain(daniel.devotional.question.little);
  });

  it("offers Read to me only when speech is available", async () => {
    const without = await render("little");
    expect(without).not.toContain("Read this to me");
    vi.stubGlobal("window", {
      speechSynthesis: {
        getVoices: () => [],
        addEventListener() {},
        removeEventListener() {},
        cancel() {},
      },
    });
    const withSpeech = await render("little");
    expect(withSpeech).toContain("Read this to me");
  });
});
