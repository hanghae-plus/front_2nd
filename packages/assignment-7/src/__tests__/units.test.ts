import { describe, expect, expectTypeOf, test } from "vitest";
import { getDaysInMonth } from "../utils/getDaysInMonth";
import { getWeekDates } from "../utils/getWeekDates";
import { formatWeek } from "../utils/formatWeek";
import { formatMonth } from "../utils/formatMonth";
import { REPEAT_TYPE } from "../constants/date";
import { getNextDate } from "../utils/getNextDate";
import { addMonths } from "../utils/addMonths";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("일반적인 달의 일수를 정확히 반환한다", () => {
      expect(getDaysInMonth(2023, 3)).toBe(30);
      expect(getDaysInMonth(2023, 6)).toBe(31);
    });

    test("연도가 변경되어도 정확히 작동한다", () => {
      expect(getDaysInMonth(2000, 1)).toBe(29);
      expect(getDaysInMonth(2100, 1)).toBe(28);
    });

    test("반환값의 타입이 number인지 확인한다", () => {
      const months = Array.from({ length: 12 }, (_, index) => index);

      months.forEach((month) => {
        expect(typeof getDaysInMonth(2023, month)).toBe("number");
      });
    });

    test("모든 월의 일수가 0보다 큰지 확인한다", () => {
      const months = Array.from({ length: 12 }, (_, index) => index);

      months.forEach((month) => {
        expect(getDaysInMonth(2023, month)).toBeGreaterThan(0);
      });
    });

    test("모든 월의 일수가 32보다 작은지 확인한다", () => {
      const months = Array.from({ length: 12 }, (_, index) => index);

      months.forEach((month) => {
        expect(getDaysInMonth(2023, month)).toBeLessThan(32);
      });
    });

    test("윤년의 2월을 정확히 처리한다", () => {
      expect(getDaysInMonth(2020, 1)).toBe(29);
      expect(getDaysInMonth(2024, 1)).toBe(29);
      expect(getDaysInMonth(2000, 1)).toBe(29);
      expect(getDaysInMonth(2100, 1)).toBe(28);
      expect(getDaysInMonth(2200, 1)).toBe(28);
      expect(getDaysInMonth(2300, 1)).toBe(28);
      expect(getDaysInMonth(2400, 1)).toBe(29);
    });

    test("잘못된 입력값을 처리한다", () => {});
  });

  describe("getWeekDates 함수", () => {
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const date = new Date(2024, 0, 3);
      const weekDates = getWeekDates(date);

      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].getDate()).toBe(1);
      expect(weekDates[6].getDate()).toBe(7);
    });

    test("반환된 날짜들이 연속적인지 확인한다", () => {
      const date = new Date(2024, 0, 15);
      const weekDates = getWeekDates(date);

      for (let i = 1; i < weekDates.length; i++) {
        const diff = weekDates[i].getTime() - weekDates[i - 1].getTime();
        expect(diff).toBe(24 * 60 * 60 * 1000);
      }
    });

    test("연도를 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const date = new Date(2023, 11, 31);
      const weekDates = getWeekDates(date);

      expect(weekDates[0].getFullYear()).toBe(2023);
      expect(weekDates[0].getDate()).toBe(25);
      expect(weekDates[6].getFullYear()).toBe(2023);
      expect(weekDates[6].getDate()).toBe(31);
    });

    test("월을 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const date = new Date(2024, 1, 29);
      const weekDates = getWeekDates(date);

      expect(weekDates[0].getMonth()).toBe(1);
      expect(weekDates[0].getDate()).toBe(26);
      expect(weekDates[6].getMonth()).toBe(2);
      expect(weekDates[6].getDate()).toBe(3);
    });

    test("일요일이 주어졌을 때 정확한 주의 날짜를 반환한다", () => {
      const date = new Date(2024, 0, 7);
      const weekDates = getWeekDates(date);

      expect(weekDates[0].getDate()).toBe(1);
      expect(weekDates[6].getDate()).toBe(7);
    });

    test("윤년의 2월 말을 포함하는 주를 정확히 처리한다", () => {
      const date = new Date(2024, 1, 28);
      const weekDates = getWeekDates(date);

      expect(weekDates[0].getDate()).toBe(26);
      expect(weekDates[3].getDate()).toBe(29);
      expect(weekDates[4].getDate()).toBe(1);
      expect(weekDates[6].getDate()).toBe(3);
    });

    test("반환값이 Date 객체의 배열인지 확인한다", () => {
      const date = new Date(2024, 0, 3);
      const weekDates = getWeekDates(date);

      expectTypeOf(weekDates).toEqualTypeOf<Date[]>();
    });
  });

  describe("formatWeek 함수", () => {
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      const testCases = [
        { date: new Date(2024, 0, 1), expected: "2024년 1월 1주" },
        { date: new Date(2024, 0, 8), expected: "2024년 1월 2주" },
        { date: new Date(2024, 1, 15), expected: "2024년 2월 3주" },
        { date: new Date(2024, 11, 31), expected: "2024년 12월 5주" },
      ];

      testCases.forEach(({ date, expected }) => {
        expect(formatWeek(date)).toBe(expected);
      });
    });

    test("연도가 바뀌는 주를 올바르게 처리한다", () => {
      expect(formatWeek(new Date(2023, 11, 31))).toBe("2023년 12월 5주");
      expect(formatWeek(new Date(2024, 0, 1))).toBe("2024년 1월 1주");
    });

    test("반환값이 올바른 형식의 문자열인지 확인한다", () => {
      const result = formatWeek(new Date(2024, 5, 15));
      expect(result).toMatch(/^\d{4}년 \d{1,2}월 \d주$/);
    });

    test("윤년의 2월 말을 포함하는 주를 올바르게 포맷팅한다", () => {
      expect(formatWeek(new Date(2024, 1, 28))).toBe("2024년 2월 4주");
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      const testCases = [
        { date: new Date(2023, 0, 1), expected: "2023년 1월" },
        { date: new Date(2023, 11, 31), expected: "2023년 12월" },
        { date: new Date(2024, 1, 29), expected: "2024년 2월" },
        { date: new Date(2025, 6, 15), expected: "2025년 7월" },
      ];

      testCases.forEach(({ date, expected }) => {
        expect(formatMonth(date)).toBe(expected);
      });
    });

    test("월이 1자리 수일 때도 올바르게 포맷팅한다", () => {
      expect(formatMonth(new Date(2023, 0, 15))).toBe("2023년 1월");
      expect(formatMonth(new Date(2023, 8, 1))).toBe("2023년 9월");
    });

    test("월이 2자리 수일 때 올바르게 포맷팅한다", () => {
      expect(formatMonth(new Date(2023, 9, 1))).toBe("2023년 10월");
      expect(formatMonth(new Date(2023, 11, 31))).toBe("2023년 12월");
    });

    test("연도가 바뀔 때 올바르게 처리한다", () => {
      expect(formatMonth(new Date(2023, 11, 31))).toBe("2023년 12월");
      expect(formatMonth(new Date(2024, 0, 1))).toBe("2024년 1월");
    });

    test("반환값이 올바른 형식의 문자열인지 확인한다", () => {
      const result = formatMonth(new Date(2023, 5, 15));
      expect(result).toMatch(/^\d{4}년 \d{1,2}월$/);
    });
  });
  describe("getNextDate 함수", () => {
    test("일간 반복 시 다음 날짜를 반환한다", () => {
      const date = new Date("2023-05-15");
      const result = getNextDate({ date, repeatType: REPEAT_TYPE.DAILY });
      expect(result).toEqual(new Date("2023-05-16"));
    });

    test("주간 반복 시 7일 후의 날짜를 반환한다", () => {
      const date = new Date("2023-05-15");
      const result = getNextDate({ date, repeatType: REPEAT_TYPE.WEEKLY });
      expect(result).toEqual(new Date("2023-05-22"));
    });

    test("월간 반복 시 다음 달의 같은 날짜를 반환한다", () => {
      const date = new Date("2023-05-15");
      const result = getNextDate({ date, repeatType: REPEAT_TYPE.MONTHLY });
      expect(result).toEqual(new Date("2023-06-15"));
    });

    test("연간 반복 시 다음 해의 같은 날짜를 반환한다", () => {
      const date = new Date("2023-05-15");
      const result = getNextDate({ date, repeatType: REPEAT_TYPE.YEARLY });
      expect(result).toEqual(new Date("2024-05-15"));
    });

    test("알 수 없는 반복 유형에 대해 원래 날짜를 반환한다", () => {
      const date = new Date("2023-05-15");
      const result = getNextDate({ date, repeatType: "UNKNOWN" as any });
      expect(result).toEqual(date);
    });

    test("월말 날짜에 대해 월간 반복을 올바르게 처리한다", () => {
      const date = new Date("2023-01-31");
      const result = getNextDate({ date, repeatType: REPEAT_TYPE.MONTHLY });
      expect(result).toEqual(new Date("2023-02-28")); // 2월은 28일까지만 있으므로
    });

    test("윤년을 고려하여 연간 반복을 올바르게 처리한다", () => {
      const date = new Date("2024-02-29");
      const result = getNextDate({ date, repeatType: REPEAT_TYPE.YEARLY });
      expect(result).toEqual(new Date("2025-02-28"));
    });

    test("함수가 원본 Date 객체를 변경하지 않는다", () => {
      const originalDate = new Date("2023-05-15");
      const dateCopy = new Date(originalDate);
      getNextDate({ date: dateCopy, repeatType: REPEAT_TYPE.DAILY });
      expect(dateCopy).toEqual(originalDate);
    });
  });

  describe("addMonths 함수", () => {
    test("기본적인 월 추가를 올바르게 처리한다", () => {
      const date = new Date("2023-05-15");
      expect(addMonths(date, 1)).toEqual(new Date("2023-06-15"));
      expect(addMonths(date, 2)).toEqual(new Date("2023-07-15"));
      expect(addMonths(date, 12)).toEqual(new Date("2024-05-15"));
    });

    test("연도를 넘어가는 월 추가를 올바르게 처리한다", () => {
      const date = new Date("2023-12-15");
      expect(addMonths(date, 1)).toEqual(new Date("2024-01-15"));
      expect(addMonths(date, 13)).toEqual(new Date("2025-01-15"));
    });

    test("월말 날짜에 대해 올바르게 처리한다", () => {
      const date = new Date("2023-01-31");
      expect(addMonths(date, 1)).toEqual(new Date("2023-02-28"));
      expect(addMonths(date, 2)).toEqual(new Date("2023-03-31"));
    });

    test("윤년을 올바르게 처리한다", () => {
      const date = new Date("2024-01-31");
      expect(addMonths(date, 1)).toEqual(new Date("2024-02-29"));
      expect(addMonths(date, 13)).toEqual(new Date("2025-02-28"));
    });

    test("0개월 추가 시 원래 날짜를 반환한다", () => {
      const date = new Date("2023-05-15");
      expect(addMonths(date, 0)).toEqual(date);
    });
  });
});
