// INFO: 8주차 과제 파일

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import EventForm from '../components/EventForm';
import { Event } from '../types';
import { useEvents } from '../hooks/useEvents';

const setup = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  return {
    user,
    ...render(component),
  };
};

describe('반복 일정 기능', () => {
  describe('새 일정 생성', () => {
    test('반복 설정을 할 수 있다', async () => {
      setup(<EventForm />);

      // 반복 설정 체크박스 찾기 및 클릭
      const repeatCheckbox = screen.getByLabelText('반복 일정');
      userEvent.click(repeatCheckbox);

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
      render(<EventForm />);

      // 반복 설정 활성화
      userEvent.click(screen.getByLabelText('반복 일정'));

      // 반복 간격 입력 필드 확인 및 값 입력
      const intervalInput = await screen.findByLabelText('반복 간격');
      userEvent.type(intervalInput, '2');

      expect(intervalInput).toHaveValue(2);
    });
  });

  describe.skip('반복 일정 표시', () => {
    const recurringEvent: Event = {
      id: 1,
      title: '주간 팀 회의',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '11:00',
      category: '업무',
      description: '',
      location: '회의실 A',
      notificationTime: 0,
      repeat: { type: 'weekly', interval: 1, endDate: '2024-08-31' },
    };

    // beforeEach(() => {
    //   vi.spyOn(useEvents, 'useEvents').mockReturnValue({
    //     events: [recurringEvent],
    //   });
    // });

    // const renderWithContext = (view: 'week' | 'month', currentDate: Date) => {
    //   return render(
    //     <CalendarProvider initialState={{ view, currentDate }}>
    //       <CalendarView />
    //     </CalendarProvider>
    //   );
    // };

    // describe('월간 뷰 (Month View)', () => {
    //   test('월간 뷰에 반복 일정이 올바르게 표시된다', () => {
    //     const currentDate = new Date('2024-07-01');
    //     renderWithContext('month', currentDate);

    //     const mondays = ['01', '08', '15', '22', '29'];

    //     mondays.forEach((day) => {
    //       const eventElement = screen.getByTestId(`month-cell-${day}`);
    //       expect(eventElement).toHaveTextContent('주간 팀 회의');
    //     });

    //     // 월요일이 아닌 날에는 이벤트가 표시되지 않아야 함
    //     const nonMonday = '02'; // 화요일
    //     const nonMondayCell = screen.getByTestId(`month-cell-${nonMonday}`);
    //     expect(nonMondayCell).not.toHaveTextContent('주간 팀 회의');
    //   });
    // });

    // describe('주간 뷰 (Week View)', () => {
    //   test('주간 뷰에 반복 일정이 올바르게 표시된다', () => {
    //     const currentDate = new Date('2024-07-01');
    //     renderWithContext('week', currentDate);

    //     // 월요일에만 이벤트가 표시되어야 함
    //     const mondayCell = screen.getByTestId('week-cell-1');
    //     expect(mondayCell).toHaveTextContent('주간 팀 회의');

    //     // 다른 요일에는 이벤트가 표시되지 않아야 함
    //     ['2', '3', '4', '5', '6', '7'].forEach((day) => {
    //       const cell = screen.getByTestId(`week-cell-${day}`);
    //       expect(cell).not.toHaveTextContent('주간 팀 회의');
    //     });
    //   });

    //   test('다음 주 주간 뷰에도 반복 일정이 올바르게 표시된다', () => {
    //     const currentDate = new Date('2024-07-08');
    //     renderWithContext('week', currentDate);

    //     // 월요일에만 이벤트가 표시되어야 함
    //     const mondayCell = screen.getByTestId('week-cell-8');
    //     expect(mondayCell).toHaveTextContent('주간 팀 회의');

    //     // 다른 요일에는 이벤트가 표시되지 않아야 함
    //     ['9', '10', '11', '12', '13', '14'].forEach((day) => {
    //       const cell = screen.getByTestId(`week-cell-${day}`);
    //       expect(cell).not.toHaveTextContent('주간 팀 회의');
    //     });
    //   });
    // });
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
