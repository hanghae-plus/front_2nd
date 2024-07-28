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
 *
 * @param date
 * @returns
 */
const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

export { getDaysInMonth, getWeekDates, formatWeek, formatMonth };
