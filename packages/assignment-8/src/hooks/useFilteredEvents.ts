import { useMemo } from 'react';
import { Event, View } from '../types/types';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isDateInRange,
} from '../lib/utils/date';

interface UseFilteredEventsProps {
  // searchTerm
  term?: string;
  events: Event[];
  currentDate: Date;
  view: View;
}

// 테스트를 위해 과도하게 많은 이벤트가 생성되지 않게 하기 위해 테스트용 날짜를 지정합니다.
const testEndDate = new Date('2025-01-01');

// return값으로는 검색 필터링 이벤트 / view 필터링 이벤트를 반환합니다.
export const useFilteredEvents = ({
  term,
  events,
  currentDate,
  view,
}: UseFilteredEventsProps) => {
  return useMemo(() => {
    const startDate = new Date(currentDate);
    let endDate: Date;

    if (view === 'week') {
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    } else {
      startDate.setDate(1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    }
    endDate.setHours(23, 59, 59, 999);

    const expandedEvents = expandRepeatingEvents(events, startDate, endDate);

    const filteredEvents = expandedEvents.filter((event) => {
      const eventDate = new Date(event.date);
      const isInDateRange = isDateInRange(eventDate, currentDate, view);
      const matchesSearch =
        !term?.trim() ||
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        event?.description?.toLowerCase().includes(term.toLowerCase()) ||
        event?.location?.toLowerCase().includes(term.toLowerCase());

      return isInDateRange && matchesSearch;
    });

    return filteredEvents;
  }, [events, term, currentDate, view]);
};

const expandRepeatingEvents = (
  events: Event[],
  startDate: Date,
  endDate: Date
): Event[] => {
  const expandedEvents: Event[] = [];

  events.forEach((event) => {
    if (!event.repeat || event.repeat.type === 'none') {
      expandedEvents.push(event);
      return;
    }

    const { type, interval, endDate: repeatEndDate } = event.repeat;
    let currentDate = new Date(event.date);
    const repeatEnd = repeatEndDate ? new Date(repeatEndDate) : testEndDate;

    while (currentDate <= repeatEnd && currentDate <= endDate) {
      if (currentDate >= startDate && currentDate <= endDate) {
        expandedEvents.push({
          ...event,
          date: currentDate.toISOString().split('T')[0],
        });
      }

      switch (type) {
        case 'daily':
          currentDate = addDays(currentDate, interval);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, interval);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, interval);
          break;
        case 'yearly':
          currentDate = addYears(currentDate, interval);
          break;
      }
    }
  });

  return expandedEvents;
};
