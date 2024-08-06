import { formatMonth, formatWeek, getDaysInMonth, getWeekDates } from '../utils/utils';

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(getDaysInMonth(2024, 7)).toBe(31);
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const now = new Date('2024-07-30T11:36:49.014Z');
      const result = getWeekDates(now);
      const expectedDates = [
        '2024-07-29T11:36:49.014Z',
        '2024-07-30T11:36:49.014Z',
        '2024-07-31T11:36:49.014Z',
        '2024-08-01T11:36:49.014Z',
        '2024-08-02T11:36:49.014Z',
        '2024-08-03T11:36:49.014Z',
        '2024-08-04T11:36:49.014Z',
      ];

      expect(result.map((date) => date.toISOString())).toEqual(expectedDates);
    });
    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date('2023-12-31T12:00:00Z');
      const weekDates = getWeekDates(date);
      const expectedDates = [
        new Date('2023-12-25T12:00:00Z'),
        new Date('2023-12-26T12:00:00Z'),
        new Date('2023-12-27T12:00:00Z'),
        new Date('2023-12-28T12:00:00Z'),
        new Date('2023-12-29T12:00:00Z'),
        new Date('2023-12-30T12:00:00Z'),
        new Date('2023-12-31T12:00:00Z'),
      ];

      weekDates.forEach((date, index) => {
        expect(date.toISOString().split('T')[0]).toBe(expectedDates[index].toISOString().split('T')[0]);
      });

      const nextMonday = new Date(weekDates[6]);
      nextMonday.setDate(nextMonday.getDate() + 1);
      expect(nextMonday.getFullYear()).toBe(2024);
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const now = new Date('2024-07-29');
      expect(formatWeek(now)).toBe(`2024년 7월 5주`);
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const now = new Date('2024-07-29');
      expect(formatMonth(now)).toBe('2024년 7월');
    });
  });
});
