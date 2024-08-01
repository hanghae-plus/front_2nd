import App from "../App";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, getByLabelText, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw';
import { mockApiHandlers } from '../mockApiHandlers';

// MSW 서버 설정
const server = setupServer(...mockApiHandlers);

describe('일정 관리 애플리케이션 통합 테스트', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterEach(() => {
    server.resetHandlers();
    vi.useRealTimers();
  })
  afterAll(() => {
    // 모든 테스트 완료 후 서버 종료 및 타이머 복원
    server.close();
    vi.useRealTimers();
  });

  describe('일정 CRUD 및 기본 기능', () => {
    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-07-19T00:00:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });

      // 폼 필드 채우기
      await userEvent.type(screen.getByText('제목'), '새로운 테스트 일정');
      await userEvent.type(screen.getByText('날짜'), new Date().toISOString().split('T')[0]);
      await userEvent.type(screen.getByText('시작 시간'), '10:00');
      await userEvent.type(screen.getByText('종료 시간'), '11:00');
      await userEvent.type(screen.getByText('설명'), '통합 테스트를 위한 새 일정');
      await userEvent.type(screen.getByText('카테고리'), '업무');
      await userEvent.type(screen.getByText('위치'), '테스트 룸');
      await userEvent.type(screen.getByText('알림 설정'), '10분 전');

      // 저장 버튼 클릭
      const saveButton = await screen.findByTestId('event-submit-button');
      fireEvent.click(saveButton);

      // 새로운 일정이 달력에 추가되었는지 확인
      await waitFor(async () => {
        const monthView = await screen.findByTestId('month-view');
        expect(monthView).toHaveTextContent('새로운 테스트 일정');
      });

      //새로운 일정이 목록에 추가되었는지 확인
      await waitFor(async () => {
        const eventList = await screen.findByTestId('event-list');
        expect(eventList).toHaveTextContent('새로운 테스트 일정');
        expect(eventList).toHaveTextContent('10:00');
        expect(eventList).toHaveTextContent('통합 테스트를 위한 새 일정');
        expect(eventList).toHaveTextContent('카테고리: 업무');
        expect(eventList).toHaveTextContent('테스트 룸');
        expect(eventList).toHaveTextContent('알림: 10분 전');
      });
    });

    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다'), async () => {
      //첫번째 일정 수정 버튼클릭
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-07-19T00:00:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });

      // 첫번째 삭제 버튼 클릭
      const editButtons = await screen.findAllByRole('button', { name: 'Edit event' });
      const firstEditButton = editButtons[0];
      fireEvent.click(firstEditButton);

      //일정 수정-강제셋팅?
      await userEvent.type(screen.getByText('제목'), '일정 수정 테스트');
      await userEvent.type(screen.getByText('날짜'), '2024-07-18');
      await userEvent.type(screen.getByText('시작 시간'), '13:00');
      await userEvent.type(screen.getByText('종료 시간'), '15:00');
      await userEvent.type(screen.getByText('설명'), '일정 수정');
      await userEvent.type(screen.getByText('카테고리'), '개인');
      await userEvent.type(screen.getByText('위치'), '스터디룸');
      await userEvent.type(screen.getByText('알림 설정'), '5분 전');

      //일정 수정 버튼 클릭
      const editEventButton = await screen.findByTestId('event-submit-button');
      fireEvent.click(editEventButton);

      //새로운 일정 잘 생성되었는지 확인
      await waitFor(async () => {
        const eventList = await screen.findByTestId('event-list');
        expect(eventList).toHaveTextContent('일정 수정 테스트');
        expect(eventList).toHaveTextContent('13:00');
        expect(eventList).toHaveTextContent('일정 수정');
        expect(eventList).toHaveTextContent('카테고리: 개인');
        expect(eventList).toHaveTextContent('스터디룸');
        expect(eventList).toHaveTextContent('알림: 5분 전');
      });
    };

    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-07-19T00:00:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });

      // 첫번째 삭제 버튼 클릭
      const deleteButtons = await screen.findAllByRole('button', { name: 'Delete event' });
      const firstDeleteButton = deleteButtons[0];
      fireEvent.click(firstDeleteButton);

      // 삭제된 일정이 더 이상 화면에 표시되지 않는지 확인
      await waitFor(() => {
        expect(screen.queryByText('주간 팀 미팅')).not.toBeInTheDocument();
      });
    });
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-06-05T00:00:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });
      const viewSelect = await screen.findByTestId('week-month-select');
      await userEvent.selectOptions(viewSelect, 'week');

      //주별 뷰가 로드되기를 기다림
      await waitFor(() => {
        expect(screen.getByTestId('week-view')).toBeInTheDocument();
      });

      expect(screen.getByText('2024년 6월 1주')).toBeInTheDocument();

      // 모든 날짜 셀을 확인
      const dateCells = await screen.getAllByRole('cell');

      // 각 날짜 셀에 일정이 없는지 확인
      dateCells.forEach(cell => {
        const eventElements = cell.querySelectorAll('[data-testid^="event-"]');
        expect(eventElements.length).toBe(0);
      });

      // 검색 결과 확인
      await waitFor(async () => {
        const eventList = await screen.findByTestId('event-list');
        expect(eventList).toHaveTextContent('검색 결과가 없습니다');
      });
    });
    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);
      const user = userEvent.setup();
    
      // 주별 뷰로 변경
      const viewSelect = screen.getByLabelText('view');
      await user.selectOptions(viewSelect, 'week');
    
      // 2024년 7월 4주로 이동
      const currentDateElement = screen.getByText(/\d{4}년 \d{1,2}월 \d{1,2}주/);
      const prevButton = screen.getByLabelText('Previous');
      // const nextButton = screen.getByLabelText('Next');

      while (!currentDateElement.textContent?.includes('2024년 7월 4주')) {
        await user.click(prevButton);
        await waitFor(() => {
          expect(screen.getByTestId('week-view')).toBeInTheDocument();
        });
      }
    
      // 주별 뷰의 모든 날짜 셀을 확인
      const weekView = screen.getByTestId('week-view');
      const dateCells = weekView.querySelectorAll('td');
    
      // 디버깅: 각 셀의 내용을 로그로 출력
      dateCells.forEach((cell, index) => {
        console.log(`Cell ${index} content:`, cell.textContent);
      });
        
      // 일요일 셀에 두 번째 일정이 표시되는지 확인
      const sundayCell = dateCells[0]; // 0은 일요일
      expect(sundayCell).toHaveTextContent('21'); // 날짜 확인
      expect(sundayCell).toHaveTextContent('점심 약속');

      // 월요일 셀에 두 번째 일정이 표시되는지 확인
      const mondayCell = dateCells[1]; // 0은 일요일
      expect(mondayCell).toHaveTextContent('22'); // 날짜 확인
      expect(mondayCell).toHaveTextContent('운동');

      // 목요일 셀에 두 번째 일정이 표시되는지 확인
      const thursdayCell = dateCells[4]; // 0은 일요일
      expect(thursdayCell).toHaveTextContent('25'); // 날짜 확인
      expect(thursdayCell).toHaveTextContent('프로젝트 마감');
    
      // 다른 날짜 셀에는 일정이 없는지 확인
      [2, 3, 5, 6].forEach(index => {
        const cell = dateCells[index];
        // 날짜 텍스트를 제외한 다른 내용이 없는지 확인
        expect(cell.textContent).toMatch(/^\d+$/); // 셀 내용이 숫자(날짜)만 포함하는지 확인
      });
    });
    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-06-05T00:00:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });
      const viewSelect = await screen.findByTestId('week-month-select');
      await userEvent.selectOptions(viewSelect, 'month');

      //월별 뷰가 로드되기를 기다림
      await waitFor(() => {
        expect(screen.getByTestId('month-view')).toBeInTheDocument();
      });

      expect(screen.getByText('2024년 6월')).toBeInTheDocument();

      // 모든 날짜 셀을 확인
      const dateCells = await screen.getAllByRole('cell');

      // 각 날짜 셀에 일정이 없는지 확인
      dateCells.forEach(cell => {
        const eventElements = cell.querySelectorAll('[data-testid^="event-"]');
        expect(eventElements.length).toBe(0);
      });

      // 검색 결과 확인
      await waitFor(async () => {
        const eventList = await screen.findByTestId('event-list');
        expect(eventList).toHaveTextContent('검색 결과가 없습니다');
      });
    });

    test('월별 뷰에 일정이 정확히 표시되는지 확인한다.', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-07-19T00:00:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });
      const viewSelect = await screen.findByTestId('week-month-select');
      await userEvent.selectOptions(viewSelect, 'month');

      //월별 뷰가 로드되기를 기다림
      await waitFor(() => {
        expect(screen.getByTestId('month-view')).toBeInTheDocument();
      });

      expect(screen.getByText('2024년 7월')).toBeInTheDocument();

      //날짜 셀에 일정이 2개인지 확인
      await waitFor(() => {
        const eventElements = screen.getAllByTestId(/^event-/);
        expect(eventElements.length).toBe(2);
      }, { timeout: 5000 });
    });
  });

  describe('알림 기능', () => {
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다'), async () => {
      //시간 셋팅.
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-07-19T09:55:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });

      // 일정을 추가한다.
      await userEvent.type(screen.getByText('제목'), '알림 테스트');
      await userEvent.type(screen.getByText('날짜'), new Date().toISOString().split('T')[0]);
      await userEvent.type(screen.getByText('시작 시간'), '10:00');
      await userEvent.type(screen.getByText('종료 시간'), '11:00');
      await userEvent.type(screen.getByText('설명'), '알림 테스트를 위한 새 일정');
      await userEvent.type(screen.getByText('카테고리'), '개인');
      await userEvent.type(screen.getByText('위치'), '집');
      await userEvent.type(screen.getByText('알림 설정'), '4분 전');

      // 저장 버튼 클릭
      const saveButton = await screen.findByTestId('event-submit-button');
      fireEvent.click(saveButton);

      // 새로운 일정이 달력에 추가되었는지 확인
      await waitFor(async () => {
        const monthView = await screen.findByTestId('month-view');
        expect(monthView).toHaveTextContent('알림 테스트 일정');
      });

      //시간을 1분 앞으로 당김
      await act(async () => {
        vi.advanceTimersByTime(60 * 1000); // 1분 앞으로 이동
      });

      //알림창이 나타나는지 확인
      await waitFor(() => {
        const alertElement = screen.getByRole('alert');
        expect(alertElement).toBeInTheDocument();
        expect(alertElement).toHaveTextContent('4분 후');
      });
    };
  });

  describe('검색 기능', () => {
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다', async () => {
      //시간을 7월로 셋팅
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-07-19T09:55:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimersAsync();
      });

      // 일정 데이터가 로드되기를 기다립니다.
      const eventList = await screen.findByTestId('event-list');
      expect(eventList).toHaveTextContent('점심 약속');

      // 검색 입력 필드를 찾습니다.
      const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');

      // '점심'을 검색합니다.
      await userEvent.type(searchInput, '점심');

      // 검색 결과를 확인합니다.
      const eventListResult = await screen.findByTestId('event-list');
      expect(eventListResult).toHaveTextContent('점심 약속');

      // 검색어를 지웁니다.
      await userEvent.clear(searchInput);

      // '테스트'를 검색합니다.
      await userEvent.type(searchInput, '테스트');

      // 검색 결과를 확인합니다.
      const eventListSecondResult = await screen.findByTestId('event-list');
      expect(eventListSecondResult).not.toHaveTextContent('점심 약속');
      expect(eventListSecondResult).toHaveTextContent('테스트');

      // 존재하지 않는 일정을 검색합니다.
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, '존재하지 않는 일정');

      // 검색 결과가 없음을 확인합니다.
      const eventListNoResult = await screen.findByTestId('event-list');
      expect(eventListNoResult).not.toHaveTextContent('존재하지 않는 일정');
    });

    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
      //시간을 7월로 셋팅
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-07-19T09:55:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });

      // 일정 데이터가 로드되기를 기다립니다.
      const eventList = await screen.findByTestId('event-list');
      expect(eventList).toHaveTextContent('점심 약속');

      // 검색 입력 필드를 찾습니다.
      const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');

      // '점심'을 검색합니다.
      await userEvent.type(searchInput, '점심');

      // 검색 결과를 확인합니다.
      const eventListResult = await screen.findByTestId('event-list');
      expect(eventListResult).toHaveTextContent('점심 약속');

      // 검색어를 지웁니다.
      await userEvent.clear(searchInput);

      // 검색 결과를 확인합니다.
      const eventListSecondResult = await screen.findByTestId('event-list');
      expect(eventListSecondResult).toHaveTextContent('점심 약속');
      expect(eventListSecondResult).toHaveTextContent('테스트');
    });
  });

  describe('공휴일 표시', () => {
    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      //시간을 1월로 셋팅
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-01-01'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });

      // month-view를 찾습니다
      const monthView = await screen.findByTestId('month-view');

      // month-view 내에서 1월 1일 셀을 찾습니다
      const januaryFirstCell = within(monthView).getByRole('cell', { name: /신정/ });

      // 이제 januaryFirstCell을 사용하여 공휴일 표시를 확인할 수 있습니다
      expect(within(januaryFirstCell).getByText('신정')).toBeInTheDocument();
      expect(januaryFirstCell).toHaveTextContent('신정');
    });

    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다'), async () => {
      //시간을 1월로 셋팅
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-05-01'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });

      // month-view를 찾습니다
      const monthView = await screen.findByTestId('month-view');

      // month-view 내에서 5월 5일 셀을 찾습니다
      const childrensDay = within(monthView).getByRole('cell', { name: /어린이날/ });

      // 어린이날 cell 확인
      expect(within(childrensDay).getByText('어린이날')).toBeInTheDocument();
      expect(childrensDay).toHaveTextContent('어린이날');

      // 텍스트 색상이 빨간색인지 확인
      expect(window.getComputedStyle(childrensDay).color).toBe('rgb(255, 0, 0)');
    };
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다'), async () => {
      //시간 셋팅.
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-07-19T09:55:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });

      // 일정을 추가한다.
      await userEvent.type(screen.getByText('제목'), '알림 테스트');
      await userEvent.type(screen.getByText('날짜'), new Date().toISOString().split('T')[0]);
      await userEvent.type(screen.getByText('시작 시간'), '10:00');
      await userEvent.type(screen.getByText('종료 시간'), '11:00');
      await userEvent.type(screen.getByText('설명'), '알림 테스트를 위한 새 일정');
      await userEvent.type(screen.getByText('카테고리'), '개인');
      await userEvent.type(screen.getByText('위치'), '집');
      await userEvent.type(screen.getByText('알림 설정'), '4분 전');

      // 저장 버튼 클릭
      const saveButton = await screen.findByTestId('event-submit-button');
      fireEvent.click(saveButton);

      //알림창이 나타나는지 확인
      await waitFor(() => {
        const alertElement = screen.getByRole('alert');
        expect(alertElement).toBeInTheDocument();
        expect(alertElement).toHaveTextContent('일정 겹침 경고');
      });
    };

    test('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다'), async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date('2024-07-19T00:00:00Z'));
      await act(async () => {
        render(<App />);
        await vi.runAllTimers();
      });

      // 첫번째 수정 버튼 클릭
      const editButtons = await screen.findAllByRole('button', { name: 'Edit event' });
      const firstEditButton = editButtons[0];
      fireEvent.click(firstEditButton);

      //일정 수정-강제셋팅?
      await userEvent.type(screen.getByText('제목'), '일정 충돌 테스트');
      await userEvent.type(screen.getByText('날짜'), '2024-07-19');

      //일정 수정 버튼 클릭
      const editEventButton = await screen.findByTestId('event-submit-button');
      fireEvent.click(editEventButton);

      //알림창이 나타나는지 확인
      await waitFor(() => {
        const alertElement = screen.getByRole('alert');
        expect(alertElement).toBeInTheDocument();
        expect(alertElement).toHaveTextContent('일정 겹침 경고');
      });
    };
  });
});