import { Event, RepeatType } from "../types";
import { getWeekDates, isDateInRange, formatDate } from "./dateUtils";

const containsTerm = (target: string, term: string) => {
  return target.toLowerCase().includes(term.toLowerCase());
};

export const searchEvents = (events: Event[], term: string) => {
  if (!term.trim()) {
    return events;
  }

  return events.filter(
    ({ title, description, location }) =>
      containsTerm(title, term) ||
      containsTerm(description, term) ||
      containsTerm(location, term)
  );
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
  newEvent: Event,
  events: Event[]
): Event[] => {
  return events.filter(
    (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
  );
};

export const getFilteredEvents = (
  events: Event[],
  searchTerm: string,
  currentDate: Date,
  view: "week" | "month"
): Event[] => {
  const searchedEvents = searchEvents(events, searchTerm);

  if (view === "week") {
    const weekDates = getWeekDates(currentDate);
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return isDateInRange(eventDate, weekDates[0], weekDates[6]);
    });
  }

  if (view === "month") {
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const monthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return isDateInRange(eventDate, monthStart, monthEnd);
    });
  }

  return searchedEvents;
};

export const getRepeatChildren = (
  date: string,
  repeatType: RepeatType,
  repeatInterval: number,
  repeatEndDate: string
) => {
  const newDate = new Date(date);
  const childEvents = [];

  while (newDate <= new Date(repeatEndDate)) {
    const calculatedDate = calculateDate(repeatType, repeatInterval, newDate);

    if (new Date(calculatedDate) <= new Date(repeatEndDate)) {
      childEvents.push({
        id: Date.now() + "-" + childEvents.length + 1,
        date: formatDate(newDate),
      });
    }
  }

  return childEvents;
};

const calculateDate = (
  repeatType: RepeatType,
  repeatInterval: number,
  newDate: Date
) => {
  if (repeatType === "daily") {
    return newDate.setDate(newDate.getDate() + repeatInterval);
  }
  if (repeatType === "weekly") {
    return newDate.setDate(newDate.getDate() + repeatInterval * 7);
  }
  if (repeatType === "monthly") {
    return newDate.setDate(newDate.getMonth() + repeatInterval);
  }
  if (repeatType === "yearly") {
    return newDate.setDate(newDate.getFullYear() + repeatInterval);
  }
  return newDate;
};
