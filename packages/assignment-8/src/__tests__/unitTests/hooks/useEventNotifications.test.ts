import { getAlarmBoundary } from "@/__tests__/testUtils";
import useEventNotifications from "@/hooks/useEventNotifications";
import { Event } from "@/types";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

beforeEach(() => {
  const fakeTime = new Date("2024-07-25T08:00:00Z");
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(fakeTime);
});

describe("useEventNotifications", () => {
  test("notification과 notifiedEvents 초기화 테스트", () => {
    const { result } = renderHook(() => useEventNotifications({ events: [] }));

    expect(result.current.notifications).toEqual([]);
    expect(result.current.notifiedEvents).toEqual([]);
  });

  test("현재 시점이 알림 범위에 포함된 이벤트가 있으면 notification에 이벤트가 추가됩니다.", () => {
    const mockEvents: Array<Event> = [
      {
        id: 1,
        title: "회의",
        description: "회의 설명",
        location: "회의실",
        category: "업무",
        repeat: { type: "weekly", interval: 1 },
        notificationTime: 10,
        ...getAlarmBoundary(),
      },
    ];

    const { result } = renderHook(() =>
      useEventNotifications({ events: mockEvents })
    );

    act(() => {
      result.current.checkUpcomingEvents();
    });

    expect(result.current.notifications).toEqual([
      {
        id: 1,
        message: "10분 후 회의 일정이 시작됩니다.",
      },
    ]);
    expect(result.current.notifiedEvents).toEqual([1]);
  });

  test("이미 알림을 보낸 이벤트는 notifiedEvents에 저장되어 다시 notificatino에 추가되지 않습니다.", () => {
    const mockEvents: Array<Event> = [
      {
        id: 1,
        title: "회의",
        description: "회의 설명",
        location: "회의실",
        category: "업무",
        repeat: { type: "weekly", interval: 1 },
        notificationTime: 10,
        ...getAlarmBoundary(),
      },
    ];

    const { result } = renderHook(() =>
      useEventNotifications({ events: mockEvents })
    );

    act(() => {
      result.current.checkUpcomingEvents();
    });
    expect(result.current.notifiedEvents).toEqual([1]);

    act(() => {
      result.current.checkUpcomingEvents();
    });
    expect(result.current.notifications).toHaveLength(1);
  });
});
