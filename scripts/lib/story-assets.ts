/**
 * Which files each downloadable story needs, read from the build's own
 * bundle graph rather than a hand-kept list: a story's chunk, every asset
 * that chunk imports (including art borrowed from another story), and the
 * assets of any shared chunk it imports. The entry chunk is left out because
 * the app shell is always precached.
 */

export interface ChunkLike {
  type: "chunk";
  fileName: string;
  facadeModuleId: string | null;
  imports: string[];
  viteMetadata?: { importedAssets: Set<string> };
  code: string;
}
export interface AssetLike {
  type: "asset";
  fileName: string;
  source: string | Uint8Array;
}
export type BundleLike = Record<string, ChunkLike | AssetLike>;

export interface StoryAssets {
  /** Root-relative URLs, sorted. */
  files: string[];
  /** Total size on disk, for the quota check. */
  bytes: number;
}
export type StoryAssetsManifest = Record<string, StoryAssets>;

/** The story id a scene module belongs to, from its source path. */
export function storyOf(facadeModuleId: string | null | undefined): string | undefined {
  if (!facadeModuleId) return undefined;
  const m = facadeModuleId
    .split("\\")
    .join("/")
    .match(/\/src\/scenes\/([a-z-]+)\.tsx$/);
  return m ? m[1] : undefined;
}

function isEntry(chunk: ChunkLike): boolean {
  return /\.html$/.test(chunk.facadeModuleId ?? "");
}

function sizeOf(item: ChunkLike | AssetLike): number {
  if (item.type === "chunk") return Buffer.byteLength(item.code);
  return typeof item.source === "string" ? Buffer.byteLength(item.source) : item.source.byteLength;
}

export function collectStoryAssets(bundle: BundleLike, firstStory: string): StoryAssetsManifest {
  const out: StoryAssetsManifest = {};
  for (const item of Object.values(bundle)) {
    if (item.type !== "chunk") continue;
    const story = storyOf(item.facadeModuleId);
    if (!story || story === firstStory) continue;

    const files = new Set<string>();
    const seen = new Set<string>();
    const walk = (name: string) => {
      if (seen.has(name)) return;
      seen.add(name);
      const chunk = bundle[name];
      if (!chunk || chunk.type !== "chunk" || isEntry(chunk)) return;
      files.add(chunk.fileName);
      for (const a of chunk.viteMetadata?.importedAssets ?? []) files.add(a);
      for (const dep of chunk.imports) walk(dep);
    };
    walk(item.fileName);

    let bytes = 0;
    for (const f of files) {
      const entry = bundle[f];
      if (entry) bytes += sizeOf(entry);
    }
    out[story] = { files: [...files].sort().map((f) => `/${f}`), bytes };
  }
  return out;
}
