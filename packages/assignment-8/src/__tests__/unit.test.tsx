import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Event } from '../interface';
import { useEventManagement } from '../hooks/api/useEventManagement';
import { useEvents } from '../hooks/api/useEvent';
import { useEventNotifications } from '../hooks/useEventNotifications';

// useChakraToast 모킹
const mockErrorToast = vi.fn();
vi.mock('../hooks/useChakraToast', () => ({
  default: () => ({
    errorToast: mockErrorToast,
  }),
}));

describe('useEvents 훅', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch = vi.fn();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it('fetchEventsFunction이 제공되면 그 함수를 사용해 이벤트를 가져와야 한다', async () => {
    const mockEvents: Event[] = [
      {
        id: 1,
        title: '테스트 이벤트',
        date: '2024-03-15',
        startTime: '09:00',
        endTime: '10:00',
      },
    ];
    const mockFetchEvents = vi.fn().mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents(mockFetchEvents));

    await act(async () => {
      await result.current.fetchEvents();
    });

    expect(mockFetchEvents).toHaveBeenCalled();
    expect(result.current.events).toEqual(mockEvents);
  });

  it('fetchEventsFunction이 제공되지 않으면 API를 호출해야 한다', async () => {
    const mockEvents: Event[] = [
      {
        id: 2,
        title: 'API 이벤트',
        date: '2024-03-16',
        startTime: '11:00',
        endTime: '12:00',
      },
    ];
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEvents),
    } as Response);

    const { result } = renderHook(() => useEvents());

    await act(async () => {
      await result.current.fetchEvents();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/events');
    expect(result.current.events).toEqual(mockEvents);
  });

  it('API 호출 실패 시 에러를 처리해야 한다', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useEvents());

    await act(async () => {
      await result.current.fetchEvents();
    });

    expect(mockErrorToast).toHaveBeenCalledWith('이벤트 로딩 실패');
    expect(result.current.events).toEqual([]);
  });
});

const mockSuccessToast = vi.fn();
const mockInfoToast = vi.fn();

vi.mock('../hooks/useChakraToast', () => ({
  default: () => ({
    successToast: mockSuccessToast,
    errorToast: mockErrorToast,
    infoToast: mockInfoToast,
  }),
}));

vi.mock('../utils/dateUtils', () => ({
  createRecurringEvents: vi.fn(),
  getOneYearLaterDate: vi.fn(),
}));

describe('useEventManagement 훅', () => {
  const mockFetchEvents = vi.fn();
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch = vi.fn();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it('새 이벤트를 성공적으로 저장해야 한다', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);
    const { result } = renderHook(() => useEventManagement(mockFetchEvents));

    const newEvent: Event = {
      id: 1,
      title: '새 이벤트',
      date: '2024-03-15',
      startTime: '09:00',
      endTime: '10:00',
      repeat: { type: 'none', interval: 1 },
    };

    await act(async () => {
      await result.current.saveEvent(newEvent);
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/events', expect.any(Object));
    expect(mockFetchEvents).toHaveBeenCalled();
    expect(mockSuccessToast).toHaveBeenCalledWith('일정이 추가되었습니다.');
  });

  it('이벤트 저장 실패 시 에러를 처리해야 한다', async () => {
    mockFetch.mockRejectedValue(new Error('저장 실패'));
    const { result } = renderHook(() => useEventManagement(mockFetchEvents));

    const failEvent: Event = {
      id: 1,
      title: '실패할 이벤트',
      date: '2024-03-16',
      startTime: '11:00',
      endTime: '12:00',
      repeat: { type: 'none', interval: 1 },
    };

    await act(async () => {
      await result.current.saveEvent(failEvent);
    });

    expect(mockErrorToast).toHaveBeenCalledWith('일정 저장 실패');
  });
});

// Chakra UI의 useInterval 모킹
vi.mock('@chakra-ui/react', () => ({
  useInterval: (callback: () => void, delay: number | null) => {
    vi.useFakeTimers();
    if (delay !== null) {
      setInterval(callback, delay);
    }
  },
}));

describe('useEventNotifications 훅', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-15T10:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('다가오는 이벤트에 대한 알림을 생성해야 한다', () => {
    const events: Event[] = [
      {
        id: 1,
        title: '곧 시작할 이벤트',
        date: '2024-03-15',
        startTime: '10:05',
        endTime: '11:00',
        notificationTime: 10,
      },
    ];

    const { result } = renderHook(() => useEventNotifications(events));

    act(() => {
      vi.advanceTimersByTime(1000); // 1초 후
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].message).toBe(
      '10분 후 곧 시작할 이벤트 일정이 시작됩니다.'
    );
  });

  it('이미 알림이 생성된 이벤트에 대해서는 중복 알림을 생성하지 않아야 한다', () => {
    const events: Event[] = [
      {
        id: 1,
        title: '반복 확인 이벤트',
        date: '2024-03-15',
        startTime: '10:05',
        endTime: '11:00',
        notificationTime: 10,
      },
    ];

    const { result } = renderHook(() => useEventNotifications(events));

    act(() => {
      vi.advanceTimersByTime(1000); // 1초 후
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000); // 추가 1초 후
    });

    expect(result.current.notifications).toHaveLength(1); // 여전히 1개의 알림만 존재해야 함
  });

  it('알림을 제거할 수 있어야 한다', () => {
    const events: Event[] = [
      {
        id: 1,
        title: '제거할 알림 이벤트',
        date: '2024-03-15',
        startTime: '10:05',
        endTime: '11:00',
        notificationTime: 10,
      },
    ];

    const { result } = renderHook(() => useEventNotifications(events));

    act(() => {
      vi.advanceTimersByTime(1000); // 알림 생성
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.removeNotification(0);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('events prop이 변경되면 새로운 알림을 확인해야 한다', () => {
    const initialEvents: Event[] = [];
    const { result, rerender } = renderHook(
      ({ events }) => useEventNotifications(events),
      { initialProps: { events: initialEvents } }
    );

    expect(result.current.notifications).toHaveLength(0);

    const newEvents: Event[] = [
      {
        id: 2,
        title: '새로운 이벤트',
        date: '2024-03-15',
        startTime: '10:05',
        endTime: '11:00',
        notificationTime: 10,
      },
    ];

    rerender({ events: newEvents });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].message).toBe(
      '10분 후 새로운 이벤트 일정이 시작됩니다.'
    );
  });
});
