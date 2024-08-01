import { http, HttpResponse } from 'msw';
import { Event } from '../../types/types';
import { initialEvents } from '../mockData';

let events = [...initialEvents];

export const mockEventApiHandlers = [
  http.get('/api/events', () => {
    return HttpResponse.json(events);
  }),

  http.post('/api/events', async ({ request }) => {
    const event = (await request.json()) as Event;
    const newEvent = { ...event };
    events.push(event);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Record<string, unknown>;
    events = events.map((event) => (event.id === Number(id) ? { ...event, ...updates } : event));
    return HttpResponse.json(events.find((event) => event.id === Number(id)));
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    events = events.filter((event) => event.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
