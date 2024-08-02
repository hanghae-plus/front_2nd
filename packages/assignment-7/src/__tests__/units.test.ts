import { describe, test, expect } from "vitest";
import {
  getDaysInMonth,
  getWeekDates,
  formatWeek,
  formatMonth,
  parseDateTime,
} from "../App";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("주어진 월의 일 수를 정확히 반환한다(성공했을떄)", () => {
      // TODO: given, when, then으로 분리하기
      /**
      // given
      const year = 2024;
      const month = 1;
      // when
      const res = getDaysInMonth(2024, 1);

      // then
      expect(res).toBe(31); // 1월
       **/
      expect(getDaysInMonth(2024, 1)).toBe(31); // 1월
      expect(getDaysInMonth(2024, 2)).toBe(29); // 윤년 2월
      expect(getDaysInMonth(2023, 2)).toBe(28); // 평년 2월
      expect(getDaysInMonth(2024, 4)).toBe(30); // 4월
    });

    // TODO: 예외처리 테스트코드 추가하기
    /**
    test.fails(
      "주어진 월의 일 수를 반환하지 못한다 (실패했을 때 -> Year 가 스트링 | 4자리가 넘어)",
      () => {
        // given
        const year = 2024;
        const month = 1;
        // when
        const res = getDaysInMonth(2024, 1);

        // then
        expect(res).throw(); // 1월
      },
    );
    **/
  });

  describe("getWeekDates 함수", () => {
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const date = new Date("2024-07-15"); // new Date(2024,6,15)
      const weekDates = getWeekDates(date);
      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].getDate()).toBe(14); // 일요일
      expect(weekDates[6].getDate()).toBe(20); // 토요일
    });

    test("연도를 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const date = new Date("2024-12-30"); // 2024년 12월 30일 (월요일)
      const weekDates = getWeekDates(date);
      expect(weekDates[0].getFullYear()).toBe(2024);
      expect(weekDates[6].getFullYear()).toBe(2025);
    });
  });

  describe("formatWeek 함수", () => {
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      expect(formatWeek(new Date("2024-07-15"))).toBe("2024년 7월 3주");
      expect(formatWeek(new Date("2024-08-03"))).toBe("2024년 8월 1주");
      expect(formatWeek(new Date("2024-08-04"))).toBe("2024년 8월 2주");
      expect(formatWeek(new Date("2024-08-07"))).toBe("2024년 8월 2주");
      expect(formatWeek(new Date("2024-08-08"))).toBe("2024년 8월 2주");
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      const date = new Date(2024, 6, 15); // 2024년 7월 15일
      expect(formatMonth(date)).toBe("2024년 7월");
    });
  });

  describe("parseDateTime 함수", () => {
    test("주어진 날짜와 문자열을 Date 객체로 변환한다", () => {
      expect(parseDateTime("2024-07-22", "18:00")).toStrictEqual(
        new Date("2024-07-22T18:00"),
      );
      expect(parseDateTime("2023-08-30", "01:52")).toStrictEqual(
        new Date("2023-08-30T01:52"),
      );
      expect(parseDateTime("2024-02-29", "23:59")).toStrictEqual(
        new Date("2024-02-29T23:59"),
      );
      expect(parseDateTime("2024-03-01", "00:00")).toStrictEqual(
        new Date("2024-03-01T00:00"),
      );
      expect(parseDateTime("2024-03-35", "28:72")).toStrictEqual(
        new Date("2024-03-35T28:72"),
      );
    });
  });
});
