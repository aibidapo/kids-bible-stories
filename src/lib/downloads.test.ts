// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  STORIES_CACHE,
  download,
  hasSpace,
  loadManifest,
  refresh,
  resetDownloads,
  summarize,
  useDownloads,
  type StoryAssetsManifest,
} from "./downloads";

/** A Map-backed stand-in for the Cache API: enough for match, put, delete and keys. */
function fakeCaches() {
  const stores = new Map<string, Map<string, Response>>();
  const open = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name)!;
    return {
      match: async (url: string) => store.get(url),
      put: async (url: string, res: Response) => {
        store.set(url, res);
      },
      delete: async (url: string) => store.delete(url),
      keys: async () => [...store.keys()],
    };
  };
  return { open, stores };
}

const manifest: StoryAssetsManifest = {
  noah: {
    files: ["/assets/stories/noah/scene-1.js", "/assets/stories/noah/bg-2.webp"],
    bytes: 3000,
  },
  daniel: { files: ["/assets/stories/daniel/scene-3.js"], bytes: 1000 },
};

let caches: ReturnType<typeof fakeCaches>;
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  resetDownloads();
  caches = fakeCaches();
  Object.defineProperty(globalThis, "caches", {
    value: caches,
    configurable: true,
    writable: true,
  });
  fetchMock = vi.fn(async (url: string) => new Response(`body of ${url}`, { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  Object.defineProperty(navigator, "storage", {
    value: {
      estimate: async () => ({ usage: 1000, quota: 100_000 }),
      persist: async () => true,
    },
    configurable: true,
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
});

function state() {
  return renderHook(() => useDownloads()).result.current;
}

describe("useDownloads", () => {
  it("re-renders on changes and stops listening after unmount", async () => {
    const { result, unmount } = renderHook(() => useDownloads());
    expect(result.current).toEqual({});
    await act(() => refresh(manifest, "creation"));
    expect(result.current.noah.status).toBe("none");
    unmount();
    await act(() => refresh({}, "creation"));
    expect(result.current.noah.status).toBe("none");
  });
});

describe("summarize and hasSpace", () => {
  it("reads none, partial and ready from a list of cache hits", () => {
    expect(summarize([])).toBe("ready");
    expect(summarize([false, false])).toBe("none");
    expect(summarize([true, false])).toBe("partial");
    expect(summarize([true, true])).toBe("ready");
  });

  it("allows a download when the estimate is missing and refuses when the free quota is short", () => {
    expect(hasSpace(undefined, 5000)).toBe(true);
    expect(hasSpace({}, 5000)).toBe(true);
    expect(hasSpace({ usage: 1000, quota: 100_000 }, 5000)).toBe(true);
    expect(hasSpace({ usage: 99_000, quota: 100_000 }, 5000)).toBe(false);
  });
});

describe("refresh", () => {
  it("marks the first story built in, an unseen story none, a half-cached story partial and a full one ready", async () => {
    const cache = await caches.open(STORIES_CACHE);
    await cache.put("/assets/stories/noah/scene-1.js", new Response("x"));
    await cache.put("/assets/stories/daniel/scene-3.js", new Response("x"));
    await act(() => refresh(manifest, "creation"));
    const s = state();
    expect(s.creation).toEqual({ status: "builtin", done: 0, total: 0 });
    expect(s.noah).toEqual({ status: "partial", done: 1, total: 2 });
    expect(s.daniel).toEqual({ status: "ready", done: 1, total: 1 });
  });

  it("reports unsupported when the browser has no Cache API", async () => {
    Object.defineProperty(globalThis, "caches", { value: undefined, configurable: true });
    await act(() => refresh(manifest, "creation"));
    expect(state().noah.status).toBe("unsupported");
    expect(state().creation.status).toBe("builtin");
  });
});

describe("download", () => {
  it("fetches every file into the stories cache, counting progress, and ends ready", async () => {
    await act(() => refresh(manifest, "creation"));
    const seen: number[] = [];
    const { result } = renderHook(() => useDownloads());
    await act(async () => {
      const p = download("noah");
      seen.push(result.current.noah.done);
      await p;
    });
    expect(result.current.noah.status).toBe("ready");
    expect(result.current.noah.done).toBe(2);
    const store = caches.stores.get(STORIES_CACHE)!;
    expect([...store.keys()].sort()).toEqual([...manifest.noah.files].sort());
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("skips files already in the cache", async () => {
    const cache = await caches.open(STORIES_CACHE);
    await cache.put("/assets/stories/noah/scene-1.js", new Response("x"));
    await act(() => refresh(manifest, "creation"));
    await act(() => download("noah"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(state().noah.status).toBe("ready");
  });

  it("ends in error when a fetch fails or answers with a bad status, and can be retried", async () => {
    await act(() => refresh(manifest, "creation"));
    fetchMock.mockImplementationOnce(async () => new Response("nope", { status: 404 }));
    await act(() => download("noah"));
    expect(state().noah.status).toBe("error");
    fetchMock.mockImplementationOnce(async () => {
      throw new TypeError("network");
    });
    await act(() => download("noah"));
    expect(state().noah.status).toBe("error");
    await act(() => download("noah"));
    expect(state().noah.status).toBe("ready");
  });

  it("treats a failing storage estimate and a refused persist as unknown and downloads anyway", async () => {
    Object.defineProperty(navigator, "storage", {
      value: {
        estimate: async () => {
          throw new Error("no estimate");
        },
        persist: async () => {
          throw new Error("no persist");
        },
      },
      configurable: true,
    });
    await act(() => refresh(manifest, "creation"));
    await act(() => download("noah"));
    expect(state().noah.status).toBe("ready");
  });

  it("refuses when the reported free space is smaller than the story", async () => {
    Object.defineProperty(navigator, "storage", {
      value: { estimate: async () => ({ usage: 99_000, quota: 100_000 }) },
      configurable: true,
    });
    await act(() => refresh(manifest, "creation"));
    await act(() => download("noah"));
    expect(state().noah.status).toBe("no-space");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ignores a second tap while downloading, a built-in story and an unknown story", async () => {
    await act(() => refresh(manifest, "creation"));
    await act(async () => {
      const first = download("noah");
      await download("noah");
      await first;
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await act(() => download("creation"));
    await act(() => download("nope"));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does nothing without the Cache API", async () => {
    Object.defineProperty(globalThis, "caches", { value: undefined, configurable: true });
    await act(() => refresh(manifest, "creation"));
    await act(() => download("noah"));
    expect(state().noah.status).toBe("unsupported");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("loadManifest", () => {
  it("fetches story-assets.json under the base URL once and reuses it", async () => {
    fetchMock.mockImplementation(async () => new Response(JSON.stringify(manifest)));
    const a = await loadManifest();
    const b = await loadManifest();
    expect(a).toEqual(manifest);
    expect(b).toBe(a);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/story-assets\.json$/);
  });

  it("yields an empty manifest when the file cannot be read or answers with an error status", async () => {
    fetchMock.mockImplementation(async () => {
      throw new TypeError("offline");
    });
    expect(await loadManifest()).toEqual({});
    resetDownloads();
    fetchMock.mockImplementation(async () => new Response("gone", { status: 404 }));
    expect(await loadManifest()).toEqual({});
  });
});
