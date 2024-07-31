import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { ReactNode } from 'react';

const setup = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  return {
    user,
    ...render(component),
  };
};

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {
    test('초기 일정 목록이 올바르게 렌더링 되어 검색 목록에 노출된다.', async () => {
      // 테스트를 위한 환경 (렌더링)
      setup(<App />);

      // 검증하고자 하는 동작
      // API 호출과 렌더링이 완료될 때까지 기다리고, 요소를 반환받음
      const eventListElement = await waitFor(() => {
        const element = screen.getByTestId('event-list');
        expect(element).toBeInTheDocument();
        return element;
      });

      // 검증
      expect(eventListElement).toHaveTextContent('팀 회의');
      expect(eventListElement).toHaveTextContent('2024-07-20');
      expect(eventListElement).toHaveTextContent('10:00');
      expect(eventListElement).toHaveTextContent('11:00');
      expect(eventListElement).toHaveTextContent('주간 팀 미팅');
    });

    test('새로운 일정을 생성하면 검색 목록에 추가된다.', async () => {
      // 테스트를 위한 환경 (렌더링)
      const { user } = setup(<App />);

      // 폼 필드 입력
      const titleInput = screen.getByLabelText('제목');
      const dateInput = screen.getByLabelText('날짜');
      const startTimeInput = screen.getByLabelText('시작 시간');
      const endTimeInput = screen.getByLabelText('종료 시간');

      await user.type(titleInput, '새 일정');
      await user.type(dateInput, '2024-07-30');
      await user.type(startTimeInput, '14:00');
      await user.type(endTimeInput, '15:00');

      // 폼 제출
      const submitButton = screen.getByTestId('event-submit-button');
      await user.click(submitButton);

      // 새로운 일정이 목록에 추가되었는지 확인
      await waitFor(() => {
        const eventListElement = screen.getByTestId('event-list');
        expect(eventListElement).toHaveTextContent('새 일정');
        expect(eventListElement).toHaveTextContent('2024-07-30');
        expect(eventListElement).toHaveTextContent('14:00');
        expect(eventListElement).toHaveTextContent('15:00');
      });
    });
  });
});
