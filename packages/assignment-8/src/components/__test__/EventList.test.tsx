import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventList from '../EventList';
import { SchedulerContextType } from '../../contexts/SchedulerContext';
import { EventFormData } from '../../types';

// SchedulerContext를 모의(mock)
vi.mock('../../contexts/SchedulerContext', async () => {
  const actual = (await vi.importActual(
    '../../contexts/SchedulerContext'
  )) as typeof import('../../contexts/SchedulerContext');
  return {
    ...actual,
    useSchedulerContext: vi.fn(
      (): SchedulerContextType => ({
        calendar: {
          currentDate: new Date('2024-05-01'),
          view: 'month',
          holidays: {
            '2024-05-01': '근로자의 날',
            '2024-05-05': '어린이날',
          },
          navigate: vi.fn(() => {}),
          goToToday: vi.fn(() => {}),
          changeView: vi.fn(() => {}),
          formatWeek: vi.fn(
            (date: Date) =>
              `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${Math.ceil(date.getDate() / 7)}주`
          ),
          formatMonth: vi.fn(
            (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`
          ),
          getWeekDates: vi.fn((date: Date) => {
            const week = [];
            for (let i = 0; i < 7; i++) {
              const day = new Date(date);
              day.setDate(date.getDate() - date.getDay() + i);
              week.push(day);
            }
            return week;
          }),
          getDaysInMonth: vi.fn((year: number, month: number) =>
            new Date(year, month + 1, 0).getDate()
          ),
        },
        events: {
          events: [
            {
              id: 1,
              title: 'Event 1',
              description: 'Description for Event 1',
              date: '2024-05-01',
              startTime: '10:00',
              endTime: '11:00',
              category: '업무',
              location: 'Office',
              repeat: {
                type: 'none',
                interval: 0,
                endDate: undefined,
              },
              notificationTime: 15,
            },
            {
              id: 2,
              title: 'Event 2',
              description: 'Description for Event 2',
              date: '2024-05-02',
              startTime: '14:00',
              endTime: '15:00',
              category: '개인',
              location: 'Home',
              repeat: {
                type: 'weekly',
                interval: 1,
                endDate: '2024-06-02',
              },
              notificationTime: 30,
            },
          ],
          loading: false,
          error: null,
          setEvents: vi.fn(() => {}),
          fetchEvents: vi.fn(async () => {}),
          addEvent: vi.fn(async () => {}),
          updateEvent: vi.fn(async () => {}),
          deleteEvent: vi.fn(async () => {}),
          saveEvent: vi.fn(async (eventData: EventFormData) => {
            if (eventData.id) {
              await vi.fn()();
              return { success: true, message: '일정이 수정되었습니다.' };
            } else {
              await vi.fn()();
              return { success: true, message: '일정이 추가되었습니다.' };
            }
          }),
        },
        notifications: {
          notifications: [
            { id: 1, message: '알림 1' },
            { id: 2, message: '알림 2' },
          ],
          addNotification: vi.fn(() => {}),
          removeNotification: vi.fn(() => {}),
          notifiedEvents: [1, 2],
        },
        overlapDialog: {
          state: {
            isOpen: false,
            overlappingEvents: [],
          },
          openDialog: vi.fn(() => {}),
          closeDialog: vi.fn(() => {}),
        },
        error: {
          error: null,
          setError: vi.fn(() => {}),
        },
        loading: {
          isLoading: false,
          setIsLoading: vi.fn(() => {}),
        },
        tempEventData: null,
        setTempEventData: vi.fn(() => {}),
        selectedEvent: null,
        setSelectedEvent: vi.fn(() => {}),
        clearSelectedEvent: vi.fn(() => {}),
      })
    ),
  };
});

describe('EventList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('렌더링 시, 컨텍스트에서 일정 목록을 가져온다.', () => {
    render(<EventList />);

    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('특정 검색어를 포함한 목록만 노출한다.', async () => {
    render(<EventList />);

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    fireEvent.change(searchInput, { target: { value: 'Event 1' } });

    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });
});
