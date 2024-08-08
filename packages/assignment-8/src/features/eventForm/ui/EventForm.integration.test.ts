import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { describe, test, beforeEach, vi, expect } from 'vitest';

const user = userEvent.setup();

describe('일정 추가 통합 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setInterval', 'Date'],
    });
    vi.setSystemTime(new Date(2024, 8, 1));
  });

  test('일정 추가가 가능하다.', async () => {
    await user.type(screen.getByLabelText('제목'), '테스트 일정');
    await user.type(screen.getByLabelText('날짜'), '2024-08-30');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '10:00');
    await user.type(screen.getByLabelText('설명'), '테스트 설명');
    await user.type(screen.getByLabelText('위치'), '테스트 위치');
    await user.selectOptions(screen.getByLabelText('카테고리'), '업무');

    await user.click(screen.getByTestId('event-submit-button'));

    await waitFor(() => {
      const eventElements = screen.getAllByText('테스트 일정');
      expect(eventElements.length).toBeGreaterThan(0);
      expect(screen.getByText('2024-08-30 09:00 - 10:00')).toBeInTheDocument();
    });
  });

  test.fails('반복 일정이 정상적으로 추가 되었는가.');
});
