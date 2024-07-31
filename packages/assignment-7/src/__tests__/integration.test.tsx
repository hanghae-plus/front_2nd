import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import App from '../App';
import { mockServer } from '../lib/services/mockWorker';
import { getWeekDates } from '../lib/utils/date';

describe('일정 관리 애플리케이션 통합 테스트', () => {
  beforeAll(() => {
    mockServer.listen();
  });
  afterEach(() => {
    mockServer.resetHandlers();
  });
  afterAll(() => {
    mockServer.close();
  });
  describe('일정 CRUD 및 기본 기능', () => {
    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      render(<App />);

      await userEvent.type(screen.getByLabelText(/제목/), 'Test 일정');
      await userEvent.type(screen.getByLabelText(/날짜/), '2024-07-31');
      await userEvent.type(screen.getByLabelText(/시작 시간/), '13:00');
      await userEvent.type(screen.getByLabelText(/종료 시간/), '15:00');
      await userEvent.type(screen.getByLabelText(/설명/), 'Test 설명');
      await userEvent.type(screen.getByLabelText(/위치/), 'Test 위치');
      await userEvent.selectOptions(screen.getByLabelText(/카테고리/), '업무');

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      const eventList = screen.getByTestId('event-list');
      await waitFor(() => {
        expect(eventList).toHaveTextContent('Test 일정');
        expect(eventList).toHaveTextContent('2024-07-31');
        expect(eventList).toHaveTextContent('13:00 - 15:00');
        expect(eventList).toHaveTextContent('Test 설명');
        expect(eventList).toHaveTextContent('Test 위치');
        expect(eventList).toHaveTextContent('업무');
      });
    });
    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      render(<App />);

      const editButtons = await screen.findAllByLabelText('Edit event');
      await userEvent.click(editButtons[0]);

      await userEvent.clear(screen.getByLabelText(/제목/));
      await userEvent.type(screen.getByLabelText(/제목/), '수정된 Test 일정');
      await userEvent.clear(screen.getByLabelText(/날짜/));
      await userEvent.type(screen.getByLabelText(/날짜/), '2024-07-05');
      await userEvent.clear(screen.getByLabelText(/시작 시간/));
      await userEvent.type(screen.getByLabelText(/시작 시간/), '14:00');
      await userEvent.clear(screen.getByLabelText(/종료 시간/));
      await userEvent.type(screen.getByLabelText(/종료 시간/), '16:00');
      await userEvent.clear(screen.getByLabelText(/설명/));
      await userEvent.type(screen.getByLabelText(/설명/), '수정된 Test 설명');
      await userEvent.clear(screen.getByLabelText(/위치/));
      await userEvent.type(screen.getByLabelText(/위치/), '수정된 Test 위치');
      await userEvent.selectOptions(screen.getByLabelText(/카테고리/), '개인');

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      const eventList = screen.getByTestId('event-list');
      await waitFor(() => {
        expect(eventList).toHaveTextContent('수정된 Test 일정');
        expect(eventList).toHaveTextContent('2024-07-05');
        expect(eventList).toHaveTextContent('14:00 - 16:00');
        expect(eventList).toHaveTextContent('수정된 Test 설명');
        expect(eventList).toHaveTextContent('수정된 Test 위치');
        expect(eventList).toHaveTextContent('개인');
      });
    });
    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      render(<App />);

      const eventItems = await screen.findAllByTestId(/^event-item-/);
      // 삭제할 이벤트가 없으면 테스트를 종료합니다.
      if (eventItems.length === 0) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * eventItems.length);
      const eventToDelete = eventItems[randomIndex];
      const eventId = eventToDelete.getAttribute('data-testid') as string;

      const eventTitle = eventToDelete.querySelector('h3')
        ?.textContent as string;

      const deleteButton = within(eventToDelete).getByLabelText('Delete event');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByTestId(eventId)).not.toBeInTheDocument();
        expect(screen.queryByText(eventTitle)).not.toBeInTheDocument();
      });
    });
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      const viewSelect = screen.getByLabelText('view');
      await userEvent.selectOptions(viewSelect, 'Week');

      const nextWeekButton = screen.getByLabelText('Next');
      let hasEvent = true;

      while (hasEvent) {
        await userEvent.click(nextWeekButton);

        const weekViewTable = screen
          .getByTestId('week-view')
          .querySelector('table');
        const dayTds = weekViewTable?.querySelectorAll('td');
        hasEvent = Array.from(dayTds ?? []).some((td) =>
          td.querySelector('div')
        );
      }

      // 주별 뷰에 이젠 이벤트가 없습니다
      const eventList = screen.getByTestId('event-list');
      expect(eventList).toHaveTextContent('검색 결과가 없습니다.');
    });
    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);

      const viewSelect = screen.getByLabelText('view');
      await userEvent.selectOptions(viewSelect, 'Week');

      const weekView = screen.getByTestId('week-view');
      const weekInfo = weekView.querySelector('h2')?.textContent as string;
      expect(weekInfo).toBeTruthy();

      const match = weekInfo.match(/(\d{4})년\s+(\d{1,2})월\s+(\d)주/);
      expect(match).toBeTruthy();
      const [_, year, month] = match as RegExpMatchArray;

      const firstDay = (
        weekView.querySelector('td')?.textContent as string
      ).match(/\d+/)?.[0];
      const firstDate = new Date(`${year}-${month}-${firstDay}`);
      const weekDates = getWeekDates(firstDate);
      // weekDates.length는 항상 7
      const randomDateIndex = Math.floor(Math.random() * weekDates.length);
      const randomDate = weekDates[randomDateIndex];
      const randomDateString = randomDate.toISOString().split('T')[0];

      // Create new Event
      await userEvent.type(screen.getByLabelText(/제목/), 'Test 일정');
      await userEvent.type(screen.getByLabelText(/날짜/), randomDateString);
      await userEvent.type(screen.getByLabelText(/시작 시간/), '13:00');
      await userEvent.type(screen.getByLabelText(/종료 시간/), '15:00');
      await userEvent.type(screen.getByLabelText(/설명/), 'Test 설명');
      await userEvent.type(screen.getByLabelText(/위치/), 'Test 위치');
      await userEvent.selectOptions(screen.getByLabelText(/카테고리/), '업무');

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        const updatedWeekView = screen.getByTestId('week-view');
        expect(updatedWeekView).toHaveTextContent('Test 일정');
        // use 'within' to query element within weekView have 'Test 일정'
        const dayCell = within(updatedWeekView)
          .getByText('Test 일정')
          .closest('td');
        expect(dayCell).toBeTruthy();
        const cellWithNewEvent = screen.getByTestId(
          `week-date-${randomDateString}`
        );
        expect(cellWithNewEvent).toEqual(dayCell);
      });
    });
    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      const viewSelect = screen.getByLabelText('view');
      await userEvent.selectOptions(viewSelect, 'Month');

      const monthView = screen.getByTestId('month-view');
      let hasEvent = true;
      while (hasEvent) {
        const cells = monthView.querySelectorAll('td');
        hasEvent = Array.from(cells).some((cell) => cell.querySelector('div'));
        if (hasEvent) {
          const nextMonthButton = screen.getByLabelText('Next');
          await userEvent.click(nextMonthButton);
        }
      }

      const eventList = screen.getByTestId('event-list');
      expect(eventList).toHaveTextContent('검색 결과가 없습니다.');
    });
    test('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);

      const viewSelect = screen.getByLabelText('view');
      await userEvent.selectOptions(viewSelect, 'Month');

      // 일정이 없는 월로 이동
      let hasEvent = true;
      while (hasEvent) {
        const monthView = screen.getByTestId('month-view');
        const cells = monthView.querySelectorAll('td');
        hasEvent = Array.from(cells).some((cell) => cell.querySelector('div'));
        if (hasEvent) {
          const nextMonthButton = screen.getByLabelText('Next');
          await userEvent.click(nextMonthButton);
        }
      }

      const monthView = screen.getByTestId('month-view');
      const monthInfo = monthView.querySelector('h2')?.textContent as string;
      expect(monthInfo).toBeTruthy();

      const match = monthInfo.match(/(\d{4})년\s+(\d{1,2})월/);
      expect(match).toBeTruthy();
      const [_, year, month] = match as RegExpMatchArray;

      // 랜덤 날짜 생성 (1일부터 28일까지)
      const randomDate = Math.ceil(Math.random() * 28);
      const randomDateString = `${year}-${month.padStart(2, '0')}-${randomDate.toString().padStart(2, '0')}`;

      // 새 일정 생성
      await userEvent.type(screen.getByLabelText(/제목/), 'Test 일정');
      await userEvent.type(screen.getByLabelText(/날짜/), randomDateString);
      await userEvent.type(screen.getByLabelText(/시작 시간/), '13:00');
      await userEvent.type(screen.getByLabelText(/종료 시간/), '15:00');
      await userEvent.type(screen.getByLabelText(/설명/), 'Test 설명');
      await userEvent.type(screen.getByLabelText(/위치/), 'Test 위치');
      await userEvent.selectOptions(screen.getByLabelText(/카테고리/), '업무');

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      // 이벤트 추가 후 상태 업데이트 대기
      await waitFor(
        () => {
          const updatedMonthView = screen.getByTestId('month-view');
          const eventList = screen.getByTestId('event-list');

          // 일정 목록에서 새 일정 확인
          expect(eventList).toHaveTextContent('Test 일정');

          // 월별 뷰에서 새 일정 확인
          const dayCell = within(updatedMonthView)
            .getByText('Test 일정')
            .closest('td');
          expect(dayCell).toBeInTheDocument();

          // 올바른 날짜 셀에 일정이 추가되었는지 확인
          const cellDate = dayCell?.querySelector('p')?.textContent;
          expect(cellDate).toBe(randomDate.toString());
        },
        { timeout: 5000 }
      ); // 타임아웃 증가
    });
  });

  describe('알림 기능', () => {
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다');
  });

  describe('검색 기능', () => {
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다');
  });

  describe('공휴일 표시', () => {
    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다');
    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다');
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다');
    test(
      '기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다'
    );
  });
});
