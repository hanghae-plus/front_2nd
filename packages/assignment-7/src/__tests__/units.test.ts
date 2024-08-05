import { describe, expect, test } from 'vitest';
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getWeekDates,
  isDateInRange,
} from '../utils/date';

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(getDaysInMonth(2023, 11)).toBe(31); // 2023년 12월
      expect(getDaysInMonth(2024, 0)).toBe(31); // 2024년 1월
      expect(getDaysInMonth(2024, 1)).toBe(29); // 2024년 2월
      expect(getDaysInMonth(2024, 6)).toBe(31); // 2024년 7월
      expect(getDaysInMonth(2024, 7)).toBe(31); // 2024년 8월
      expect(getDaysInMonth(2024, 11)).toBe(31); // 2024년 12월
      expect(getDaysInMonth(2025, 0)).toBe(31); // 2025년 1월
      expect(getDaysInMonth(2025, 1)).toBe(28); // 2025년 2월
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      expect(getWeekDates(new Date(2024, 0, 1))).toEqual([
        new Date(2024, 0, 1),
        new Date(2024, 0, 2),
        new Date(2024, 0, 3),
        new Date(2024, 0, 4),
        new Date(2024, 0, 5),
        new Date(2024, 0, 6),
        new Date(2024, 0, 7),
      ]);
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      expect(getWeekDates(new Date(2024, 11, 31))).toEqual([
        new Date(2024, 11, 30),
        new Date(2024, 11, 31),
        new Date(2025, 0, 1),
        new Date(2025, 0, 2),
        new Date(2025, 0, 3),
        new Date(2025, 0, 4),
        new Date(2025, 0, 5),
      ]);
      expect(getWeekDates(new Date(2026, 0, 1))).toEqual([
        new Date(2025, 11, 29),
        new Date(2025, 11, 30),
        new Date(2025, 11, 31),
        new Date(2026, 0, 1),
        new Date(2026, 0, 2),
        new Date(2026, 0, 3),
        new Date(2026, 0, 4),
      ]);
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      expect(formatWeek(new Date(2024, 0, 1))).toBe('2024년 1월 1주');
      expect(formatWeek(new Date(2024, 0, 8))).toBe('2024년 1월 2주');
      expect(formatWeek(new Date(2024, 11, 31))).toBe('2024년 12월 5주');
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      expect(formatMonth(new Date(2024, 0, 1))).toBe('2024년 1월');
      expect(formatMonth(new Date(2024, 11, 31))).toBe('2024년 12월');
    });
  });

  describe('isDateInRange 함수', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정히 판단한다', () => {
      expect(
        isDateInRange(
          new Date(2024, 0, 1),
          new Date(2024, 0, 1),
          new Date(2024, 0, 31)
        )
      ).toBe(true);
      expect(
        isDateInRange(
          new Date(2024, 0, 32),
          new Date(2024, 0, 1),
          new Date(2024, 0, 31)
        )
      ).toBe(false);
    });
  });
});
