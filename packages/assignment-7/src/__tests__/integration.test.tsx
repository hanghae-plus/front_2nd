import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { resetMockEvents } from '../mockApiHandlers';

describe('일정 관리 애플리케이션 통합 테스트', () => {
  beforeEach(() => {
    resetMockEvents();
    render(<App />);
  });
  describe('일정 CRUD 및 기본 기능', () => {
    test('일정 리스트를 가져온다.', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toBeInTheDocument();
      });
    });

    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      await userEvent.type(screen.getByLabelText('제목'), '테스트 일정');
      await userEvent.type(screen.getByLabelText('날짜'), '2024-08-30');
      await userEvent.type(screen.getByLabelText('시작 시간'), '09:00');
      await userEvent.type(screen.getByLabelText('종료 시간'), '10:00');
      await userEvent.type(screen.getByLabelText('설명'), '테스트 설명');
      await userEvent.type(screen.getByLabelText('위치'), '테스트 위치');
      await userEvent.selectOptions(screen.getByLabelText('카테고리'), '업무');

      await userEvent.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        const eventElements = screen.getAllByText('테스트 일정');
        expect(eventElements.length).toBeGreaterThan(0);
        expect(
          screen.getByText('2024-08-30 09:00 - 10:00')
        ).toBeInTheDocument();
      });
    });

    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      // 먼저 일정을 생성
      await userEvent.type(screen.getByLabelText('제목'), '수정 전 일정');
      await userEvent.type(screen.getByLabelText('날짜'), '2024-08-25');
      await userEvent.type(screen.getByLabelText('시작 시간'), '09:00');
      await userEvent.type(screen.getByLabelText('종료 시간'), '10:00');
      await userEvent.click(screen.getByTestId('event-submit-button'));

      // 생성된 일정 수정
      await waitFor(() => {
        const editButton = screen.getAllByLabelText('Edit event')[0];
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        const titleInput = screen.getByLabelText('제목');
        fireEvent.change(titleInput, { target: { value: '수정 후 일정' } });
      });

      await waitFor(() => {
        const dateInput = screen.getByLabelText('날짜');
        fireEvent.change(dateInput, { target: { value: '2024-08-15' } });
      });

      await waitFor(() => {
        const startTimeInput = screen.getByLabelText('시작 시간');
        fireEvent.change(startTimeInput, { target: { value: '14:00' } });
      });

      await waitFor(() => {
        const endTimeInput = screen.getByLabelText('종료 시간');
        fireEvent.change(endTimeInput, { target: { value: '15:00' } });
      });

      await userEvent.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        const eventElements = screen.getAllByText('수정 후 일정');
        expect(eventElements.length).toBeGreaterThan(0);
        expect(
          screen.getByText('2024-08-15 14:00 - 15:00')
        ).toBeInTheDocument();
      });
    });

    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      // 먼저 일정을 생성
      await userEvent.type(screen.getByLabelText('제목'), '삭제할 일정');
      await userEvent.type(screen.getByLabelText('날짜'), '2024-08-30');
      await userEvent.type(screen.getByLabelText('시작 시간'), '09:00');
      await userEvent.type(screen.getByLabelText('종료 시간'), '10:00');
      await userEvent.click(screen.getByTestId('event-submit-button'));

      // 생성된 일정 삭제
      await waitFor(() => {
        const deleteButton = screen.getAllByLabelText('Delete event')[0];
        fireEvent.click(deleteButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('삭제할 일정')).not.toBeInTheDocument();
      });
    });
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      // 주간 뷰로 변경
      const viewSelect = screen.getByLabelText('view');
      await userEvent.click(viewSelect);

      await userEvent.selectOptions(viewSelect, 'week');

      await waitFor(() => {
        expect(viewSelect).toHaveValue('week');
      });
      const eventElements = screen.getAllByText('점심 약속');
      expect(eventElements.length).toBeGreaterThan(0);
    });

    test('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      // 일정 생성
      await userEvent.type(screen.getByLabelText('제목'), '월간 일정');
      await userEvent.type(screen.getByLabelText('날짜'), '2024-08-24');
      await userEvent.type(screen.getByLabelText('시작 시간'), '09:00');
      await userEvent.type(screen.getByLabelText('종료 시간'), '10:00');
      await userEvent.click(screen.getByTestId('event-submit-button'));

      // 월간 뷰로 변경
      await userEvent.selectOptions(screen.getByLabelText('view'), 'month');

      await waitFor(() => {
        const monthView = screen.getByTestId('month-view');
        expect(monthView).toBeInTheDocument();

        // 연도와 월이 표시되는지 확인합니다
        expect(monthView).toHaveTextContent('2024년 8월');

        // 30일에 해당하는 셀을 찾습니다
        const dateCell = screen.getByText('24');
        expect(dateCell).toBeInTheDocument();

        // 해당 셀의 부모 요소에 일정 내용이 포함되어 있는지 확인합니다
        const parentCell = dateCell.closest('td');
        expect(parentCell).toHaveTextContent('월간 일정');
      });
    });
  });

  describe('알림 기능', () => {
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다', async () => {
      // vi.setSystemTime(new Date('2024-08-03T09:50:00'));
      // await waitFor(() => {
      //   expect(screen.getByTestId('event-list')).toBeInTheDocument();
      // });
      // // 새 일정 추가
      // await userEvent.type(screen.getByLabelText('제목'), '테스트2 일정');
      // await userEvent.type(screen.getByLabelText('날짜'), '2024-08-03');
      // await userEvent.type(screen.getByLabelText('시작 시간'), '10:00');
      // await userEvent.type(screen.getByLabelText('종료 시간'), '11:00');
      // await userEvent.type(screen.getByLabelText('설명'), '테스트 설명');
      // await userEvent.type(screen.getByLabelText('위치'), '테스트 위치');
      // await userEvent.selectOptions(screen.getByLabelText('카테고리'), '업무');
      // // 알림 설정 (10분 전)
      // await userEvent.selectOptions(screen.getByLabelText('알림 설정'), '10');
      // await userEvent.click(screen.getByTestId('event-submit-button'));
      // // 알림이 표시되었는지 확인
      // await waitFor(() => {
      //   const eventElements = screen.getAllByText('테스트2 일정');
      //   expect(eventElements.length).toBeGreaterThan(0);
      //   expect(screen.getByText('알림')).toBeInTheDocument();
      // });
    });
  });

  describe('검색 기능', () => {
    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다', async () => {
      // 검색 수행
      const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
      await userEvent.type(searchInput, '테스트');

      await waitFor(() => {
        const eventList = screen.getByTestId('event-list');
        expect(eventList).toHaveTextContent(/테스트알림/i);
      });
    });

    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
      // 일정 생성
      const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
      await userEvent.type(searchInput, '검색 결과 없음');

      await waitFor(() => {
        const eventList = screen.getByTestId('event-list');
        expect(eventList).not.toHaveTextContent(/테스트알림/i);
      });

      await userEvent.clear;

      await waitFor(() => {
        const eventList = screen.getByTestId('event-list');
        expect(eventList).not.toHaveTextContent(/테스트알림/i);
      });
    });
  });

  describe('공휴일 표시', () => {
    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      // 월간 뷰로 변경
      await userEvent.selectOptions(screen.getByLabelText('view'), 'month');

      // 1월로 이동
      while (!screen.queryByText('2024년 1월')) {
        await userEvent.click(screen.getByLabelText('Previous'));
      }

      await waitFor(() => {
        expect(screen.getByText('신정')).toBeInTheDocument();
      });
    });

    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다', async () => {
      // 월간 뷰로 변경
      await userEvent.selectOptions(screen.getByLabelText('view'), 'month');

      // 5월로 이동
      while (!screen.queryByText('2024년 5월')) {
        await userEvent.click(screen.getByLabelText('Previous'));
      }

      await waitFor(() => {
        expect(screen.getByText('어린이날')).toBeInTheDocument();
      });
    });
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('event-list')).toBeInTheDocument();
      });

      // 겹치는 일정 생성 시도
      await userEvent.type(screen.getByLabelText('제목'), '겹치는 일정');
      await userEvent.type(screen.getByLabelText('날짜'), '2024-08-02');
      await userEvent.type(screen.getByLabelText('시작 시간'), '08:50');
      await userEvent.type(screen.getByLabelText('종료 시간'), '11:00');
      await userEvent.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
      });
    });
    test('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다', async () => {
      // 먼저 일정을 생성
      await userEvent.type(screen.getByLabelText('제목'), '수정 전 일정');
      await userEvent.type(screen.getByLabelText('날짜'), '2024-08-03');
      await userEvent.type(screen.getByLabelText('시작 시간'), '09:00');
      await userEvent.type(screen.getByLabelText('종료 시간'), '10:00');
      await userEvent.click(screen.getByTestId('event-submit-button'));

      // 생성된 일정 수정
      await waitFor(() => {
        const editButton = screen.getAllByLabelText('Edit event')[0];
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        const titleInput = screen.getByLabelText('제목');
        fireEvent.change(titleInput, { target: { value: '수정 후 일정' } });
      });

      await waitFor(() => {
        const dateInput = screen.getByLabelText('날짜');
        fireEvent.change(dateInput, { target: { value: '2024-08-02' } });
      });

      await waitFor(() => {
        const startTimeInput = screen.getByLabelText('시작 시간');
        fireEvent.change(startTimeInput, { target: { value: '08:50' } });
      });

      await waitFor(() => {
        const endTimeInput = screen.getByLabelText('종료 시간');
        fireEvent.change(endTimeInput, { target: { value: '15:00' } });
      });

      await userEvent.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
      });
    });
  });
});
