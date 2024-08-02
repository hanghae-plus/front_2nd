import { useState, useEffect } from 'react';

type CalendarView = 'week' | 'month';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

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

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const changeView = (newView: CalendarView) => {
    setView(newView);
  };

  const formatWeek = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const weekNumber = Math.ceil(date.getDate() / 7);
    return `${year}년 ${month}월 ${weekNumber}주`;
  };

  const formatMonth = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const getWeekDates = (date: Date): Date[] => {
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

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const fetchHolidays = async (_year: number, _month: number) => {
    // 여기서 실제로 API를 호출하여 휴일 정보를 가져오는 로직을 구현합니다.
    // 예시로 하드코딩된 데이터를 반환합니다.
    return {
      '2024-01-01': '신정',
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
      '2024-03-01': '삼일절',
      '2024-05-05': '어린이날',
      '2024-06-06': '현충일',
      '2024-08-15': '광복절',
      '2024-09-16': '추석',
      '2024-09-17': '추석',
      '2024-09-18': '추석',
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
      '2024-12-25': '크리스마스',
    };
  };

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    fetchHolidays(year, month).then(setHolidays);
  }, [currentDate]);

  return {
    currentDate,
    view,
    holidays,
    navigate,
    goToToday,
    changeView,
    formatWeek,
    formatMonth,
    getWeekDates,
    getDaysInMonth,
  };
}
