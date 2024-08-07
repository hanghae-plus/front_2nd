// INFO: 8주차 과제 파일

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import EventForm from '../components/EventForm';
import { Event, EventFormData } from '../types';
import { SchedulerProvider } from '../contexts/SchedulerContext';
import { act, renderHook } from '@testing-library/react-hooks';
import { useEvents } from '../hooks/useEvents';

const setup = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  return {
    user,
    ...render(<SchedulerProvider>{component}</SchedulerProvider>),
  };
};

describe('반복 일정 기능', () => {
  // TODO: EventForm 컴포넌트 테스트로 분리
  describe('반복 일정 지정', () => {
    test('반복 설정을 할 수 있다', async () => {
      const { user } = setup(<EventForm />);

      // 반복 설정 체크박스 찾기 및 클릭
      const repeatCheckbox = screen.getByLabelText('반복 일정');
      user.click(repeatCheckbox);

      // 반복 유형 선택 확인
      const repeatTypeSelect = await screen.findByLabelText('반복 유형');
      expect(repeatTypeSelect).toBeInTheDocument();

      // 각 반복 유형 옵션 확인
      expect(screen.getByRole('option', { name: '매일' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '매주' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '매월' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '매년' })).toBeInTheDocument();
    });
    test('반복 간격을 설정할 수 있다', async () => {
      const { user } = setup(<EventForm />);

      // 반복 설정 활성화
      const repeatCheckbox = screen.getByLabelText('반복 일정');
      user.click(repeatCheckbox);

      // 반복 간격 입력 필드 확인 및 값 입력
      const intervalInput = await screen.findByLabelText('반복 간격');
      await user.clear(intervalInput);
      await user.type(intervalInput, '2');

      expect(intervalInput).toHaveValue(2);
    });
  });

  // TODO: useEvents 훅 테스트로 분리
  describe('반복 일정 생성', () => {
    test('반복 일정이 올바르게 생성되고 저장된다', async () => {
      const { result } = renderHook(() => useEvents());

      const newEventData: EventFormData = {
        title: '주간 회의',
        description: '팀 주간 회의',
        date: '2024-07-01',
        startTime: '10:00',
        endTime: '11:00',
        category: '업무',
        location: '회의실 A',
        repeat: {
          isRepeating: true,
          type: 'weekly',
          interval: 1,
          endDate: '2024-07-29',
        },
        notificationTime: 15,
      };

      await act(async () => {
        await result.current.addEvent(newEventData);
      });

      // events 배열에 5개의 이벤트가 생성되었는지 확인 (7월의 월요일 수)
      expect(result.current.events).toHaveLength(5);

      // 생성된 이벤트들의 날짜가 올바른지 확인
      const expectedDates = [
        '2024-07-01',
        '2024-07-08',
        '2024-07-15',
        '2024-07-22',
        '2024-07-29',
      ];
      result.current.events.forEach((event: Event, index: number) => {
        expect(event.date).toBe(expectedDates[index]);
        expect(event.title).toBe('주간 회의');
        expect(event.repeat.type).toBe('weekly');
        expect(event.repeat.interval).toBe(1);
      });

      // 마지막 이벤트가 종료 날짜를 넘어가지 않았는지 확인
      expect(result.current.events[result.current.events.length - 1].date).toBe(
        '2024-07-29'
      );
    });
  });

  describe('반복 일정 수정', () => {
    test.fails('특정 날짜의 일정만 수정할 수 있다', async () => {});
    test.fails('특정 날짜 이후의 모든 일정을 수정할 수 있다', async () => {});
  });

  describe('반복 일정 삭제', () => {
    test.fails('특정 날짜의 일정만 삭제할 수 있다', async () => {});
    test.fails('특정 날짜 이후의 모든 일정을 삭제할 수 있다', async () => {});
    test.fails('전체 반복 일정을 삭제할 수 있다', async () => {});
  });

  describe('반복 규칙 수정', () => {
    test.fails('반복 일정의 반복 규칙을 수정할 수 있다', async () => {});
  });

  describe('예외 날짜 처리', () => {
    test.fails('반복 일정에 예외 날짜를 추가할 수 있다', async () => {});
  });
});
