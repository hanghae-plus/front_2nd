import { describe, expect, test } from "vitest";
import { Event } from "../types";
import {
fillZero,
formatDate,
formatMonth,
formatWeek,
getDaysInMonth,
  getEventsForDay,
  getWeekDates,
getWeeksAtMonth,
isDateInRange
} from "../utils/dateUtils";
import { convertEventToDateRange, findOverlappingEvents, isOverlapping, parseDateTime } from "../utils/eventOverlap"; // 이 함수들이 정의된 파일을 import 해야 합니다.
import { getTimeErrorMessage } from "../utils/timeValidation";
import { getFilteredEvents } from "../utils/eventUtils";
import { createNotificationMessage, getUpcomingEvents } from "../utils/notificationUtils";
import { fetchHolidays } from "../apis/fetchHolidays";

describe('단위 테스트: 날짜 및 시간 관리', () => {
  describe('getDaysInMonth >', () => {
    test('주어진 월의 일 수를 정확히 반환한다', () => {
      expect(getDaysInMonth(2024, 1)).toBe(31); // 1월
      expect(getDaysInMonth(2024, 2)).toBe(29); // 윤년의 2월
      expect(getDaysInMonth(2023, 2)).toBe(28); // 평년의 2월
      expect(getDaysInMonth(2024, 4)).toBe(30); // 4월
    });
  });

  describe('getWeekDates >', () => {
    test('주어진 날짜가 속한 주의 모든 날짜를 반환한다', () => {
      const date = new Date('2024-07-10'); // 수요일
      const weekDates = getWeekDates(date);
      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-07-08'); // 월요일
      expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-07-14'); // 일요일
    });

    test('연도를 넘어가는 주의 날짜를 정확히 처리한다', () => {
      const date = new Date('2024-12-30'); // 월요일
      const weekDates = getWeekDates(date);
      expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-12-30'); // 월요일
      expect(weekDates[6].toISOString().split('T')[0]).toBe('2025-01-05'); // 일요일
    });
  });

  describe('getWeeksAtMonth >', () => {
    test('주어진 월의 올바른 주 정보를 반환해야 한다', () => {
      const testDate = new Date('2024-07-01');
      const weeks = getWeeksAtMonth(testDate);
      expect(weeks).toEqual([
        [null, 1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12, 13],
        [14, 15, 16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25, 26, 27],
        [28, 29, 30, null, null, null, null],
      ]);
    });
  });

  describe('getEventsForDay >', () => {
    const events: Event[] = [
      {
        id: 1,
        title: '이벤트 1',
        date: '2024-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0
      },
      {
        id: 2,
        title: '이벤트 2',
        date: '2024-07-01',
        startTime: '14:00',
        endTime: '15:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0
      },
      {
        id: 3,
        title: '이벤트 3',
        date: '2024-07-02',
        startTime: '11:00',
        endTime: '12:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0
      },
    ];

    test('특정 날짜의 이벤트만 반환해야 한다', () => {
      const dayEvents = getEventsForDay(events, 1);
      expect(dayEvents).toHaveLength(2);
      expect(dayEvents[0].title).toBe('이벤트 1');
      expect(dayEvents[1].title).toBe('이벤트 2');
    });
  });

  describe('formatWeek >', () => {
    test('주어진 날짜의 주 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-07-10');
      expect(formatWeek(date)).toBe('2024년 7월 2주');
    });
  });

  describe('formatMonth >', () => {
    test('주어진 날짜의 월 정보를 올바른 형식으로 반환한다', () => {
      const date = new Date('2024-07-10');
      expect(formatMonth(date)).toBe('2024년 7월');
    });
  });

  describe('isDateInRange >', () => {
    test('주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다', () => {
      const date = new Date('2024-07-10');
      const rangeStart = new Date('2024-07-01');
      const rangeEnd = new Date('2024-07-31');
      expect(isDateInRange(date, rangeStart, rangeEnd)).toBe(true);

      const outOfRangeDate = new Date('2024-08-01');
      expect(isDateInRange(outOfRangeDate, rangeStart, rangeEnd)).toBe(false);
    });
  });

  describe('getDaysInMonth >', () => {
    test('각 월의 올바른 일수를 반환해야 한다', () => {
      expect(getDaysInMonth(2023, 2)).toBe(28);
      expect(getDaysInMonth(2024, 2)).toBe(29); // 윤년
      expect(getDaysInMonth(2023, 4)).toBe(30);
      expect(getDaysInMonth(2023, 12)).toBe(31);
    });
  });

  describe('fillZero >', () => {
    test('주어진 숫자를 지정된 자릿수만큼 0으로 채워야 한다', () => {
      expect(fillZero(5)).toBe('05');
      expect(fillZero(10)).toBe('10');
      expect(fillZero(3, 3)).toBe('003');
    });
  });

  describe('formatDate >', () => {
    test('날짜를 YYYY-MM-DD 형식으로 포맷팅해야 한다', () => {
      const testDate = new Date('2023-05-10');
      expect(formatDate(testDate)).toBe('2023-05-10');
      expect(formatDate(testDate, 15)).toBe('2023-05-15');
    });
  });

  describe('eventOverlap >', () => {
    describe('parseDateTime >', () => {
      test('날짜와 시간 문자열을 Date 객체로 정확히 변환해야 한다', () => {
        const result = parseDateTime('2024-07-01', '14:30');
        expect(result).toEqual(new Date('2024-07-01T14:30:00'));
      });
    });

    describe('convertEventToDateRange >', () => {
      test('이벤트 객체를 시작 시간과 종료 시간을 가진 객체로 변환해야 한다', () => {
        const event: Event = {
          id: 1,
          date: '2024-07-01',
          startTime: '14:30',
          endTime: '15:30',
          title: '테스트 이벤트',
          description: '',
          location: '',
          category: '',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 0
        };
        const result = convertEventToDateRange(event);
        expect(result.start).toEqual(new Date('2024-07-01T14:30:00'));
        expect(result.end).toEqual(new Date('2024-07-01T15:30:00'));
      });
    });

    describe('isOverlapping >', () => {
      test('두 이벤트가 겹치는 경우 true를 반환해야 한다', () => {
        const event1: Event = {
          id: 1, date: '2024-07-01', startTime: '14:00', endTime: '16:00',
          title: '이벤트 1', description: '', location: '', category: '',
          repeat: { type: 'none', interval: 0 }, notificationTime: 0
        };
        const event2: Event = {
          id: 2, date: '2024-07-01', startTime: '15:00', endTime: '17:00',
          title: '이벤트 2', description: '', location: '', category: '',
          repeat: { type: 'none', interval: 0 }, notificationTime: 0
        };
        expect(isOverlapping(event1, event2)).toBe(true);
      });

      test('두 이벤트가 겹치지 않는 경우 false를 반환해야 한다', () => {
        const event1: Event = {
          id: 1, date: '2024-07-01', startTime: '14:00', endTime: '16:00',
          title: '이벤트 1', description: '', location: '', category: '',
          repeat: { type: 'none', interval: 0 }, notificationTime: 0
        };
        const event2: Event = {
          id: 2, date: '2024-07-01', startTime: '16:00', endTime: '18:00',
          title: '이벤트 2', description: '', location: '', category: '',
          repeat: { type: 'none', interval: 0 }, notificationTime: 0
        };
        expect(isOverlapping(event1, event2)).toBe(false);
      });
    });

    describe('findOverlappingEvents >', () => {
      test('새 이벤트와 겹치는 모든 이벤트를 반환해야 한다', () => {
        const events: Event[] = [
          {
            id: 1,
            date: '2024-07-01',
            startTime: '10:00',
            endTime: '12:00',
            title: '이벤트 1',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
          {
            id: 2,
            date: '2024-07-01',
            startTime: '11:00',
            endTime: '13:00',
            title: '이벤트 2',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
          {
            id: 3,
            date: '2024-07-01',
            startTime: '15:00',
            endTime: '16:00',
            title: '이벤트 3',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
        ];
        const newEvent: Event = {
          id: 4,
          date: '2024-07-01',
          startTime: '11:30',
          endTime: '14:30',
          title: '새 이벤트',
          description: '',
          location: '',
          category: '',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 0
        };
        const result = findOverlappingEvents(newEvent, events);
        expect(result).toEqual([events[0], events[1]]);
      });

      test('겹치는 이벤트가 없으면 빈 배열을 반환해야 한다', () => {
        const events: Event[] = [
          {
            id: 1,
            date: '2024-07-01',
            startTime: '10:00',
            endTime: '12:00',
            title: '이벤트 1',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
          {
            id: 2,
            date: '2024-07-01',
            startTime: '14:00',
            endTime: '16:00',
            title: '이벤트 2',
            description: '',
            location: '',
            category: '',
            repeat: { type: 'none', interval: 0 },
            notificationTime: 0
          },
        ];
        const newEvent: Event = {
          id: 3,
          date: '2024-07-01',
          startTime: '12:00',
          endTime: '14:00',
          title: '새 이벤트',
          description: '',
          location: '',
          category: '',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 0
        };
        const result = findOverlappingEvents(newEvent, events);
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('timeValidation >', () => {
    describe('getTimeErrorMessage >', () => {
      test('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환해야 한다', () => {
        const result = getTimeErrorMessage('14:00', '13:00');
        expect(result.startTimeError).toBe('시작 시간은 종료 시간보다 빨라야 합니다.');
        expect(result.endTimeError).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
      });

      test('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환해야 한다', () => {
        const result = getTimeErrorMessage('14:00', '14:00');
        expect(result.startTimeError).toBe('시작 시간은 종료 시간보다 빨라야 합니다.');
        expect(result.endTimeError).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
      });

      test('시작 시간이 종료 시간보다 빠를 때 null을 반환해야 한다', () => {
        const result = getTimeErrorMessage('13:00', '14:00');
        expect(result.startTimeError).toBeNull();
        expect(result.endTimeError).toBeNull();
      });

      test('시작 시간이나 종료 시간이 비어있을 때 null을 반환해야 한다', () => {
        const result1 = getTimeErrorMessage('', '14:00');
        expect(result1.startTimeError).toBeNull();
        expect(result1.endTimeError).toBeNull();

        const result2 = getTimeErrorMessage('13:00', '');
        expect(result2.startTimeError).toBeNull();
        expect(result2.endTimeError).toBeNull();

        const result3 = getTimeErrorMessage('', '');
        expect(result3.startTimeError).toBeNull();
        expect(result3.endTimeError).toBeNull();
      });
    });
  });

  describe('getFilteredEvents >', () => {
    const events: Event[] = [
      {
        id: 1,
        title: '이벤트 1',
        date: '2024-07-01',
        startTime: '10:00',
        endTime: '11:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0
      },
      {
        id: 2,
        title: '이벤트 2',
        date: '2024-07-05',
        startTime: '14:00',
        endTime: '15:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0
      },
      {
        id: 3,
        title: '이벤트 3',
        date: '2024-07-10',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0
      },
    ];

    test('검색어에 맞는 이벤트만 반환해야 한다', () => {
      const result = getFilteredEvents(events, '이벤트 2', new Date('2024-07-01'), 'month');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('이벤트 2');
    });

    test('주간 뷰에서 해당 주의 이벤트만 반환해야 한다', () => {
      const result = getFilteredEvents(events, '', new Date('2024-07-01'), 'week');
      expect(result).toHaveLength(2);
      expect(result.map(e => e.title)).toEqual(['이벤트 1', '이벤트 2']);
    });

    test('월간 뷰에서 해당 월의 이벤트만 반환해야 한다', () => {
      const result = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');
      expect(result).toHaveLength(3);
    });

    test('검색어와 날짜 필터링을 동시에 적용해야 한다', () => {
      const result = getFilteredEvents(events, '이벤트', new Date('2024-07-01'), 'week');
      expect(result).toHaveLength(2);
      expect(result.map(e => e.title)).toEqual(['이벤트 1', '이벤트 2']);
    });
  });

  describe('fetchHolidays >', () => {
    test('주어진 월의 공휴일만 반환해야 한다', () => {
      const testDate = new Date('2024-05-01');
      const holidays = fetchHolidays(testDate);
      expect(Object.keys(holidays)).toHaveLength(1);
      expect(holidays['2024-05-05']).toBe('어린이날');
    });

    test('공휴일이 없는 월에 대해 빈 객체를 반환해야 한다', () => {
      const testDate = new Date('2024-04-01');
      const holidays = fetchHolidays(testDate);
      expect(Object.keys(holidays)).toHaveLength(0);
    });

    test('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환해야 한다', () => {
      const testDate = new Date('2024-09-01');
      const holidays = fetchHolidays(testDate);
      expect(Object.keys(holidays)).toHaveLength(3);
      expect(holidays['2024-09-16']).toBe('추석');
      expect(holidays['2024-09-17']).toBe('추석');
      expect(holidays['2024-09-18']).toBe('추석');
    });
  });

  describe('getUpcomingEvents >', () => {
    const events: Event[] = [
      {
        id: 1,
        title: '이벤트 1',
        date: '2023-05-10',
        startTime: '10:00',
        endTime: '11:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10
      },
      {
        id: 2,
        title: '이벤트 2',
        date: '2023-05-10',
        startTime: '14:00',
        endTime: '15:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 30
      },
      {
        id: 3,
        title: '이벤트 3',
        date: '2023-05-11',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 60
      },
    ];

    test('알림 시간이 도래한 이벤트만 반환해야 한다', () => {
      const now = new Date('2023-05-10T09:55:00');
      const notifiedEvents: number[] = [];
      const upcomingEvents = getUpcomingEvents(events, now, notifiedEvents);
      expect(upcomingEvents).toHaveLength(1);
      expect(upcomingEvents[0].title).toBe('이벤트 1');
    });

    test('이미 알림이 간 이벤트는 제외해야 한다', () => {
      const now = new Date('2023-05-10T13:35:00');
      const notifiedEvents: number[] = [1];
      const upcomingEvents = getUpcomingEvents(events, now, notifiedEvents);
      expect(upcomingEvents).toHaveLength(1);
      expect(upcomingEvents[0].title).toBe('이벤트 2');
    });
  });

  describe('createNotificationMessage >', () => {
    test('올바른 알림 메시지를 생성해야 한다', () => {
      const event: Event = {
        id: 1,
        title: '중요 회의',
        date: '2023-05-10',
        startTime: '10:00',
        endTime: '11:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 15
      };
      const message = createNotificationMessage(event);
      expect(message).toBe('15분 후 중요 회의 일정이 시작됩니다.');
    });
  });
});
