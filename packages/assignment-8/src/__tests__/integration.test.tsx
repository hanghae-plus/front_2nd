import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { setupServer } from 'msw/node';

import App from '../App';
import { createHandlers } from '../lib/services/mockHandlers';
import { events as originalEvents } from '../lib/services/mockData';
import { Event } from '../types/types';
import { act } from 'react';

const mockServer = setupServer();

beforeAll(() => {
  mockServer.listen();
});

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const handlers = createHandlers(originalEvents);
  mockServer.use(...handlers);
});

afterEach(() => {
  mockServer.resetHandlers();
  vi.useRealTimers();
});

afterAll(() => {
  mockServer.close();
});

describe('반복 일정에 대한 테스트', () => {
  describe('반복 유형 선택', () => {
    test('반복 설정 활성화 시 반복 설정들이 잘 나타나는지, 네가지 옵션을 잘 선택할 수 있는지 확인한다', async () => {
      render(<App />);

      const repeatLabel = screen.getByLabelText(/반복 설정/);
      expect(repeatLabel).toBeInTheDocument();

      await userEvent.click(repeatLabel);
      expect(screen.getByLabelText(/반복 유형/)).toBeInTheDocument();
      expect(screen.getByLabelText(/반복 간격/)).toBeInTheDocument();
      expect(screen.getByLabelText(/반복 종료일/)).toBeInTheDocument();

      const repeatTypeSelect = screen.getByLabelText(/반복 유형/);

      const options = within(repeatTypeSelect).getAllByRole('option');
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent('매일');
      expect(options[0]).toHaveValue('daily');
      expect(options[1]).toHaveTextContent('매주');
      expect(options[1]).toHaveValue('weekly');
      expect(options[2]).toHaveTextContent('매월');
      expect(options[2]).toHaveValue('monthly');
      expect(options[3]).toHaveTextContent('매년');
      expect(options[3]).toHaveValue('yearly');

      await userEvent.selectOptions(repeatTypeSelect, 'weekly');
      expect(repeatTypeSelect).toHaveValue('weekly');

      await userEvent.selectOptions(repeatTypeSelect, 'monthly');
      expect(repeatTypeSelect).toHaveValue('monthly');
    });
  });
  describe('반복 간격 설정', () => {
    test('반복 간격을 설정할 수 있고, 저장할 수 있는지 확인한다.', async () => {
      vi.setSystemTime(new Date('2024-08-05'));
      render(<App />);

      // 새로운 일정 추가 베이스
      await userEvent.clear(screen.getByLabelText(/제목/));
      await userEvent.type(screen.getByLabelText(/제목/), 'Test 일정');
      await userEvent.clear(screen.getByLabelText(/날짜/));
      await userEvent.type(screen.getByLabelText(/날짜/), '2024-08-08');
      await userEvent.type(screen.getByLabelText(/시작 시간/), '09:00');
      await userEvent.type(screen.getByLabelText(/종료 시간/), '10:00');

      // 반복 설정
      const repeatLabel = screen.getByLabelText(/반복 설정/);
      expect(repeatLabel).toBeInTheDocument();

      await userEvent.click(repeatLabel);
      expect(screen.getByLabelText(/반복 유형/)).toBeInTheDocument();
      expect(screen.getByLabelText(/반복 간격/)).toBeInTheDocument();
      expect(screen.getByLabelText(/반복 종료일/)).toBeInTheDocument();

      const repeatTypeSelect = screen.getByLabelText(/반복 유형/);
      await userEvent.selectOptions(repeatTypeSelect, 'monthly');

      const repeatIntervalInput = screen.getByLabelText(/반복 간격/);
      await userEvent.clear(repeatIntervalInput);
      await userEvent.type(repeatIntervalInput, '1');
      expect(repeatIntervalInput).toHaveValue(1);

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      const eventList = screen.getByTestId('event-list');
      await waitFor(() => {
        const events = within(eventList).getAllByText(/Test 일정/);
        // events[0] -> target EventDetailView with own testid
        const event = events[0].closest(
          '[data-testid^="event-item-"]'
        ) as HTMLElement;

        if (event === null) {
          throw new Error('EventDetailView를 찾을 수 없습니다.');
        }
        if (event !== null) {
          expect(within(event).getByText(/Test 일정/)).toBeInTheDocument();
          expect(
            within(event).getByText(/2024-08-08 09:00 - 10:00/)
          ).toBeInTheDocument();
          expect(within(event).getByText(/반복: 1월마다/)).toBeInTheDocument();
        }
      });
    });
    test('반복 간격을 0으로 설정하는 경우 interval 1로 저장되는지 확인한다.', async () => {
      vi.setSystemTime(new Date('2024-08-05'));
      render(<App />);

      // 새로운 일정 추가 베이스
      await userEvent.clear(screen.getByLabelText(/제목/));
      await userEvent.type(screen.getByLabelText(/제목/), 'Test 일정');
      await userEvent.clear(screen.getByLabelText(/날짜/));
      await userEvent.type(screen.getByLabelText(/날짜/), '2024-08-08');
      await userEvent.type(screen.getByLabelText(/시작 시간/), '09:00');
      await userEvent.type(screen.getByLabelText(/종료 시간/), '10:00');

      // 반복 설정
      const repeatLabel = screen.getByLabelText(/반복 설정/);
      expect(repeatLabel).toBeInTheDocument();

      await userEvent.click(repeatLabel);
      expect(screen.getByLabelText(/반복 유형/)).toBeInTheDocument();
      expect(screen.getByLabelText(/반복 간격/)).toBeInTheDocument();
      expect(screen.getByLabelText(/반복 종료일/)).toBeInTheDocument();

      const repeatTypeSelect = screen.getByLabelText(/반복 유형/);
      await userEvent.selectOptions(repeatTypeSelect, 'monthly');

      const repeatIntervalInput = screen.getByLabelText(/반복 간격/);
      await userEvent.clear(repeatIntervalInput);
      await userEvent.type(repeatIntervalInput, '0');
      expect(repeatIntervalInput).toHaveValue(0);

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      const eventList = screen.getByTestId('event-list');
      await waitFor(() => {
        const events = within(eventList).getAllByText(/Test 일정/);
        // events[0] -> target EventDetailView with own testid
        const event = events[0].closest(
          '[data-testid^="event-item-"]'
        ) as HTMLElement;

        if (event === null) {
          throw new Error('EventDetailView를 찾을 수 없습니다.');
        }
        if (event !== null) {
          expect(within(event).getByText(/Test 일정/)).toBeInTheDocument();
          expect(
            within(event).getByText(/2024-08-08 09:00 - 10:00/)
          ).toBeInTheDocument();
          expect(within(event).getByText(/반복: 1월마다/)).toBeInTheDocument();
        }
      });
    });
  });
  describe('반복 일정 표시', () => {
    test('유형 daily, 단위 2일 때, 일정이 반복하여 나타나는지 확인한다.', async () => {
      const testEvents: Event[] = [
        {
          id: 1,
          title: 'Test 일정',
          date: '2024-08-12',
          startTime: '10:00',
          endTime: '12:00',
          repeat: {
            type: 'daily',
            interval: 2,
            endDate: '2024-08-24',
          },
        },
      ];
      const handlers = createHandlers(testEvents);
      mockServer.use(...handlers);
      try {
        vi.setSystemTime(new Date('2024-08-10'));

        await act(async () => {
          render(<App />);
          await vi.advanceTimersByTimeAsync(1500);
        });

        const monthView = screen.getByTestId('month-view');
        const viewHeading = within(monthView).getByRole('heading');
        expect(viewHeading).toHaveTextContent('2024년 8월');
        const cells = within(monthView).getAllByRole('cell');
        const eventCells = cells.filter((cell) => {
          const viewBox = within(cell).queryByTestId('event-month-view-1');
          return viewBox !== null;
        });
        expect(eventCells).toHaveLength(7);
        const eventDates = eventCells.map((cell) => {
          const date = within(cell).getByText(/^(\d+)$/);
          return date.textContent;
        });
        expect(eventDates).toEqual(['12', '14', '16', '18', '20', '22', '24']);
      } finally {
        mockServer.resetHandlers();
        mockServer.use(...createHandlers(originalEvents));
      }
    });
    test('유형 weekly, 단위 1일 때, 일정이 반복하여 나타나는지 확인한다.', async () => {
      // 테스트용 일정 데이터
      const testEvents: Event[] = [
        {
          id: 1,
          title: 'Test 일정',
          date: '2024-08-09',
          startTime: '09:00',
          endTime: '11:00',
          repeat: {
            type: 'weekly',
            interval: 1,
            endDate: '2024-09-11',
          },
        },
      ];
      const handlers = createHandlers(testEvents);
      mockServer.use(...handlers);
      try {
        vi.setSystemTime(new Date('2024-08-03'));

        await act(async () => {
          render(<App />);
          await vi.advanceTimersByTimeAsync(1500);
        });

        const monthView = screen.getByTestId('month-view');
        const viewHeading = within(monthView).getByRole('heading');
        expect(viewHeading).toHaveTextContent('2024년 8월');
        const cells = within(monthView).getAllByRole('cell');
        const eventCells = cells.filter((cell) => {
          const viewBox = within(cell).queryByTestId('event-month-view-1');
          return viewBox !== null;
        });
        expect(eventCells).toHaveLength(4);
        const eventDates = eventCells.map((cell) => {
          const date = within(cell).getByText(/^(\d+)$/);
          return date.textContent;
        });
        expect(eventDates).toEqual(['9', '16', '23', '30']);
      } finally {
        mockServer.resetHandlers();
        mockServer.use(...createHandlers(originalEvents));
      }
    });
  });
  //   describe('예외 날짜 처리', async () => {
  //     render(<App />);
  //   });
  //   describe('반복 종료 조건 설정', async () => {
  //     render(<App />);
  //   });
  //   describe('요일 지정(주간 반복의 경우)', async () => {
  //     render(<App />);
  //   });
  //   describe('월간 반복의 경우', async () => {
  //     render(<App />);
  //   });
  //   describe('반복 일정의 수정', async () => {
  //     render(<App />);
  //   });
});
