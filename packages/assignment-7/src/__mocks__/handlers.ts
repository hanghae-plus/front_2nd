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
  notificationTime: number;
}

let events: Event[] = [
  {
    id: 1,
    title: "외부 업체 미팅",
    date: "2024-08-02",
    startTime: "10:00",
    endTime: "12:00",
    description: "외부 업체와 미팅",
    location: "2층 회의실",
    category: "업무",
    repeat: {
      type: "none",
      interval: 1,
    },
    notificationTime: 10,
  },
  {
    id: 2,
    title: "PT 수업",
    date: "2024-08-05",
    startTime: "20:00",
    endTime: "21:00",
    description: "2회차 PT 수업",
    location: "피트니스 센터",
    category: "개인",
    repeat: {
      type: "none",
      interval: 1,
    },
    notificationTime: 10,
  },
];

export const createHandlers = [
  // 일정 조회
  http.get("/api/events", () => {
    return HttpResponse.json(events);
  }),

  // 일정 추가
  http.post("/api/events", async ({ request }) => {
    const newEventData = (await request.json()) as { text: string };
    const newEvent: Event = {
      id: Date.now(),
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      location: "",
      category: "",
      repeat: { type: "none", interval: 0 },
      notificationTime: 1,
      ...newEventData,
    };
    events.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // 일정 수정
  http.put("/api/events/:id", async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<Event>;
    events = events.map((event) =>
      event.id === Number(id) ? { ...event, ...updates } : event
    );
    const updatedEvent = events.find((event) => event.id === Number(id));
    return HttpResponse.json(updatedEvent);
  }),

  // 일정 삭제
  http.delete("/api/events/:id", ({ params }) => {
    const { id } = params;
    events = events.filter((event) => event.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];

export const resetMockData = () => {
  events = [...events];
};
