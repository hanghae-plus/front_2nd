import { describe, test } from "vitest";
import {getDaysInMonth, getWeekDates, formatWeek, formatMonth } from "../utils/utilsFunc.ts";

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test("주어진 월의 일 수를 정확히 반환한다", () => {
      expect(getDaysInMonth(2023, 1)).toBe(31); // 2023년 1월
      expect(getDaysInMonth(2024, 3)).toBe(31); // 2024년 3월 (윤년)
      expect(getDaysInMonth(2022, 2)).toBe(28); // 2022년 2월 (평년)
      expect(getDaysInMonth(2025, 4)).toBe(30); // 2025년 4월
      expect(getDaysInMonth(2025, 5)).toBe(31); // 2025년 5월
      expect(getDaysInMonth(2023, 6)).toBe(30); // 2023년 6월
      expect(getDaysInMonth(2024, 7)).toBe(31); // 2024년 7월 (윤년)
      expect(getDaysInMonth(2025, 8)).toBe(31); // 2025년 8월
      expect(getDaysInMonth(2022, 9)).toBe(30); // 2022년 9월
      expect(getDaysInMonth(2023, 10)).toBe(31); // 2023년 10월
      expect(getDaysInMonth(2024, 11)).toBe(30); // 2024년 11월 (윤년)
      expect(getDaysInMonth(2025, 12)).toBe(31); // 2025년
    });
  });

  describe("getWeekDates 함수", () => {
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const date = new Date("2024-12-31");
      const weekDates = getWeekDates(date);
      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].getDate()).toBe(30); // 2024년 12월 30일이 일요일
      expect(weekDates[6].getDate()).toBe(5); // 2025년 1월 5일이 토요일
    });

    test("연도를 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const date = new Date("2024-12-30"); // 2024년 12월 30일 (월요일)
      const weekDates = getWeekDates(date);
      // 일요일 날짜 검사
      expect(weekDates[0].getDate()).toBe(30);
      // 토요일 날짜 검사 (다음 해 1월 5일)
      expect(weekDates[6].getDate()).toBe(5);
    });
  });

  describe("formatWeek 함수", () => {
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      const date = new Date("2024-8-02");
      expect(formatWeek(date)).toBe("2024년 8월 1주");
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      const date = new Date(2024, 7, 2); // 2024년 8월 02일
      expect(formatMonth(date)).toBe("2024년 8월");
    });
  });
});
