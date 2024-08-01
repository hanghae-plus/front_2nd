import { http, HttpResponse } from "msw";
import { Event } from "../../types";
import events from "../mockdata/events";

export const createHandlers = (mockEvents?: Array<Event>) => {
  let eventsInstance = mockEvents
    ? structuredClone(mockEvents)
    : structuredClone(events);

  return [
    http.get("/todos", () => {
      return HttpResponse.json(eventsInstance);
    }),

    http.get("/api/events", () => {
      return HttpResponse.json(eventsInstance);
    }),

    http.post("/api/events", async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      eventsInstance.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    }),

    http.put("/api/events/:id", async ({ params, request }) => {
      const { id } = params;
      const updateEvent = (await request.json()) as Event;
      eventsInstance = eventsInstance.map((event) =>
        event.id === Number(id) ? { ...event, ...updateEvent } : event
      );
      return HttpResponse.json(
        eventsInstance.find((event) => event.id === Number(id))
      );
    }),

    http.delete("/api/events/:id", ({ params }) => {
      const { id } = params;
      eventsInstance = eventsInstance.filter(
        (event) => event.id !== Number(id)
      );
      return new HttpResponse(null, { status: 204 });
    }),
  ];
};
