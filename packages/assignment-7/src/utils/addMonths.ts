import { getDaysInMonth } from "./getDaysInMonth";

export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  const currentYear = newDate.getFullYear();
  const currentMonth = newDate.getMonth();
  const currentDay = newDate.getDate();

  const targetMonth = currentMonth + months;
  const targetYear = currentYear + Math.floor(targetMonth / 12);
  const targetMonthIndex = targetMonth % 12;

  const daysInTargetMonth = getDaysInMonth(targetYear, targetMonthIndex);
  const targetDay = Math.min(currentDay, daysInTargetMonth);

  newDate.setFullYear(targetYear, targetMonthIndex, targetDay);
  return newDate;
};
