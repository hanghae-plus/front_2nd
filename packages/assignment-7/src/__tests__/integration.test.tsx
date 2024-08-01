import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { prettyDOM, render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import { createStandaloneToast } from '@chakra-ui/react';

const { ToastContainer, toast } = createStandaloneToast();

const wrapper = () => (
  <>
    <App />
    <ToastContainer />
  </>
);

const setup = () => {
  const user = userEvent.setup();
  return {
    user,
    ...render(wrapper()),
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

    test('일정 생성 완료 후 토스트 메시지가 표시된다', async () => {
      const { user } = setup();

      // 일정 입력 및 추가 (간단한 버전)
      await user.type(screen.getByLabelText('제목'), '새로운 일정');
      await user.type(screen.getByLabelText('날짜'), '2024-08-03');
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');

      const submitButton = screen.getByTestId('event-submit-button');
      expect(submitButton).toBeInTheDocument(); // 버튼이 존재하는지 확인
      await user.click(submitButton);

      console.log(prettyDOM(screen.getByLabelText('제목')));
      expect(screen.getByText('일정이 추가되었습니다.')).toBeInTheDocument();
    });

    test.skip('생성된 일정이 캘린더 뷰에 표시된다', async () => {
      const { user } = setup();

      // 일정 입력 및 추가
      await user.type(screen.getByLabelText('제목'), '새로운 일정');
      await user.type(screen.getByLabelText('날짜'), '2024-08-03');
      await user.click(screen.getByText('일정 추가'));

      // 캘린더 뷰에서 일정 확인
      expect(screen.getByText('새로운 일정')).toBeInTheDocument();
    });
  });

  describe('일정 수정', () => {
    test.skip('기존 일정을 수정하고 변경사항이 일정 검색 리스트에 반영되는지 확인한다', async () => {
      const { user } = setup();

      // 기존 일정 선택 (일정이 이미 존재한다고 가정)
      await user.click(screen.getByText('기존 일정'));

      // 일정 수정
      await user.clear(screen.getByLabelText('제목'));
      await user.type(screen.getByLabelText('제목'), '수정된 일정');
      await user.click(screen.getByText('일정 수정'));

      // 수정된 일정 확인
      expect(screen.getByText('수정된 일정')).toBeInTheDocument();
    });
  });

  describe('일정 삭제', () => {
    test.skip('일정을 삭제하고 검색 리스트와 캘린더 뷰에서 사라지는지 확인한다', async () => {
      const { user } = setup();

      // 일정 삭제 (삭제 아이콘 클릭)
      await user.click(screen.getByLabelText('Delete event'));

      // 삭제 확인 대화상자에서 확인
      await user.click(screen.getByText('확인'));

      // 삭제된 일정이 없는지 확인
      expect(screen.queryByText('삭제할 일정')).not.toBeInTheDocument();
    });
  });

  describe('일정 뷰 전환', () => {
    test.skip('주별 뷰와 월별 뷰 간 전환이 가능하다', async () => {
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
    test.skip('제목으로 일정을 검색하고 결과가 표시되는지 확인한다', async () => {
      const { user } = setup();

      await user.type(screen.getByPlaceholderText('검색어를 입력하세요'), '회의');

      // 검색 결과 확인
      expect(screen.getByText('회의 일정')).toBeInTheDocument();
      expect(screen.queryByText('개인 일정')).not.toBeInTheDocument();
    });

    test.skip('검색어를 지우면 모든 일정이 다시 표시된다', async () => {
      const { user } = setup();

      // 검색어 입력 후 지우기
      await user.type(screen.getByPlaceholderText('검색어를 입력하세요'), '회의');
      await user.clear(screen.getByPlaceholderText('검색어를 입력하세요'));

      // 모든 일정이 표시되는지 확인
      expect(screen.getByText('회의 일정')).toBeInTheDocument();
      expect(screen.getByText('개인 일정')).toBeInTheDocument();
    });
  });

  describe('공휴일 표시', () => {
    test.skip('캘린더에 공휴일이 표시된다', async () => {
      const { user } = setup();

      // 1월로 이동
      await user.click(screen.getByLabelText('Previous'));

      // 공휴일 확인
      expect(screen.getByText('신정')).toBeInTheDocument();
    });
  });

  describe('일정 충돌 감지', () => {
    test.skip('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
      const { user } = setup();

      // 겹치는 일정 입력
      await user.type(screen.getByLabelText('제목'), '충돌 일정');
      await user.type(screen.getByLabelText('날짜'), '2024-08-03');
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.click(screen.getByText('일정 추가'));

      // 충돌 경고 확인
      expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    });
  });
});
