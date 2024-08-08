import { Event } from "../types.ts";

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
  rangeEnd: Date,
): boolean {
  return date >= rangeStart && date <= rangeEnd;
}

export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, "0");
}

export function formatDate(currentDate: Date, day?: number) {
  return [
    currentDate.getFullYear(),
    fillZero(currentDate.getMonth() + 1),
    fillZero(day ?? currentDate.getDate()),
  ].join("-");
}

type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

let repeatEndCnt = 0;

export function isDateInRepeatEvent(
  calendarDate: Date,
  eventDate: Date,
  repeatType: RepeatType,
  repeatInterval: number,
  endDate?: Date,
  endCnt?: number,
) {
  const getDifferenceInDays = (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDifferenceInMonths = (date1: Date, date2: Date): number => {
    return (
      (date2.getFullYear() - date1.getFullYear()) * 12 +
      (date2.getMonth() - date1.getMonth())
    );
  };

  const getDifferenceInYears = (date1: Date, date2: Date): number => {
    return date2.getFullYear() - date1.getFullYear();
  };

  // 기준 날짜보다 이전에 있는 일정은 표시 x
  if (calendarDate.getTime() - eventDate.getTime() < 0) {
    return false;
  }

  if (endDate) {
    if (calendarDate.getTime() > endDate.getTime()) {
      return false;
    }
  }

  if (repeatType === "daily") {
    const differenceInDays = getDifferenceInDays(calendarDate, eventDate);
    return differenceInDays % repeatInterval === 0;
  }

  if (repeatType === "weekly") {
    const differenceInDays = getDifferenceInDays(calendarDate, eventDate);
    return (differenceInDays / 7) % repeatInterval === 0;
  }

  if (repeatType === "monthly") {
    const differenceInMonths = getDifferenceInMonths(calendarDate, eventDate);
    return differenceInMonths % repeatInterval === 0;
  }

  if (repeatType === "yearly") {
    const differenceInYears = getDifferenceInYears(calendarDate, eventDate);
    return differenceInYears % repeatInterval === 0;
  }
}

function combineDate(date: Date, day: number) {
  const year = date.getFullYear();
  const month = date.getMonth(); // getMonth는 0부터 시작하므로 0이 1월입니다.

  // 새로운 Date 객체를 생성
  return new Date(year, month, day);
}
