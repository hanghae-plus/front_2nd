import { http, HttpResponse } from 'msw'
import { mockEvents as originalMockEvents } from './mockEvents';
import {checkType} from "../utils/utilsFunc.ts";

let mockEvents = JSON.parse(JSON.stringify(originalMockEvents));

export const mockApiHandlers = [
    // 일정 조회
    http.get('/api/events', () => {
        return HttpResponse.json(mockEvents)
    }),

    // 일정 추가
    http.post('/api/events', async ({ request }) => {
        const newEvent = await request.json() ;
        const createdEvents = [];

        // 객체일때
        if(checkType(newEvent) === 'Object'){
            newEvent.id = new Date().getTime();
            mockEvents.push(newEvent);
            createdEvents.push(newEvent);
        }

        // 배열일때
        if(checkType(newEvent) === 'Array'){
            for(const event of newEvent){
                event.id = new Date().getTime();
                mockEvents.push(event);
                createdEvents.push(event);
            }
        }

        // 모든 이벤트가 생성된 후에 응답을 반환
        return HttpResponse.json(createdEvents, { status: 201 })
    }),

    // 일정 수정
    http.put('/api/events/:id', async ({ params, request }) => {
        const { id } = params;
        const updates = await request.json();
        mockEvents = mockEvents.map(event =>
            event.id === Number(id) ? { ...event, ...updates } : event
        )
        return HttpResponse.json(mockEvents.find(event => event.id === Number(id)))
    }),

    // 일정 삭제
    http.delete('/api/events/:id', ({ params }) => {
        const { id } = params;
        mockEvents = mockEvents.filter(event => event.id !== Number(id));
        return new HttpResponse(null, { status: 204 })
    }),
];