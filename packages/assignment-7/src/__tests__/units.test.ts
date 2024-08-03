import { describe, test } from "vitest";
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getWeekDates,
} from "../testFn/dateFn";

// 24년 월별 일 수
const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("주어진 월의 일 수를 정확히 반환한다", () => {
      // 24년 2월은 윤달 29일까지 있다.
      expect(
        MONTH_DAYS.every((days, index) => getDaysInMonth(24, index) === days),
      ).toBeTruthy();
    });
  });

  describe("getWeekDates 함수", () => {
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const targetDate = new Date("2024-08-01");
      const weekDates = getWeekDates(targetDate);

      const comparisonWeekDates = [
        new Date("2024-07-29"),
        new Date("2024-07-30"),
        new Date("2024-07-31"),
        new Date("2024-08-01"),
        new Date("2024-08-02"),
        new Date("2024-08-03"),
        new Date("2024-08-04"),
      ];
      const result = compareWeekEqual(weekDates, comparisonWeekDates);
      expect(result).toBeTruthy();
    });

    test("윤년의 2월 마지막 주의 날짜를 정확히 처리한다", () => {
      const targetDate = new Date("2024-02-28");

      const comparisonWeekDates = [
        new Date("2024-02-26"),
        new Date("2024-02-27"),
        new Date("2024-02-28"),
        new Date("2024-02-29"),
        new Date("2024-03-01"),
        new Date("2024-03-02"),
        new Date("2024-03-03"),
      ];
      const weekDates = getWeekDates(targetDate);

      const result = compareWeekEqual(weekDates, comparisonWeekDates);
      expect(result).toBeTruthy();
    });

    test("연도를 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const targetDate = new Date("2024-12-31");
      const weekDates = getWeekDates(targetDate);

      const comparisonWeekDates = [
        new Date("2024-12-30"),
        new Date("2024-12-31"),
        new Date("2025-01-01"),
        new Date("2025-01-02"),
        new Date("2025-01-03"),
        new Date("2025-01-04"),
        new Date("2025-01-05"),
      ];

      const result = compareWeekEqual(weekDates, comparisonWeekDates);
      expect(result).toBeTruthy();
    });
  });

  describe("formatWeek 함수", () => {
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      const newDate = new Date("2024-05-07");
      expect(formatWeek(newDate)).toBe("2024년 5월 1주");
    });

    test("윤달에도 올바른 형식으로 반환한다.", () => {
      const newDate = new Date("2024-02-29");
      expect(formatWeek(newDate)).toBe("2024년 2월 5주");
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      const date = new Date("2024-05-07");
      expect(formatMonth(date)).toBe("2024년 5월");
    });

    test("윤달에도 월 정보를 올바른 형식으로 반환한다", () => {
      const date = new Date("2024-02-01");
      expect(formatMonth(date)).toBe("2024년 2월");
    });
  });

  // describe("isDateInRange 함수", () => {
  //   test.fails("주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다");
  // });
});

function compareWeekEqual(targetList: Date[], compareList: Date[]) {
  let result = true;
  for (let i = 0; i < 7; i++) {
    if (targetList[i].getTime() !== compareList[i].getTime()) {
      result = false;
    }
  }
  return result;
}
