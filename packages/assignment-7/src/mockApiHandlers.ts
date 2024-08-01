import { http, HttpResponse } from "msw";
import { Event } from "./types";
let initialEvents = [
  {
    id: 1,
    title: "팀 회의 msw",
    date: "2024-07-03",
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
    title: "점심 약속 msw",
    date: "2024-07-21",
    startTime: "12:30",
    endTime: "13:30",
    description: "동료와 점심 식사",
    location: "회사 근처 식당",
    category: "개인",
    repeat: { type: "none", interval: 0 },
    notificationTime: 120,
  },
  {
    id: 3,
    title: "실리카겔 공연 msw",
    date: "2024-07-27",
    startTime: "18:00",
    endTime: "19:00",
    description: "실리카겔",
    location: "잠실",
    category: "취미",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 2880,
  },
  {
    id: 4,
    title: "1일 전 알림 테스트 msw",
    date: "2024-07-02",
    startTime: "13:00",
    endTime: "13:30",
    description: "알림 테스트 설명",
    location: "집",
    category: "기타",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1440,
  },
  {
    id: 5,
    title: "1일 전 알림 테스트 msw",
    date: "2024-08-02",
    startTime: "13:00",
    endTime: "13:30",
    description: "알림 테스트 설명",
    location: "집",
    category: "기타",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1440,
  },
];

let events = [...initialEvents];

export const resetEvents = () => {
  events = [...initialEvents];
};

export const mockApiHandlers = [
  // 일정 조회
  http.get("/api/events", () => {
    return HttpResponse.json(events);
  }),

  // 일정 추가
  http.post("/api/events", async ({ request }) => {
    const { id, ...rest } = (await request.json()) as Event;
    const newEvent = {
      id: events.length + 1,
      ...rest,
    };

    events.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // 일정 수정
  http.put("/api/events/:id", async ({ params, request }) => {
    const id = parseInt(params.id[0]);
    const eventIndex = events.findIndex((event) => event.id === id);
    const modifiedEvent = (await request.json()) as Event;

    if (eventIndex > -1) {
      events[eventIndex] = { ...events[eventIndex], ...modifiedEvent };
      return HttpResponse.json(events[eventIndex]);
    } else {
      return HttpResponse.json("Event not found", { status: 404 });
    }
  }),

  // 일정 삭제
  http.delete("/api/events/:id", ({ params }) => {
    const id = parseInt(params.id[0]);
    events = events.filter((event) => event.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
