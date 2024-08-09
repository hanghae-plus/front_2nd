import { Event } from '../types';

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function isBefore(date1: Date, date2: Date): boolean {
  return date1 < date2;
}

export function expandRecurringEvent(event: Event, endDate: Date): Event[] {
  if (event.repeat.type === 'none') {
    return [event];
  }

  const expandedEvents: Event[] = [];
  let currentDate = new Date(event.date);
  const eventEndDate = event.repeat.endDate
    ? new Date(event.repeat.endDate)
    : endDate;

  while (isBefore(currentDate, eventEndDate)) {
    expandedEvents.push({
      ...event,
      date: currentDate.toISOString().split('T')[0],
      id: parseInt(`${event.id}-${currentDate.getTime()}`),
    });

    switch (event.repeat.type) {
      case 'daily':
        currentDate = addDays(currentDate, event.repeat.interval);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, event.repeat.interval);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, event.repeat.interval);
        break;
      case 'yearly':
        currentDate = addYears(currentDate, event.repeat.interval);
        break;
    }
  }

  return expandedEvents;
}

/**
 * 주어진 년도와 월의 일수를 반환합니다.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 주어진 날짜가 속한 주의 모든 날짜를 반환합니다.
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 주의 시작을 월요일로 조정
  const monday = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
}

export function getWeeksAtMonth(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = [];

  const initWeek = () => Array(7).fill(null);

  let week: Array<number | null> = initWeek();

  for (let i = 0; i < firstDayOfMonth; i++) {
    week[i] = null;
  }

  for (const day of days) {
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    week[dayIndex] = day;
    if (dayIndex === 6 || day === daysInMonth) {
      weeks.push(week);
      week = initWeek();
    }
  }

  return weeks;
}

export function getEventsForDay(events: Event[], date: number): Event[] {
  return events.filter((event) => new Date(event.date).getDate() === date);
}

/**
 * 주어진 날짜의 주 정보를 "YYYY년 M월 W주" 형식으로 반환합니다.
 */
export function formatWeek(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${year}년 ${month}월 ${weekNumber}주`;
}

/**
 * 주어진 날짜의 월 정보를 "YYYY년 M월" 형식으로 반환합니다.
 */
export function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

/**
 * 주어진 날짜가 특정 범위 내에 있는지 확인합니다.
 */
export function isDateInRange(
  date: Date,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  return date >= rangeStart && date <= rangeEnd;
}

export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, '0');
}

export function formatDate(currentDate: Date, day?: number) {
  return [
    currentDate.getFullYear(),
    fillZero(currentDate.getMonth() + 1),
    fillZero(day ?? currentDate.getDate()),
  ].join('-');
}
