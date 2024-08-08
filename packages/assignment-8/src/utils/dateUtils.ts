import { Event, RepeatType } from '../types.ts';

/**
 * 주어진 년도와 월의 일수를 반환합니다.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 주어진 날짜를 복사하여 새로운 날짜를 반환합니다.
 * @description callback 함수를 사용하여 날짜를 조작하고, 새로운 날짜를 반환합니다.
 */
export function getNewDate(date: Date, callback: (date: Date) => void) {
  const newDate = new Date(date);
  callback(newDate);
  return newDate;
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
    const nextDate = getNewDate(monday, (date) => {
      date.setDate(date.getDate() + i - 1);
    });
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

export function getRepeatTypeText(repeatType: RepeatType, interval: number): string {
  switch (repeatType) {
    case 'none':
      return '';
    case 'daily':
      return `${interval}일마다 반복`;
    case 'weekly':
      return `${interval}주마다 반복`;
    case 'monthly':
      return `${interval}월마다 반복`;
    case 'yearly':
      return `${interval}년마다 반복`;
    default:
      return '알 수 없는 반복 유형';
  }
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
export function isDateInRange(date: Date, rangeStart: Date, rangeEnd: Date): boolean {
  return date >= rangeStart && date <= rangeEnd;
}

/**
 * 주어진 날짜가 특정 월에 포함되어 있는지 확인합니다.
 * @description 연도를 함께 비교하여 동일한 월인지 확인합니다.
 */
export function isDateInMonth(date: Date, month: Date) {
  return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
}

/**
 * 주어진 날짜가 특정 주에 포함되어 있는지 확인합니다.
 * @description 연도를 함께 비교하여 동일한 주인지 확인합니다.
 */
export function isDateInWeek(date: Date, week: Date): boolean {
  const weekDates = getWeekDates(week);
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return weekDates.some(
    (weekDate) =>
      weekDate.getFullYear() === compareDate.getFullYear() &&
      weekDate.getMonth() === compareDate.getMonth() &&
      weekDate.getDate() === compareDate.getDate()
  );
}
export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, '0');
}

export function formatDate(currentDate: Date, day?: number) {
  return [currentDate.getFullYear(), fillZero(currentDate.getMonth() + 1), fillZero(day ?? currentDate.getDate())].join(
    '-'
  );
}
