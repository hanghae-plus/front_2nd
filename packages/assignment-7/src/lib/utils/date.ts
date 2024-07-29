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
