import { describe, expect, test } from "vitest";

import {
  getDaysInMonth,
  getWeekDates,
  formatWeek,
  formatMonth,
  isDateInRange,
} from "../dateUtils";
import { searchEvents, isOverlapping } from "../eventUtils";

import { Event } from "../../types";

type MonthDays = {
  [key: number]: number;
};

const TOTAL_DAYS: MonthDays = {
  0: 31,
  1: 28,
  2: 31,
  3: 30,
  4: 31,
  5: 30,
  6: 31,
  7: 31,
  8: 30,
  9: 31,
  10: 30,
  11: 31,
};

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수: 주어진 연도와 월에 해당하는 월의 일수를 반환한다.", () => {
    test("일반적인 해의 1월부터 12월까지 월의 일수를 반환한다.", () => {
      for (let i = 0; i < 12; i++) {
        const daysInMonth = getDaysInMonth(2023, i);
        expect(daysInMonth).toBe(TOTAL_DAYS[i]);
      }
    });
    test("윤년의 2월은 29일을 반환한다.", () => {
      const daysInMonth = getDaysInMonth(2024, 1);
      expect(daysInMonth).toBe(29);
    });
  });

  describe("getWeekDates 함수: 주어진 날짜를 기준으로 해당 주의 월요일부터 일요일까지의 날짜를 반환한다.", () => {
    test("주어진 날짜가 월요일일 때 올바른 날짜 범위를 반환한다.", () => {
      const date = new Date("2024-07-29"); // 월요일
      const weekDates = getWeekDates(date);
      expect(weekDates.map((d) => d.toISOString().split("T")[0])).toEqual([
        "2024-07-29",
        "2024-07-30",
        "2024-07-31",
        "2024-08-01",
        "2024-08-02",
        "2024-08-03",
        "2024-08-04",
      ]);
    });
    test("주어진 날짜가 일요일일 때 올바른 날짜 범위를 반환한다.", () => {
      const date = new Date("2024-08-04"); // 일요일
      const weekDates = getWeekDates(date);
      expect(weekDates.map((d) => d.toISOString().split("T")[0])).toEqual([
        "2024-07-29",
        "2024-07-30",
        "2024-07-31",
        "2024-08-01",
        "2024-08-02",
        "2024-08-03",
        "2024-08-04",
      ]);
    });
    test("주어진 날짜가 한 주의 다른 요일일 때 올바른 날짜 범위를 반환한다.", () => {
      const date = new Date("2024-07-31"); // 수요일
      const weekDates = getWeekDates(date);
      expect(weekDates.map((d) => d.toISOString().split("T")[0])).toEqual([
        "2024-07-29",
        "2024-07-30",
        "2024-07-31",
        "2024-08-01",
        "2024-08-02",
        "2024-08-03",
        "2024-08-04",
      ]);
    });
    test("윤년과 같은 특별한 날짜에 대해서도 제대로 작동한다.", () => {
      const date = new Date("2024-02-29"); // This is a Thursday in a leap year
      const weekDates = getWeekDates(date);
      expect(weekDates.map((d) => d.toISOString().split("T")[0])).toEqual([
        "2024-02-26",
        "2024-02-27",
        "2024-02-28",
        "2024-02-29",
        "2024-03-01",
        "2024-03-02",
        "2024-03-03",
      ]);
    });
  });

  describe("formatWeek 함수: 주어진 날짜를 기준으로 해당 연도의 월과 주 번호를 포맷팅하여 문자열로 반환한다.", () => {
    test("연도와 월, 주 번호가 올바르게 계산된다. (1)", () => {
      const date = new Date("2024-01-01"); // January 1, 2024
      expect(formatWeek(date)).toBe("2024년 1월 1주");
    });
    test("연도와 월, 주 번호가 올바르게 계산된다. (2)", () => {
      const date = new Date("2024-01-15"); // January 15, 2024
      expect(formatWeek(date)).toBe("2024년 1월 3주");
    });
    test("연도와 월, 주 번호가 올바르게 계산된다. (3)", () => {
      const date = new Date("2024-01-31"); // January 31, 2024
      expect(formatWeek(date)).toBe("2024년 1월 5주");
    });
    test("연도와 월, 주 번호가 올바르게 계산된다. (4)", () => {
      const date = new Date("2024-02-29"); // February 29, 2024 (leap year)
      expect(formatWeek(date)).toBe("2024년 2월 5주");
    });
    test("연도와 월, 주 번호가 올바르게 계산된다. (5)", () => {
      const date = new Date("2024-12-31"); // December 31, 2024
      expect(formatWeek(date)).toBe("2024년 12월 5주");
    });
  });

  describe('formatMonth 함수: 주어진 날짜를 "xxxx년 x월" 형식으로 포맷팅하여 문자열로 반환한다.', () => {
    test("1월에 대해 올바르게 포맷팅된다. (경계값 테스트)", () => {
      const date = new Date("2024-01-01"); // January 1, 2024
      expect(formatMonth(date)).toBe("2024년 1월");
    });
    test("2월에 대해 올바르게 포맷팅된다.", () => {
      const date = new Date("2024-02-01"); // February 1, 2024
      expect(formatMonth(date)).toBe("2024년 2월");
    });
    test("7월에 대해 올바르게 포맷팅된다.", () => {
      const date = new Date("2024-07-01"); // July 1, 2024
      expect(formatMonth(date)).toBe("2024년 7월");
    });
    test("12월에 대해 올바르게 포맷팅된다. (경계값 테스트)", () => {
      const date = new Date("2024-12-01"); // December 1, 2024
      expect(formatMonth(date)).toBe("2024년 12월");
    });
    test("전년도 12월에 대해 올바르게 포맷팅된다. (경계값 테스트)", () => {
      const date = new Date("2023-12-31"); // December 31, 2023
      expect(formatMonth(date)).toBe("2023년 12월");
    });
  });

  describe("isDateInRange 함수", () => {
    test("주어진 날짜가 시작 날짜와 종료 날짜 범위 내에 있는지 판단한다.", async () => {
      const startDate = new Date("2024-07-01");
      const endDate = new Date("2024-07-31");

      const inRangeDate = new Date("2024-07-15");
      const outOfRangeDateBefore = new Date("2024-06-30");
      const outOfRangeDateAfter = new Date("2024-08-01");

      expect(isDateInRange(inRangeDate, startDate, endDate)).toBe(true);
      expect(isDateInRange(outOfRangeDateBefore, startDate, endDate)).toBe(
        false
      );
      expect(isDateInRange(outOfRangeDateAfter, startDate, endDate)).toBe(
        false
      );
    });
  });

  /** eventUtils 함수 테스트코드 */
  describe("searchEvents 함수", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "주간회의",
        date: "2024-07-25",
        startTime: "10:00",
        endTime: "11:00",
        description: "Weekly team meeting",
        location: "Conference Room",
        category: "업무",
        repeat: { type: "none", interval: 0 },
        notificationTime: 10,
      },
      {
        id: 2,
        title: "점심 약속",
        date: "2024-07-26",
        startTime: "12:00",
        endTime: "13:00",
        description: "친구랑 점심 약속",
        location: "연남동",
        category: "개인",
        repeat: { type: "none", interval: 0 },
        notificationTime: 10,
      },
    ];

    test("검색어가 없을 때 모든 이벤트를 반환한다", () => {
      const result = searchEvents(events, "");
      expect(result).toEqual(events);
    });

    test("검색어와 일치하는 이벤트를 정확히 필터링한다", () => {
      const result = searchEvents(events, "주간회의");
      expect(result).toEqual([events[0]]);
    });

    test("검색어와 일치하지 않는 경우 빈 배열을 반환한다", () => {
      const result = searchEvents([], "party");
      expect(result).toEqual([]);
    });
  });

  describe("isOverlapping 함수", () => {
    const event1: Event = {
      id: 1,
      title: "Event 1",
      date: "2024-07-25",
      startTime: "10:00",
      endTime: "11:00",
      description: "Event 1 description",
      location: "Location 1",
      category: "Work",
      repeat: { type: "none", interval: 0 },
      notificationTime: 10,
    };

    const event2: Event = {
      id: 2,
      title: "Event 2",
      date: "2024-07-25",
      startTime: "10:30",
      endTime: "11:30",
      description: "Event 2 description",
      location: "Location 2",
      category: "Personal",
      repeat: { type: "none", interval: 0 },
      notificationTime: 10,
    };

    const event3: Event = {
      id: 3,
      title: "Event 3",
      date: "2024-07-25",
      startTime: "11:30",
      endTime: "12:30",
      description: "Event 3 description",
      location: "Location 3",
      category: "Personal",
      repeat: { type: "none", interval: 0 },
      notificationTime: 10,
    };

    test("두 일정이 겹치는 경우 true를 반환한다", () => {
      expect(isOverlapping(event1, event2)).toBe(true);
    });

    test("두 일정이 겹치지 않는 경우 false를 반환한다", () => {
      expect(isOverlapping(event1, event3)).toBe(false);
    });
  });
});
