import useEventSearch from "@/hooks/useEventSearch";
import { Event, ViewType } from "@/types";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

const events: Array<Event> = [
  {
    id: 1,
    title: "팀 회의",
    date: "2024-07-20",
    startTime: "10:00",
    endTime: "11:00",
    description: "주간 팀 미팅",
    location: "회의실 A",
    category: "업무",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 2,
    title: "점심 약속",
    date: "2024-07-21",
    startTime: "12:30",
    endTime: "13:30",
    description: "동료와 점심 식사",
    location: "회사 근처 식당",
    category: "개인",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
  {
    id: 3,
    title: "프로젝트 마감",
    date: "2024-07-25",
    startTime: "09:00",
    endTime: "18:00",
    description: "분기별 프로젝트 마감",
    location: "사무실",
    category: "업무",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
  {
    id: 4,
    title: "생일 파티",
    date: "2024-07-28",
    startTime: "19:00",
    endTime: "22:00",
    description: "친구 생일 축하",
    location: "친구 집",
    category: "개인",
    repeat: { type: "yearly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 5,
    title: "운동",
    date: "2024-07-22",
    startTime: "18:00",
    endTime: "19:00",
    description: "주간 운동",
    location: "헬스장",
    category: "개인",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
];

const currentDate = new Date("2024-07-23");

describe("useEventSearch", () => {
  test("searchTerm이 비어있을 때는 모든 이벤트가 반환됩니다.", () => {
    const { result } = renderHook(() =>
      useEventSearch({ events, view: "month", currentDate })
    );

    expect(result.current.filteredEvents).toEqual(events);
  });

  test("searchTerm에 입력된 값을 제목에 포함한 모든 이벤트가 반환됩니다.", () => {
    const { result } = renderHook(() =>
      useEventSearch({ events, view: "month", currentDate })
    );

    act(() => {
      result.current.setSearchTerm("회의");
    });

    expect(result.current.filteredEvents).toEqual([events[0]]);
  });

  test("searchTerm에 입력된 값을 설명에 포함한 모든 이벤트가 반환됩니다.", () => {
    const { result } = renderHook(() =>
      useEventSearch({ events, view: "month", currentDate })
    );

    act(() => {
      result.current.setSearchTerm("프로젝트");
    });

    expect(result.current.filteredEvents).toEqual([events[2]]);
  });

  test("searchTerm에 입력된 값을 장소에 포함한 모든 이벤트가 반환됩니다.", () => {
    const { result } = renderHook(() =>
      useEventSearch({ events, view: "month", currentDate })
    );

    act(() => {
      result.current.setSearchTerm("헬스장");
    });

    expect(result.current.filteredEvents).toEqual([events[4]]);
  });

  test("view가 week일 때 currentDate 기준으로 주간 내의 이벤트가 반환됩니다.", () => {
    const { result } = renderHook(() =>
      useEventSearch({ events, view: "week", currentDate })
    );

    expect(result.current.filteredEvents).toEqual([
      events[2],
      events[3],
      events[4],
    ]);
  });

  test("view가 month일 때 currentDate 기준으로 월간 내의 이벤트가 반환됩니다.", () => {
    const { result } = renderHook(() =>
      useEventSearch({ events, view: "month", currentDate })
    );

    expect(result.current.filteredEvents).toEqual(events);
  });

  test("events가 비어있을 때 예외처리", () => {
    const { result } = renderHook(() =>
      useEventSearch({ events: [], view: "week", currentDate })
    );

    expect(result.current.filteredEvents).toEqual([]);
  });

  test("view가 invalid일 때 예외처리", () => {
    const { result } = renderHook(() =>
      useEventSearch({ events, view: "invalid" as ViewType, currentDate })
    );

    expect(result.current.filteredEvents).toEqual(events);
  });
});
