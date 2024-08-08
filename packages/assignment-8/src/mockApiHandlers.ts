import { http, HttpResponse } from 'msw'
import { Event, RepeatInfo } from './types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchHolidays = (year: number, month: number) => {
  // 실제로는 API를 호출하여 공휴일 정보를 가져와야 합니다.
  // 여기서는 예시로 하드코딩된 데이터를 사용합니다.
  return {
    "2024-01-01": "신정",
    "2024-02-09": "설날",
    "2024-02-10": "설날",
    "2024-02-11": "설날",
    "2024-03-01": "삼일절",
    "2024-05-05": "어린이날",
    "2024-06-06": "현충일",
    "2024-08-15": "광복절",
    "2024-09-16": "추석",
    "2024-09-17": "추석",
    "2024-09-18": "추석",
    "2024-10-03": "개천절",
    "2024-10-09": "한글날",
    "2024-12-25": "크리스마스"
  };
};

export const initialMockEvents: Event[] = [
  {
    id: 1,
    title: "팀 회의",
    date: "2024-07-20",
    startTime: "10:00",
    endTime: "11:00",
    description: "주간 팀 미팅",
    location: "회의실 A",
    category: "업무",
    repeat: { type: 'weekly', interval: 1 },
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
    repeat: { type: 'none', interval: 0 },
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
    repeat: { type: 'none', interval: 0 },
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
    repeat: { type: 'yearly', interval: 1 },
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
    repeat: { type: 'weekly', interval: 1 },
    notificationTime: 1,
  },
  {
    id: 6,
    title: "알림 테스트",
    date: "2024-07-31",
    startTime: "18:00",
    endTime: "19:00",
    description: "알림 테스트",
    location: "알림 테스트",
    category: "개인",
    repeat: { type: 'weekly', interval: 1 },
    notificationTime: 10,
  }
]

export const createHandlers = (initialMockEvents: Event[]) => {
  let events: Event[] = [...initialMockEvents];

  return [
    http.get('/api/events', () => {
      return HttpResponse.json(events);
    }),

    http.post('/api/events', async ({ request }) => {
      const data = await request.json() as { 
        title: string,
        date: string,
        startTime: string,
        endTime: string,
        description: string,
        location: string,
        category: string,
        repeat: RepeatInfo,
        notificationTime: number }

      const newEvent: Event = {
        id: Date.now(),
        ...data
      };
      events.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 })
    }),

    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updates = await request.json() as Event;
      const eventIndex = events.findIndex(event => event.id === Number(id));

      if (eventIndex > -1) {
        events[eventIndex] = { ...events[eventIndex], ...updates }
        return HttpResponse.json(events[eventIndex]);
      } else {
        return HttpResponse.json(null, {status: 404});
      }
    }),

    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      events = events.filter(event => event.id !== Number(id));
      return new HttpResponse(null, {status: 204});
    })
  ]
}