import { Event } from "./type/schedule.type";

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

export const isDateInRange = ({
  date,
  startDate,
  endDate,
}: {
  date: Date;
  startDate: Date;
  endDate: Date;
}): boolean => {
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const rangeStart = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const rangeEnd = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  return targetDate >= rangeStart && targetDate <= rangeEnd;
};

// 날짜 문자열을 Date 객체로 변환하는 함수
export const parseDateTime = (date: string, time: string): Date => {
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
