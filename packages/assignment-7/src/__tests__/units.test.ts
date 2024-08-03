import { describe, expect, test } from "vitest";
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getWeekDates,
  isDateInRange,
} from "../utils";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("주어진 월의 일 수를 정확히 반환한다", () => {
      expect(getDaysInMonth(2024, 6)).toBe(31); // 7월
      expect(getDaysInMonth(2024, 10)).toBe(30); // 11월
      expect(getDaysInMonth(2024, 1)).toBe(29); // 2월
    });
  });

  describe("getWeekDates 함수", () => {
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const testDate = new Date("2024-07-17");
      expect(getWeekDates(testDate)).toEqual(
        [15, 16, 17, 18, 19, 20, 21].map((date) => new Date(`2024-07-${date}`))
      );
    });

    test("연도를 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const testDate = new Date("2025-01-01");
      expect(
        getWeekDates(testDate).map((date) => date.toLocaleDateString())
      ).toEqual([
        ...[30, 31].map((date) =>
          new Date(`2024-12-${date}`).toLocaleDateString()
        ),
        ...[1, 2, 3, 4, 5].map((date) =>
          new Date(`2025-01-${date}`).toLocaleDateString()
        ),
      ]);
    });
  });

  describe("formatWeek 함수", () => {
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      const testDate = new Date("2024-07-29");
      expect(formatWeek(testDate)).toBe("2024년 7월 5주");
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      const testDate = new Date("2024-07-30");
      expect(formatMonth(testDate)).toBe("2024년 7월");
    });
  });

  describe("isDateInRange 함수", () => {
    test("주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다", () => {
      const startDate = new Date("2024-06-01");
      const endDate = new Date("2024-07-31");
      const testDate1 = new Date("2024-06-01");
      const testDate2 = new Date("2024-08-01");

      expect(isDateInRange(testDate1, startDate, endDate)).toBe(true);
      expect(isDateInRange(testDate2, startDate, endDate)).toBe(false);
    });
  });
});
