import { Event } from "../types/types";

/**
 * 특정 년도와 달을 통해 일수를 얻는 함수
 * @param year 현재 년도
 * @param month 이전 달
 * @returns
 */
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * date인자를 기준으로 date를 포함한 주의 날들을 얻는 함수
 * @param date
 * @returns
 */
const getWeekDates = (date: Date) => {
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

/**
 * date에 따라 현재 `년 월 주`형식으로 반환하는 함수
 * @param date
 * @returns
 */
const formatWeek = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${year}년 ${month}월 ${weekNumber}주`;
};

/**
 * date에 따라 현재 `년 월`형식으로 반환하는 함수
 * @param date
 * @returns
 */
const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

// 현재 날짜 'YYYY-MM-DD' 포맷 맞추기
const getCurrentDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");

  const dateString = year + "-" + month + "-" + day;

  return dateString;
};

/**
 * 날짜 문자열을 Date 객체로 변환하는 함수
 * @param date
 * @param time
 * @returns
 */
const parseDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

/**
 * 두 일정이 겹치는지 확인하는 함수
 * @param event1
 * @param event2
 * @returns
 */
const isOverlapping = (event1: Event, event2: Event): boolean => {
  const start1 = parseDateTime(event1.date, event1.startTime);
  const end1 = parseDateTime(event1.date, event1.endTime);
  const start2 = parseDateTime(event2.date, event2.startTime);
  const end2 = parseDateTime(event2.date, event2.endTime);

  return start1 < end2 && start2 < end1;
};

/**
 * 겹치는 일정을 찾는 함수
 * @param newEvent
 * @returns
 */
const findOverlappingEvents = (oldEvent: Event[], newEvent: Event): Event[] => {
  return oldEvent.filter(
    (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
  );
};

/**
 * 이벤트 검색 함수
 * @param repeatEvents
 * @param term
 * @returns
 */
const searchEvents = (repeatEvents: Event[], term: string) => {
  if (!term.trim()) return repeatEvents;

  return repeatEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(term.toLowerCase()) ||
      event.description.toLowerCase().includes(term.toLowerCase()) ||
      event.location.toLowerCase().includes(term.toLowerCase())
  );
};

/**
 * 주어진 날짜가 시작일과 종료일 사이에 있는지 확인하는 함수
 * @param date
 * @param startDate
 * @param endDate
 * @returns boolean 주어진 날짜가 범위 내에 있으면 true, 그렇지 않으면 false
 */
const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

/**
 * 주어진 일정과 반복 정보(반복 유형, 반복 주기)로 반복 일정을 생성하는 함수
 * @param event
 * @returns
 */
const getRepeatEvents = (event: Event) => {
  const { type, interval, endDate, repeatNumber, repeatDay } = event.repeat;

  const repeatEvents = [];
  if (type === "none" || !interval) {
    return [];
  }
  const startDate = new Date(event.date);

  let tempId = 0;

  const dayMapping: Record<string, number> = {
    일: 0,
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
  };

  if (Number(repeatNumber) > 0) {
    const currentDate = new Date(startDate);
    let count = 0;
    // 요일 지정해서 생성하는 부분 급해서...gpt에 의존...ㅠㅠ
    while (count < Number(repeatNumber)) {
      if (type === "weekly" && repeatDay && repeatDay.length > 0) {
        for (let i = 0; i < 7; i++) {
          const tempDate = new Date(currentDate);
          tempDate.setDate(tempDate.getDate() + i);
          const dayOfWeek = tempDate.getDay();
          if (repeatDay.some((day) => dayMapping[day] === dayOfWeek)) {
            const newEvent = {
              ...event,
              id: event.id + tempId,
              date: tempDate.toISOString().split("T")[0],
            };
            repeatEvents.push(newEvent);
            tempId++;
            count++;
            if (count >= Number(repeatNumber)) break;
          }
        }
        currentDate.setDate(currentDate.getDate() + 7 * interval);
      } else {
        const newEvent = {
          ...event,
          id: event.id + tempId,
          date: currentDate.toISOString().split("T")[0],
        };
        repeatEvents.push(newEvent);
        count++;

        // 다음 날짜 계산하기
        switch (type) {
          case "daily":
            currentDate.setDate(currentDate.getDate() + interval);
            break;
          case "weekly":
            currentDate.setDate(currentDate.getDate() + 7 * interval);
            break;
          case "monthly":
            currentDate.setMonth(currentDate.getMonth() + interval);
            break;
          case "yearly":
            currentDate.setFullYear(currentDate.getFullYear() + interval);
            break;
        }
        tempId++;
      }
    }
    return repeatEvents;
  }

  const newEndDate = endDate
    ? new Date(endDate)
    : new Date(new Date(startDate.getFullYear(), 11, 31));

  for (let currentDate = new Date(startDate); currentDate <= newEndDate; ) {
    if (type === "weekly" && repeatDay && repeatDay.length > 0) {
      for (let i = 0; i < 7; i++) {
        const tempDate = new Date(currentDate);
        tempDate.setDate(tempDate.getDate() + i);
        if (tempDate > newEndDate) break;
        const dayOfWeek = tempDate.getDay();
        if (repeatDay.some((day) => dayMapping[day] === dayOfWeek)) {
          const newEvent = {
            ...event,
            id: event.id + tempId,
            date: tempDate.toISOString().split("T")[0],
          };
          repeatEvents.push(newEvent);
          tempId++;
        }
      }
      currentDate.setDate(currentDate.getDate() + 7 * interval);
    } else {
      const newEvent = {
        ...event,
        id: event.id + tempId,
        date: currentDate.toISOString().split("T")[0],
      };
      repeatEvents.push(newEvent);

      // 다음 날짜 계산하기
      switch (type) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7 * interval);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + interval);
          break;
        case "yearly":
          currentDate.setFullYear(currentDate.getFullYear() + interval);
          break;
      }
      tempId++;
    }
  }

  return repeatEvents;
};

export {
  getDaysInMonth,
  getWeekDates,
  formatWeek,
  formatMonth,
  getCurrentDate,
  parseDateTime,
  isOverlapping,
  findOverlappingEvents,
  searchEvents,
  isDateInRange,
  getRepeatEvents,
};
