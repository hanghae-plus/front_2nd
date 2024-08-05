import { RepeatEvent } from "../types/event";
import { isDateInRange } from "./date";

export const isDailyRepeat = (
  startDate: Date,
  calendarDate: Date,
  interval: number
): boolean => {
  const diffTime = Math.abs(calendarDate.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays % interval === 0;
};

const isWeeklyRepeat = (
  startDate: Date,
  calendarDate: Date,
  interval: number
): boolean => {
  const diffTime = Math.abs(calendarDate.getTime() - startDate.getTime());
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return (
    diffWeeks % interval === 0 && startDate.getDay() === calendarDate.getDay()
  );
};

const isMonthlyRepeat = (
  startDate: Date,
  calendarDate: Date,
  interval: number
): boolean => {
  const monthsDiff =
    (calendarDate.getFullYear() - startDate.getFullYear()) * 12 +
    (calendarDate.getMonth() - startDate.getMonth());
  return (
    monthsDiff % interval === 0 &&
    startDate.getDate() === calendarDate.getDate()
  );
};

const isYearlyRepeat = (
  startDate: Date,
  calendarDate: Date,
  interval: number
): boolean => {
  const yearsDiff = calendarDate.getFullYear() - startDate.getFullYear();
  return (
    yearsDiff % interval === 0 &&
    startDate.getMonth() === calendarDate.getMonth() &&
    startDate.getDate() === calendarDate.getDate()
  );
};

export const getRepeatingEventForDate = (
  { repeatEndDate, repeatInterval, date, repeatType }: RepeatEvent,
  calendarDate: string
): boolean => {
  if (!date) return false;

  const startDate = new Date(date);
  const endDate = new Date(repeatEndDate);
  const calendarDateObj = new Date(calendarDate);

  if (repeatEndDate && !isDateInRange(calendarDateObj, startDate, endDate)) {
    return false;
  }

  switch (repeatType) {
    case "daily":
      return isDailyRepeat(startDate, calendarDateObj, repeatInterval);
    case "weekly":
      return isWeeklyRepeat(startDate, calendarDateObj, repeatInterval);
    case "monthly":
      return isMonthlyRepeat(startDate, calendarDateObj, repeatInterval);
    case "yearly":
      return isYearlyRepeat(startDate, calendarDateObj, repeatInterval);
    default:
      return false;
  }
};
