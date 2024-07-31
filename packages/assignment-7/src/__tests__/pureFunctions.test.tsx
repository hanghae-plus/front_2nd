import { describe, test, expect } from "vitest";
import { getDaysInMonth, getWeekDates, formatWeek, formatMonth, isDateInRange } from '../utils/dateUtils';

describe('dateUtils', () => {
  describe('getDaysInMonth 함수', () => {
    test('2023년 7월의 일 수를 반환한다', () => {
      expect(getDaysInMonth(2023, 7)).toBe(31);
    });

    test('2024년 2월의 일 수를 반환한다 (윤년)', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29);
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date('2023-07-30');
      const weekDates = getWeekDates(date).map(d => d.toISOString().slice(0, 10));
      expect(weekDates).toEqual([
        '2023-07-30', '2023-07-31', '2023-08-01',
        '2023-08-02', '2023-08-03', '2023-08-04', '2023-08-05'
      ]);
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2023-07-30');
      expect(formatWeek(date)).toBe('2023-07-30, 2023-07-31, 2023-08-01, 2023-08-02, 2023-08-03, 2023-08-04, 2023-08-05');
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2023-07-30');
      expect(formatMonth(date)).toBe('2023-07');
    });
  });

  describe('isDateInRange 함수', () => {
    test('날짜가 범위 내에 있는지 판단한다', () => {
      const date = new Date('2023-07-30');
      const startDate = new Date('2023-07-01');
      const endDate = new Date('2023-07-31');
      expect(isDateInRange(date, startDate, endDate)).toBe(true);
    });

    test('날짜가 범위 내에 없는지 판단한다', () => {
      const date = new Date('2023-08-01');
      const startDate = new Date('2023-07-01');
      const endDate = new Date('2023-07-31');
      expect(isDateInRange(date, startDate, endDate)).toBe(false);
    });
  });
});
