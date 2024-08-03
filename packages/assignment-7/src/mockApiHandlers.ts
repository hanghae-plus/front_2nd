import { http, HttpResponse } from "msw";
import { Event } from "./App";

export let events: Event[] = [
  {
    id: 1,
    title: "테스트 일정 1",
    date: "2024-08-15",
    startTime: "09:00",
    endTime: "10:00",
    description: "테스트 설명 1",
    location: "테스트 위치 1",
    category: "업무",
    repeat: { type: "none", interval: 1 },
    notificationTime: 10,
  },
  {
    id: 2,
    title: "테스트 일정 2",
    date: "2024-08-16",
    startTime: "14:00",
    endTime: "15:00",
    description: "테스트 설명 2",
    location: "테스트 위치 2",
    category: "개인",
    repeat: { type: "weekly", interval: 1, endDate: "2023-07-16" },
    notificationTime: 30,
  },
];

export const resetEvents = () => {
  events = [...events];
};

export const mockApiHandlers = [
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
    const updates = (await request.json()) as Partial<Event>;
    events = events.map((event) =>
      event.id === Number(id) ? { ...event, ...updates } : event
    );
    const updatedEvent = events.find((event) => event.id === Number(id));
    return HttpResponse.json(updatedEvent);
  }),

  http.delete("/api/events/:id", ({ params }) => {
    const { id } = params;
    events = events.filter((event) => event.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
