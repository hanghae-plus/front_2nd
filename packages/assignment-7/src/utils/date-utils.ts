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

export { getDaysInMonth, getWeekDates };
