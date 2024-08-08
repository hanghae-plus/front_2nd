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

const sortEventsByDateAndTime = (events: Event[]): Event[] => {
  return [...events].sort((a, b) => {
    // 날짜 비교
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    }

    // 날짜가 같은 경우 시작 시간으로 비교
    const aStartTime = new Date(`${a.date}T${a.startTime}`).getTime();
    const bStartTime = new Date(`${b.date}T${b.startTime}`).getTime();
    return aStartTime - bStartTime;
  });
};

export { findOverlappingEvents, sortEventsByDateAndTime };
