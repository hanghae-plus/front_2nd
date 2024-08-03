import { http, HttpResponse } from "msw";

type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number; // 분 단위로 저장
}

// fake db
let events: Event[] = [
  {
    id: 1,
    title: "팀 회의 msw",
    date: "2024-07-20",
    startTime: "10:00",
    endTime: "11:00",
    description: "주간 팀 미팅",
    location: "회의실 A",
    category: "업무",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
];

export const mockCalendarApiHandler = [
  http.get("/api/events", () => {
    return HttpResponse.json(events);
  }),

  http.post("/api/events", async ({ request }) => {
    const newEvent = (await request.json()) as Event;

    newEvent.id = events.length + 1;
    events.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put("/api/events/:id", async ({ params, request }) => {
    const { id } = params;
    const requestEvent = (await request.json()) as Event;
    events = events.map((event) =>
      event.id === Number(id) ? requestEvent : event,
    );

    const updatedEvent = events.find((event) => event.id === Number(id));
    return HttpResponse.json(updatedEvent);
  }),

  http.delete("/api/events/:id", ({ params }) => {
    const { id } = params;

    events = events.filter((event) => event.id !== Number(id));
    return HttpResponse.json(true, { status: 201 });
  }),
];
