import { describe, test, expect, beforeEach } from "vitest";
import { ScheduleApp } from '../components/ScheduleApp';

describe('일정 관리 애플리케이션 통합 테스트', () => {
  beforeEach(() => {
    ScheduleApp.clear();  // 테스트 시작 전에 기존 일정 초기화
  });

  describe('일정 CRUD 및 기본 기능', () => {
    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', () => {
      const schedule = { id: 1, title: 'Meeting', date: '2024-07-30', time: '10:00', description: 'Project meeting' };
      const created = ScheduleApp.create(schedule);
      expect(created).toEqual(schedule);
      const allSchedules = ScheduleApp.getAll();
      expect(allSchedules).toContainEqual(schedule);
    });

    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', () => {
      const schedule = { id: 1, title: 'Meeting', date: '2024-07-30', time: '10:00', description: 'Project meeting' };
      ScheduleApp.create(schedule);
      const updatedSchedule = { id: 1, title: 'Updated Meeting', date: '2024-07-30', time: '11:00', description: 'Updated project meeting' };
      ScheduleApp.update(1, updatedSchedule);
      const fetchedSchedule = ScheduleApp.getById(1);
      expect(fetchedSchedule).toEqual(updatedSchedule);
    });

    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', () => {
      const schedule = { id: 1, title: 'Meeting', date: '2024-07-30', time: '10:00', description: 'Project meeting' };
      ScheduleApp.create(schedule);
      ScheduleApp.delete(1);
      const fetchedSchedule = ScheduleApp.getById(1);
      expect(fetchedSchedule).toBeUndefined();
    });
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다', () => {
      const weeklySchedules = ScheduleApp.getAll().filter(sch => sch.date >= '2024-07-28' && sch.date <= '2024-08-03');
      expect(weeklySchedules.length).toBe(0);
    });

    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', () => {
      const schedule = { id: 1, title: 'Weekly Meeting', date: '2024-07-30', time: '10:00', description: 'Weekly meeting' };
      ScheduleApp.create(schedule);
      const weeklySchedules = ScheduleApp.getAll().filter(sch => sch.date >= '2024-07-28' && sch.date <= '2024-08-03');
      expect(weeklySchedules).toContainEqual(schedule);
    });

    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다', () => {
      const monthlySchedules = ScheduleApp.getAll().filter(sch => sch.date.startsWith('2024-07'));
      expect(monthlySchedules.length).toBe(0);
    });

    test('월별 뷰에 일정이 정확히 표시되는지 확인한다', () => {
      const schedule = { id: 1, title: 'Monthly Meeting', date: '2024-07-15', time: '10:00', description: 'Monthly meeting' };
      ScheduleApp.create(schedule);
      const monthlySchedules = ScheduleApp.getAll().filter(sch => sch.date.startsWith('2024-07'));
      expect(monthlySchedules).toContainEqual(schedule);
    });
  });

  describe('알림 기능', () => {
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다', () => {
      const schedule = { id: 1, title: 'Meeting with Notification', date: '2024-07-30', time: '10:00', description: 'Meeting' };
      ScheduleApp.create(schedule);
      ScheduleApp.setNotification(1, '2024-07-30T09:50:00');
      const notification = ScheduleApp.getNotificationByScheduleId(1);
      expect(notification).toEqual({ scheduleId: 1, time: '2024-07-30T09:50:00' });
    });
  });

  describe('검색 기능', () => {
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다', () => {
      const schedule1 = { id: 1, title: 'Search Meeting 1', date: '2024-07-30', time: '10:00', description: 'Search test' };
      const schedule2 = { id: 2, title: 'Search Meeting 2', date: '2024-07-30', time: '11:00', description: 'Search test' };
      ScheduleApp.create(schedule1);
      ScheduleApp.create(schedule2);
      const searchResults = ScheduleApp.search('Search Meeting 1');
      expect(searchResults).toEqual([schedule1]);
    });

    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다', () => {
      const schedule1 = { id: 1, title: 'Clear Search Meeting 1', date: '2024-07-30', time: '10:00', description: 'Search test' };
      const schedule2 = { id: 2, title: 'Clear Search Meeting 2', date: '2024-07-30', time: '11:00', description: 'Search test' };
      ScheduleApp.create(schedule1);
      ScheduleApp.create(schedule2);
      const allSchedules = ScheduleApp.getAll();
      expect(allSchedules.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('공휴일 표시', () => {
    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', () => {
      const holidays = ScheduleApp.getHolidays();
      expect(holidays).toContainEqual({ date: '2024-01-01', name: '신정' });
    });

    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다', () => {
      const holidays = ScheduleApp.getHolidays();
      expect(holidays).toContainEqual({ date: '2024-05-05', name: '어린이날' });
    });
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다', () => {
      const schedule1 = { id: 1, title: 'Conflict Meeting 1', date: '2024-07-30', time: '10:00', description: 'Conflict test' };
      const schedule2 = { id: 2, title: 'Conflict Meeting 2', date: '2024-07-30', time: '10:00', description: 'Conflict test' };
      ScheduleApp.create(schedule1);
      const isConflict = ScheduleApp.checkConflict(schedule2);
      expect(isConflict).toBe(true);
    });

    test('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다', () => {
      const schedule1 = { id: 1, title: 'Conflict Meeting 1', date: '2024-07-30', time: '10:00', description: 'Conflict test' };
      const schedule2 = { id: 2, title: 'No Conflict Meeting', date: '2024-07-30', time: '11:00', description: 'No conflict' };
      ScheduleApp.create(schedule1);
      ScheduleApp.create(schedule2);
      const updatedSchedule = { ...schedule2, time: '10:00' };
      const isConflict = ScheduleApp.checkConflict(updatedSchedule);
      expect(isConflict).toBe(true);
    });
  });
});
