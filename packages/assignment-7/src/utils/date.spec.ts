import { describe, expect, it } from "vitest";
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getWeekDates,
  isDateInRange,
} from "./date";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    it("1, 3, 5, 7, 8, 10, 12월은 일 수 31을 반환한다'", () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
      expect(getDaysInMonth(2024, 2)).toBe(31);
      expect(getDaysInMonth(2024, 4)).toBe(31);
      expect(getDaysInMonth(2024, 6)).toBe(31);
      expect(getDaysInMonth(2024, 7)).toBe(31);
      expect(getDaysInMonth(2024, 9)).toBe(31);
      expect(getDaysInMonth(2024, 11)).toBe(31);
    });

    it("4, 6, 9, 11월은 일 수 30을 반환한다.", () => {
      expect(getDaysInMonth(2024, 3)).toBe(30);
      expect(getDaysInMonth(2024, 5)).toBe(30);
      expect(getDaysInMonth(2024, 8)).toBe(30);
      expect(getDaysInMonth(2024, 10)).toBe(30);
    });

    it("2월은 윤년일 때 일 수 29를 반환한다.", () => {
      expect(getDaysInMonth(2020, 1)).toBe(29);
    });

    it("2월은 평년일 때 일 수 28을 반환한다.", () => {
      expect(getDaysInMonth(2023, 1)).toBe(28);
    });
  });

  describe("getWeekDates 함수", () => {
    it("주어진 날짜가 속한 주의 일요일부터 토요일 7일 날짜를 반환한다", () => {
      const date = new Date("2024-07-21");
      const weekDates = getWeekDates(date);

      expect(weekDates.length).toBe(7);
      expect(weekDates[0].getDate()).toBe(21);
      expect(weekDates[1].getDate()).toBe(22);
      expect(weekDates[2].getDate()).toBe(23);
      expect(weekDates[3].getDate()).toBe(24);
      expect(weekDates[4].getDate()).toBe(25);
      expect(weekDates[5].getDate()).toBe(26);
      expect(weekDates[6].getDate()).toBe(27);

      const nextDate = new Date("2024-07-22");
      const weekDatesByNextDate = getWeekDates(nextDate);
      expect(weekDatesByNextDate).toEqual(weekDates);
    });

    it("달이 넘어가는 주의 날짜를 정확히 처리한다.", () => {
      const date = new Date("2024-07-29");

      const weekDates = getWeekDates(date);

      expect(weekDates.length).toBe(7);
      expect(weekDates[0].getDate()).toBe(28);
      expect(weekDates[1].getDate()).toBe(29);
      expect(weekDates[2].getDate()).toBe(30);
      expect(weekDates[3].getDate()).toBe(31);
      expect(weekDates[4].getDate()).toBe(1);
      expect(weekDates[5].getDate()).toBe(2);
      expect(weekDates[6].getDate()).toBe(3);

      const nextDate = new Date("2024-08-03");
      const weekDatesByNextDate = getWeekDates(nextDate);
      expect(weekDatesByNextDate).toEqual(weekDates);
    });

    it("연도를 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const date = new Date("2024-12-29");

      const weekDates = getWeekDates(date);

      expect(weekDates.length).toBe(7);
      expect(weekDates[0].getDate()).toBe(29);
      expect(weekDates[1].getDate()).toBe(30);
      expect(weekDates[2].getDate()).toBe(31);
      expect(weekDates[3].getDate()).toBe(1);
      expect(weekDates[4].getDate()).toBe(2);
      expect(weekDates[5].getDate()).toBe(3);
      expect(weekDates[6].getDate()).toBe(4);

      const nextDate = new Date("2025-01-04");
      const weekDatesByNextDate = getWeekDates(nextDate);
      expect(weekDatesByNextDate).toEqual(weekDates);
    });
  });

  describe("formatWeek 함수", () => {
    it("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      const date = new Date("2024-07-21");
      expect(formatWeek(date)).toBe("2024년 7월 3주");

      const nextDate = new Date("2024-07-22");
      expect(formatWeek(nextDate)).toBe("2024년 7월 4주");
    });

    it("첫날에는 첫주차 정보를 반환한다.", () => {
      const date = new Date("2024-07-01");
      expect(formatWeek(date)).toBe("2024년 7월 1주");
    });

    it("말일에는 마지막주차 정보를 반환한다.", () => {
      const date = new Date("2024-07-31");
      expect(formatWeek(date)).toBe("2024년 7월 5주");
    });
  });

  describe("formatMonth 함수", () => {
    it("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      const date = new Date("2024-07-21");
      expect(formatMonth(date)).toBe("2024년 7월");

      const nextDate = new Date("2024-08-21");
      expect(formatMonth(nextDate)).toBe("2024년 8월");
    });

    it("유효하지 않은 날짜 데이터를 넘길경우 빈 문자열이 반환된다.", () => {
      const date = new Date("0000-13-99");
      expect(formatMonth(date)).toBe("");
    });
  });

  describe("isDateInRange 함수", () => {
    it("특정 날짜가 주어진 범위에 속하면 true를 반환한다.", () => {
      const date = new Date("2024-07-21");
      const start = new Date("2024-07-21");
      const end = new Date("2024-07-21");

      expect(isDateInRange(date, start, end)).toBe(true);
    });

    it("주어진 날짜가 주어진 범위에 속하지 않으면 false를 반환한다.", () => {
      const date = new Date("2024-07-21");
      const start = new Date("2024-07-22");
      const end = new Date("2024-07-23");

      expect(isDateInRange(date, start, end)).toBe(false);
    });
  });
});
