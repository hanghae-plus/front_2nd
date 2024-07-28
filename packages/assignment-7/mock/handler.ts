import { http, HttpResponse } from "msw";
import { events } from "./mock-data";

export const handlers = [
  http.get("http://localhost:3000/api/events", async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json(events);
  }),
];
