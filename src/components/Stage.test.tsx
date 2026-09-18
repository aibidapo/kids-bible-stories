import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Stage } from "./Stage";
import { daniel } from "../data/stories/daniel";

describe("Stage", () => {
  const scene = daniel.scenes.find((s) => s.id === "den")!;

  it("draws the hotspots inside a layer glued to the art's rendered box", () => {
    const html = renderToStaticMarkup(
      <Stage storyId="daniel" scene={scene} onSticker={() => {}} />,
    );
    const layer = /<div class="stage__spots">([\s\S]*?)<\/div>/.exec(html);
    expect(layer, "stage__spots layer").not.toBeNull();
    const spots = (layer![1].match(/class="hotspot(?: |")/g) ?? []).length;
    expect(spots).toBe(scene.hotspots!.length);
    for (const h of scene.hotspots!) {
      expect(layer![1]).toContain(`left:${h.x}%`);
      expect(layer![1]).toContain(`top:${h.y}%`);
    }
  });

  it("keeps the picture as a 1000x625 viewBox drawn with slice", () => {
    const html = renderToStaticMarkup(
      <Stage storyId="daniel" scene={scene} onSticker={() => {}} />,
    );
    expect(html).toContain('viewBox="0 0 1000 625"');
    expect(html).toContain('preserveAspectRatio="xMidYMax slice"');
  });
});
