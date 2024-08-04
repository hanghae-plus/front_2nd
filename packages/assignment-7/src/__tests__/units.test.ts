import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { mockApiHandlers } from "../mockApiHandlers";
import { formatMonth, formatWeek, getDaysInMonth, getWeekDates, isDateInRange } from "../utils/dateUtils";

const server = setupServer(...mockApiHandlers);

// Execute mock server before test
beforeAll(() => server.listen())

// Close mock server after test
afterAll(() => server.close())

type Month = 0|1|2|3|4|5|6|7|8|9|10|11
const getRealDaysInMonth = (year:number, month: Month) => {
  switch(month){
    case 0:
      return 31
    case 1:
      return year % 4 === 0 ? 29 : 28
    case 2:
      return 31
    case 3:
      return 30
    case 4:
      return 31
    case 5:
      return 30
    case 6:
      return 31
    case 7:
      return 31
    case 8:
      return 30
    case 9:
      return 31
    case 10:
      return 30
    case 11:
      return 31
  }
}
describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth 함수', () => {
    test('윤년이 아닌 해의 1월부터 12월까지 각 일 수를 반환한다.', () => {
      for(let i = 0 ; i < 12 ; i ++){
        const daysInMonth = getDaysInMonth(2023, i);
        expect(daysInMonth).toBe(getRealDaysInMonth(2023, i as Month))
      }
    });
    test("윤년인 해의 2월은 29일까지이다.", () => {
      const daysInMonth = getDaysInMonth(2024, 1);
      expect(daysInMonth).toBe(getRealDaysInMonth(2024, 1))
    })
  });

  describe('getWeekDates 함수', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const targetDate = new Date('2024-08-05')
      const expectResult = [
        new Date("2024-08-05T00:00:00.000Z"),
        new Date("2024-08-06T00:00:00.000Z"),
        new Date("2024-08-07T00:00:00.000Z"),
        new Date("2024-08-08T00:00:00.000Z"),
        new Date("2024-08-09T00:00:00.000Z"),
        new Date("2024-08-10T00:00:00.000Z"),
        new Date("2024-08-11T00:00:00.000Z"),
      ]
      expect(getWeekDates(targetDate)).toStrictEqual(expectResult)
    });
    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const targetDate = new Date("2024-12-31")
      const expectResult = [
        new Date("2024-12-30T00:00:00.000Z"),
        new Date("2024-12-31T00:00:00.000Z"),
        new Date("2025-01-01T00:00:00.000Z"),
        new Date("2025-01-02T00:00:00.000Z"),
        new Date("2025-01-03T00:00:00.000Z"),
        new Date("2025-01-04T00:00:00.000Z"),
        new Date("2025-01-05T00:00:00.000Z"),
      ]
      expect(getWeekDates(targetDate)).toStrictEqual(expectResult)
    });
  });

  describe('formatWeek 함수', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      expect(formatWeek(new Date("2024-07-31"))).toBe("2024년 7월 5주")
      expect(formatWeek(new Date("2024-08-01"))).toBe("2024년 8월 1주")
    });
  });

  describe('formatMonth 함수', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      expect(formatMonth(new Date("2024-07-31"))).toBe("2024년 7월")
      expect(formatMonth(new Date("2024-08-01"))).toBe("2024년 8월")
    });
  });

  describe('isDateInRange 함수', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const startDate = new Date("2024-08-01")
      const endDate = new Date("2024-08-31")
      const targetDate1 = new Date("2024-07-15")
      const targetDate2 = new Date("2024-08-15")
      const targetDate3 = new Date("2024-09-15")

      expect(isDateInRange(targetDate1, startDate, endDate)).toBe(false)
      expect(isDateInRange(targetDate2, startDate, endDate)).toBe(true)
      expect(isDateInRange(targetDate3, startDate, endDate)).toBe(false)
    });
  });
});
