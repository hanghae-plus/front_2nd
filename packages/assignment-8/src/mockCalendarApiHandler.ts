import { http, HttpResponse } from "msw";

type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  endCnt?: number;
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
export const initalEvents: Event[] = [
  {
    id: 1,
    title: "팀 회의 msw",
    date: "2024-08-06",
    startTime: "10:00",
    endTime: "11:00",
    description: "주간 팀 미팅",
    location: "회의실 A",
    category: "업무",
    repeat: { type: "daily", interval: 3 },
    notificationTime: 1,
  },
];

export const createMockHandler = (initialEvents: Event[]) => {
  let events = [...initialEvents];

  return [
    http.get("/api/events", () => {
      return HttpResponse.json(events);
    }),

    http.post("/api/events", async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      if (newEvent.repeat) {
        const generatedEvents = generateRecurringEvents(newEvent);
        events.push(...generatedEvents);
      } else {
        newEvent.id = events.length + 1;
        events.push(newEvent);
      }

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

  function generateRecurringEvents(event: Event): Event[] {
    const repeat = event.repeat;
    if (!repeat) return [event];

    const { type, interval, endDate, endCnt } = repeat;
    const initialDate = new Date(event.date);
    let currentDate = initialDate;
    const recurringEvents: Event[] = [];
    let occurrenceCount = 0;
    const MAX_OCCURRENCES = 365;
    const currentId = Math.max(...events.map((e) => e.id)) + 1;

    while (true) {
      if (endDate && currentDate > new Date(endDate)) break;
      if (endCnt && occurrenceCount >= endCnt) break;
      if (!endDate && !endCnt && occurrenceCount >= MAX_OCCURRENCES) break;
      recurringEvents.push({
        ...event,
        id: currentId + occurrenceCount,
        date: currentDate.toISOString().split("T")[0],
      });

      occurrenceCount++;
      switch (type) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + interval * 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + interval);
          break;
        case "yearly":
          currentDate.setFullYear(currentDate.getFullYear() + interval);
          break;
      }
    }
    return recurringEvents;
  }
};
