import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { describe, expect, test, vi } from 'vitest';
import App from '../App';

const TEST_IDS = {
  EVENT_SUBMIT_BUTTON: 'event-submit-button',
  EVENT_LIST: 'event-list',
} as const;

function setup(component: ReactNode) {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  return {
    user,
    ...render(component),
  };
}

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {
    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.type(screen.getByLabelText('제목'), '항해 플러스 프론트엔드');
      await user.type(screen.getByLabelText('날짜'), '2024-08-01');
      await user.type(screen.getByLabelText('시작 시간'), '11:00');
      await user.type(screen.getByLabelText('종료 시간'), '13:00');
      await user.type(screen.getByLabelText('설명'), '테스트 코드 과제');
      await user.type(screen.getByLabelText('위치'), '서울 사당역');
      await user.type(screen.getByLabelText('카테고리'), '서울 사당역');
      await user.selectOptions(screen.getByLabelText('카테고리'), '개인');
      await user.click(screen.getByLabelText('반복 설정'));
      await user.selectOptions(screen.getByLabelText('알림 설정'), '10분 전');
      await user.selectOptions(screen.getByLabelText('반복 유형'), '매주');
      await user.type(screen.getByLabelText('반복 간격'), '2');
      await user.type(screen.getByLabelText('반복 종료일'), '2024-08-31');
      await user.click(screen.getByTestId(TEST_IDS.EVENT_SUBMIT_BUTTON));

      await user.type(screen.getByLabelText('일정 검색'), '항해 플러스');
      expect(screen.getByText('2024-08-01 11:00 - 13:00')).toBeInTheDocument();
    });

    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.type(screen.getByLabelText('일정 검색'), '주간 운동');
      await user.click(screen.getByLabelText('Edit event'));
      await user.clear(screen.getByLabelText('위치'));
      await user.type(screen.getByLabelText('위치'), '선릉역 헬스장');
      await user.click(screen.getByTestId(TEST_IDS.EVENT_SUBMIT_BUTTON));

      expect(screen.getByText('선릉역 헬스장')).toBeInTheDocument();
    });

    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.type(screen.getByLabelText('일정 검색'), '주간 운동');
      await user.click(screen.getByLabelText('Delete event'));

      expect(screen.queryByText('주간 운동')).not.toBeInTheDocument();
    });
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      const { user } = setup(<App />);

      await user.selectOptions(screen.getByLabelText('view'), 'Week');
      await user.click(screen.getByLabelText('Next'));

      const tdElements = screen.getAllByRole('cell');
      tdElements.forEach((tdElement) => {
        Array.from(tdElement.children).forEach((child) => {
          expect(child.tagName).toBe('P');
        });
      });
    });

    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.selectOptions(screen.getByLabelText('view'), 'Week');

      const workCell = screen.getByRole('cell', {
        name: /4 운동/i,
      });
      const alarmCell = screen.getByRole('cell', {
        name: /1 알림 테스트/i,
      });

      expect(workCell).toBeInTheDocument();
      expect(alarmCell).toBeInTheDocument();
    });

    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      const { user } = setup(<App />);

      await user.selectOptions(screen.getByLabelText('view'), 'Month');
      await user.click(screen.getByLabelText('Previous'));
      await user.click(screen.getByLabelText('Previous'));

      const tdElements = screen.getAllByRole('cell');
      tdElements.forEach((tdElement) => {
        Array.from(tdElement.children).forEach((child) => {
          expect(child.tagName).toBe('P');
        });
      });
    });

    test('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.selectOptions(screen.getByLabelText('view'), 'Month');

      const eventList = screen.getByTestId(TEST_IDS.EVENT_LIST);
      const calendar = screen.getByRole('table');

      expect(within(eventList).getByText('운동')).toBeInTheDocument();
      expect(within(calendar).getByText('운동')).toBeInTheDocument();
    });
  });

  describe('알림 기능', () => {
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다', async () => {
      /**
       * @todo
       */
    });
  });

  describe('검색 기능', () => {
    test('제목으로 일정을 검색하고 정한 결과가 반환되는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.type(screen.getByLabelText('일정 검색'), '운동');

      expect(screen.getByText('주간 운동')).toBeInTheDocument();
    });

    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
      const { user } = setup(<App />);

      await user.type(screen.getByLabelText('일정 검색'), '운동');
      await user.clear(screen.getByLabelText('일정 검색'));

      expect(screen.getByText('주간 운동')).toBeInTheDocument();
    });
  });

  describe('공휴일 표시', () => {
    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.click(screen.getByLabelText('Previous'));
      await user.click(screen.getByLabelText('Previous'));
      await user.click(screen.getByLabelText('Previous'));
      await user.click(screen.getByLabelText('Previous'));
      await user.click(screen.getByLabelText('Previous'));
      await user.click(screen.getByLabelText('Previous'));
      await user.click(screen.getByLabelText('Previous'));

      const happyNewYearDay = screen.getByRole('cell', {
        name: /1 신정/i,
      });

      expect(happyNewYearDay).toBeInTheDocument();
    });
    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.click(screen.getByLabelText('Previous'));
      await user.click(screen.getByLabelText('Previous'));
      await user.click(screen.getByLabelText('Previous'));

      const childrenDay = screen.getByRole('cell', {
        name: /5 어린이날/i,
      });

      expect(childrenDay).toBeInTheDocument();
    });
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.type(screen.getByLabelText('제목'), '항해 플러스 프론트엔드');
      await user.type(screen.getByLabelText('날짜'), '2024-08-04');
      await user.type(screen.getByLabelText('시작 시간'), '18:30');
      await user.type(screen.getByLabelText('종료 시간'), '19:00');
      await user.type(screen.getByLabelText('설명'), '테스트 코드 과제');
      await user.type(screen.getByLabelText('위치'), '서울 사당역');
      await user.type(screen.getByLabelText('카테고리'), '서울 사당역');
      await user.selectOptions(screen.getByLabelText('카테고리'), '개인');
      await user.click(screen.getByLabelText('반복 설정'));
      await user.selectOptions(screen.getByLabelText('알림 설정'), '10분 전');
      await user.selectOptions(screen.getByLabelText('반복 유형'), '매주');
      await user.type(screen.getByLabelText('반복 간격'), '2');
      await user.type(screen.getByLabelText('반복 종료일'), '2024-08-31');
      await user.click(screen.getByTestId(TEST_IDS.EVENT_SUBMIT_BUTTON));

      expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    });

    test('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다', async () => {
      const { user } = setup(<App />);

      await user.type(screen.getByLabelText('제목'), '항해 플러스 프론트엔드');
      await user.type(screen.getByLabelText('날짜'), '2024-08-02');
      await user.type(screen.getByLabelText('시작 시간'), '18:30');
      await user.type(screen.getByLabelText('종료 시간'), '19:00');
      await user.type(screen.getByLabelText('설명'), '테스트 코드 과제');
      await user.type(screen.getByLabelText('위치'), '서울 사당역');
      await user.type(screen.getByLabelText('카테고리'), '서울 사당역');
      await user.selectOptions(screen.getByLabelText('카테고리'), '개인');
      await user.click(screen.getByLabelText('반복 설정'));
      await user.selectOptions(screen.getByLabelText('알림 설정'), '10분 전');
      await user.selectOptions(screen.getByLabelText('반복 유형'), '매주');
      await user.type(screen.getByLabelText('반복 간격'), '2');
      await user.type(screen.getByLabelText('반복 종료일'), '2024-08-31');
      await user.click(screen.getByTestId(TEST_IDS.EVENT_SUBMIT_BUTTON));

      await user.type(screen.getByLabelText('일정 검색'), '항해 플러스');
      await user.click(screen.getByLabelText('Edit event'));
      await user.clear(screen.getByLabelText('날짜'));
      await user.type(screen.getByLabelText('날짜'), '2024-08-04');
      await user.click(screen.getByTestId(TEST_IDS.EVENT_SUBMIT_BUTTON));

      expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    });
  });
});
