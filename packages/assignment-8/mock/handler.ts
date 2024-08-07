import { http, HttpResponse } from "msw";
import { Event } from "../src/types/types";

export const DUMMY_DATA: Event[] = [
  {
    id: 4,
    title: "여행",
    date: "2024-07-22",
    startTime: "17:00",
    endTime: "19:00",
    description: "강릉여행",
    location: "강릉",
    category: "개인",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 5,
    title: "운동",
    date: "2024-07-22",
    startTime: "18:00",
    endTime: "19:00",
    description: "주간 운동",
    location: "헬스장",
    category: "개인",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 6,
    title: "알림 테스트",
    description: "알림 테스트",
    location: "알림 테스트",
    category: "개인",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 10,
    ...(() => {
      const now = new Date();
      const startTime = new Date(now.getTime() + 5 * 60000); // 5분 후
      const endTime = new Date(startTime.getTime() + 60 * 60000); // 시작시간으로부터 1시간 후

      const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
      };

      const formatTime = (date: Date) => {
        return date.toTimeString().split(" ")[0].substring(0, 5);
      };

      return {
        date: formatDate(now),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
      };
    })(),
  },
  {
    id: 7,
    title: "생일 파티",
    date: "2024-08-05",
    startTime: "19:00",
    endTime: "22:00",
    description: "친구 생일 축하",
    location: "친구 집",
    category: "개인",
    repeat: { type: "yearly", interval: 1 },
    notificationTime: 1,
  },
];

let events = [...DUMMY_DATA];

export const initializeHandler = () => {
  events = [...DUMMY_DATA];
};

export const handlers = [
  http.get("/api/events", async () => {
    return HttpResponse.json(events);
  }),

  http.post("/api/events", async ({ request }) => {
    const body = (await request.json()) as Event | Event[];

    let newEvent: Event | Event[];

    if (Array.isArray(body)) {
      newEvent = [...body];
      events.push(...newEvent);
    } else {
      newEvent = {
        ...body,
      };
      events.push(newEvent);
    }

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put("/api/events/:id", async ({ request, params }) => {
    const id = parseInt(params.id as string);
    const eventIndex = events.findIndex((event) => event.id === id);

    const body = (await request.json()) as Event;

    if (eventIndex > -1) {
      events[eventIndex] = { ...events[eventIndex], ...body };

      return HttpResponse.json(events[eventIndex]);
    } else {
      return HttpResponse.json("Event not found", {
        status: 404,
      });
    }
  }),

  http.delete("/api/events/:id", async ({ params }) => {
    const id = parseInt(params.id as string);

    events = events.filter((event) => event.id !== id);

    return HttpResponse.json({ status: 204 });
  }),
];
