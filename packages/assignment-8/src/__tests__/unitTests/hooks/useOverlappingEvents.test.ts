import useOverlappingEvents from "@/hooks/useOverlappingEvents";
import { Event } from "@/types";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

const events: Array<Event> = [
  {
    id: 1,
    title: "일정 1",
    date: "2024-08-01",
    startTime: "09:00",
    endTime: "10:00",
    description: "설명 1",
    location: "장소 1",
    category: "카테고리 1",
    notificationTime: 10,
    repeat: { type: "weekly", interval: 1 },
  },
  {
    id: 2,
    title: "일정 2",
    date: "2024-08-01",
    startTime: "09:30",
    endTime: "10:30",
    description: "설명 2",
    location: "장소 2",
    category: "카테고리 2",
    notificationTime: 10,
    repeat: { type: "weekly", interval: 1 },
  },
];

const overlappedEvent: Event = {
  id: 3,
  title: "일정 3",
  date: "2024-08-01",
  startTime: "09:45",
  endTime: "10:15",
  description: "설명 3",
  location: "장소 3",
  category: "카테고리 3",
  notificationTime: 10,
  repeat: { type: "weekly", interval: 1 },
};

const nonOverlappedEvent: Event = {
  id: 3,
  title: "일정 2",
  date: "2024-08-01",
  startTime: "10:00",
  endTime: "11:00",
  description: "설명 2",
  location: "장소 2",
  category: "카테고리 2",
  notificationTime: 10,
  repeat: { type: "weekly", interval: 1 },
};

describe("useOverlappingEvents", () => {
  test("isOverlapDialogOpen, overlappedEvents 초기화 테스트", () => {
    const { result } = renderHook(() => useOverlappingEvents({ events: [] }));

    expect(result.current.isOverlapDialogOpen).toBe(false);
    expect(result.current.overlappedEvents).toEqual([]);
  });

  test("중복 기간이 발생한 경우 dialog를 열고 overlappedEvents에 set해줍니다.", () => {
    const { result } = renderHook(() => useOverlappingEvents({ events }));

    act(() => {
      result.current.getIsOverlappingAndSetOverlappingEvents(
        nonOverlappedEvent
      );
    });

    expect(result.current.isOverlapDialogOpen).toBe(true);
    expect(result.current.overlappedEvents).toEqual([events[1]]);
  });

  test("여러 개의 중복 기간이 발생한 경우 dialog를 열고 overlappedEvents에 모두 set해줍니다.", () => {
    const { result } = renderHook(() => useOverlappingEvents({ events }));

    act(() => {
      result.current.getIsOverlappingAndSetOverlappingEvents(overlappedEvent);
    });

    expect(result.current.isOverlapDialogOpen).toBe(true);
    expect(result.current.overlappedEvents).toEqual([events[0], events[1]]);
  });

  test("새로운 입력 일정이 기존의 일정들과 중복되지 않는 경우 초기값을 유지합니다.", () => {
    const { result } = renderHook(() =>
      useOverlappingEvents({ events: events.slice(0, 1) })
    );

    act(() => {
      result.current.getIsOverlappingAndSetOverlappingEvents(
        nonOverlappedEvent
      );
    });

    expect(result.current.isOverlapDialogOpen).toBe(false);
    expect(result.current.overlappedEvents).toEqual([]);
  });
});
