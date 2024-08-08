import { describe, expect, test } from "vitest";
import {
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getRepeatEvents,
  getWeekDates,
  isDateInRange,
} from "../date-utils";
import { Event } from "../../types/types";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test("주어진 월의 일 수를 정확히 반환한다", () => {
      expect(getDaysInMonth(2024, 11)).toBe(31);
      expect(getDaysInMonth(2024, 3)).toBe(30);
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });
  });

  describe("getWeekDates 함수", () => {
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

    // 경계값에 대해 체크
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

    // 경계값에 대해 체크
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
    test("주어진 날짜의 주 정보를 올바른 형식으로 반환한다", () => {
      expect(formatWeek(new Date("2023-07-24"))).toBe("2023년 7월 4주");
    });

    // 경계값에 대해 체크
    test("주어진 날짜의 주 정보가 현재달과 다음달의 날짜가 포함된다면 현재달을 기준으로 표현한다.", () => {
      expect(formatWeek(new Date("2023-07-31"))).toBe("2023년 7월 5주");
    });

    // 경계값에 대해 체크
    test("주어진 날짜의 주 정보가 다음년도가 넘어가도 현재 달의 주를 기준으로 표현한다.", () => {
      expect(formatWeek(new Date("2023-12-31"))).toBe("2023년 12월 5주");
    });
  });

  describe("formatMonth 함수", () => {
    test("주어진 날짜의 월 정보를 올바른 형식으로 반환한다", () => {
      expect(formatMonth(new Date("2023-07-24"))).toBe("2023년 7월");
      expect(formatMonth(new Date("2024-07-31"))).toBe("2024년 7월");
      expect(formatMonth(new Date("2024-12-24"))).toBe("2024년 12월");
    });
  });

  describe("isDateInRange 함수", () => {
    test("주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다", () => {
      const startDate = new Date("2023-01-01");
      const endDate = new Date("2023-12-31");

      expect(isDateInRange(new Date("2023-06-15"), startDate, endDate)).toBe(
        true
      );

      expect(isDateInRange(new Date("2023-01-01"), startDate, endDate)).toBe(
        true
      );

      expect(isDateInRange(new Date("2023-12-31"), startDate, endDate)).toBe(
        true
      );

      expect(isDateInRange(new Date("2022-12-31"), startDate, endDate)).toBe(
        false
      );

      expect(isDateInRange(new Date("2024-01-01"), startDate, endDate)).toBe(
        false
      );
    });

    test("시작일이 종료일보다 늦은 경우를 올바르게 처리합니다.", () => {
      const startDate = new Date("2023-12-31");
      const endDate = new Date("2023-01-01");

      expect(isDateInRange(new Date("2023-06-15"), startDate, endDate)).toBe(
        false
      );
    });

    test("시작일, 종료일, 확인할 날짜가 모두 같은 경우를 처리합니다.", () => {
      const sameDate = new Date("2023-05-05");
      expect(isDateInRange(sameDate, sameDate, sameDate)).toBe(true);
    });
  });

  describe("getRepeatEvents 함수", () => {
    // 모든 이벤트들은 endDate가 주어지지 않으면 date를 기준년도까지 이벤트가 생성됩니다.
    // repeat type과 interval이 주어지지 않는다면 본래 event 객체를 반환합니다.
    test("주어진 이벤트를 1주 마다 반복 이벤트로 생성합니다.", () => {
      const event: Event = {
        id: 100,
        title: "주간 팀 회의",
        date: "2024-12-16",
        startTime: "10:00",
        endTime: "11:00",
        description: "주간 업무 보고 및 계획 수립",
        location: "회의실 A",
        category: "",
        repeat: { type: "weekly", interval: 1, endDate: undefined },
        notificationTime: 10,
      };
      const weeklyRepeatEvents = getRepeatEvents(event);

      // 실제 반복 데이터가 형성되었는지 확실하게 체크하는게 괜찮은 걸까??
      expect(weeklyRepeatEvents).toEqual([
        {
          id: 100,
          title: "주간 팀 회의",
          date: "2024-12-16",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "weekly", interval: 1, endDate: undefined },
          notificationTime: 10,
        },
        {
          id: 101,
          title: "주간 팀 회의",
          date: "2024-12-23",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "weekly", interval: 1, endDate: undefined },
          notificationTime: 10,
        },
        {
          id: 102,
          title: "주간 팀 회의",
          date: "2024-12-30",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "weekly", interval: 1, endDate: undefined },
          notificationTime: 10,
        },
      ]);
    });
    test("주어진 이벤트를 매 달 반복 이벤트로 생성합니다.", () => {
      const event: Event = {
        id: 100,
        title: "주간 팀 회의",
        date: "2024-10-01",
        startTime: "10:00",
        endTime: "11:00",
        description: "주간 업무 보고 및 계획 수립",
        location: "회의실 A",
        category: "",
        repeat: { type: "monthly", interval: 1, endDate: undefined },
        notificationTime: 10,
      };
      const monthlyRepeatEvents = getRepeatEvents(event);
      expect(monthlyRepeatEvents).toEqual([
        {
          id: 100,
          title: "주간 팀 회의",
          date: "2024-10-01",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "monthly", interval: 1, endDate: undefined },
          notificationTime: 10,
        },
        {
          id: 101,
          title: "주간 팀 회의",
          date: "2024-11-01",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "monthly", interval: 1, endDate: undefined },
          notificationTime: 10,
        },
        {
          id: 102,
          title: "주간 팀 회의",
          date: "2024-12-01",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "monthly", interval: 1, endDate: undefined },
          notificationTime: 10,
        },
      ]);
    });

    test("주어진 이벤트를 매 년 반복 이벤트로 생성합니다.", () => {
      const event: Event = {
        id: 100,
        title: "주간 팀 회의",
        date: "2024-09-02",
        startTime: "10:00",
        endTime: "11:00",
        description: "주간 업무 보고 및 계획 수립",
        location: "회의실 A",
        category: "",
        repeat: { type: "yearly", interval: 1, endDate: undefined },
        notificationTime: 10,
      };
      const yearlyRepeatEvents = getRepeatEvents(event);
      expect(yearlyRepeatEvents).toEqual([
        {
          id: 100,
          title: "주간 팀 회의",
          date: "2024-09-02",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "yearly", interval: 1, endDate: undefined },
          notificationTime: 10,
        },
      ]);
    });

    test("반복 종료일이 있다면, 종료일까지 반복이벤트를 생성합니다.", () => {
      const event: Event = {
        id: 100,
        title: "주간 팀 회의",
        date: "2024-12-24",
        startTime: "10:00",
        endTime: "11:00",
        description: "주간 업무 보고 및 계획 수립",
        location: "회의실 A",
        category: "",
        repeat: { type: "weekly", interval: 1, endDate: "2025-01-12" },
        notificationTime: 10,
      };
      const weeklyRepeatEvents = getRepeatEvents(event);
      expect(weeklyRepeatEvents).toEqual([
        {
          id: 100,
          title: "주간 팀 회의",
          date: "2024-12-24",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "weekly", interval: 1, endDate: "2025-01-12" },
          notificationTime: 10,
        },
        {
          id: 101,
          title: "주간 팀 회의",
          date: "2024-12-31",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "weekly", interval: 1, endDate: "2025-01-12" },
          notificationTime: 10,
        },
        {
          id: 102,
          title: "주간 팀 회의",
          date: "2025-01-07",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 업무 보고 및 계획 수립",
          location: "회의실 A",
          category: "",
          repeat: { type: "weekly", interval: 1, endDate: "2025-01-12" },
          notificationTime: 10,
        },
      ]);
    });
  });
});
