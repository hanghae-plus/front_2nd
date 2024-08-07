import { Event } from '../types';

export function parseDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

export function convertEventToDateRange({ date, startTime, endTime }: Event) {
  return {
    start: parseDateTime(date, startTime),
    end: parseDateTime(date, endTime),
  }
}

export function isOverlapping(event1: Event, event2: Event) {
  const { start: start1, end: end1 } = convertEventToDateRange(event1);
  const { start: start2, end: end2 } = convertEventToDateRange(event2);

  return start1 < end2 && start2 < end1;
}

export function findOverlappingEvents(newEvent: Event, events: Event[]) {
  return events.filter(event => event.id !== newEvent.id && isOverlapping(event, newEvent));
}
