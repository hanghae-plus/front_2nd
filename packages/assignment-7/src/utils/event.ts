import { Event, EventFormData } from '../types';
import { isSameDay, parseDateTime } from './date';

export function isOverlapping(event1: Event, event2: EventFormData): boolean {
  if (event1.date !== event2.date) return false;

  const start1 = parseDateTime(event1.date, event1.startTime);
  const end1 = parseDateTime(event1.date, event1.endTime);
  const start2 = parseDateTime(event2.date, event2.startTime);
  const end2 = parseDateTime(event2.date, event2.endTime);

  return start1 < end2 && start2 < end1;
}

export function findOverlappingEvents(
  newEvent: EventFormData,
  events: Event[]
): Event[] {
  return events.filter(
    (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
  );
}

export function filterEventsByDate(events: Event[], date: Date): Event[] {
  return events.filter((event) => isSameDay(new Date(event.date), date));
}

export function sortEventsByTime(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    if (a.date !== b.date) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return a.startTime.localeCompare(b.startTime);
  });
}

export function searchEvents(events: Event[], searchTerm: string): Event[] {
  const lowercaseTerm = searchTerm.toLowerCase();
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowercaseTerm) ||
      event.description.toLowerCase().includes(lowercaseTerm) ||
      event.location?.toLowerCase().includes(lowercaseTerm)
  );
}

export function getUpcomingEvents(
  events: Event[],
  date: Date,
  limit: number = 5
): Event[] {
  return sortEventsByTime(events)
    .filter((event) => new Date(`${event.date}T${event.startTime}`) >= date)
    .slice(0, limit);
}

export function generateRecurringEvents(event: Event, endDate: Date): Event[] {
  if (event.repeat.type === 'none') return [event];

  const events: Event[] = [];
  let currentDate = new Date(event.date);
  const end =
    endDate || (event.repeat.endDate ? new Date(event.repeat.endDate) : null);

  while (!end || currentDate <= end) {
    events.push({
      ...event,
      date: currentDate.toISOString().split('T')[0],
      id: event.id + currentDate.getTime(), // 고유 ID 생성
    });

    switch (event.repeat.type) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + event.repeat.interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7 * event.repeat.interval);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + event.repeat.interval);
        break;
      case 'yearly':
        currentDate.setFullYear(
          currentDate.getFullYear() + event.repeat.interval
        );
        break;
    }
  }

  return events;
}

export function convertFormDataToEvent(formData: EventFormData): Event {
  return {
    id: formData.id ?? Date.now(), // id가 있으면 사용하고, 없으면 새로 생성
    title: formData.title,
    description: formData.description,
    date: formData.date,
    startTime: formData.startTime,
    endTime: formData.endTime,
    category: formData.category,
    location: formData.location,
    repeat: {
      type: formData.isRepeating ? formData.repeatType || 'none' : 'none',
      interval: formData.repeatInterval || 1,
      endDate: formData.repeatEndDate,
    },
    notificationTime: formData.notificationTime,
  };
}
