import { describe, test } from "vitest";


describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      // 평년의 월 일수 확인
      expect(getDaysInMonth(2023, 0)).toBe(31);  // January
      expect(getDaysInMonth(2023, 1)).toBe(28);  // February
      expect(getDaysInMonth(2023, 2)).toBe(31);  // March
      expect(getDaysInMonth(2023, 3)).toBe(30);  // April
      expect(getDaysInMonth(2023, 4)).toBe(31);  // May
      expect(getDaysInMonth(2023, 5)).toBe(30);  // June
      expect(getDaysInMonth(2023, 6)).toBe(31);  // July
      expect(getDaysInMonth(2023, 7)).toBe(31);  // August
      expect(getDaysInMonth(2023, 8)).toBe(30);  // September
      expect(getDaysInMonth(2023, 9)).toBe(31);  // October
      expect(getDaysInMonth(2023, 10)).toBe(30); // November
      expect(getDaysInMonth(2023, 11)).toBe(31); // December
      
      // 윤년의 2월 29일 반환하는지 확인
      expect(getDaysInMonth(2024, 1)).toBe(29);  
    });
  });

  describe('getWeekDates 함수', () => {
    test.fails('주어진 날짜가 속한 주의 모든 날짜를 반환한다');
    test.fails('연도를 넘어가는 주의 날짜를 정확히 처리한다');
  });

  describe('formatWeek 함수', () => {
    test.fails('주어진 날짜의 주 정보를 올바른 형식으로 반환한다');
  });

  describe('formatMonth 함수', () => {
    test.fails('주어진 날짜의 월 정보를 올바른 형식으로 반환한다');
  });

  describe('isDateInRange 함수', () => {
    test.fails('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다');
  });
});
