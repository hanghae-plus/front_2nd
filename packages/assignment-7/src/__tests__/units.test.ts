// packages/assignment-7/src/__tests__/units.test.ts
import { describe, test, expect } from "vitest";
import {
  getDaysInMonth,
  getWeekDates,
  formatWeek,
  formatMonth,
  isDateInRange,
} from "../utils";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("주어진 월의 일 수를 정확히 반환한다", () => {
      expect(getDaysInMonth(2024, 3)).toBe(30); // 4월
      expect(getDaysInMonth(2024, 1)).toBe(29); // 윤년 2월
      expect(getDaysInMonth(2023, 1)).toBe(28); // 평년 2월
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
      expect(weekDates[6].getFullYear()).toBe(2025);
    });
  });

  describe("formatWeek 함수", () => {
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      expect(formatWeek(new Date(2024, 6, 10))).toBe("2024년 7월 2주");
      expect(formatWeek(new Date(2024, 0, 1))).toBe("2024년 1월 1주");
      expect(formatWeek(new Date(2024, 11, 31))).toBe("2024년 12월 5주");
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      expect(formatMonth(new Date(2024, 0, 1))).toBe("2024년 1월");
      expect(formatMonth(new Date(2024, 11, 31))).toBe("2024년 12월");
    });
  });

  describe("isDateInRange 함수", () => {
    test("주어진 날짜가 범위 내에 있을 때 true를 반환한다", () => {
      const start = new Date(2024, 0, 1); // 2024년 1월 1일
      const end = new Date(2024, 11, 31); // 2024년 12월 31일
      const date = new Date(2024, 5, 15); // 2024년 6월 15일
      expect(isDateInRange(date, start, end)).toBe(true);
    });

    test("주어진 날짜가 범위를 벗어날 때 false를 반환한다", () => {
      const start = new Date(2024, 0, 1); // 2024년 1월 1일
      const end = new Date(2024, 11, 31); // 2024년 12월 31일
      const dateBefore = new Date(2023, 11, 31); // 2023년 12월 31일
      const dateAfter = new Date(2025, 0, 1); // 2025년 1월 1일
      expect(isDateInRange(dateBefore, start, end)).toBe(false);
      expect(isDateInRange(dateAfter, start, end)).toBe(false);
    });

    test("경계값 테스트: 시작 날짜와 종료 날짜는 범위에 포함되지 않는다", () => {
      const start = new Date(2024, 0, 1); // 2024년 1월 1일
      const end = new Date(2024, 11, 31); // 2024년 12월 31일
      expect(isDateInRange(start, start, end)).toBe(false);
      expect(isDateInRange(end, start, end)).toBe(false);
    });

    test("경계값 테스트: 시작 날짜 다음날과 종료 날짜 전날은 범위에 포함된다", () => {
      const start = new Date(2024, 0, 1); // 2024년 1월 1일
      const end = new Date(2024, 11, 31); // 2024년 12월 31일
      const dayAfterStart = new Date(2024, 0, 2); // 2024년 1월 2일
      const dayBeforeEnd = new Date(2024, 11, 30); // 2024년 12월 30일
      expect(isDateInRange(dayAfterStart, start, end)).toBe(true);
      expect(isDateInRange(dayBeforeEnd, start, end)).toBe(true);
    });

    test("시작 날짜가 종료 날짜보다 늦을 때 항상 false를 반환한다", () => {
      const start = new Date(2024, 11, 31); // 2024년 12월 31일
      const end = new Date(2024, 0, 1); // 2024년 1월 1일
      const date = new Date(2024, 5, 15); // 2024년 6월 15일
      expect(isDateInRange(date, start, end)).toBe(false);
    });

    test("같은 날짜로 범위를 지정했을 때 항상 false를 반환한다", () => {
      const sameDate = new Date(2024, 5, 15); // 2024년 6월 15일
      expect(isDateInRange(sameDate, sameDate, sameDate)).toBe(false);
    });
  });
});
