import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCalendarView } from "../hooks/useCalendarView.ts";
import { Event } from "../types.ts";
import createMockServer from "./createMockServer.ts";
import { useEventOperations } from "../hooks/useEventOperations.ts";
import { http, HttpResponse } from "msw";
import { useNotifications } from "../hooks/useNotifications.ts";
import { fillZero, formatDate } from "../utils/dateUtils.ts";
import { useSearch } from "../hooks/useSearch.ts";

const MOCK_EVENT_1: Event = {
  id: 1,
  title: "기존 회의",
  date: "2024-07-15",
  startTime: "09:00",
  endTime: "10:00",
  description: "기존 팀 미팅",
  location: "회의실 B",
  category: "업무",
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
}

const events: Event[] = [{ ...MOCK_EVENT_1 }];

const server = createMockServer(events);

const mockToast = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => (props: never) => mockToast(props),
  };
});

beforeAll(() => server.listen());
afterAll(() => {
  server.close();
  vi.clearAllMocks();
});

describe('단위 테스트: 커스텀훅', () => {
  describe('useCalendarView > ', () => {
    test('초기 상태가 올바르게 설정되어야 한다', () => {
      vi.useFakeTimers({toFake: ['Date']  });
      vi.setSystemTime(new Date(2024, 6, 1))
      const { result } = renderHook(() => useCalendarView());

      expect(result.current.view).toBe('month');
      expect(result.current.currentDate).toBeInstanceOf(Date);
      expect(result.current.holidays).toEqual({});

      vi.useRealTimers();
    });

    test('view를 변경할 수 있어야 한다', () => {
      const { result } = renderHook(() => useCalendarView());

      act(() => {
        result.current.setView('week');
      });

      expect(result.current.view).toBe('week');
    });

    test('주간 뷰에서 다음으로 네비게이션하면 7일 후의 날짜여야 한다', () => {
      const { result } = renderHook(() => useCalendarView());
      const initialDate = new Date('2024-01-01');
      act(() => {
        result.current.setView('week');
        result.current.setCurrentDate(initialDate);
      });

      act(() => {
        result.current.navigate('next');
      });

      expect(result.current.currentDate).toEqual(new Date('2024-01-08'));
    });

    test('월간 뷰에서 이전으로 네비게이션하면 한 달 전의 날짜여야 한다', () => {
      const { result } = renderHook(() => useCalendarView());
      const initialDate = new Date('2024-03-15');
      act(() => {
        result.current.setCurrentDate(initialDate);
      });

      act(() => {
        result.current.navigate('prev');
      });

      expect(result.current.currentDate).toEqual(new Date('2024-02-15'));
    });

    test('currentDate가 변경되면 holidays가 업데이트되어야 한다', async () => {
      const { result } = renderHook(() => useCalendarView());

      act(() => {
        result.current.setCurrentDate(new Date('2024-10-01'));
      });

      expect(result.current.holidays).toEqual({
        "2024-10-03": "개천절",
        "2024-10-09": "한글날",
      });
    });
  });


  describe('useEventOperations > ', () => {

    describe('오류 케이스에 대한 테스트', () => {
      afterEach(() => server.resetHandlers()) // 각각 테스트 요청 마다 핸들러 초기화

      test('이벤트 로딩 실패 시 에러 토스트가 표시되어야 한다', async () => {
        server.use(
          http.get('/api/events', () => {
            return new HttpResponse(null, { status: 500 });
          })
        );

        renderHook(() => useEventOperations(true));

        await act(() => Promise.resolve(null));

        expect(mockToast).toHaveBeenCalledWith({
          duration: 3000,
          isClosable: true,
          title: "이벤트 로딩 실패",
          status: "error",
        });
      });

      test('존재하지 않는 이벤트 수정 시 에러 처리가 되어야 한다', async () => {
        const { result } = renderHook(() => useEventOperations(true));

        await act(() => Promise.resolve(null));

        const nonExistentEvent: Event = {
          id: 999, // 존재하지 않는 ID
          title: "존재하지 않는 이벤트",
          date: "2024-07-20",
          startTime: "09:00",
          endTime: "10:00",
          description: "이 이벤트는 존재하지 않습니다",
          location: "어딘가",
          category: "기타",
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        };

        await act(async () => {
          await result.current.saveEvent(nonExistentEvent);
        });

        expect(mockToast).toHaveBeenCalledWith({
          duration: 3000,
          isClosable: true,
          title: "일정 저장 실패",
          status: "error",
        });
      });

      test('네트워크 오류 시 이벤트 삭제가 실패해야 한다', async () => {
        server.use(
          http.delete('/api/events/:id', () => {
            return new HttpResponse(null, { status: 500 });
          })
        );

        const { result } = renderHook(() => useEventOperations(false));

        await act(() => Promise.resolve(null));

        await act(async () => {
          await result.current.deleteEvent(1);
        });

        expect(mockToast).toHaveBeenCalledWith({
          duration: 3000,
          isClosable: true,
          title: "일정 삭제 실패",
          status: "error",
        });
        expect(result.current.events).toHaveLength(1); // 삭제가 실패했으므로 이벤트가 그대로 남아있어야 함
      });
    });

    describe('정상적으로 동작하는 케이스에 대한 테스트 > ', () => {

      beforeEach(() => {
        events.length = 0;
        events.push({ ...MOCK_EVENT_1 })
      })

      test('초기 상태에서 이벤트를 정상적으로 불러와야 한다', async () => {
        const { result } = renderHook(() => useEventOperations(false));

        await act(() => Promise.resolve(null))

        expect(result.current.events).toEqual(events);
      });

      test('새 이벤트를 추가할 수 있어야 한다. 이벤트를 추가할 때, ID는 서버에서 만들어준다.', async () => {
        const { result } = renderHook(() => useEventOperations(false));

        await act(() => Promise.resolve(null))

        const newEvent: Event = {
          id: Date.now(),
          title: "새 회의",
          date: "2024-07-16",
          startTime: "11:00",
          endTime: "12:00",
          description: "새로운 팀 미팅",
          location: "회의실 A",
          category: "업무",
          repeat: { type: 'none', interval: 0 },
          notificationTime: 5,
        };

        await act(async () => {
          await result.current.saveEvent(newEvent);
        });

        expect(result.current.events).toEqual([
          events[0],
          {
            ...newEvent,
            id: 2, // 서버에서 할당된 ID
          }
        ])
      });

      test('기존 이벤트를 수정할 수 있어야 한다', async () => {
        const { result } = renderHook(() => useEventOperations(true));

        await act(() => Promise.resolve(null))

        const updatedEvent: Event = {
          ...events[0],
          title: "수정된 회의",
          endTime: "11:00",
        };

        await act(async () => {
          await result.current.saveEvent(updatedEvent);
        });

        expect(result.current.events[0]).toEqual(updatedEvent);
      });

      test('이벤트를 삭제할 수 있어야 한다', async () => {
        const { result } = renderHook(() => useEventOperations(false));

        await act(async () => {
          await result.current.deleteEvent(1);
        });

        await act(() => Promise.resolve(null))

        expect(result.current.events).toEqual([]);
      });

    })
  });

  describe('useNotifications >', () => {
    const 초 = 1000;
    const 분 = 초 * 60;

    const parseHM = (timestamp: number) => {
      const date = new Date(timestamp);
      const h = fillZero(date.getHours());
      const m = fillZero(date.getMinutes());
      return `${h}:${m}`;
    }

    beforeAll(() => {
      vi.useFakeTimers({
        toFake: ['setInterval', 'Date']
      });
    })

    afterAll(() => {
      vi.useRealTimers();
    })

    test('초기 상태에서는 알림이 없어야 한다', () => {
      const { result } = renderHook(() => useNotifications([]));
      expect(result.current.notifications).toEqual([]);
      expect(result.current.notifiedEvents).toEqual([]);
    });

    test('알림 시간이 되면 새로운 알림을 생성해야 한다', () => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: '테스트 이벤트',
          date: formatDate(new Date()),
          startTime: parseHM(Date.now() + (10 * 분)),
          endTime: parseHM(Date.now() + 20 * 분),
          description: '',
          location: '',
          category: '',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 5,
        },
      ];

      const { result } = renderHook(() => useNotifications(mockEvents));

      expect(result.current.notifications).toHaveLength(0);

      vi.setSystemTime(new Date(Date.now() + 5 * 분))

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifiedEvents).toContain(1);
    });

    test('알림을 제거할 수 있어야 한다', () => {
      const { result } = renderHook(() => useNotifications([]));

      act(() => {
        result.current.setNotifications([
          { id: 1, message: '테스트 알림 1' },
          { id: 2, message: '테스트 알림 2' },
        ]);
      });

      expect(result.current.notifications).toHaveLength(2);

      act(() => {
        result.current.removeNotification(0);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].message).toBe('테스트 알림 2');
    });

    test('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: '테스트 이벤트',
          date: formatDate(new Date()),
          startTime: parseHM(Date.now() + (10 * 분)),
          endTime: parseHM(Date.now() + 20 * 분),
          description: '',
          location: '',
          category: '',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ];

      const { result } = renderHook(() => useNotifications(mockEvents));

      vi.setSystemTime(new Date(Date.now() + 5 * 분))

      act(() => {
        vi.advanceTimersByTime(1000)
      });

      vi.setSystemTime(new Date(Date.now() + 20 * 분))

      act(() => {
        vi.advanceTimersByTime(1000)
      });

      expect(result.current.notifications).toHaveLength(1); // 여전히 1개의 알림만 존재해야 함
    });
  });

  describe('useSearch >', () => {
    const mockEvents: Event[] = [
      { id: 1, title: '회의', date: '2024-07-01', startTime: '10:00', endTime: '11:00', description: '팀 회의', location: '회의실', category: '업무', repeat: { type: 'none', interval: 0 }, notificationTime: 10 },
      { id: 2, title: '점심 약속', date: '2024-07-02', startTime: '12:00', endTime: '13:00', description: '친구와 점심', location: '레스토랑', category: '개인', repeat: { type: 'none', interval: 0 }, notificationTime: 10 },
      { id: 3, title: '운동', date: '2024-07-03', startTime: '18:00', endTime: '19:00', description: '헬스장 가기', location: '헬스장', category: '개인', repeat: { type: 'none', interval: 0 }, notificationTime: 10 },
    ];

    const currentDate = new Date('2024-07-01');
    const view = 'month' as const;

    test('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      expect(result.current.filteredEvents).toEqual(mockEvents);
    });

    test('검색어에 맞는 이벤트만 필터링해야 한다', () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      act(() => {
        result.current.setSearchTerm('회의');
      });

      expect(result.current.filteredEvents).toEqual([mockEvents[0]]);
    });

    test('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      act(() => {
        result.current.setSearchTerm('점심');
      });

      expect(result.current.filteredEvents).toEqual([mockEvents[1]]);
    });

    test('검색어 대소문자를 구분하지 않아야 한다', () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      act(() => {
        result.current.setSearchTerm('헬스장');
      });

      expect(result.current.filteredEvents).toEqual([mockEvents[2]]);
    });

    test('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
      const { result } = renderHook(() => useSearch(mockEvents, new Date('2024-07-10'), 'week'));

      expect(result.current.filteredEvents).toEqual([]);
    });

    test('검색어를 변경하면 필터링된 결과가 즉시 업데이트되어야 한다', () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      act(() => {
        result.current.setSearchTerm('회의');
      });
      expect(result.current.filteredEvents).toEqual([mockEvents[0]]);

      act(() => {
        result.current.setSearchTerm('점심');
      });
      expect(result.current.filteredEvents).toEqual([mockEvents[1]]);
    });
  });
})
