import { Event } from '../App';

// 특정 날짜에 날짜를 더하는 함수
export function addDays(date: Date, days: number): Date {}

// 특정 날짜에 주를 더하는 함수
export function addWeeks(date: Date, weeks: number): Date {}

// 특정 날짜에 년을 더하는 함수
export function addYears(date: Date, years: number): Date {}

// 반복 일정을 만드는 함수
export function createRecurringEvents(
  event: Event,
  endDateStr: string
): Event[] {}
