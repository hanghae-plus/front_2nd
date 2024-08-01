import formatMonth from "@/utils/formatMonth";
import formatWeek from "@/utils/formatWeek";
import getDaysInMonth from "@/utils/getDaysInMonth";
import getWeekDates from "@/utils/getWeekDates";
import isDateInRange from "@/utils/isDateInRange";
import { describe, expect, test } from "vitest";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("주어진 월의 일 수를 정확히 반환한다", () => {
      expect(getDaysInMonth(1996, 0)).toBe(31);
      expect(getDaysInMonth(1996, 1)).toBe(29);
      expect(getDaysInMonth(1996, 2)).toBe(31);
      expect(getDaysInMonth(1996, 3)).toBe(30);
      expect(getDaysInMonth(1996, 4)).toBe(31);
      expect(getDaysInMonth(1996, 5)).toBe(30);
      expect(getDaysInMonth(1996, 6)).toBe(31);
      expect(getDaysInMonth(1996, 7)).toBe(31);
      expect(getDaysInMonth(1996, 8)).toBe(30);
      expect(getDaysInMonth(1996, 9)).toBe(31);
      expect(getDaysInMonth(1996, 10)).toBe(30);
      expect(getDaysInMonth(1996, 11)).toBe(31);
    });
  });

  describe("getWeekDates 함수", () => {
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const date = new Date(1996, 7, 14);
      const weekDates = getWeekDates(date).map((d) => d.toDateString());
      expect(weekDates).toEqual([
        new Date(1996, 7, 12).toDateString(),
        new Date(1996, 7, 13).toDateString(),
        new Date(1996, 7, 14).toDateString(),
        new Date(1996, 7, 15).toDateString(),
        new Date(1996, 7, 16).toDateString(),
        new Date(1996, 7, 17).toDateString(),
        new Date(1996, 7, 18).toDateString(),
      ]);
    });

    test("연도를 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const date = new Date(1996, 11, 31);
      const weekDates = getWeekDates(date).map((d) => d.toDateString());
      expect(weekDates).toEqual([
        new Date(1996, 11, 30).toDateString(),
        new Date(1996, 11, 31).toDateString(),
        new Date(1997, 0, 1).toDateString(),
        new Date(1997, 0, 2).toDateString(),
        new Date(1997, 0, 3).toDateString(),
        new Date(1997, 0, 4).toDateString(),
        new Date(1997, 0, 5).toDateString(),
      ]);
    });
  });

  describe("formatWeek 함수", () => {
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      const date = new Date(1996, 7, 14);
      expect(formatWeek(date)).toBe("1996년 8월 2주");
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      const date = new Date(1996, 7, 14);
      expect(formatMonth(date)).toBe("1996년 8월");
    });
  });

  describe("isDateInRange 함수", () => {
    test("주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다", () => {
      const start = new Date(2024, 0, 1);
      const end = new Date(2024, 11, 31);

      expect(isDateInRange(new Date(2024, 6, 15), start, end)).toBe(true);
      expect(isDateInRange(new Date(2023, 11, 31), start, end)).toBe(false);
      expect(isDateInRange(new Date(2025, 0, 1), start, end)).toBe(false);
    });
  });
});
