import { describe, test } from "vitest";
import {
  getDaysInMonth,
  getWeekDates,
  formatWeek,
  formatMonth,
} from "../utils/date";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("주어진 월의 일 수를 정확히 반환한다", () => {
      const year = 2024;
      const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const expectedDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      months.forEach((month, index) => {
        expect(getDaysInMonth(year, month)).toBe(expectedDays[index]);
      });
    });

    test("윤년의 2월은 29일을 반환한다", () => {
      expect(getDaysInMonth(2000, 1)).toBe(29);
      expect(getDaysInMonth(2012, 1)).toBe(29);
    });

    test("1970년 전후의 날짜들을 올바르게 처리한다", () => {
      expect(getDaysInMonth(1969, 11)).toBe(31); // 1969년 12월
      expect(getDaysInMonth(1970, 0)).toBe(31); // 1970년 1월
      expect(getDaysInMonth(1970, 1)).toBe(28); // 1970년 2월
      expect(getDaysInMonth(1971, 0)).toBe(31); // 1971년 1월
    });
  });

  describe("getWeekDates 함수", () => {
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const bDay = new Date(2025, 1, 23);
      const bDayWeekDates = getWeekDates(bDay);
      const expectedDays = [17, 18, 19, 20, 21, 22, 23];

      expect(bDayWeekDates).toHaveLength(7);
      bDayWeekDates.forEach((weekDate, index) => {
        expect(weekDate.getDate()).toBe(expectedDays[index]);
      });
    });
  });

  describe("formatWeek 함수", () => {
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      expect(formatWeek(new Date(2024, 0, 1))).toBe("2024년 1월 1주"); // 월의 시작
      expect(formatWeek(new Date(2024, 5, 15))).toBe("2024년 6월 3주"); // 월의 중간
      expect(formatWeek(new Date(2024, 11, 31))).toBe("2024년 12월 5주"); // 월의 마지막 날
      expect(formatWeek(new Date(2024, 1, 29))).toBe("2024년 2월 5주"); // 윤년의 2월 29일
      expect(formatWeek(new Date(2024, 3, 30))).toBe("2024년 4월 5주"); // 월의 마지막 주, 하지만 다음 달로 이어지지 않는 경우
      expect(formatWeek(new Date(2024, 11, 31))).toBe("2024년 12월 5주"); // 연도가 바뀌는 시점
      expect(formatWeek(new Date(2025, 0, 1))).toBe("2025년 1월 1주"); // 원래는 1월 1주가 아님. 12월 5주.
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      expect(formatMonth(new Date(2024, 0, 1))).toBe("2024년 1월"); // 연초
      expect(formatMonth(new Date(2024, 11, 31))).toBe("2024년 12월"); // 연말
      expect(formatMonth(new Date(2024, 1, 29))).toBe("2024년 2월"); // 윤년 2월
      expect(formatMonth(new Date(2024, 5, 15))).toBe("2024년 6월"); // 월의 중간
      expect(formatMonth(new Date(2024, 8, 1))).toBe("2024년 9월"); // 한 자리 월
      expect(formatMonth(new Date(2024, 9, 1))).toBe("2024년 10월"); // 두 자리 월
      expect(formatMonth(new Date(2024, 11, 31))).toBe("2024년 12월"); // 연도가 바뀌는 시점
      expect(formatMonth(new Date(2025, 0, 1))).toBe("2025년 1월");
    });
  });
});
