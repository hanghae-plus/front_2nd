import { describe, expect, it } from 'vitest';
import {
  getOneYearLaterDate,
  getWeekDates,
  isOverlapping,
  searchEvents,
} from '../utils/dateUtils';
import { Event } from '../interface';

describe('날짜 유틸리티 함수', () => {
  describe('이벤트 겹침 확인', () => {
    it('겹치는 이벤트를 올바르게 식별해야 한다', () => {
      const event1: Event = {
        id: 1,
        title: '이벤트 1',
        date: '2024-03-15',
        startTime: '10:00',
        endTime: '12:00',
      };
      const event2: Event = {
        id: 2,
        title: '이벤트 2',
        date: '2024-03-15',
        startTime: '11:00',
        endTime: '13:00',
      };
      expect(isOverlapping(event1, event2)).toBe(true);
    });

    it('겹치지 않는 이벤트를 올바르게 식별해야 한다', () => {
      const event1: Event = {
        id: 1,
        title: '이벤트 1',
        date: '2024-03-15',
        startTime: '10:00',
        endTime: '12:00',
      };
      const event2: Event = {
        id: 2,
        title: '이벤트 2',
        date: '2024-03-15',
        startTime: '13:00',
        endTime: '14:00',
      };
      expect(isOverlapping(event1, event2)).toBe(false);
    });
  });

  describe('주간 날짜 가져오기', () => {
    it('올바른 주간 날짜를 반환해야 한다', () => {
      const testDate = new Date('2024-03-15'); // 금요일
      const weekDates = getWeekDates(testDate);
      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].getDate()).toBe(11); // 월요일
      expect(weekDates[6].getDate()).toBe(17); // 일요일
    });
  });

  describe('1년 후 날짜 가져오기', () => {
    it('1년 후의 날짜를 반환해야 한다', () => {
      expect(getOneYearLaterDate('2024-03-15')).toBe('2025-03-15');
    });
  });

  describe('이벤트 검색', () => {
    const events: Event[] = [
      {
        id: 1,
        title: '존과의 미팅',
        date: '2024-03-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '프로젝트 논의',
        location: '사무실',
      },
      {
        id: 2,
        title: '팀 점심',
        date: '2024-03-15',
        startTime: '12:00',
        endTime: '13:00',
        description: '팀 빌딩',
        location: '구내 식당',
      },
      {
        id: 3,
        title: '화상 회의',
        date: '2024-03-15',
        startTime: '15:00',
        endTime: '16:00',
        description: '고객 통화',
        location: '전화',
      },
    ];

    it('제목으로 이벤트를 찾아야 한다', () => {
      const result = searchEvents('미팅', events);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('설명으로 이벤트를 찾아야 한다', () => {
      const result = searchEvents('팀', events);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('위치로 이벤트를 찾아야 한다', () => {
      const result = searchEvents('전화', events);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
      const result = searchEvents('', events);
      expect(result).toHaveLength(3);
    });
  });
});
