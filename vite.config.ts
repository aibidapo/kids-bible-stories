import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { collectStoryAssets, storyOf, type BundleLike } from "./scripts/lib/story-assets";

/**
 * The first story in the library is precached with the app shell; every other
 * story is downloaded on demand (see src/lib/downloads.ts). Keep this in step
 * with the first entry of STORIES in src/data/stories.ts.
 */
const FIRST_STORY = "creation";

/** Which story a built file belongs to, from the source path of the asset or the chunk's scene module. */
function storyOfAsset(originalFileNames: readonly string[] | undefined): string | undefined {
  const src = (originalFileNames?.[0] ?? "").split("\\").join("/");
  const m = src.match(/src\/assets\/scenes\/([a-z-]+)\//);
  return m ? m[1] : undefined;
}

/** Emits story-assets.json: the files each downloadable story needs, derived from the bundle graph. */
function storyAssetsPlugin(): Plugin {
  return {
    name: "story-assets",
    generateBundle(_options, bundle) {
      const manifest = collectStoryAssets(bundle as unknown as BundleLike, FIRST_STORY);
      this.emitFile({
        type: "asset",
        fileName: "story-assets.json",
        source: JSON.stringify(manifest),
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    storyAssetsPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"],
      manifest: {
        name: "Bible Adventures for Kids",
        short_name: "Bible Adventures",
        description:
          "Interactive, illustrated Bible stories children can tap, watch and read along with.",
        theme_color: "#2b1b56",
        background_color: "#2b1b56",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        scope: "/",
        categories: ["education", "kids"],
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // The shell, the covers, story-assets.json and the first story are precached.
        globPatterns: ["**/*.{js,css,html,svg,png,webp,woff2,json}"],
        // Every other story's files are fetched on demand and kept in the "stories" cache,
        // which is the same cache the library's Download button fills.
        globIgnores: ["assets/stories/**"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes("/assets/stories/"),
            handler: "CacheFirst",
            options: { cacheName: "stories" },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // A story's art and chunk live under assets/stories/<id>/ so the precache
        // can leave them out; the first story's files stay in assets/ with the shell.
        assetFileNames: (info) => {
          const story = storyOfAsset(info.originalFileNames);
          return story && story !== FIRST_STORY
            ? `assets/stories/${story}/[name]-[hash][extname]`
            : "assets/[name]-[hash][extname]";
        },
        chunkFileNames: (info) => {
          const story = storyOf(info.facadeModuleId);
          return story && story !== FIRST_STORY
            ? `assets/stories/${story}/scene-[hash].js`
            : "assets/[name]-[hash].js";
        },
      },
    },
  },
});
