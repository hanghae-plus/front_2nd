import { http, HttpResponse } from 'msw'

let events = [
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
    // ... 다른 이벤트들도 여기에 포함
];

export const mockApiHandlers = [
    // 모든 일정 조회
    http.get('/api/events', () => {
        return HttpResponse.json(events)
    }),

    // 새 일정 추가
    http.post('/api/events', async ({ request }) => {
        const newEvent = await request.json() as any
        newEvent.id = Date.now()
        events.push(newEvent)
        return HttpResponse.json(newEvent, { status: 201 })
    }),

    // 일정 수정
    http.put('/api/events/:id', async ({ params, request }) => {
        const id = parseInt(params.id as string)
        const updatedEvent = await request.json() as any
        const eventIndex = events.findIndex(event => event.id === id)
        if (eventIndex > -1) {
            events[eventIndex] = { ...events[eventIndex], ...updatedEvent }
            return HttpResponse.json(events[eventIndex])
        } else {
            return new HttpResponse(null, { status: 404, statusText: 'Event not found' })
        }
    }),

    // 일정 삭제
    http.delete('/api/events/:id', ({ params }) => {
        const id = parseInt(params.id as string)
        events = events.filter(event => event.id !== id)
        return new HttpResponse(null, { status: 204 })
    }),
]