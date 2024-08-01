import { mockHolidays } from "@/contants";
import useCalendarView from "@/hooks/useCalendarView";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const expectSameDate = (a: Date, b: Date) => {
  expect(a.toDateString()).toBe(b.toDateString());
};

beforeEach(() => {
  const fakeTime = new Date("2024-07-25T08:00:00Z");
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(fakeTime);
});

describe("useCalendarView", () => {
  test("useEffect를 통한 holidays 정보 fetch로 초기값을 불러올 수 있습니다.", () => {
    const { result } = renderHook(() => useCalendarView());

    expect(result.current.view).toBe("month");
    expect(result.current.currentDate).toBeInstanceOf(Date);
    expect(result.current.holidays).toEqual({ ...mockHolidays });
  });

  test("week view일 때 prev navigate는 -7일, next navigate는 +7일의 연산을 합니다.", () => {
    const { result } = renderHook(() => useCalendarView());

    act(() => {
      result.current.setView("week");
    });

    act(() => {
      result.current.navigate("next");
    });

    expectSameDate(
      result.current.currentDate,
      new Date("2024-08-01T08:00:00Z")
    );

    act(() => {
      result.current.navigate("prev");
    });

    expectSameDate(
      result.current.currentDate,
      new Date("2024-07-25T08:00:00Z")
    );
  });

  test("month view일 때 prev navigate는 -1개월, next navigate는 +1개월의 연산을 합니다.", () => {
    const { result } = renderHook(() => useCalendarView());

    act(() => {
      result.current.setView("month");
    });

    act(() => {
      result.current.navigate("next");
    });

    expectSameDate(
      result.current.currentDate,
      new Date("2024-08-25T08:00:00Z")
    );

    act(() => {
      result.current.navigate("prev");
    });

    expectSameDate(
      result.current.currentDate,
      new Date("2024-07-25T08:00:00Z")
    );
  });
});
