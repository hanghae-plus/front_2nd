import { describe, test, expect } from 'vitest';

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getWeekDates = (date: Date): Date[] => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
};

const formatWeek = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${year}년 ${month}월 ${weekNumber}주`;
};

const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31); // 2024년 1월
      expect(getDaysInMonth(2024, 1)).toBe(29); // 2024년 2월 (윤년)
      expect(getDaysInMonth(2024, 3)).toBe(30); // 2024년 4월
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date('2024-08-20'); // 화요일
      const weekDates = getWeekDates(date);
      expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-08-19'); // 월요일
      expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-08-25'); // 일요일
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date('2023-12-30'); // 토요일
      const weekDates = getWeekDates(date);
      expect(weekDates[0].toISOString().split('T')[0]).toBe('2023-12-25'); // 월요일
      expect(weekDates[6].toISOString().split('T')[0]).toBe('2023-12-31'); // 일요일
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-08-20');
      expect(formatWeek(date)).toBe('2024년 8월 3주');
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-08-20');
      expect(formatMonth(date)).toBe('2024년 8월');
    });
  });

  describe('isDateInRange 함수', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const date = new Date('2024-08-20');
      const startDate = new Date('2024-08-01');
      const endDate = new Date('2024-08-31');
      expect(isDateInRange(date, startDate, endDate)).toBe(true);

      const outOfRangeDate = new Date('2024-09-01');
      expect(isDateInRange(outOfRangeDate, startDate, endDate)).toBe(false);
    });
  });
});