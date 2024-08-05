import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import { useGetEvent } from "../useGetEvent";
import { DUMMY_DATA } from "../../../../../mock/handler";

describe("useGetEvent를 테스트합니다.", () => {
  const mockFetch = vi.fn();

  test("초기 데이터를 테스트합니다.", () => {
    const { result } = renderHook(() => useGetEvent());

    expect(result.current.events).toEqual([]);
  });

  test("이벤트 데이터를 fetch 합니다.", async () => {
    const { result } = renderHook(() => useGetEvent());

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(DUMMY_DATA),
    });

    await waitFor(() => {
      expect(result.current.events).toEqual(DUMMY_DATA);
    });
  });
});
