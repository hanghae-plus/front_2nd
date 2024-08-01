import { describe, expect, test } from 'vitest';

import { getDaysInMonth, getWeekDates, isDateInRange } from '../lib/utils/date';
import { formatWeek, formatMonth } from '../lib/utils/dateFormat';

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(getDaysInMonth(2021, 0)).toBe(31);
      expect(getDaysInMonth(2021, 1)).toBe(28);
      expect(getDaysInMonth(2021, 2)).toBe(31);
      expect(getDaysInMonth(2021, 3)).toBe(30);
      expect(getDaysInMonth(2021, 4)).toBe(31);
      expect(getDaysInMonth(2021, 5)).toBe(30);
      expect(getDaysInMonth(2021, 6)).toBe(31);
      expect(getDaysInMonth(2021, 7)).toBe(31);
      expect(getDaysInMonth(2021, 8)).toBe(30);
      expect(getDaysInMonth(2021, 9)).toBe(31);
      expect(getDaysInMonth(2021, 10)).toBe(30);
      expect(getDaysInMonth(2021, 11)).toBe(31);
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      expect(getWeekDates(new Date('2024-07-29'))).toEqual([
        new Date('2024-07-28'),
        new Date('2024-07-29'),
        new Date('2024-07-30'),
        new Date('2024-07-31'),
        new Date('2024-08-01'),
        new Date('2024-08-02'),
        new Date('2024-08-03'),
      ]);
    });
    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      expect(getWeekDates(new Date('2023-12-31'))).toEqual([
        new Date('2023-12-31'),
        new Date('2024-01-01'),
        new Date('2024-01-02'),
        new Date('2024-01-03'),
        new Date('2024-01-04'),
        new Date('2024-01-05'),
        new Date('2024-01-06'),
      ]);
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      expect(formatWeek(new Date('2024-07-29'))).toBe('2024년 7월 5주');
      expect(formatWeek(new Date('2022-12-29'))).toBe('2022년 12월 5주');
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      expect(formatMonth(new Date('2024-07-29'))).toBe('2024년 7월');
      expect(formatMonth(new Date('2022-12-29'))).toBe('2022년 12월');
    });
  });

  describe('isDateInRange 함수', () => {
    describe('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const currentDate = new Date('2024-07-29');
      test('view가 week일 때', () => {
        expect(isDateInRange(new Date('2024-07-29'), currentDate, 'week')).toBe(
          true
        );
        expect(isDateInRange(new Date('2024-07-27'), currentDate, 'week')).toBe(
          false
        );
      });
      test('view가 month일 때', () => {
        expect(
          isDateInRange(new Date('2024-07-29'), currentDate, 'month')
        ).toBe(true);
        expect(
          isDateInRange(new Date('2024-06-29'), currentDate, 'month')
        ).toBe(false);
      });
    });
  });
});
