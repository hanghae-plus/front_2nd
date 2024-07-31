import { describe, test, expect } from "vitest";
import { getDaysInMonth, getWeekDates, formatWeek, formatMonth, isDateInRange } from '../utils/dateUtils.js';


describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29); // 2024년 2월은 윤년이므로 29일
      expect(getDaysInMonth(2023, 1)).toBe(31); // 2023년 1월은 31일
      expect(getDaysInMonth(2023, 4)).toBe(30); // 2023년 4월은 30일
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date('2024-07-30');
      const weekDates = getWeekDates(date).map(d => d.toISOString().slice(0, 10));
      expect(weekDates).toEqual(['2024-07-28', '2024-07-29', '2024-07-30', '2024-07-31', '2024-08-01', '2024-08-02', '2024-08-03']);
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date('2023-12-31');
      const weekDates = getWeekDates(date).map(d => d.toISOString().slice(0, 10));
      expect(weekDates).toEqual(['2023-12-31', '2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06']);
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-07-30');
      expect(formatWeek(date)).toBe('2024-07-28, 2024-07-29, 2024-07-30, 2024-07-31, 2024-08-01, 2024-08-02, 2024-08-03');
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-07-30');
      expect(formatMonth(date)).toBe('2024-07');
    });
  });

  describe('isDateInRange 함수', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const date = new Date('2024-07-30');
      const startDate = new Date('2024-07-01');
      const endDate = new Date('2024-07-31');
      expect(isDateInRange(date, startDate, endDate)).toBe(true);
      expect(isDateInRange(new Date('2024-08-01'), startDate, endDate)).toBe(false);
    });
  });
});
