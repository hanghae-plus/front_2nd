import { describe, expect, test } from "vitest";
import * as utils from "../utils.tsx";

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(utils.getDaysInMonth(2024, 0)).toBe(31);  // 1월
      expect(utils.getDaysInMonth(2024, 1)).toBe(29);  // 2월 (윤년)
      expect(utils.getDaysInMonth(2024, 3)).toBe(30);  // 4월
      expect(utils.getDaysInMonth(2023, 1)).toBe(28);  // 2월 (평년)
      expect(utils.getDaysInMonth(2024, 11)).toBe(31); // 12월
    });
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date(2024, 6, 10); // 2024년 7월 10일 (수요일)
      const weekDates = utils.getWeekDates(date);
      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].getDate()).toBe(8);  // 월요일
      expect(weekDates[6].getDate()).toBe(14); // 일요일
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date(2024, 11, 30); // 2024년 12월 30일 (월요일)
      const weekDates = utils.getWeekDates(date);
      expect(weekDates[0].getFullYear()).toBe(2024);
      expect(weekDates[0].getMonth()).toBe(11); // 12월
      expect(weekDates[6].getFullYear()).toBe(2025);
      expect(weekDates[6].getMonth()).toBe(0);  // 1월
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date(2024, 6, 10); // 2024년 7월 10일
      expect(utils.formatWeek(date)).toBe('2024년 7월 2주');
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date(2024, 6, 10); // 2024년 7월 10일
      expect(utils.formatMonth(date)).toBe('2024년 7월');
    });
  });

  // describe('isDateInRange 함수', () => {
  //   test.fails('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다');
  // });
});