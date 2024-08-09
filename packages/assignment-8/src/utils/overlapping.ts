import { EventType } from "../types/event";

// 날짜 문자열을 Date 객체로 변환하는 함수
const parseDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

// 두 일정이 겹치는지 확인하는 함수
const isOverlapping = (event1: EventType, event2: EventType): boolean => {
  const start1 = parseDateTime(event1.date, event1.startTime);
  const end1 = parseDateTime(event1.date, event1.endTime);
  const start2 = parseDateTime(event2.date, event2.startTime);
  const end2 = parseDateTime(event2.date, event2.endTime);

  return start1 < end2 && start2 < end1;
};

// 겹치는 일정을 찾는 함수
export const findOverlappingEvents = (
  events: EventType[],
  newEvent: EventType
) => {
  return events?.filter(
    (event) => event.id !== newEvent.id && isOverlapping(event, newEvent)
  );
};
