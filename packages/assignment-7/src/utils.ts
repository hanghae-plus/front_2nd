import { Event } from "./types";

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

export const isDateInRange = (dateToCheck: Date, startDate: Date, endDate: Date): boolean => {
  // 모든 날짜를 Date 객체로 변환
  const check = new Date(dateToCheck);
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 범위 내에 있는지 확인
  return check >= start && check <= end;
}

export const searchEvents = (events: Event[], term: string) => {
  if (!term.trim()) return events;

  return events.filter(event =>
    event.title.toLowerCase().includes(term.toLowerCase()) ||
    event.description.toLowerCase().includes(term.toLowerCase()) ||
    event.location.toLowerCase().includes(term.toLowerCase())
  );
};

export const filteredEvents = (() => {
  return (events: Event[], searchTerm: string, view: 'week' | 'month', currentDate: Date) => {
    const filtered = searchEvents(events, searchTerm);
    return filtered.filter(event => {
      const eventDate = new Date(event.date);
      if (view === 'week') {
        const weekDates = getWeekDates(currentDate);
        return eventDate >= weekDates[0] && eventDate <= weekDates[6];
      } else if (view === 'month') {
        return eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear();
      }
      return true;
    })
  }
})();

// 날짜 문자열을 Date 객체로 변환하는 함수
export const parseDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

// 겹치는 일정을 찾는 함수
export const findOverlappingEvents = (events: Event[], newEvent: Event): Event[] => {
  return events.filter(event =>
    event.id !== newEvent.id && isOverlapping(event, newEvent)
  );
}

// 두 일정이 겹치는지 확인하는 함수
export const isOverlapping = (event1: Event, event2: Event): boolean => {
  const start1 = parseDateTime(event1.date, event1.startTime);
  const end1 = parseDateTime(event1.date, event1.endTime);
  const start2 = parseDateTime(event2.date, event2.startTime);
  const end2 = parseDateTime(event2.date, event2.endTime);

  return start1 < end2 && start2 < end1;
};