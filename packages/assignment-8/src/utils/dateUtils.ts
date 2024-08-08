import { Event } from '../App';

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
