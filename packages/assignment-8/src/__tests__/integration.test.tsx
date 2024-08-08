import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  addDays,
  addWeeks,
  addYears,
  createRecurringEvents,
} from '../utils/dateUtils.ts';
import App from '../App.tsx';

describe('날짜 유틸리티 함수 테스트', () => {
  test('addDays 함수는 정확한 일수를 더한다', () => {
    const date = new Date('2024-01-01');
    expect(addDays(date, 5)).toEqual(new Date('2024-01-06'));
  });

  test('addWeeks 함수는 정확한 주수를 더한다', () => {
    const date = new Date('2024-01-01');
    expect(addWeeks(date, 2)).toEqual(new Date('2024-01-15'));
  });

  test('addYears 함수는 정확한 연수를 더한다', () => {
    const date = new Date('2024-01-01');
    expect(addYears(date, 1)).toEqual(new Date('2025-01-01'));
  });
});

describe('반복 이벤트 생성 테스트', () => {
  test('createRecurringEvents 함수는 올바른 수의 이벤트를 생성한다', () => {
    const event = {
      id: Number(Date.now()) + Number(Math.floor(Math.random() * 1000)),
      title: '테스트 이벤트',
      date: '2024-08-01',
      startTime: '09:00',
      endTime: '10:00',
      repeat: { type: 'weekly' as const, interval: 1 },
    };
    const endDate = '2024-08-22'; // 시작일로부터 3주 후
    const recurringEvents = createRecurringEvents(event, endDate);
    expect(recurringEvents).toHaveLength(4); // 원본 이벤트 + 3개의 반복 이벤트
  });

  test('31일 일정을 매월 반복일정으로 설정하면 매월 말일이 반복일로 설정된다.', async () => {
    const event = {
      id: Number(Date.now()) + Number(Math.floor(Math.random() * 1000)),
      title: '말일 반복 테스트 이벤트',
      date: '2024-08-31',
      startTime: '09:00',
      endTime: '10:00',
      repeat: { type: 'monthly' as const, interval: 1 },
    };
    const endDate = '2025-03-01';
    const recurringEvents = createRecurringEvents(event, endDate);

    expect(recurringEvents).toHaveLength(7); // 2024-08-31부터 2025-02-28까지 7개의 이벤트

    const expectedDates = [
      '2024-08-31',
      '2024-09-30',
      '2024-10-31',
      '2024-11-30',
      '2024-12-31',
      '2025-01-31',
      '2025-02-28',
    ];

    recurringEvents.forEach((recEvent, index) => {
      expect(recEvent.date).toBe(expectedDates[index]);
      expect(recEvent.startTime).toBe(event.startTime);
      expect(recEvent.endTime).toBe(event.endTime);
      expect(recEvent.title).toBe(event.title);

      // 각 날짜가 해당 월의 마지막 날인지 확인
      const [year, month] = recEvent.date.split('-').map(Number);
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const [, , day] = recEvent.date.split('-').map(Number);
      expect(day).toBe(lastDayOfMonth);
    });
  });
});

describe('반복 이벤트 저장 테스트', () => {
  test('saveEvent 함수는 반복 이벤트에 대해 여러 이벤트를 생성한다', async () => {
    const user = userEvent.setup();

    const mockFetchEvents = vi.fn().mockResolvedValue([
      {
        id: 1,
        title: '반복 테스트 이벤트',
        date: '2024-08-01',
        startTime: '09:00',
        endTime: '10:00',
      },
      {
        id: 2,
        title: '반복 테스트 이벤트',
        date: '2024-08-08',
        startTime: '09:00',
        endTime: '10:00',
      },
      {
        id: 3,
        title: '반복 테스트 이벤트',
        date: '2024-08-15',
        startTime: '09:00',
        endTime: '10:00',
      },
      {
        id: 4,
        title: '반복 테스트 이벤트',
        date: '2024-08-22',
        startTime: '09:00',
        endTime: '10:00',
      },
    ]);

    render(<App fetchEventsFunction={mockFetchEvents} />);

    const title = '반복 테스트 이벤트';

    // 이벤트 폼 작성
    await user.type(screen.getByLabelText('제목'), title);
    await user.type(screen.getByLabelText('날짜'), '2024-08-01');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '10:00');
    await user.click(screen.getByLabelText('반복 일정'));
    await user.selectOptions(screen.getByLabelText('반복 유형'), 'weekly');
    await user.type(screen.getByLabelText('반복 종료일'), '2024-08-22');

    const addButton = screen.getByTestId('event-submit-button');
    await user.click(addButton);

    await waitFor(() => {
      const eventList = screen.getByTestId('event-list');
      const newEventElements = within(eventList).getAllByText(title);
      expect(newEventElements).toHaveLength(4);
    });

    // fetchEvents 함수가 호출되었는지 확인
    expect(mockFetchEvents).toHaveBeenCalled();
  });
});
