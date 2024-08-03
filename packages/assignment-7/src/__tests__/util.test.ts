import { describe, expect, test } from "vitest";
import {
  findOverlappingEvents,
  parseDateTime,
} from "../utils";
import { Event } from "../types";

const events: Event[] = [
  {
    id: 1,
    title: "팀 회의",
    date: "2024-07-20",
    startTime: "10:00",
    endTime: "11:00",
    description: "주간 팀 미팅",
    location: "회의실 A",
    category: "업무",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 2,
    title: "점심 약속",
    date: "2024-07-21",
    startTime: "12:30",
    endTime: "13:30",
    description: "동료와 점심 식사",
    location: "회사 근처 식당",
    category: "개인",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
];

describe("util 함수 테스트", () => {
  describe("findOverlappingEvents 함수", () => {
    test("겹치는 일정이 있으면 해당 목록 반환", () => {
      const newEvent: Event = {
        id: 3,
        title: "새 일정",
        date: "2024-07-20",
        startTime: "10:00",
        endTime: "11:00",
        description: "새로운 일정",
        location: "집",
        category: "개인",
        repeat: { type: "weekly", interval: 1 },
        notificationTime: 1,
      };

      expect(findOverlappingEvents(events, newEvent)).toEqual([events[0]]);
    });
    test("겹치는 일정이 없으면 빈 목록 반환", () => {
      const newEvent: Event = {
        id: 4,
        title: "새 일정",
        date: "2020-07-20",
        startTime: "10:00",
        endTime: "11:00",
        description: "새로운 일정",
        location: "집",
        category: "개인",
        repeat: { type: "weekly", interval: 1 },
        notificationTime: 1,
      };

      expect(findOverlappingEvents(events, newEvent)).toEqual([]);
    });
  });

  describe("parseDateTime 함수", () => {
    test("날짜 문자열을 Date 객체로 변환", () => {
      const dateString = '2024-08-08';
      const timeString = '00:00';
      
      expect(parseDateTime(dateString, timeString) instanceof Date).toEqual(true);
      expect(parseDateTime(dateString, timeString)).toEqual(new Date('2024-08-08 00:00'));
    });
  });
});
