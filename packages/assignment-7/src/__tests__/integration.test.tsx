import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { setupServer } from 'msw/node';
import { ReactNode } from 'react';
import App from '../App';
import { mockApiHandlers, resetEvents } from '../mocks/handlers';

const TEST_IDS = {
  eventSubmitButton: 'event-submit-button',
  eventList: 'event-list',
};

const server = setupServer(...mockApiHandlers);

beforeAll(() => server.listen());
afterAll(() => server.close());

const setup = (component: ReactNode) => {
  const user = userEvent.setup();

  return { user, ...render(component) };
};

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe.skip('일정 CRUD 및 기본 기능', () => {
    beforeEach(resetEvents);

    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      const TEST_EVENT = {
        title: '새로운 일정',
        date: '2024-08-01',
        startTime: '14:30',
        endTime: '15:30',
        description: '새로운 일정 설명',
        location: '서울대입구역',
        category: '업무',
      };

      const { user } = setup(<App />);

      const titleInput = screen.getByRole('textbox', { name: '제목' });
      await user.type(titleInput, TEST_EVENT.title);
      expect(titleInput).toHaveValue(TEST_EVENT.title);

      const dateInput = screen.getByLabelText('날짜');
      await user.type(dateInput, TEST_EVENT.date);
      expect(dateInput).toHaveValue(TEST_EVENT.date);

      const startTimeInput = screen.getByLabelText('시작 시간');
      await user.type(startTimeInput, TEST_EVENT.startTime);
      expect(startTimeInput).toHaveValue(TEST_EVENT.startTime);

      const endTimeInput = screen.getByLabelText('종료 시간');
      await user.type(endTimeInput, TEST_EVENT.endTime);
      expect(endTimeInput).toHaveValue(TEST_EVENT.endTime);

      const descriptionInput = screen.getByLabelText('설명');
      await user.type(descriptionInput, TEST_EVENT.description);
      expect(descriptionInput).toHaveValue(TEST_EVENT.description);

      const locationInput = screen.getByLabelText('위치');
      await user.type(locationInput, TEST_EVENT.location);
      expect(locationInput).toHaveValue(TEST_EVENT.location);

      const categorySelect = screen.getByLabelText('카테고리');
      await user.selectOptions(categorySelect, TEST_EVENT.category);
      expect(categorySelect).toHaveValue(TEST_EVENT.category);

      const submitButton = screen.getByTestId(TEST_IDS.eventSubmitButton);
      await user.click(submitButton);

      [titleInput, dateInput, startTimeInput, endTimeInput, descriptionInput, locationInput, categorySelect].forEach(
        (input) => {
          expect(input).toHaveValue('');
        }
      );

      const eventList = screen.getByTestId(TEST_IDS.eventList);
      expect(eventList).toHaveTextContent(TEST_EVENT.title);
    });

    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      const TEST_EVENT = {
        title: '수정된 테스트 일정 1',
        date: '2024-08-02',
        startTime: '15:30',
        endTime: '16:30',
      };

      const { user } = setup(<App />);

      const eventList = screen.getByTestId(TEST_IDS.eventList);

      // 이벤트 아이템들이 비동기적으로 로드되기를 기다림
      await waitFor(() => {
        const eventItem = within(eventList).getByText('테스트 일정 1');
        expect(eventItem).toBeInTheDocument();
      });

      const [editButton] = screen.getAllByLabelText('Edit event');
      await user.click(editButton);

      const titleInput = screen.getByRole('textbox', { name: '제목' });
      await user.clear(titleInput);
      await user.type(titleInput, TEST_EVENT.title);

      const dateInput = screen.getByLabelText('날짜');
      await user.clear(dateInput);
      await user.type(dateInput, TEST_EVENT.date);

      const startTimeInput = screen.getByLabelText('시작 시간');
      await user.clear(startTimeInput);
      await user.type(startTimeInput, TEST_EVENT.startTime);

      const endTimeInput = screen.getByLabelText('종료 시간');
      await user.clear(endTimeInput);
      await user.type(endTimeInput, TEST_EVENT.endTime);

      const submitButton = screen.getByTestId(TEST_IDS.eventSubmitButton);
      await user.click(submitButton);

      expect(titleInput).toHaveValue('');
      expect(dateInput).toHaveValue('');

      const eventItem = within(eventList).getByText(TEST_EVENT.title);
      const eventItemDate = within(eventList).getByText(
        `${TEST_EVENT.date} ${TEST_EVENT.startTime} - ${TEST_EVENT.endTime}`
      );
      expect(eventItem).toBeInTheDocument();
      expect(eventItemDate).toBeInTheDocument();
    });

    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      const { user } = setup(<App />);

      const eventList = screen.getByTestId(TEST_IDS.eventList);

      // 이벤트 아이템들이 비동기적으로 로드되기를 기다림
      await waitFor(() => {
        const eventItem = within(eventList).getByText('테스트 일정 1');
        expect(eventItem).toBeInTheDocument();
      });

      const [deleteButton] = screen.getAllByLabelText('Delete event');
      await user.click(deleteButton);

      expect(eventList).not.toHaveTextContent('테스트 일정 1');
    });
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      // 일정이 있는 주로 설정
      vi.setSystemTime(new Date('2024-08-16'));
      const { user } = setup(<App />);

      const weekSelector = screen.getByRole('combobox', { name: 'view' });
      await user.selectOptions(weekSelector, 'week');

      // 주로 설정했으므로 tbody 내부의 자식이 한 줄인지 확인
      const table = await screen.findByRole('table');
      const tbody = table.querySelector('tbody');
      expect(tbody?.children.length).toBe(1);

      expect(table).toHaveTextContent(/테스트 일정/);

      const nextWeekButton = screen.getByRole('button', { name: 'Next' });
      await user.click(nextWeekButton);

      expect(table).not.toHaveTextContent(/테스트 일정/);
    });
    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      vi.setSystemTime(new Date('2024-08-16'));
      const { user } = setup(<App />);

      const weekSelector = screen.getByRole('combobox', { name: 'view' });
      await user.selectOptions(weekSelector, 'week');

      const table = await screen.findByRole('table');
      const tbody = table.querySelector('tbody');
      expect(tbody?.children.length).toBe(1);

      expect(table).toHaveTextContent(/테스트 일정/);
    });
    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      vi.setSystemTime(new Date('2024-07-16'));
      const { user } = setup(<App />);

      const weekSelector = screen.getByRole('combobox', { name: 'view' });
      await user.selectOptions(weekSelector, 'month');

      const table = await screen.findByRole('table');
      const tbody = table.querySelector('tbody');
      expect(tbody?.children.length).toBeGreaterThan(1);

      expect(table).not.toHaveTextContent(/테스트 일정/);
    });
    test('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      vi.setSystemTime(new Date('2024-08-16'));
      const { user } = setup(<App />);

      const weekSelector = screen.getByRole('combobox', { name: 'view' });
      await user.selectOptions(weekSelector, 'month');

      const table = await screen.findByRole('table');
      const tbody = table.querySelector('tbody');
      expect(tbody?.children.length).toBeGreaterThan(1);

      expect(table).toHaveTextContent(/테스트 일정/);
    });
  });

  describe('알림 기능', () => {
    test.fails('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다');
  });

  describe('검색 기능', () => {
    test.fails('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test.fails('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test.fails('검색어를 지우면 모든 일정이 다시 표시되어야 한다');
  });

  describe('공휴일 표시', () => {
    test.fails('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다');
    test.fails('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다');
  });

  describe('일정 충돌 감지', () => {
    test.fails('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다');
    test.fails('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다');
  });
});
