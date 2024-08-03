import { http, HttpResponse } from "msw";

interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: { type: string; interval: number };
  notificationTime: number;
}

export const originalMockEvents: Event[] = [
  {
    id: 1,
    title: "팀 회의",
    date: "2024-07-20",
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
    title: "점심 약속",
    date: "2024-07-21",
    startTime: "12:30",
    endTime: "13:30",
    description: "동료와 점심 식사",
    location: "회사 근처 식당",
    category: "개인",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
  {
    id: 3,
    title: "프로젝트 마감",
    date: "2024-07-25",
    startTime: "09:00",
    endTime: "18:00",
    description: "분기별 프로젝트 마감",
    location: "사무실",
    category: "업무",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
  {
    id: 4,
    title: "생일 파티",
    date: "2024-07-28",
    startTime: "19:00",
    endTime: "22:00",
    description: "친구 생일 축하",
    location: "친구 집",
    category: "개인",
    repeat: { type: "yearly", interval: 1 },
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
      const now = new Date("2024-08-01");
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
];

export let mockEvents = [...originalMockEvents];

// mockEvents를 초기화하는 함수
export const resetMockEvents = () => {
  mockEvents = [...originalMockEvents];
};

export const mockApiHandlers = [
  http.get("/api/events", () => {
    return HttpResponse.json(mockEvents);
  }),

  http.post("/api/events", async ({ request }) => {
    const requestEvent = (await request.json()) as Event;
    const newEvent = { ...requestEvent, id: mockEvents.length + 1 };

    if (requestEvent.title === "테스트 에러") {
      return HttpResponse.json({ error: "테스트 에러" }, { status: 400 });
    }
    mockEvents.push(newEvent);
    return HttpResponse.json(mockEvents, { status: 201 });
  }),

  http.put("/api/events/:id", async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Event;

    if (updates.title === "테스트 에러") {
      return HttpResponse.json({ error: "테스트 에러" }, { status: 400 });
    }

    mockEvents = mockEvents.map((event) =>
      event.id === Number(id) ? { ...event, ...updates } : event
    );
    return HttpResponse.json(
      mockEvents.find((event) => event.id === Number(id))
    );
  }),

  http.delete("/api/events/:id", ({ params }) => {
    const { id } = params;

    mockEvents = mockEvents.filter((event) => event.id !== Number(id));

    return new HttpResponse(null, { status: 204 });
  }),
];
