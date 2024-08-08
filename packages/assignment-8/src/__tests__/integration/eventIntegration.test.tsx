import { act, renderHook } from '@testing-library/react-hooks';
import { useEvents } from '../../hooks/useEvents';
import { ReactNode } from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { SchedulerProvider } from '../../contexts/SchedulerContext';
import EventList from '../../components/EventList';
import EventForm from '../../components/EventForm';

const setup = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  return {
    user,
    ...render(<SchedulerProvider>{component}</SchedulerProvider>),
  };
};

test('이벤트 생성 시 상태가 올바르게 업데이트되는지 확인', async () => {
  const { result } = renderHook(() => useEvents());

  act(() => {
    result.current.addEvent({
      id: 1,
      title: '팀 회의',
      date: '2024-07-20',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { isRepeating: false, type: 'none', interval: 1 },
      notificationTime: 1,
    });
  });

  expect(result.current.events).toHaveLength(1);
  expect(result.current.events[0].title).toBe('새 이벤트');
});

test('이벤트 검색 기능이 올바르게 작동하는지 확인', () => {
  const { getByTestId, getAllByTestId } = setup(<EventList />);
  const searchInput = getByTestId('event-search-input');

  fireEvent.change(searchInput, { target: { value: '회의' } });
  expect(getAllByTestId('event-item')).toHaveLength(2); // '회의' 관련 이벤트 수

  fireEvent.change(searchInput, { target: { value: '생일' } });
  expect(getAllByTestId('event-item')).toHaveLength(1); // '생일' 관련 이벤트 수
});

test('이벤트 충돌 시 경고 다이얼로그 표시', async () => {
  const { getByTestId, getByText } = setup(<EventForm />);

  fireEvent.change(getByTestId('event-title-input'), {
    target: { value: '충돌 테스트' },
  });
  fireEvent.change(getByTestId('event-date-input'), {
    target: { value: '2024-08-10' },
  });
  fireEvent.change(getByTestId('event-start-time-input'), {
    target: { value: '10:00' },
  });
  fireEvent.change(getByTestId('event-end-time-input'), {
    target: { value: '11:00' },
  });

  fireEvent.click(getByTestId('event-submit-button'));

  await waitFor(() => {
    expect(getByText('일정 겹침 경고')).toBeInTheDocument();
  });
});
