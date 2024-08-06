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
        const event = within(eventList).getByText('Test 일정');
        expect(event).toBeInTheDocument();
        const repeatInfo = within(eventList).getByText(/반복:\s\w+/);
        expect(repeatInfo).toHaveTextContent('반복: 1월마다');
      });
    });
  });
  //   describe('반복 일정 표시', async () => {
  //     render(<App />);
  //   });
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
