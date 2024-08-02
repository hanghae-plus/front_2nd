
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getDaysInMonth,
  getWeekDates,
  formatWeek,
  formatMonth,
  isDateInRange,
} from '../../src/utils/dateUtils.ts';

import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { setupServer } from "msw/node";
import { mockApiHandlers } from "../../src/basic/__tests__/mockApiHandlers.ts";

const server = setupServer(...mockApiHandlers);

// 테스트 시작 전에 목 서버를 실행
beforeAll(() => server.listen())

// 테스트 종료 후에 목 서버 종료
afterAll(() => server.close())


describe('단위 테스트: 날짜 및 시간 관리', () => {
  const user = userEvent.setup()
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      
      const inputYear = screen.getByLabelText('year-input');
      const inputMonth = screen.getByLabelText('month-input');
      const output = screen.getByLabelText('days-output');

      userEvent.type(inputYear, '2024');
      userEvent.type(inputMonth, '2');
      userEvent.click(screen.getByText('Get Days'));
      expect(output).toHaveTextContent('29');

      userEvent.clear(inputYear);
      userEvent.clear(inputMonth);
      userEvent.type(inputYear, '2023');
      userEvent.type(inputMonth, '1');
      userEvent.click(screen.getByText('Get Days'));
      expect(output).toHaveTextContent('31');

      userEvent.clear(inputYear);
      userEvent.clear(inputMonth);
      userEvent.type(inputYear, '2023');
      userEvent.type(inputMonth, '4');
      userEvent.click(screen.getByText('Get Days'));
      expect(output).toHaveTextContent('30');
    });
  });

  describe.skip('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const inputDate = screen.getByLabelText('date-input');
      const output = screen.getByLabelText('week-dates-output');

      userEvent.type(inputDate, '2024-07-30');
      userEvent.click(screen.getByText('Get Week Dates'));
      expect(output).toHaveTextContent('2024-07-28, 2024-07-29, 2024-07-30, 2024-07-31, 2024-08-01, 2024-08-02, 2024-08-03');
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const inputDate = screen.getByLabelText('date-input');
      const output = screen.getByLabelText('week-dates-output');

      userEvent.type(inputDate, '2023-12-31');
      userEvent.click(screen.getByText('Get Week Dates'));
      expect(output).toHaveTextContent('2023-12-31, 2024-01-01, 2024-01-02, 2024-01-03, 2024-01-04, 2024-01-05, 2024-01-06');
    });
  });

  describe.skip('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const inputDate = screen.getByLabelText('date-input');
      const output = screen.getByLabelText('formatted-week-output');

      userEvent.type(inputDate, '2024-07-30');
      userEvent.click(screen.getByText('Format Week'));
      expect(output).toHaveTextContent('2024-07-28, 2024-07-29, 2024-07-30, 2024-07-31, 2024-08-01, 2024-08-02, 2024-08-03');
    });
  });

  describe.skip('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const inputDate = screen.getByLabelText('date-input');
      const output = screen.getByLabelText('formatted-month-output');

      userEvent.type(inputDate, '2024-07-30');
      userEvent.click(screen.getByText('Format Month'));
      expect(output).toHaveTextContent('2024-07');
    });
  });

  describe.skip('isDateInRange 함수', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const inputDate = screen.getByLabelText('date-input');
      const inputStartDate = screen.getByLabelText('start-date-input');
      const inputEndDate = screen.getByLabelText('end-date-input');
      const output = screen.getByLabelText('date-in-range-output');

      userEvent.type(inputDate, '2024-07-30');
      userEvent.type(inputStartDate, '2024-07-01');
      userEvent.type(inputEndDate, '2024-07-31');
      userEvent.click(screen.getByText('Check Range'));
      expect(output).toHaveTextContent('true');

      userEvent.clear(inputDate);
      userEvent.type(inputDate, '2024-08-01');
      userEvent.click(screen.getByText('Check Range'));
      expect(output).toHaveTextContent('false');
    });
  });
});
