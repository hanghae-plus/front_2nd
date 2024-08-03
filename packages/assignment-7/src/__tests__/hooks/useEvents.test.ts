import { renderHook, act } from '@testing-library/react-hooks';
import { useEvents } from '../../hooks/useEvents';
import * as eventService from '../../services/eventService';
import { Event, EventFormData } from '../../types';
import { events } from '../../mockApiHandlers';
import { convertFormDataToEvent } from '../../utils/event';

// Vitest mock 설정
vi.mock('../../services/eventService', () => ({
  fetchEvents: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

describe('useEvents', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('데이터를 정확하게 조회할 수 있다.', async () => {
    const mockEvents: Event[] = events;

    // fetchEvents 함수를 mocking하고, mock 데이터를 반환하도록 설정
    const mockFetchEvents = vi
      .spyOn(eventService, 'fetchEvents')
      .mockResolvedValue(mockEvents);

    const { result, waitForNextUpdate } = renderHook(() => useEvents());

    act(() => {
      result.current.fetchEvents();
    });

    await waitForNextUpdate();

    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    mockFetchEvents.mockRestore();
  });

  it('일정을 추가할 수 있다.', async () => {
    const newEventFormData: EventFormData = {
      title: '개인 운동',
      description: '헬스장에서 운동',
      date: '2024-02-15',
      startTime: '18:00',
      endTime: '19:00',
      category: '개인',
      location: '헬스장',
      isRepeating: false,
      notificationTime: 5,
    };

    const convertedData = convertFormDataToEvent(newEventFormData);

    const mockCreateEvents = vi
      .spyOn(eventService, 'createEvent')
      .mockResolvedValue(convertedData);

    const { result, waitForNextUpdate } = renderHook(() => useEvents());

    act(() => {
      result.current.addEvent(newEventFormData);
    });

    await waitForNextUpdate();

    expect(result.current.events).toEqual([convertedData]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    mockCreateEvents.mockRestore();
  });

  it('일정을 수정할 수 있다.', async () => {
    const initialEvents: Event[] = events;

    const updatedEventFormData: EventFormData = {
      id: 1,
      title: '팀 회의',
      date: '2024-07-21',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'weekly', interval: 1 },
      notificationTime: 1,
      isRepeating: true,
    };

    const convertedData = convertFormDataToEvent(updatedEventFormData);

    const mockUpdateEvents = vi
      .spyOn(eventService, 'updateEvent')
      .mockResolvedValue(convertedData);

    const { result, waitForNextUpdate } = renderHook(() => useEvents());

    act(() => {
      result.current.setEvents(initialEvents);
    });

    act(() => {
      result.current.updateEvent(updatedEventFormData);
    });

    await waitForNextUpdate();

    const expected = initialEvents.map((eventItem) =>
      eventItem.id === convertedData.id ? convertedData : eventItem
    );

    expect(result.current.events).toEqual(expected); // 여기
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    mockUpdateEvents.mockRestore();
  });

  it('일정을 삭제할 수 있다.', async () => {
    const initialEvents: Event[] = events;

    const mockDeleteEvents = vi
      .spyOn(eventService, 'deleteEvent')
      .mockResolvedValue();

    const { result, waitForNextUpdate } = renderHook(() => useEvents());

    act(() => {
      result.current.setEvents(initialEvents);
    });

    act(() => {
      result.current.deleteEvent(1);
    });

    await waitForNextUpdate();

    const expected = initialEvents.filter((eventItem) => eventItem.id !== 1);

    expect(result.current.events).toEqual(expected);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    mockDeleteEvents.mockRestore();
  });
});
