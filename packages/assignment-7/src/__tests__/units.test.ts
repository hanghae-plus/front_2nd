import { describe, test } from 'vitest';
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getWeekDates,
  isDateInRange,
} from '../utils/temp';

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('31일인 달에 대해 정확히 반환한다', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31); // 1월
      expect(getDaysInMonth(2024, 2)).toBe(31); // 3월
      expect(getDaysInMonth(2024, 4)).toBe(31); // 5월
      expect(getDaysInMonth(2024, 6)).toBe(31); // 7월
      expect(getDaysInMonth(2024, 7)).toBe(31); // 8월
      expect(getDaysInMonth(2024, 9)).toBe(31); // 10월
      expect(getDaysInMonth(2024, 11)).toBe(31); // 12월
    });

    test('30일인 달에 대해 정확히 반환한다', () => {
      expect(getDaysInMonth(2024, 3)).toBe(30); // 4월
      expect(getDaysInMonth(2024, 5)).toBe(30); // 6월
      expect(getDaysInMonth(2024, 8)).toBe(30); // 9월
      expect(getDaysInMonth(2024, 10)).toBe(30); // 11월
    });

    test('2월에 대해 정확히 반환한다 (윤년)', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29); // 2024년은 윤년
    });

    test('다음 윤년이 아닌 해의 2월에 대해 정확히 반환한다', () => {
      expect(getDaysInMonth(2025, 1)).toBe(28); // 2025년은 평년
    });

    test('연도가 바뀌는 경우를 정확히 처리한다', () => {
      expect(getDaysInMonth(2024, 12)).toBe(31); // 2025년 1월로 처리됨
      expect(getDaysInMonth(2024, -1)).toBe(31); // 2023년 12월로 처리됨
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date('2024-03-06'); // 수요일
      const weekDates = getWeekDates(date);

      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-03-04');
      expect(weekDates[1].toISOString().split('T')[0]).toBe('2024-03-05');
      expect(weekDates[2].toISOString().split('T')[0]).toBe('2024-03-06');
      expect(weekDates[3].toISOString().split('T')[0]).toBe('2024-03-07');
      expect(weekDates[4].toISOString().split('T')[0]).toBe('2024-03-08');
      expect(weekDates[5].toISOString().split('T')[0]).toBe('2024-03-09');
      expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-03-10');
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date('2024-12-28'); // 2024년의 마지막 토요일
      const weekDates = getWeekDates(date);

      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-12-23');
      expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-12-29');

      const nextYearDate = new Date('2024-12-30'); // 2024년의 마지막 월요일
      const nextYearWeekDates = getWeekDates(nextYearDate);

      expect(nextYearWeekDates).toHaveLength(7);
      expect(nextYearWeekDates[0].toISOString().split('T')[0]).toBe(
        '2024-12-30'
      );
      expect(nextYearWeekDates[6].toISOString().split('T')[0]).toBe(
        '2025-01-05'
      );
    });

    test('윤년의 2월에 대해 정확한 주간 날짜를 반환한다', () => {
      const date = new Date('2024-02-29'); // 목요일 (윤년)
      const weekDates = getWeekDates(date);

      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-02-26');
      expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-03-03');
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      expect(formatWeek(new Date(2024, 0, 1))).toBe('2024년 1월 1주');

      expect(formatWeek(new Date(2024, 0, 8))).toBe('2024년 1월 2주');

      expect(formatWeek(new Date(2024, 1, 29))).toBe('2024년 2월 5주');

      expect(formatWeek(new Date(2024, 2, 31))).toBe('2024년 3월 5주');
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      expect(formatMonth(new Date(2024, 0, 1))).toBe('2024년 1월');

      expect(formatMonth(new Date(2024, 11, 31))).toBe('2024년 12월');

      expect(formatMonth(new Date(2025, 5, 15))).toBe('2025년 6월');
    });
  });

  describe('isDateInRange 함수', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const startDate = new Date(2024, 0, 1); // 2024년 1월 1일
      const endDate = new Date(2024, 11, 31); // 2024년 12월 31일

      // 범위 내의 날짜
      expect(isDateInRange(new Date(2024, 5, 15), startDate, endDate)).toBe(
        true
      );

      // 시작 날짜와 같은 경우
      expect(isDateInRange(new Date(2024, 0, 1), startDate, endDate)).toBe(
        true
      );

      // 종료 날짜와 같은 경우
      expect(isDateInRange(new Date(2024, 11, 31), startDate, endDate)).toBe(
        true
      );

      // 범위 밖의 날짜 (이전)
      expect(isDateInRange(new Date(2023, 11, 31), startDate, endDate)).toBe(
        false
      );

      // 범위 밖의 날짜 (이후)
      expect(isDateInRange(new Date(2025, 0, 1), startDate, endDate)).toBe(
        false
      );
    });

    test('시작 날짜가 종료 날짜보다 늦은 경우를 처리한다', () => {
      const startDate = new Date(2024, 11, 31); // 2024년 12월 31일
      const endDate = new Date(2024, 0, 1); // 2024년 1월 1일

      // 이 경우 항상 false를 반환해야 함
      expect(isDateInRange(new Date(2024, 5, 15), startDate, endDate)).toBe(
        false
      );
    });

    test('같은 날짜로 범위를 지정한 경우를 처리한다', () => {
      const sameDate = new Date(2024, 5, 15); // 2024년 6월 15일

      expect(isDateInRange(sameDate, sameDate, sameDate)).toBe(true);
    });
  });
});
