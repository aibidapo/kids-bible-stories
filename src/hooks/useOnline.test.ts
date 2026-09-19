// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useOnline } from "./useOnline";

afterEach(() => vi.restoreAllMocks());

describe("useOnline", () => {
  it("reports the browser's connection state and follows online and offline events", () => {
    const onLine = vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
    const { result, unmount } = renderHook(() => useOnline());
    expect(result.current).toBe(true);
    act(() => {
      onLine.mockReturnValue(false);
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current).toBe(false);
    act(() => {
      onLine.mockReturnValue(true);
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current).toBe(true);
    unmount();
  });
});
