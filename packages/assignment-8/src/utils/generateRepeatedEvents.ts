import { Event, RepeatType } from "../types";

function generateRepeatedEvents(events: Event[]): Event[] {

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function addWeeks(date: Date, weeks: number): Date {
    return addDays(date, weeks * 7);
  }

  function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  function addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  function getNextDate(date: Date, repeatType: RepeatType, interval: number): Date {
    switch (repeatType) {
      case 'daily':
        return addDays(date, interval);
      case 'weekly':
        return addWeeks(date, interval);
      case 'monthly':
        return addMonths(date, interval);
      case 'yearly':
        return addYears(date, interval);
      default:
        return date;
    }
  }

  const repeatedEvents: Event[] = [];
  const now = new Date();
  const maxEndDate = addYears(now, 1);

  events.forEach((event) => {
    const newEvent: Event = { ...event };

    if (newEvent.repeat && newEvent.repeat.type !== 'none' && newEvent.repeat.interval > 0) {
      const { type, interval, endDate } = newEvent.repeat;
      let currentDate = new Date(newEvent.date);
      const end = endDate ? new Date(endDate) : maxEndDate;

      let idx = 0
      while (currentDate <= end) {
        newEvent.subId = idx ++
        newEvent.date = currentDate.toISOString().split('T')[0];
        repeatedEvents.push({ ...newEvent });
        currentDate = getNextDate(currentDate, type, interval);
      }
    } else {
      newEvent.subId = 0
      repeatedEvents.push(newEvent);
    }
  });

  return repeatedEvents;
}

export default generateRepeatedEvents