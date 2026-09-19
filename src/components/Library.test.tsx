// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Library } from "./Library";
import { STORIES, TOTAL_STICKERS } from "../data/stories";
import { markCompleted, recordFound, recordQuiz, resetProgress, setMode } from "../lib/store";
import * as downloads from "../lib/downloads";

beforeEach(() => {
  resetProgress();
  setMode("little");
  downloads.resetDownloads();
});
afterEach(cleanup);

describe("Library", () => {
  it("lists every story as a card and reports sticker progress", () => {
    render(<Library onOpen={() => {}} onStickers={() => {}} onSettings={() => {}} />);
    for (const s of STORIES) expect(screen.getByText(s.title)).toBeTruthy();
    expect(screen.getByText(`of ${TOTAL_STICKERS} stickers found`, { exact: false })).toBeTruthy();
    expect(screen.getByText(/Little mode/)).toBeTruthy();
  });

  it("opens a story and the sticker book and settings from their buttons", () => {
    const onOpen = vi.fn();
    const onStickers = vi.fn();
    const onSettings = vi.fn();
    render(<Library onOpen={onOpen} onStickers={onStickers} onSettings={onSettings} />);
    fireEvent.click(screen.getByText(STORIES[1].title));
    expect(onOpen).toHaveBeenCalledWith(STORIES[1]);
    fireEvent.click(screen.getByRole("button", { name: "My stickers" }));
    expect(onStickers).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Grown-up settings" }));
    fireEvent.click(screen.getByRole("button", { name: "Change" }));
    expect(onSettings).toHaveBeenCalledTimes(2);
  });

  it("shows a done badge, the best quiz stars, and the sticker count from progress", () => {
    markCompleted("daniel");
    recordQuiz("daniel", 2);
    recordFound("daniel", "den", "king", "The King");
    setMode("big");
    render(<Library onOpen={() => {}} onStickers={() => {}} onSettings={() => {}} />);
    expect(screen.getByLabelText("Best quiz score 2").textContent).toBe("★★");
    expect(document.querySelector(".card__badge")).not.toBeNull();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText(/Big mode/)).toBeTruthy();
  });
});

describe("Library download rows", () => {
  const manifest = {
    noah: { files: ["/a", "/b", "/c"], bytes: 1_250_000 },
    daniel: { files: ["/d"], bytes: 40_000 },
    david: { files: ["/e", "/f"], bytes: 900_000 },
    jonah: { files: ["/g"], bytes: 900_000 },
    christmas: { files: ["/h"], bytes: 2_300_000 },
    storm: { files: ["/i"], bytes: 1_800_000 },
  };
  const sizes = Object.fromEntries(Object.entries(manifest).map(([k, v]) => [k, v.bytes]));

  function fakeCaches(held: string[]) {
    const store = new Map(held.map((u) => [u, new Response("x")]));
    return {
      open: async () => ({
        match: async (u: string) => store.get(u),
        put: async (u: string, r: Response) => {
          store.set(u, r);
        },
      }),
    };
  }

  it("shows nothing before the cache has been read, then one row per story", async () => {
    Object.defineProperty(globalThis, "caches", { value: fakeCaches(["/d"]), configurable: true });
    render(
      <Library onOpen={() => {}} onStickers={() => {}} onSettings={() => {}} storySizes={sizes} />,
    );
    expect(screen.queryByText(/On this device/)).toBeNull();
    await act(() => downloads.refresh(manifest, "creation"));
    // creation is built in, daniel is fully cached: two ticks
    expect(screen.getAllByText(/On this device/)).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Download, 1.2 MB" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Download, 2.2 MB" })).toBeTruthy();
  });

  it("shows partial progress, then downloading, then the tick, and the button starts the download", async () => {
    Object.defineProperty(globalThis, "caches", { value: fakeCaches(["/a"]), configurable: true });
    const fetchMock = vi.fn(async () => new Response("ok"));
    vi.stubGlobal("fetch", fetchMock);
    render(
      <Library onOpen={() => {}} onStickers={() => {}} onSettings={() => {}} storySizes={sizes} />,
    );
    await act(() => downloads.refresh(manifest, "creation"));
    expect(screen.getByText("1 of 3 files here")).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Download, 1.2 MB" }));
    });
    expect(screen.getAllByText(/On this device/)).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("shows the running count while files are still arriving", async () => {
    Object.defineProperty(globalThis, "caches", { value: fakeCaches(["/a"]), configurable: true });
    let release: () => void = () => {};
    const gate = new Promise<void>((r) => (release = r));
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        await gate;
        return new Response("ok");
      }),
    );
    render(
      <Library onOpen={() => {}} onStickers={() => {}} onSettings={() => {}} storySizes={sizes} />,
    );
    await act(() => downloads.refresh(manifest, "creation"));
    let finished: Promise<void> = Promise.resolve();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Download, 1.2 MB" }));
      finished = downloads.download("noah");
      await Promise.resolve();
    });
    expect(screen.getByRole("status").textContent).toBe("Downloading, 1 of 3");
    await act(async () => {
      release();
      await finished;
    });
    expect(screen.getAllByText(/On this device/)).toHaveLength(2);
    vi.unstubAllGlobals();
  });

  it("shows the failure states with a retry button", async () => {
    Object.defineProperty(globalThis, "caches", { value: fakeCaches([]), configurable: true });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );
    render(
      <Library onOpen={() => {}} onStickers={() => {}} onSettings={() => {}} storySizes={sizes} />,
    );
    await act(() => downloads.refresh(manifest, "creation"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Download, 1.2 MB" }));
    });
    expect(screen.getByText(/Download failed/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();

    Object.defineProperty(navigator, "storage", {
      value: { estimate: async () => ({ usage: 10, quota: 20 }) },
      configurable: true,
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Download, 2.2 MB" }));
    });
    expect(screen.getByText(/Not enough space on this device/)).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Try again" })).toHaveLength(2);

    // Try again starts the download over; with fetch healthy now it ends on the device.
    Object.defineProperty(navigator, "storage", { value: undefined, configurable: true });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("ok")),
    );
    await act(async () => {
      fireEvent.click(screen.getAllByRole("button", { name: "Try again" })[0]);
    });
    expect(screen.getAllByText(/On this device/)).toHaveLength(2);
    vi.unstubAllGlobals();
  });

  it("shows no row at all when the browser has no Cache API", async () => {
    Object.defineProperty(globalThis, "caches", { value: undefined, configurable: true });
    render(
      <Library onOpen={() => {}} onStickers={() => {}} onSettings={() => {}} storySizes={sizes} />,
    );
    await act(() => downloads.refresh(manifest, "creation"));
    expect(screen.queryByRole("button", { name: /Download/ })).toBeNull();
    expect(screen.getAllByText(/On this device/)).toHaveLength(1);
  });
});
