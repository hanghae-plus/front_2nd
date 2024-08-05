import { act, renderHook } from "@testing-library/react";
import { useFilterEvent } from "../useFilterEvent";
import { vi } from "vitest";
import { Event } from "../../../../types/types";

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Event 1",
    date: "2024-08-01",
    startTime: "09:00",
    endTime: "10:00",
    description: "Description 1",
    location: "Location 1",
    category: "Category 1",
    repeat: { type: "none", interval: 1 },
    notificationTime: 15,
  },
  {
    id: 2,
    title: "Event 2",
    date: "2024-08-15",
    startTime: "14:00",
    endTime: "15:00",
    description: "Description 2",
    location: "Location 2",
    category: "Category 2",
    repeat: { type: "weekly", interval: 1, endDate: "2023-09-15" },
    notificationTime: 30,
  },
  {
    id: 3,
    title: "Event 3",
    date: "2024-08-23",
    startTime: "11:00",
    endTime: "12:00",
    description: "Description 3",
    location: "Location 3",
    category: "Category 3",
    repeat: { type: "monthly", interval: 1 },
    notificationTime: 60,
  },
];

describe("useFilterEvent", () => {
  test("올바른 초기 값을 확인합니다.", () => {
    vi.setSystemTime(new Date("2024-08-01"));
    const { result } = renderHook(() => useFilterEvent(mockEvents));

    expect(result.current.currentDate).toEqual(new Date());
    expect(result.current.searchTerm).toBe("");
    expect(result.current.view).toBe("month");
    expect(result.current.filteredEvents).toEqual(mockEvents);
  });

  test("navigate 함수가 월 뷰에서 필터링 된 날짜를 보여줘야합니다.", () => {
    const { result } = renderHook(() => useFilterEvent(mockEvents));

    act(() => {
      result.current.setView("month");
      result.current.navigate("next");
    });

    expect(result.current.currentDate.getMonth()).toBe(
      new Date().getMonth() + 1
    );
  });

  test("navigate 함수가 주 뷰에서 필터링 된 날짜를 보여줘야합니다.", async () => {
    vi.setSystemTime(new Date("2024-08-12"));
    const { result } = renderHook(() => useFilterEvent(mockEvents));

    act(() => {
      result.current.setView("week");
    });

    act(() => {
      result.current.navigate("next");
    });

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 7);
    expect(result.current.currentDate.getDate()).toBe(expectedDate.getDate());
  });

  test("searchTerm에 따라 이벤트를 올바르게 필터링 해줘야 합니다.", () => {
    const { result } = renderHook(() => useFilterEvent(mockEvents));

    act(() => {
      result.current.setSearchTerm("Event 1");
    });

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents[0].title).toBe("Event 1");
  });
});
