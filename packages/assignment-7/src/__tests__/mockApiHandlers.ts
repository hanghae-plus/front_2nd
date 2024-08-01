import { http, HttpResponse } from 'msw'
import { mockEvents as originalMockEvents } from './mockEvents';

let mockEvents = JSON.parse(JSON.stringify(originalMockEvents));

export const mockApiHandlers = [
    http.get('/api/events', () => {
        return HttpResponse.json(mockEvents)
    }),

    http.post('/api/events', async ({ request }) => {
        const newEvent = await request.json() ;
        newEvent.id = mockEvents.length + 1;
        mockEvents.push(newEvent);
        return HttpResponse.json(newEvent, { status: 201 })
    }),

    http.put('/api/events/:id', async ({ params, request }) => {
        const { id } = params;
        const updates = await request.json();
        mockEvents = mockEvents.map(event =>
            event.id === Number(id) ? { ...event, ...updates } : event
        )
        return HttpResponse.json(mockEvents.find(event => event.id === Number(id)))
    }),

    http.delete('/api/events/:id', ({ params }) => {
        const { id } = params;
        mockEvents = mockEvents.filter(event => event.id !== Number(id));
        return new HttpResponse(null, { status: 204 })
    }),
];