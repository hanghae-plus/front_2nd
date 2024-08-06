import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { prettyDOM, render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';

const setup = () => {
  const user = userEvent.setup();
  return {
    user,
    ...render(<App />),
  };
};

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 생성', () => {
    test('새로운 일정을 생성하고 일정 검색 리스트에 모든 필드가 일치하는지 확인한다', async () => {
      const { user } = setup();

      // 일정 입력
      await user.type(screen.getByLabelText('제목'), '새로운 일정');
      await user.type(screen.getByLabelText('날짜'), '2024-08-03');
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.type(screen.getByLabelText('설명'), '테스트 일정입니다');
      await user.type(screen.getByLabelText('위치'), '회의실');
      await user.selectOptions(screen.getByLabelText('카테고리'), '업무');

      // 일정 추가 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      // 일정 검색 리스트에서 새로 추가된 일정 확인
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText('새로운 일정')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-08-03 09:00 - 10:00')).toBeInTheDocument();
      expect(within(eventList).getByText('테스트 일정입니다')).toBeInTheDocument();
      expect(within(eventList).getByText('회의실')).toBeInTheDocument();
      expect(within(eventList).getByText('카테고리: 업무')).toBeInTheDocument();
    });

    test('생성된 일정이 캘린더 뷰에 표시된다 > 초기 month-view', async () => {
      const { user } = setup();

      // 일정 입력 및 추가
      await user.type(screen.getByLabelText('제목'), '새로운 일정');
      await user.type(screen.getByLabelText('날짜'), '2024-08-03');
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      // 일정 추가 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      // 캘린더 뷰에서 일정 확인
      const calendar = screen.getByTestId('month-view');
      expect(within(calendar).getByText('새로운 일정')).toBeInTheDocument();
    });
  });

  describe('일정 수정', () => {
    test('기존 일정을 수정하고 변경사항이 일정 캘린더에 반영되는지 확인한다', async () => {
      const { user } = setup();

      // 이벤트 목록이 렌더링될 때까지 대기
      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toBeInTheDocument();
      });

      // 기존 일정 선택 (일정이 이미 존재한다고 가정)
      const editButtons = screen.getAllByLabelText('Edit event');
      await user.click(editButtons[0]);

      // 일정 수정
      await user.clear(screen.getByLabelText('제목'));

      await user.type(screen.getByLabelText('제목'), '수정된 일정');
      // 일정 수정 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      // 캘린더에서 수정된 일정 확인
      const calendar = screen.getByTestId('month-view');
      expect(within(calendar).getByText('수정된 일정')).toBeInTheDocument();
    });
    test('기존 일정을 수정하고 변경사항이 일정 검색 리스트에 반영되는지 확인한다', async () => {
      const { user } = setup();

      // 이벤트 목록이 렌더링될 때까지 대기
      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toBeInTheDocument();
      });

      // 기존 일정 선택 (일정이 이미 존재한다고 가정)
      const editButtons = screen.getAllByLabelText('Edit event');
      await user.click(editButtons[0]);

      // 일정 수정
      await user.clear(screen.getByLabelText('제목'));

      await user.type(screen.getByLabelText('제목'), '수정된 일정2');
      // 일정 수정 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      const searchList = screen.getByTestId('event-list');
      expect(within(searchList).getByText('수정된 일정2')).toBeInTheDocument();
    });
  });

  describe('일정 삭제', () => {
    test('일정을 삭제하고 검색 리스트와 캘린더에서 사라지는지 확인한다', async () => {
      const { user } = setup();
      // 이벤트 목록이 렌더링될 때까지 대기
      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toBeInTheDocument();
      });

      // 모든 일정 항목을 가져옵니다
      const eventItems = screen.getAllByTestId('event-item');
      expect(eventItems.length).toBeGreaterThan(0); // 최소한 하나의 일정이 있는지 확인

      // 첫 번째 일정의 제목을 가져옵니다
      const firstEventTitle = within(eventItems[0]).getByTestId('event-title').textContent || '';
      expect(firstEventTitle).toBeTruthy();

      // 일정 삭제 (삭제 아이콘 클릭)
      const deleteButton = within(eventItems[0]).getByLabelText('Delete event');
      await user.click(deleteButton);

      // 삭제된 일정이 목록과 화면(캘린더도)에서 사라졌는지 확인
      await waitFor(() => {
        expect(screen.queryByText(firstEventTitle)).not.toBeInTheDocument();
      });
    });
  });

  describe('일정 뷰 전환', () => {
    test('주별 뷰와 월별 뷰 간 전환이 가능하다', async () => {
      const { user } = setup();

      // 월별 뷰로 전환
      await user.selectOptions(screen.getByLabelText('view'), 'month');
      expect(screen.getByTestId('month-view')).toBeInTheDocument();

      // 주별 뷰로 전환
      await user.selectOptions(screen.getByLabelText('view'), 'week');
      expect(screen.getByTestId('week-view')).toBeInTheDocument();
    });
  });

  describe('일정 검색', () => {
    test('제목으로 일정을 검색하고 결과가 표시되는지 확인한다', async () => {
      const { user } = setup();
      // 이벤트 목록이 렌더링될 때까지 대기
      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toBeInTheDocument();
      });

      // 일정 입력 및 추가
      await user.type(screen.getByLabelText('제목'), '검색할 일정');
      await user.type(screen.getByLabelText('날짜'), '2024-08-06');
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');

      // 일정 추가 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      await user.type(screen.getByPlaceholderText('검색어를 입력하세요'), '검색');

      // 캘린더에서 검색 결과 확인
      const calendar = screen.getByTestId('month-view');
      expect(within(calendar).getByText('검색할 일정')).toBeInTheDocument();
      expect(within(calendar).queryByText('알림 테스트')).not.toBeInTheDocument();

      // 검색 리스트에서 검색 결과 확인
      const searchList = screen.getByTestId('event-list');
      expect(within(searchList).getByText('검색할 일정')).toBeInTheDocument();
      expect(within(searchList).queryByText('알림 테스트')).not.toBeInTheDocument();
    });

    test('검색어를 지우면 모든 일정이 다시 표시된다', async () => {
      const { user } = setup();
      // 이벤트 목록이 렌더링될 때까지 대기
      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toBeInTheDocument();
      });
      // 일정 입력 및 추가
      await user.type(screen.getByLabelText('제목'), '검색할 일정');
      await user.type(screen.getByLabelText('날짜'), '2024-08-06');
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');

      console.log(prettyDOM(screen.getByTestId('event-list')));

      // 일정 추가 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));
      // 검색어 입력 후 지우기
      await user.type(screen.getByPlaceholderText('검색어를 입력하세요'), '검색');

      await user.clear(screen.getByPlaceholderText('검색어를 입력하세요'));

      // 모든 일정이 표시되는지 확인
      const searchList = screen.getByTestId('event-list');
      expect(within(searchList).getByText('검색할 일정')).toBeInTheDocument();
      const searchItemTitle = screen.getAllByTestId('event-title');
      expect(searchItemTitle.find((title) => title.textContent === '알림 테스트')).toBeInTheDocument();
    });
  });

  describe('공휴일 표시', () => {
    test('캘린더에 공휴일이 표시된다', async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toBeInTheDocument();
      });
      // 공휴일 확인
      expect(screen.getByText('광복절')).toBeInTheDocument();
    });
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
      const { user } = setup();

      // 기본 일정
      await user.type(screen.getByLabelText('제목'), '기본 일정');
      await user.type(screen.getByLabelText('날짜'), '2024-08-03');
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      // 일정 추가 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      // 겹치는 일정 입력
      await user.type(screen.getByLabelText('제목'), '충돌 일정');
      await user.type(screen.getByLabelText('날짜'), '2024-08-03');
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      // 일정 추가 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      // 충돌 경고 확인
      expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    });
  });
});
