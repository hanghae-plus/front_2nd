import { describe, expect, it } from 'vitest';
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getWeekDates,
  isDateInRange,
} from './dateTimeUtils';

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    it('2024-01 에는 31일이 반환된다.', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
    });

    it('2024-02(윤년)에는 29일이 반환된다.', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('2024-11에는 30일이 반환된다.', () => {
      expect(getDaysInMonth(2024, 10)).toBe(30);
    });
  });

  describe('getWeekDates 함수', () => {
    it('월요일에 호출해도 월~일까지의 날짜를 반환한다.', () => {
      // G
      const monday = new Date('2024-07-22');
      const expectResult = [
        '2024. 7. 22.',
        '2024. 7. 23.',
        '2024. 7. 24.',
        '2024. 7. 25.',
        '2024. 7. 26.',
        '2024. 7. 27.',
        '2024. 7. 28.',
      ];

      // W
      const weekDates = getWeekDates(monday);

      // then
      expect(
        weekDates.map((date) => date.toLocaleDateString('ko-KR')),
      ).toStrictEqual(expectResult);
    });

    it('수요일에 호출해도 월~일까지의 날짜를 반환한다.', () => {
      // G
      const wednesday = new Date('2024-07-25');
      const expectResult = [
        '2024. 7. 22.',
        '2024. 7. 23.',
        '2024. 7. 24.',
        '2024. 7. 25.',
        '2024. 7. 26.',
        '2024. 7. 27.',
        '2024. 7. 28.',
      ];

      // W
      const weekDates = getWeekDates(wednesday);

      // then
      expect(
        weekDates.map((date) => date.toLocaleDateString('ko-KR')),
      ).toStrictEqual(expectResult);
    });

    it('일요일에 호출해도 월~일까지의 날짜를 반환한다.', () => {
      // G
      const sunday = new Date('2024-07-28');
      const expectResult = [
        '2024. 7. 22.',
        '2024. 7. 23.',
        '2024. 7. 24.',
        '2024. 7. 25.',
        '2024. 7. 26.',
        '2024. 7. 27.',
        '2024. 7. 28.',
      ];

      // W
      const weekDates = getWeekDates(sunday);

      // T
      expect(
        weekDates.map((date) => date.toLocaleDateString('ko-KR')),
      ).toStrictEqual(expectResult);
    });

    it('월을 넘어가는 주의 월~일까지의 날짜를 반환한다.', () => {
      // G
      const lastDayofMonth = new Date('2024-07-29');
      const expectResult = [
        '2024. 7. 29.',
        '2024. 7. 30.',
        '2024. 7. 31.',
        '2024. 8. 1.',
        '2024. 8. 2.',
        '2024. 8. 3.',
        '2024. 8. 4.',
      ];

      // W
      const weekDates = getWeekDates(lastDayofMonth);

      // T
      expect(
        weekDates.map((date) => date.toLocaleDateString('ko-KR')),
      ).toStrictEqual(expectResult);
    });

    it('연도를 넘어가는 주의 월~일까지의 날짜를 반환한다.', () => {
      // G
      const lastDayofMonth = new Date('2024-12-31');
      const expectResult = [
        '2024. 12. 30.',
        '2024. 12. 31.',
        '2025. 1. 1.',
        '2025. 1. 2.',
        '2025. 1. 3.',
        '2025. 1. 4.',
        '2025. 1. 5.',
      ];

      // W
      const weekDates = getWeekDates(lastDayofMonth);

      // T
      expect(
        weekDates.map((date) => date.toLocaleDateString('ko-KR')),
      ).toStrictEqual(expectResult);
    });
  });

  describe('formatWeek 함수', () => {
    it('연초의 첫째 주 정보를 올바른 형식으로 반환한다', () => {
      // G
      const januaryFirst = new Date('2024-01-01');
      const expectResult = '2024년 1월 1주';

      // W
      const result = formatWeek(januaryFirst);

      // T
      expect(result).toBe(expectResult);
    });

    it('연초의 첫째 주 일요일의 주 정보를 올바른 형식으로 반환한다', () => {
      // G
      const lastDayOfyear = new Date('2024-01-07');
      const expectResult = '2024년 1월 1주';

      // W
      const result = formatWeek(lastDayOfyear);

      // T
      expect(result).toBe(expectResult);
    });

    it('연말의 주 정보를 올바른 형식으로 반환한다', () => {
      // G
      const lastDayOfyear = new Date('2024-12-31');
      const expectResult = '2024년 12월 5주';

      // W
      const result = formatWeek(lastDayOfyear);

      // T
      expect(result).toBe(expectResult);
    });
  });

  describe('formatMonth 함수', () => {
    it('1월 정보를 올바른 형식으로 반환한다', () => {
      // G
      const januaryFirst = new Date('2024-01-01');
      const expectResult = '2024년 1월';

      // W
      const result = formatMonth(januaryFirst);

      // T
      expect(result).toBe(expectResult);
    });

    it('12월 정보를 올바른 형식으로 반환한다', () => {
      // G
      const lastDayOfyear = new Date('2024-12-31');
      const expectResult = '2024년 12월';

      // W
      const result = formatMonth(lastDayOfyear);

      // T
      expect(result).toBe(expectResult);
    });
  });

  describe('isDateInRange 함수', () => {
    it('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-12-31');

      expect(isDateInRange(new Date('2023-06-15'), startDate, endDate)).toBe(
        true,
      );

      expect(isDateInRange(new Date('2023-01-01'), startDate, endDate)).toBe(
        true,
      );

      expect(isDateInRange(new Date('2023-12-31'), startDate, endDate)).toBe(
        true,
      );

      expect(isDateInRange(new Date('2022-12-31'), startDate, endDate)).toBe(
        false,
      );

      expect(isDateInRange(new Date('2024-01-01'), startDate, endDate)).toBe(
        false,
      );
    });
  });
});
