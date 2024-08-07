import { http, HttpResponse } from "msw";
import events from "./response";

let mockEvents = [...events];

export const resetEvents = () => {
  mockEvents = [...events];
};

export const handlers = [
  // GET 요청 처리
  http.get("/api/events", () => {
    return HttpResponse.json(mockEvents);
  }),

  // POST 요청 처리 (이벤트 추가)
  http.post("/api/events", async ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newEvent = (await request.json()) as any;
    newEvent.id = mockEvents.length + 1; // 간단한 ID 생성
    mockEvents.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // PUT 요청 처리 (이벤트 수정)
  http.put("/api/events/:id", async ({ params, request }) => {
    const { id } = params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedEvent = (await request.json()) as any;
    const index = mockEvents.findIndex((event) => event.id === Number(id));
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // DELETE 요청 처리 (이벤트 삭제)
  http.delete("/api/events/:id", ({ params }) => {
    const { id } = params;
    const index = mockEvents.findIndex((event) => event.id === Number(id));
    if (index !== -1) {
      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),
];
