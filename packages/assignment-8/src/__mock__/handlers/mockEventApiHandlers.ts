import { http, HttpResponse } from 'msw';
import { Event } from '../../types/types';

export const mockEventApiHandlers = (initialEvents: Event[]) => {
  let events: Event[] = [...initialEvents];

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

    http.post('/api/events/bulk', async ({ request }) => {
      const newEvents = (await request.json()) as Event[];
      const repeatId = Date.now().toString() + 'repeat';
      const addedEvents = newEvents.map((event) => {
        const newEvent = { ...event, repeatId };
        events.push(newEvent);
        return newEvent;
      });
      return HttpResponse.json(addedEvents, { status: 201 });
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

    http.put('/api/events/repeat/:repeatId', async ({ params, request }) => {
      const { repeatId } = params;
      const updates = (await request.json()) as Partial<Event>;
      const updatedEvents = events.map((event) => {
        if (event.repeatId === repeatId) {
          return { ...event, ...updates };
        }
        return event;
      });
      events = updatedEvents;
      return HttpResponse.json(updatedEvents);
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
