import { http, HttpResponse } from 'msw';
import { events, type EventType, type NewEventType } from './mockData';

export const handlers = [
  // GET /api/events
  http.get('/api/events', () => {
    return HttpResponse.json(events);
  }),

  // POST /api/events
  http.post('/api/events', async ({ request }) => {
    const body = (await request.json()) as NewEventType;
    const newEvent: EventType = {
      id: Date.now(),
      ...body,
    };
    events.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // PUT /api/events/:id
  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<EventType>;
    const eventIndex = events.findIndex((event) => event.id === Number(id));
    if (eventIndex > -1) {
      events[eventIndex] = { ...events[eventIndex], ...body };
      return HttpResponse.json(events[eventIndex]);
    }
    return HttpResponse.json({ message: 'Event not found' }, { status: 404 });
  }),

  // DELETE /api/events/:id
  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    const eventIndex = events.findIndex((event) => event.id === Number(id));
    if (eventIndex > -1) {
      events.splice(eventIndex, 1);
      return new HttpResponse(null, { status: 204 });
    }
    return HttpResponse.json({ message: 'Event not found' }, { status: 404 });
  }),
];
