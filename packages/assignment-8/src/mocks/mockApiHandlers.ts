import { http, HttpResponse } from "msw";
import { Event } from "../types";
import { initialEvents } from "./mockData";

export let events: Event[] = [...initialEvents];

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
    const eventData = (await request.json()) as Omit<Event, "id">;
    const newEvent: Event = {
      id: Date.now(),
      ...eventData,
    };
    events.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // 일정 수정
  http.put("/api/events/:id", async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<Event>;
    const eventIndex = events.findIndex((event) => event.id === Number(id));
    if (eventIndex > -1) {
      events[eventIndex] = { ...events[eventIndex], ...updates };
      return HttpResponse.json(events[eventIndex]);
    } else {
      return HttpResponse.json({ error: "Event not found" }, { status: 404 });
    }
  }),

  // 일정 삭제
  http.delete("/api/events/:id", ({ params }) => {
    const { id } = params;
    events = events.filter((event) => event.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
