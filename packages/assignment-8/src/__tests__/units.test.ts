import { describe, test, expect } from "vitest";
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getWeekDates,
  isDateInRange,
} from "../dateUtils";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("주어진 월의 일 수를 정확히 반환한다", async () => {
      expect(getDaysInMonth(2024, 0)).toBe(31); // 1월 (0-based month)
      expect(getDaysInMonth(2024, 1)).toBe(29); // 윤년의 2월
      expect(getDaysInMonth(2023, 1)).toBe(28); // 평년의 2월
      expect(getDaysInMonth(2024, 3)).toBe(30); // 4월
      expect(getDaysInMonth(2024, 11)).toBe(31); // 12월
    });
  });

  describe("getWeekDates 함수", () => {
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const date = new Date(2024, 6, 10); // 2024년 7월 10일 (수요일)
      const weekDates = getWeekDates(date);
      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].getDate()).toBe(8); // 월요일
      expect(weekDates[6].getDate()).toBe(14); // 일요일
    });
    test("연도를 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const date = new Date(2024, 11, 30); // 2024년 12월 30일 (월요일)
      const weekDates = getWeekDates(date);
      expect(weekDates[0].getFullYear()).toBe(2024);
      expect(weekDates[0].getDate()).toBe(30);
      expect(weekDates[6].getFullYear()).toBe(2025);
      expect(weekDates[6].getDate()).toBe(5);
    });
    test("일요일이 입력될 경우 해당 주의 월요일부터 반환한다", () => {
      const date = new Date(2024, 6, 14); // 2024년 7월 14일 (일요일)
      const weekDates = getWeekDates(date);
      expect(weekDates[0].getDate()).toBe(8); // 월요일
      expect(weekDates[6].getDate()).toBe(14); // 일요일
    });
  });

  describe("formatWeek 함수", () => {
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      expect(formatWeek(new Date(2024, 6, 1))).toBe("2024년 7월 1주");
      expect(formatWeek(new Date(2024, 6, 10))).toBe("2024년 7월 2주");
      expect(formatWeek(new Date(2024, 6, 31))).toBe("2024년 7월 5주");
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      expect(formatMonth(new Date(2024, 6, 10))).toBe("2024년 7월");
      expect(formatMonth(new Date(2024, 11, 31))).toBe("2024년 12월");
      expect(formatMonth(new Date(2025, 0, 1))).toBe("2025년 1월");
    });
  });

  describe("isDateInRange 함수", () => {
    test("주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다", () => {
      const startDate = new Date(2024, 6, 1); // 2024년 7월 1일
      const endDate = new Date(2024, 6, 31); // 2024년 7월 31일

      // 범위 내의 날짜
      expect(
        isDateInRange({ date: new Date(2024, 6, 15), startDate, endDate })
      ).toBe(true);

      // 시작 날짜
      expect(
        isDateInRange({ date: new Date(2024, 6, 1), startDate, endDate })
      ).toBe(true);

      // 종료 날짜
      expect(
        isDateInRange({ date: new Date(2024, 6, 31), startDate, endDate })
      ).toBe(true);

      // 범위 이전의 날짜
      expect(
        isDateInRange({ date: new Date(2024, 5, 30), startDate, endDate })
      ).toBe(false);

      // 범위 이후의 날짜
      expect(
        isDateInRange({ date: new Date(2024, 7, 1), startDate, endDate })
      ).toBe(false);
    });
  });
});
