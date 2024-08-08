import { Event, RepeatType } from '../types';
import { getNewDate, getWeekDates, isDateInMonth, isDateInRange, isDateInWeek } from './dateUtils';

function filterEventsByDateRange(events: Event[], start: Date, end: Date): Event[] {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return isDateInRange(eventDate, start, end);
  });
}

function containsTerm(target: string, term: string) {
  return target.toLowerCase().includes(term.toLowerCase());
}

function searchEvents(events: Event[], term: string) {
  return events.filter(
    ({ title, description, location }) =>
      containsTerm(title, term) || containsTerm(description, term) || containsTerm(location, term)
  );
}

function filterEventsByDateRangeAtWeek(events: Event[], currentDate: Date) {
  const weekDates = getWeekDates(currentDate);
  return filterEventsByDateRange(
    events,
    getNewDate(weekDates[0], (date) => date.setHours(0, 0, 0)),
    getNewDate(weekDates[6], (date) => date.setHours(23, 59, 59))
  );
}

function filterEventsByDateRangeAtMonth(events: Event[], currentDate: Date) {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
  return filterEventsByDateRange(events, monthStart, monthEnd);
}

export function getFilteredEvents(
  events: Event[],
  searchTerm: string,
  currentDate: Date,
  view: 'week' | 'month'
): Event[] {
  const searchedEvents = searchEvents(events, searchTerm);

  if (view === 'week') {
    return filterEventsByDateRangeAtWeek(searchedEvents, currentDate);
  }

  if (view === 'month') {
    return filterEventsByDateRangeAtMonth(searchedEvents, currentDate);
  }

  return searchedEvents;
}

type RepeatFunction = (date: Date, interval: number) => Date;

const repeatFunctions: Record<Exclude<RepeatType, 'none'>, RepeatFunction> = {
  yearly: (date, interval) => {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + interval);
    // 윤년 처리
    if (newDate.getMonth() !== date.getMonth()) {
      newDate.setDate(0);
    }
    return newDate;
  },
  monthly: (date, interval) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + interval);
    // 월말 처리
    if (newDate.getDate() !== date.getDate()) {
      newDate.setDate(0);
    }
    return newDate;
  },
  weekly: (date, interval) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7 * interval);
    return newDate;
  },
  daily: (date, interval) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + interval);
    return newDate;
  },
};

function getRepeatingEvents(event: Event, currentDate: Date): Event[] {
  if (event.repeat.type === 'none' || typeof event.repeat.interval !== 'number') {
    return [event];
  }

  const repeatingEvents: Event[] = [];
  const startDate = new Date(event.date);
  const yearEnd = new Date(currentDate.getFullYear() + 10, 11, 31, 23, 59, 59);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
  const endDate = new Date(event.repeat.endDate ?? (event.repeat.type === 'yearly' ? yearEnd : monthEnd));
  let currentEventDate = new Date(startDate);

  while (currentEventDate <= endDate) {
    repeatingEvents.push({
      ...event,
      date: currentEventDate.toISOString().split('T')[0],
    });

    currentEventDate = repeatFunctions[event.repeat.type](currentEventDate, event.repeat.interval);
  }

  return repeatingEvents;
}

export function expandRepeatingEvents(events: Event[], currentDate: Date, view: 'week' | 'month'): Event[] {
  const result = events
    .flatMap((event) => getRepeatingEvents(event, currentDate))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((event) => {
      const eventDate = new Date(event.date);
      return view === 'week' ? isDateInWeek(eventDate, currentDate) : isDateInMonth(eventDate, currentDate);
    });

  return result;
}
