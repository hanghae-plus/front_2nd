import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
} from 'vitest';
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
import { startServer } from '../../server';
import { Server } from 'http';

let server: Server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(() => {
  if (server) {
    server.close();
  }
});

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

describe('반복 이벤트 테스트', () => {
  test('createRecurringEvents 함수는 올바른 수의 이벤트를 생성한다', () => {
    const event = {
      id: 1,
      title: '테스트 이벤트',
      date: '2024-08-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '테스트 설명',
      location: '테스트 장소',
      category: '테스트 카테고리',
      repeat: { type: 'weekly' as const, interval: 1 },
      notificationTime: 10,
    };
    const endDate = '2024-08-22'; // 시작일로부터 3주 후
    const recurringEvents = createRecurringEvents(event, endDate);
    expect(recurringEvents).toHaveLength(4); // 원본 이벤트 + 3개의 반복 이벤트
  });
});

describe('이벤트 저장', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('saveEvent 함수는 반복 이벤트에 대해 여러 이벤트를 생성한다', async () => {
    const user = userEvent.setup();
    render(<App serverUrl="http://localhost:3001" />);

    const title = '반복 테스트 이벤트';

    // 이벤트 폼 작성
    await user.type(screen.getByLabelText('제목'), title);
    await user.type(screen.getByLabelText('날짜'), '2024-08-01');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '10:00');
    await user.click(screen.getByLabelText('반복 일정'));
    await user.selectOptions(screen.getByLabelText('반복 유형'), 'weekly');
    await user.type(screen.getByLabelText('반복 종료일'), '2024-08-22');

    const addButton = screen.getByRole('button', { name: '일정 추가' });

    await user.click(addButton);

    await waitFor(() => {
      const eventList = screen.getByTestId('event-list');

      const newEventElement = within(eventList).getAllByText(title)[0];
      expect(newEventElement).toBeInTheDocument();

      const newEventElements = within(eventList).getAllByText(title);

      expect(newEventElements).toHaveLength(4);
    });
  });
});
