import { http, HttpResponse } from 'msw';

// TODO 다른 곳으로 이동시키기
interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: Repeat;
  notificationTime: number;
}
interface Repeat {
  type: string;
  interval: number;
}

let originEvents: Event[] = [
  {
    id: 1,
    title: '팀 회의',
    date: '2024-08-20',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'weekly', interval: 1 },
    notificationTime: 1,
  },
  {
    id: 2,
    title: '점심 약속',
    date: '2024-08-21',
    startTime: '12:30',
    endTime: '13:30',
    description: '동료와 점심 식사',
    location: '회사 근처 식당',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];

let events = [...originEvents];

export const handlers = [
  // 일정 조회
  http.get('/api/events', () => {
    return HttpResponse.json(events);
  }),

  // 일정 추가
  http.post('/api/events', async ({ request }) => {
    const newEvent = (await request.json()) as Omit<Event, 'id'>;

    events.push({
      id: Date.now(),
      ...newEvent,
    });

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // 일정 수정
  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;

    const updateEvent = (await request.json()) as Event;

    events = events.map((event) =>
      event.id === Number(id) ? { ...event, ...updateEvent } : event,
    );

    return HttpResponse.json(events.find((event) => event.id === Number(id)));
  }),

  // 일정 삭제
  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;

    const deleteEvent = events.find((event) => event.id === Number(id));

    if (!deleteEvent) {
      return new HttpResponse(null, { status: 404 });
    }

    events = events.filter((event) => event.id !== Number(id));

    return HttpResponse.json(deleteEvent);
  }),
];

export const resetEvents = () => {
  events = [...originEvents];
};
