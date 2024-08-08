import { Event } from '../types';
import { getWeekDates, isDateInMonth, isDateInRange } from './dateUtils';

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
  return filterEventsByDateRange(events, weekDates[0], weekDates[6]);
}

function filterEventsByDateRangeAtMonth(events: Event[], currentDate: Date) {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
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

export function getYearlyRepeatingEvents(event: Event, currentDate: Date): Event[] {
  const yearlyEvents: Event[] = [];

  const startDate = new Date(event.date);
  const endDate = new Date(event.repeat?.endDate ?? new Date(currentDate.getFullYear() + 10, 11, 31)); // 기본적으로 10년 후까지 반복

  const currentEventDate = new Date(startDate);

  while (currentEventDate <= endDate) {
    if (event.repeat && typeof event.repeat.interval === 'number') {
      yearlyEvents.push({
        ...event,
        date: new Date(currentEventDate).toISOString(),
      });

      // interval 년 만큼 날짜를 더합니다
      currentEventDate.setFullYear(currentEventDate.getFullYear() + event.repeat.interval);

      // 윤년 처리: 2월 29일이 있는 해에서 없는 해로 넘어갈 때
      if (currentEventDate.getMonth() !== startDate.getMonth()) {
        currentEventDate.setDate(0); // 이전 달의 마지막 날로 설정
      }
    } else {
      break;
    }
  }

  return yearlyEvents;
}

export function getMonthlyRepeatingEvents(event: Event, currentDate: Date): Event[] {
  const monthlyEvents: Event[] = [];

  const startDate = new Date(event.date);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const endDate = new Date(event.repeat?.endDate ?? monthEnd);

  const currentEventDate = new Date(startDate);

  while (currentEventDate <= endDate) {
    if (event.repeat && typeof event.repeat.interval === 'number') {
      monthlyEvents.push({
        ...event,
        date: new Date(currentEventDate).toISOString().split('T')[0],
      });

      // interval 개월 만큼 날짜를 더합니다
      currentEventDate.setMonth(currentEventDate.getMonth() + event.repeat.interval);

      // 날짜가 원래 날짜를 넘어갈 경우 (예: 31일에서 30일로), 마지막 날로 조정
      if (currentEventDate.getDate() !== startDate.getDate()) {
        currentEventDate.setDate(0); // 이전 달의 마지막 날로 설정
      }
    } else {
      break;
    }
  }

  return monthlyEvents;
}
export function getWeeklyRepeatingEvents(event: Event, currentDate: Date): Event[] {
  const weeklyEvents: Event[] = [];

  const startDate = new Date(event.date);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const endDate = new Date(event.repeat?.endDate ?? monthEnd);

  const currentEventDate = new Date(startDate);

  while (currentEventDate <= endDate) {
    if (event.repeat && typeof event.repeat.interval === 'number') {
      weeklyEvents.push({
        ...event,
        date: new Date(currentEventDate).toISOString().split('T')[0],
      });

      // interval 주 만큼 날짜를 더합니다
      currentEventDate.setDate(currentEventDate.getDate() + 7 * event.repeat.interval);
    } else {
      break;
    }
  }

  return weeklyEvents;
}

export function getDailyRepeatingEvents(event: Event, currentDate: Date): Event[] {
  const dailyEvents: Event[] = [];

  const startDate = new Date(event.date);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const endDate = new Date(event.repeat?.endDate ?? monthEnd);

  const currentEventDate = new Date(startDate);

  while (currentEventDate <= endDate) {
    if (event.repeat && typeof event.repeat.interval === 'number') {
      dailyEvents.push({
        ...event,
        date: new Date(currentEventDate).toISOString().split('T')[0],
      });

      // interval 만큼 일수를 더합니다
      currentEventDate.setDate(currentEventDate.getDate() + event.repeat.interval);
    } else {
      break;
    }
  }

  return dailyEvents;
}

export function expandRepeatingEvents(events: Event[], currentDate: Date, view: 'week' | 'month') {
  const result = events
    .reduce((acc, event) => {
      // 일단 이벤트를 찾고
      if (event.repeat.type === 'none') {
        return [...acc, event];
      }

      // 반복되는 이벤트라면 반복 유형을 확인한 후
      switch (event.repeat.type) {
        case 'yearly':
          return [...acc, ...getMonthlyRepeatingEvents(event, currentDate)];

        case 'monthly':
          return [...acc, ...getMonthlyRepeatingEvents(event, currentDate)];
        case 'weekly':
          return [...acc, ...getWeeklyRepeatingEvents(event, currentDate)];
        case 'daily':
          return [...acc, ...getDailyRepeatingEvents(event, currentDate)];
        default:
          return acc;
      }
    }, [] as Event[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((event) => isDateInMonth(new Date(event.date), currentDate));

  // 이벤트를 다시금 추가해준다.
  // 정렬하여 반환한다.

  return result;
}
