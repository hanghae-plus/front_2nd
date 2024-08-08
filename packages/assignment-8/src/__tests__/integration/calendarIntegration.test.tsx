import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { SchedulerProvider } from '../../contexts/SchedulerContext';
import CalendarView from '../../components/CalendarView';

const setup = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  return {
    user,
    ...render(<SchedulerProvider>{component}</SchedulerProvider>),
  };
};

test('캘린더 뷰 변경 시 해당 기간의 이벤트만 표시', () => {
  const { getByTestId, getAllByTestId } = setup(<CalendarView />);
  const viewSelect = getByTestId('calendar-view-select');

  fireEvent.change(viewSelect, { target: { value: 'week' } });
  expect(getAllByTestId('event-item')).toHaveLength(3); // 주간 이벤트 수

  fireEvent.change(viewSelect, { target: { value: 'month' } });
  expect(getAllByTestId('event-item')).toHaveLength(10); // 월간 이벤트 수
});
