import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import App from '../App';
import { setupServer } from 'msw/node';
import { events as originalEvents } from '../lib/services/mockData';
import { getWeekDates } from '../lib/utils/date';
import { Event } from '../types/types';
import { createHandlers } from '../lib/services/mockHandlers';

const mockServer = setupServer();

beforeAll(() => {
  mockServer.listen();
});

beforeEach(() => {
  const handlers = createHandlers(originalEvents);
  mockServer.use(...handlers);
});

afterEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});

describe('일정 관리 애플리케이션 통합 테스트', () => {
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
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      render(<App />);

      const now = new Date('2024-07-15');
      vi.setSystemTime(now);

      // 5분 후의 일정 생성
      const eventTime = new Date(now.getTime() + 5 * 60 * 1000);
      const eventDateString = eventTime.toISOString().split('T')[0];
      const eventTimeString = eventTime.toTimeString().slice(0, 5);

      // 일정 생성
      await userEvent.type(screen.getByLabelText(/제목/), 'Test 일정');
      await userEvent.type(screen.getByLabelText(/날짜/), eventDateString);
      await userEvent.type(screen.getByLabelText(/시작 시간/), eventTimeString);
      await userEvent.type(
        screen.getByLabelText(/종료 시간/),
        new Date(eventTime.getTime() + 60 * 60 * 1000)
          .toTimeString()
          .slice(0, 5)
      );
      await userEvent.type(screen.getByLabelText(/설명/), 'Test 설명');
      await userEvent.selectOptions(screen.getByLabelText(/알림 설정/), '1'); // 1분 전 알림 선택

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      // 알림 발생 1초 전으로 시간 이동
      vi.advanceTimersByTime(4 * 60 * 1000 - 1000);

      // 알림 체크 함수가 실행되도록 1초 더 진행
      vi.advanceTimersByTime(1000);

      // 알림이 표시되었는지 확인
      await waitFor(
        () => {
          const alert = screen.queryAllByText(
            /1분 후 Test 일정 일정이 시작됩니다/
          );
          expect(alert).toBeTruthy();
          expect(alert[0]).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('검색 기능', () => {
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다', async () => {
      render(<App />);

      // 목데이터에 존재하는 찾아볼 일정 '점심 약속'
      const query = '점심 약속';
      const eventList = screen.getByTestId('event-list');

      const searchInput = screen.getByLabelText(/일정 검색/);
      await userEvent.type(searchInput, query);

      await waitFor(() => {
        expect(eventList).toHaveTextContent(query);
        expect(eventList).not.toHaveTextContent('검색 결과가 없습니다.');
      });
    });
    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
      render(<App />);

      const eventList = screen.getByTestId('event-list');
      // 검색어 없는 이벤트리스트 스냅샷
      const eventListSnapshot = eventList.innerHTML;
      const searchInput = screen.getByLabelText(/일정 검색/);

      // 검색어 입력
      await userEvent.type(searchInput, '점심 약속');

      await waitFor(() => {
        expect(eventList).toHaveTextContent('점심 약속');
        expect(eventList).not.toHaveTextContent('검색 결과가 없습니다.');
      });

      await userEvent.clear(searchInput);
      await waitFor(() => {
        expect(eventList).matchSnapshot(eventListSnapshot);
      });
    });
  });

  describe('공휴일 표시', () => {
    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);

      const viewSelect = screen.getByLabelText('view');
      await userEvent.selectOptions(viewSelect, 'Month');

      const monthView = screen.getByTestId('month-view');
      const prevMonthButton = screen.getByLabelText('Previous');

      let monthInfo = monthView.querySelector('h2')?.textContent as string;

      while (!monthInfo.includes('1월')) {
        await userEvent.click(prevMonthButton);
        monthInfo = monthView.querySelector('h2')?.textContent as string;
      }

      const dayCells = monthView.querySelectorAll('td');
      const newYearDay = Array.from(dayCells).find((cell) =>
        cell.textContent?.includes('1')
      );
      expect(newYearDay).toHaveTextContent('신정');
    });
    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);

      const viewSelect = screen.getByLabelText('view');
      await userEvent.selectOptions(viewSelect, 'Month');

      const monthView = screen.getByTestId('month-view');
      const prevMonthButton = screen.getByLabelText('Previous');

      let monthInfo = monthView.querySelector('h2')?.textContent as string;

      while (!monthInfo.includes('5월')) {
        await userEvent.click(prevMonthButton);
        monthInfo = monthView.querySelector('h2')?.textContent as string;
      }

      const dayCells = monthView.querySelectorAll('td');
      const childrenDay = Array.from(dayCells).find((cell) =>
        cell.textContent?.includes('5')
      );
      expect(childrenDay).toHaveTextContent('어린이날');
    });
  });

  describe('일정 충돌 감지', () => {
    // 테스트용 일정 (이미 존재하는 일정)
    const testEvent: Event = {
      id: 1,
      title: '팀 회의',
      date: '2024-07-20',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'weekly', interval: 1 },
      notificationTime: 1,
    };
    const testEventToCompare: Event = {
      id: 2,
      title: '점심 약속',
      date: '2024-07-21',
      startTime: '12:30',
      endTime: '13:30',
      description: '동료와 점심 식사',
      location: '회사 근처 식당',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);

      // 테스트용 일정 추가
      await userEvent.type(screen.getByLabelText(/제목/), 'Test 일정');
      await userEvent.type(screen.getByLabelText(/날짜/), testEvent.date);
      await userEvent.type(
        screen.getByLabelText(/시작 시간/),
        testEvent.startTime
      );
      await userEvent.type(
        screen.getByLabelText(/종료 시간/),
        testEvent.endTime
      );

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
      });
    });
    test('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);

      const eventList = screen.getByTestId('event-list');
      await waitFor(() => {
        expect(eventList).toHaveTextContent(testEvent.title);
        expect(eventList).toHaveTextContent(testEventToCompare.title);
      });

      // 수정할 이벤트 선택 testEvent는 첫번째 이벤트이므로
      const editButton = screen.getAllByLabelText('Edit event')[0];
      await userEvent.click(editButton);

      // 충돌이 발생할 날짜, 시간으로 변경
      await userEvent.clear(screen.getByLabelText(/날짜/));
      await userEvent.type(
        screen.getByLabelText(/날짜/),
        testEventToCompare.date
      );
      await userEvent.clear(screen.getByLabelText(/시작 시간/));
      await userEvent.type(
        screen.getByLabelText(/시작 시간/),
        testEventToCompare.startTime
      );
      await userEvent.clear(screen.getByLabelText(/종료 시간/));
      await userEvent.type(
        screen.getByLabelText(/종료 시간/),
        testEventToCompare.endTime
      );

      const submitButton = screen.getByTestId('event-submit-button');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
      });
    });
  });
});
