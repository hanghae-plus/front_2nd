import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import {  render, screen, waitFor, within } from "@testing-library/react";
import App from '../App';
import { userEvent } from "@testing-library/user-event";
import createMockServer from "./createMockServer";
import { Event } from "../types";

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


beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setInterval', 'Date']
  });
  vi.setSystemTime(new Date(2024, 7, 1));
})

beforeAll(() => server.listen());

afterAll(() => server.close());

afterEach(() => {
  events.length = 0;
  events.push({ ...MOCK_EVENT_1 });
  vi.useRealTimers();
});


describe('반복 일정에 대한 테스트', () => {
  describe('반복 유형 선택', () => {
    test('반복 설정 활성화 시 매일, 매주, 매월, 매년 4가지 유형을 선택할 수 있다.', async () => {
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
    test('각 반복 유형에 대해 간격을 설정할 수 있다.', async () => {
      vi.setSystemTime(new Date('2024-08-05'));
      render(<App />);

      // 일정 추가
      await userEvent.clear(screen.getByLabelText(/제목/));
      await userEvent.type(screen.getByLabelText(/제목/), '간격 설정 할 수 있니?');
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
        const events = within(eventList).getAllByText(/간격 설정 할 수 있니?/);
        // events[0] -> target EventDetailView with own testid
        const event = events[0].closest(
          '[data-testid^="event-item-"]'
        ) as HTMLElement;

        if (event === null) {
          throw new Error('Cannot find EventDetailView');
        }
        if (event !== null) {
          expect(within(event).getByText(/간격 설정 할 수 있니?/)).toBeInTheDocument();
          expect(
            within(event).getByText(/2024-08-08 09:00 - 10:00/)
          ).toBeInTheDocument();
          expect(within(event).getByText(/반복: 1월마다/)).toBeInTheDocument();
        }
      });
    });
  });
  describe('반복 일정 표시', () => {
    test('유형 weekly, 단위 1일 때, 🔄 이모지가 붙은 일정이 캘린더에 5회 추가되는지 확인한다.', async () => {
      vi.setSystemTime(new Date('2024-08-01'));
      render(<App />);
      const title = '이걸 매주 한다고?'

      // 일정 추가
      await userEvent.clear(screen.getByLabelText(/제목/));
      await userEvent.type(screen.getByLabelText(/제목/), title);
      await userEvent.clear(screen.getByLabelText(/날짜/));
      await userEvent.type(screen.getByLabelText(/날짜/), '2024-08-01');
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
      await userEvent.selectOptions(repeatTypeSelect, 'weekly');
      expect(repeatTypeSelect).toHaveValue('weekly');

      const repeatIntervalInput = screen.getByLabelText(/반복 간격/);
      await userEvent.clear(repeatIntervalInput);
      await userEvent.type(repeatIntervalInput, '1');
      expect(repeatIntervalInput).toHaveValue(1);

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);
      
      // 이모지가 추가로 붙은 일정이 캘린더에 5회 노출되어야 함
      expect(screen.queryAllByText('🔄'+title).length).toBe(5);
    });
  });
});