import { EventType } from "../types/event";

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getWeekDates = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;

  const sunday = new Date(date.getFullYear(), date.getMonth(), diff);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(sunday);
    nextDate.setDate(sunday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
};

export const formatWeek = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${year}년 ${month}월 ${weekNumber}주`;
};

export const formatMonth = (date: Date): string => {
  if (!date.getFullYear() || date.getMonth() < 0) return "";

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

export const isDateInRange = (date: Date, start: Date, end: Date) => {
  return date >= start && date <= end;
};

export const isOverlapping = (
  event1: EventType,
  event2: EventType
): boolean => {
  const parseDateTime = (date: string, time: string): Date => {
    return new Date(`${date}T${time}`);
  };

  const start1 = parseDateTime(event1.date, event1.startTime);
  const end1 = parseDateTime(event1.date, event1.endTime);
  const start2 = parseDateTime(event2.date, event2.startTime);
  const end2 = parseDateTime(event2.date, event2.endTime);

  return start1 < end2 && start2 < end1;
};

export const findOverlappingEvents = (
  events: EventType[],
  newEvent: EventType
): EventType[] => {
  return events.filter(
    (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
  );
};
