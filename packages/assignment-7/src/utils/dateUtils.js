// src/utils/dateUtils.js

// 주어진 월의 일 수를 반환하는 함수
export function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }
  
  // 주어진 날짜가 속한 주의 모든 날짜를 반환하는 함수
  export function getWeekDates(date) {
    const day = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - day);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  }
  
  // 주어진 날짜의 주 정보를 올바른 형식으로 반환하는 함수
  export function formatWeek(date) {
    const weekDates = getWeekDates(date);
    return weekDates.map(d => d.toISOString().slice(0, 10)).join(', ');
  }
  
  // 주어진 날짜의 월 정보를 올바른 형식으로 반환하는 함수
  export function formatMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month < 10 ? '0' : ''}${month}`;
  }
  
  // 주어진 날짜가 특정 범위 내에 있는지 판단하는 함수
  export function isDateInRange(date, startDate, endDate) {
    return date >= startDate && date <= endDate;
  }
  