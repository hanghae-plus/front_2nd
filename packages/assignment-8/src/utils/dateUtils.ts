import { Event } from '../interface';

// 특정 날짜에 날짜를 더하는 함수
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// 특정 날짜에 주를 더하는 함수
export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

// 특정 날짜에 년을 더하는 함수
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

// 반복 일정을 만드는 함수
export function createRecurringEvents(
  event: Event,
  endDateStr: string
): Event[] {
  const recurringEvents: Event[] = [];
  let currentDate = new Date(event.date);
  const endDate = new Date(endDateStr);

  while (currentDate <= endDate) {
    const eventDate = currentDate.toISOString().split('T')[0];
    recurringEvents.push({
      ...event,
      id: Number(Date.now()) + Number(Math.floor(Math.random() * 1000)),
      date: eventDate,
    });

    switch (event.repeat?.type) {
      case 'daily':
        currentDate = addDays(currentDate, event.repeat.interval);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, event.repeat.interval);
        break;
      case 'monthly': {
        // 다음 달의 1일로 이동
        currentDate.setMonth(currentDate.getMonth() + event.repeat.interval, 1);

        // 원래 날짜의 일(day) 또는 해당 월의 마지막 날 중 작은 값으로 설정
        const originalDay = new Date(event.date).getDate();
        const lastDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate();
        currentDate.setDate(Math.min(originalDay, lastDayOfMonth));
        break;
      }
      case 'yearly':
        currentDate = addYears(currentDate, event.repeat.interval);
        break;
      default:
        throw new Error('Invalid repeat type');
    }
  }

  return recurringEvents;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchHolidays = (year: number, month: number) => {
  return {
    '2024-01-01': '신정',
    '2024-02-09': '설날',
    '2024-02-10': '설날',
    '2024-02-11': '설날',
    '2024-03-01': '삼일절',
    '2024-05-05': '어린이날',
    '2024-06-06': '현충일',
    '2024-08-15': '광복절',
    '2024-09-16': '추석',
    '2024-09-17': '추석',
    '2024-09-18': '추석',
    '2024-10-03': '개천절',
    '2024-10-09': '한글날',
    '2024-12-25': '크리스마스',
  };
};

// 날짜 문자열을 Date 객체로 변환하는 함수
const parseDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

// 두 일정이 겹치는지 확인하는 함수
export const isOverlapping = (event1: Event, event2: Event): boolean => {
  const start1 = parseDateTime(event1.date, event1.startTime);
  const end1 = parseDateTime(event1.date, event1.endTime);
  const start2 = parseDateTime(event2.date, event2.startTime);
  const end2 = parseDateTime(event2.date, event2.endTime);

  return start1 < end2 && start2 < end1;
};

// 겹치는 일정을 찾는 함수
export const findOverlappingEvents = (
  events: Event[],
  newEvent: Event
): Event[] => {
  return events.filter(
    (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
  );
};

export const formatWeek = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${year}년 ${month}월 ${weekNumber}주`;
};

export const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getWeekDates = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
};

export const getOneYearLaterDate = (date: string) => {
  const oneYearLater = new Date(date);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  return oneYearLater.toISOString().split('T')[0];
};

export const searchEvents = (term: string, events: Event[]) => {
  if (!term.trim()) return events;

  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(term.toLowerCase()) ||
      event.description?.toLowerCase().includes(term.toLowerCase()) ||
      event.location?.toLowerCase().includes(term.toLowerCase())
  );
};
