import { describe, expect, test } from 'vitest';
import { getDaysInMonth, getWeekDates, formatWeek, formatMonth, isDateInRange } from '../utils/index';

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    const testCases: [number, number, number][] = [
      [2023, 1, 31], // 1월
      [2023, 2, 28], // 2월 (평년)
      [2024, 2, 29], // 2월 (윤년)
      [2023, 4, 30], // 4월
      [2023, 8, 31], // 8월
      [2023, 12, 31], // 12월
    ];

    //매개
    test.each(testCases)(`%i년 %i월은 %i일까지 있다`, (year, month, expectedDays) => {
      expect(getDaysInMonth(year, month - 1)).toBe(expectedDays);
    });
  });

  describe('getWeekDates 함수', () => {
    describe('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date('2024-08-01'); // 2024년 8월 1일 (목요일)
      const weekDates = getWeekDates(date);
      const testCases = [
        [0, 29],
        [1, 30],
        [2, 31],
        [3, 1],
        [4, 2],
        [5, 3],
        [6, 4],
      ];

      // 주어진 날짜가 속한 주의 월요일부터 일요일까지의 날짜를 확인
      test.each(testCases)(`2024-08-01의 주의 %i번째 날짜는 %i일이다.`, (index, day) => {
        expect(weekDates[index].getDate()).toBe(day);
      });
    });
    describe('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date('2024-12-30'); // 2024년 8월 1일 (목요일)
      const weekDates = getWeekDates(date);
      const testCases = [
        [0, 30],
        [1, 31],
        [2, 1],
        [3, 2],
        [4, 3],
        [5, 4],
        [6, 5],
      ];

      // 주어진 날짜가 속한 주의 월요일부터 일요일까지의 날짜를 확인
      test.each(testCases)(`2024-12-30의 주의 %i번째 날짜는 %i일이다.`, (index, day) => {
        expect(weekDates[index].getDate()).toBe(day);
      });
    });
  });

  describe('formatWeek 함수', () => {
    const testCases: [Date, string][] = [
      [new Date('2024-01-01'), '2024년 1월 1주'],
      [new Date('2024-01-08'), '2024년 1월 2주'],
      [new Date('2024-02-15'), '2024년 2월 3주'],
      [new Date('2024-03-31'), '2024년 3월 5주'],
      [new Date('2024-12-25'), '2024년 12월 4주'],
    ];

    test.each(testCases)('날짜 %s의 주는 %s이다.', (inputDate, expectedOutput) => {
      expect(formatWeek(inputDate)).toBe(expectedOutput);
    });

    test('월의 마지막 날이 새로운 주의 시작인 경우를 정확히 처리한다', () => {
      const lastDayOfMonth = new Date('2024-01-31'); // 수요일
      expect(formatWeek(lastDayOfMonth)).toBe('2024년 1월 5주');

      const firstDayOfNextMonth = new Date('2024-02-01'); // 목요일
      expect(formatWeek(firstDayOfNextMonth)).toBe('2024년 2월 1주');
    });
  });

  describe('formatMonth 함수', () => {
    const testCases: [Date, string][] = [
      [new Date('2024-01-15'), '2024년 1월'],
      [new Date('2024-02-29'), '2024년 2월'],
      [new Date('2024-12-31'), '2024년 12월'],
      [new Date('2025-06-01'), '2025년 6월'],
    ];

    test.each(testCases)('날짜 %s의 월은 %s이다.', (inputDate, expectedOutput) => {
      expect(formatMonth(inputDate)).toBe(expectedOutput);
    });

    test('연도가 바뀌는 경우를 정확히 처리한다', () => {
      const lastDayOfYear = new Date('2024-12-31');
      expect(formatMonth(lastDayOfYear)).toBe('2024년 12월');

      const firstDayOfNextYear = new Date('2025-01-01');
      expect(formatMonth(firstDayOfNextYear)).toBe('2025년 1월');
    });
  });

  describe('isDateInRange 함수', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      // 범위 내의 날짜들
      expect(isDateInRange(new Date('2024-06-15'), startDate, endDate)).toBe(true);
      expect(isDateInRange(new Date('2024-01-01'), startDate, endDate)).toBe(true);
      expect(isDateInRange(new Date('2024-12-31'), startDate, endDate)).toBe(true);

      // 범위 밖의 날짜들
      expect(isDateInRange(new Date('2023-12-31'), startDate, endDate)).toBe(false);
      expect(isDateInRange(new Date('2025-01-01'), startDate, endDate)).toBe(false);

      // 시간을 포함한 날짜 범위
      const startWithTime = new Date('2024-01-01T10:00:00');
      const endWithTime = new Date('2024-01-01T18:00:00');
      expect(isDateInRange(new Date('2024-01-01T12:00:00'), startWithTime, endWithTime)).toBe(true);
      expect(isDateInRange(new Date('2024-01-01T09:59:59'), startWithTime, endWithTime)).toBe(false);

      // 경계값 테스트
      const sameDate = new Date('2024-03-15');
      expect(isDateInRange(sameDate, sameDate, sameDate)).toBe(true);

      // 잘못된 범위 테스트
      const laterStart = new Date('2024-12-31');
      const earlierEnd = new Date('2024-01-01');
      expect(isDateInRange(new Date('2024-06-15'), laterStart, earlierEnd)).toBe(false);
    });
  });
});
