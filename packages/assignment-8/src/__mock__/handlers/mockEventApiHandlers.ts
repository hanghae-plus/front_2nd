import { http, HttpResponse } from 'msw';
import { Event } from '../../types/types';

export const mockEventApiHandlers = (initialEvents: Event[]) => {
  const events: Event[] = [...initialEvents];

  return [
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
      const eventIndex = events.findIndex((event) => event.id === Number(id));
      if (eventIndex != -1) {
        events[eventIndex] = { ...events[eventIndex], ...updates };
        return HttpResponse.json(events[eventIndex]);
      }

      return HttpResponse.json(events.find((event) => event.id === Number(id)));
    }),

    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const eventIndex = events.findIndex((event) => event.id === Number(id));
      if (eventIndex > -1) {
        events.splice(eventIndex, 1);
        return new HttpResponse(null, { status: 204 });
      }
    }),
  ];
};
