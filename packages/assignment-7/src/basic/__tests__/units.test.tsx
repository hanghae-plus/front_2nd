// src/basic/__tests__/units.test.tsx
import { describe, expect, test } from 'vitest'
import {
  getDaysInMonth,
  getWeekDates,
  formatWeek,
  formatMonth,
  isDateInRange,
} from '../../utils/dateUtils.ts';

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => { 
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31); // January
      expect(getDaysInMonth(2024, 1)).toBe(29); // February (leap year)
      expect(getDaysInMonth(2024, 2)).toBe(31); // March
      expect(getDaysInMonth(2024, 3)).toBe(30); // April
      expect(getDaysInMonth(2024, 4)).toBe(31); // May
      expect(getDaysInMonth(2024, 5)).toBe(30); // June
      expect(getDaysInMonth(2024, 6)).toBe(31); // July
      expect(getDaysInMonth(2024, 7)).toBe(31); // August
      expect(getDaysInMonth(2024, 8)).toBe(30); // September
      expect(getDaysInMonth(2024, 9)).toBe(31); // October
      expect(getDaysInMonth(2024, 10)).toBe(30); // November
      expect(getDaysInMonth(2024, 11)).toBe(31); // December
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date('2024-08-15'); // Thursday
      const weekDates = getWeekDates(date);
      const expectedDates = [
        new Date('2024-08-12'), // Monday
        new Date('2024-08-13'),
        new Date('2024-08-14'),
        new Date('2024-08-15'),
        new Date('2024-08-16'),
        new Date('2024-08-17'),
        new Date('2024-08-18'), // Sunday
      ];
      expect(weekDates).toEqual(expectedDates);
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date('2023-12-31'); // Sunday
      const weekDates = getWeekDates(date);
      const expectedDates = [
        new Date('2023-12-25'), // Monday
        new Date('2023-12-26'),
        new Date('2023-12-27'),
        new Date('2023-12-28'),
        new Date('2023-12-29'),
        new Date('2023-12-30'),
        new Date('2023-12-31'), // Sunday
      ];
      expect(weekDates).toEqual(expectedDates);
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-08-15'); // Thursday
      const formattedWeek = formatWeek(date);
      const expectedFormat = '2024년 8월 3주';
      expect(formattedWeek).toBe(expectedFormat);
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-08-15'); // August
      const formattedMonth = formatMonth(date);
      const expectedFormat = '2024년 8월';
      expect(formattedMonth).toBe(expectedFormat);
    });
  });

  describe('isDateInRange 함수', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const date = new Date('2024-08-15');
      const startDate = new Date('2024-08-01');
      const endDate = new Date('2024-08-31');
      const inRange = isDateInRange(date, startDate, endDate);
      expect(inRange).toBe(true);

      const outOfRangeDate = new Date('2024-09-01');
      const notInRange = isDateInRange(outOfRangeDate, startDate, endDate);
      expect(notInRange).toBe(false);
    });
  });
});
