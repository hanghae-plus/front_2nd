import { http, HttpResponse } from 'msw';
import { getInitialEvents } from './mockEventData';

let events = getInitialEvents();

export const resetEvents = () => {
  events = getInitialEvents();
};

export const mockApiHandlers = [
  http.get('/api/events', () => {
    return HttpResponse.json(events);
  }),

  http.post('/api/events', async ({ request }) => {
    const newEvent = (await request.json()) as ReturnType<typeof getInitialEvents>[number];
    events.push({ ...newEvent, id: events.length + 1 });
    return HttpResponse.json(events[events.length - 1], { status: 201 });
  }),

  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedEvent = (await request.json()) as ReturnType<typeof getInitialEvents>[number];
    const index = events.findIndex(e => e.id === Number(id));
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent };
      return HttpResponse.json(events[index]);
    }
    return HttpResponse.json({ error: 'Event not found' }, { status: 404 });
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    events = events.filter(e => e.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
