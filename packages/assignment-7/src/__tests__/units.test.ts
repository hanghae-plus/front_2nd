import { describe, expect, test } from "vitest";
import { getDaysInMonth, getWeekDates } from "../utils/date-utils";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("주어진 월의 일 수를 정확히 반환한다", () => {
      expect(getDaysInMonth(2024, 11)).toBe(31);
      expect(getDaysInMonth(2024, 3)).toBe(30);
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });
  });

  describe.only("getWeekDates 함수", () => {
    const getWeekByISO = (currentDate: Date) => {
      return getWeekDates(currentDate).map((date) => date.toISOString());
    };
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const date = new Date("2023-07-24");
      const weekData = getWeekByISO(date);

      expect(weekData).toEqual([
        "2023-07-24T00:00:00.000Z",
        "2023-07-25T00:00:00.000Z",
        "2023-07-26T00:00:00.000Z",
        "2023-07-27T00:00:00.000Z",
        "2023-07-28T00:00:00.000Z",
        "2023-07-29T00:00:00.000Z",
        "2023-07-30T00:00:00.000Z",
      ]);
    });
    test("달이 넘어가는 날짜를 정확히 처리한다.", () => {
      const date = new Date("2023-07-31");
      const weekData = getWeekByISO(date);

      expect(weekData).toEqual([
        "2023-07-31T00:00:00.000Z",
        "2023-08-01T00:00:00.000Z",
        "2023-08-02T00:00:00.000Z",
        "2023-08-03T00:00:00.000Z",
        "2023-08-04T00:00:00.000Z",
        "2023-08-05T00:00:00.000Z",
        "2023-08-06T00:00:00.000Z",
      ]);
    });
    test("연도가 넘어가는 날짜를 정확히 처리한다.", () => {
      const date = new Date("2023-12-31");
      const weekData = getWeekByISO(date);

      expect(weekData).toEqual([
        "2023-12-25T00:00:00.000Z",
        "2023-12-26T00:00:00.000Z",
        "2023-12-27T00:00:00.000Z",
        "2023-12-28T00:00:00.000Z",
        "2023-12-29T00:00:00.000Z",
        "2023-12-30T00:00:00.000Z",
        "2023-12-31T00:00:00.000Z",
      ]);
    });
  });

  describe("formatWeek 함수", () => {
    test.fails("주어진 날짜의 주 정보를 올바른 형식으로 반환한다");
  });

  describe("formatMonth 함수", () => {
    test.fails("주어진 날짜의 월 정보를 올바른 형식으로 반환한다");
  });

  describe("isDateInRange 함수", () => {
    test.fails("주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다");
  });
});
