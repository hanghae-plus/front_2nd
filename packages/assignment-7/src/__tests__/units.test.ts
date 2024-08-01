import { describe, expect, test } from 'vitest';
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getWeekDates,
} from '../utils';

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
      expect(getDaysInMonth(2024, 1)).toBe(29);
      expect(getDaysInMonth(2024, 2)).toBe(31);
      expect(getDaysInMonth(2024, 3)).toBe(30);
      expect(getDaysInMonth(2024, 4)).toBe(31);
      expect(getDaysInMonth(2024, 5)).toBe(30);
      expect(getDaysInMonth(2024, 6)).toBe(31);
      expect(getDaysInMonth(2024, 7)).toBe(31);
      expect(getDaysInMonth(2024, 8)).toBe(30);
      expect(getDaysInMonth(2024, 9)).toBe(31);
      expect(getDaysInMonth(2024, 10)).toBe(30);
      expect(getDaysInMonth(2024, 11)).toBe(31);
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date(2024, 7, 14);
      const weekDates = getWeekDates(date).map((d) => d.toDateString());
      expect(weekDates).toEqual([
        new Date(2024, 7, 12).toDateString(),
        new Date(2024, 7, 13).toDateString(),
        new Date(2024, 7, 14).toDateString(),
        new Date(2024, 7, 15).toDateString(),
        new Date(2024, 7, 16).toDateString(),
        new Date(2024, 7, 17).toDateString(),
        new Date(2024, 7, 18).toDateString(),
      ]);
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date(2024, 11, 31);
      const weekDates = getWeekDates(date).map((d) => d.toDateString());
      expect(weekDates).toEqual([
        new Date(2024, 11, 30).toDateString(),
        new Date(2024, 11, 31).toDateString(),
        new Date(2025, 0, 1).toDateString(),
        new Date(2025, 0, 2).toDateString(),
        new Date(2025, 0, 3).toDateString(),
        new Date(2025, 0, 4).toDateString(),
        new Date(2025, 0, 5).toDateString(),
      ]);
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date();
      expect(formatWeek(date)).toBe('2024년 8월 1주');
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date();
      expect(formatMonth(date)).toBe('2024년 8월');
    });
  });
});
