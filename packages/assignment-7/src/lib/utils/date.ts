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

export const isDateInRange = (
  date: Date,
  currentDate: Date,
  view: 'month' | 'week'
) => {
  if (view === 'week') {
    const weekDates = getWeekDates(currentDate);
    return date >= weekDates[0] && date <= weekDates[6];
  }
  if (view === 'month') {
    return (
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth()
    );
  }
  return true;
};

export const formatDateString = (yyyymmdd: string) => {
  if (!/^d{8}$/.test(yyyymmdd)) {
    throw new Error('입력값은 8자리 날짜여야 합니다.');
  }

  const year = yyyymmdd.substring(0, 4);
  const month = yyyymmdd.substring(4, 6);
  const day = yyyymmdd.substring(6, 8);

  return `${year}-${month}-${day}`;
};
