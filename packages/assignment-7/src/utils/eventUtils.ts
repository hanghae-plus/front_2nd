import { Event } from '../types/types';
import { parseDateTime } from './utils';

const isOverlapping = (event1: Event, event2: Event): boolean => {
  const start1 = parseDateTime(event1.date, event1.startTime);
  const end1 = parseDateTime(event1.date, event1.endTime);
  const start2 = parseDateTime(event2.date, event2.startTime);
  const end2 = parseDateTime(event2.date, event2.endTime);

  return start1 < end2 && start2 < end1;
};

const findOverlappingEvents = (newEvent: Event, existingEvents: Event[]): Event[] => {
  return existingEvents.filter((event) => event.id !== newEvent.id && isOverlapping(event, newEvent));
};
export { findOverlappingEvents };
