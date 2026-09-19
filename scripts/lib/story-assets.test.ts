import { describe, expect, it } from "vitest";
import { collectStoryAssets, storyOf, type BundleLike } from "./story-assets";

function chunk(fileName: string, facade: string | null, imports: string[], assets: string[]) {
  return {
    type: "chunk" as const,
    fileName,
    facadeModuleId: facade,
    imports,
    viteMetadata: { importedAssets: new Set(assets) },
    code: "x".repeat(100),
  };
}
function asset(fileName: string, bytes: number) {
  return { type: "asset" as const, fileName, source: new Uint8Array(bytes) };
}

const bundle: BundleLike = {
  "assets/index-1.js": chunk("assets/index-1.js", "C:/app/index.html", [], []),
  "assets/stories/storm/scene-2.js": chunk(
    "assets/stories/storm/scene-2.js",
    String.raw`C:\app\src\scenes\storm.tsx`,
    ["assets/index-1.js", "assets/wave-3.js"],
    ["assets/stories/storm/bg-a.webp", "assets/stories/david/bird-b.webp"],
  ),
  "assets/wave-3.js": chunk("assets/wave-3.js", null, [], ["assets/stories/jonah/wave-c.webp"]),
  "assets/scene-creation-4.js": chunk(
    "assets/scene-creation-4.js",
    "/app/src/scenes/creation.tsx",
    ["assets/index-1.js"],
    ["assets/bg-d.webp"],
  ),
  "assets/stories/storm/bg-a.webp": asset("assets/stories/storm/bg-a.webp", 1000),
  "assets/stories/david/bird-b.webp": asset("assets/stories/david/bird-b.webp", 200),
  "assets/stories/jonah/wave-c.webp": asset("assets/stories/jonah/wave-c.webp", 300),
  "assets/bg-d.webp": asset("assets/bg-d.webp", 50),
};

describe("storyOf", () => {
  it("reads the story id from a scene module path on either slash", () => {
    expect(storyOf(String.raw`C:\app\src\scenes\storm.tsx`)).toBe("storm");
    expect(storyOf("/app/src/scenes/creation.tsx")).toBe("creation");
    expect(storyOf("/app/src/art/raster.tsx")).toBeUndefined();
    expect(storyOf(null)).toBeUndefined();
  });
});

describe("collectStoryAssets", () => {
  it("lists a story's chunk, its own art, art borrowed from other stories and art reached through shared chunks", () => {
    const out = collectStoryAssets(bundle, "creation");
    expect(Object.keys(out)).toEqual(["storm"]);
    expect(out.storm.files).toEqual([
      "/assets/stories/david/bird-b.webp",
      "/assets/stories/jonah/wave-c.webp",
      "/assets/stories/storm/bg-a.webp",
      "/assets/stories/storm/scene-2.js",
    ]);
    // 1000 + 200 + 300 art bytes + the 100-byte scene chunk; the shared wave chunk is precached
    expect(out.storm.bytes).toBe(1600);
  });

  it("leaves the first story out because its files are precached", () => {
    expect(collectStoryAssets(bundle, "creation").creation).toBeUndefined();
    expect(Object.keys(collectStoryAssets(bundle, "storm"))).toEqual(["creation"]);
  });

  it("counts string sources, skips a chunk without metadata and a dependency missing from the bundle", () => {
    const odd: BundleLike = {
      "assets/stories/noah/scene-9.js": {
        type: "chunk",
        fileName: "assets/stories/noah/scene-9.js",
        facadeModuleId: "/app/src/scenes/noah.tsx",
        imports: ["assets/gone.js", "assets/a-5.js", "assets/b-6.js"],
        code: "abc",
      },
      // Two shared chunks that both import a third: the walk must visit it once.
      "assets/a-5.js": chunk("assets/a-5.js", null, ["assets/c-7.js"], []),
      "assets/b-6.js": chunk("assets/b-6.js", null, ["assets/c-7.js"], []),
      "assets/c-7.js": chunk(
        "assets/c-7.js",
        null,
        [],
        ["assets/stories/noah/note.json", "assets/lost.webp"],
      ),
      "assets/stories/noah/note.json": {
        type: "asset",
        fileName: "assets/stories/noah/note.json",
        source: "{}",
      },
    };
    const out = collectStoryAssets(odd, "creation");
    expect(out.noah.files).toEqual([
      "/assets/stories/noah/note.json",
      "/assets/stories/noah/scene-9.js",
    ]);
    // 3 (scene) + 2 (the json); shared chunks and the lost asset outside the stories folder are not listed
    expect(out.noah.bytes).toBe(5);
  });

  it("does not list the entry chunk, precached shared chunks or the same file twice", () => {
    const out = collectStoryAssets(bundle, "creation");
    expect(out.storm.files).not.toContain("/assets/index-1.js");
    expect(out.storm.files).not.toContain("/assets/wave-3.js");
    expect(new Set(out.storm.files).size).toBe(out.storm.files.length);
  });
});
