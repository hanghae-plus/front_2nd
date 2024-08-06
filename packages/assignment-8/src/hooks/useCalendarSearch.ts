import { useState } from 'react';
import { Event } from '../types/types';
import { getWeekDates } from '../utils/utils';

export const useCalendarSearch = (events: Event[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const searchEvents = () => {
    if (!searchTerm.trim()) return events;

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      } else if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  // 검색후 기간내 리스트 필터
  const filteredEvents = (() => {
    const filtered = searchEvents();
    return filtered.filter((event) => {
      const eventDate = new Date(event.date);
      if (view === 'week') {
        const weekDates = getWeekDates(currentDate);
        return eventDate >= weekDates[0] && eventDate <= weekDates[6];
      } else if (view === 'month') {
        return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
      }
      return true;
    });
  })();

  return {
    searchTerm,
    setSearchTerm,
    view,
    setView,
    searchEvents,
    filteredEvents,
    navigate,
    currentDate,
  };
};
