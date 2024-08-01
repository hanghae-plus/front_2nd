import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import App from '../App';
import { mockApiHandlers, resetTestData } from '../../mock/handler';

const server = setupServer(...mockApiHandlers);

beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});

const formatDate = (date: Date): string => {
  const dateString = date.toLocaleDateString();
  const [year, month, day] = dateString.split('.').map((part) => part.trim());
  const formattedMonth = month.padStart(2, '0');
  const formattedDay = day.padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDay}`;
};

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      server.resetHandlers(...mockApiHandlers);
      resetTestData();
    });

    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      render(<App />);

      const today = formatDate(new Date());
      const title = '새 테스트 일정';

      await user.type(screen.getByLabelText('제목'), title);
      await user.type(screen.getByLabelText('날짜'), today);
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.type(screen.getByLabelText('설명'), '테스트 설명');
      await user.type(screen.getByLabelText('위치'), '테스트 위치');
      await user.selectOptions(screen.getByLabelText('카테고리'), '업무');

      const addButton = screen.getByRole('button', { name: '일정 추가' });

      await user.click(addButton);

      // 비동기 작업이 완료될 때까지 기다립니다.
      await waitFor(() => {
        expect(screen.getAllByText(title)[0]).toBeInTheDocument();
      });

      const eventList = screen.getByTestId('event-list');

      expect(eventList).toBeInTheDocument();

      // 이벤트 목록이 업데이트될 때까지 기다립니다.
      await waitFor(() => {
        const eventList = screen.getByTestId('event-list');

        // 각 필드를 개별적으로 확인합니다.
        const newEventElement = within(eventList).getByText(title);
        expect(newEventElement).toBeInTheDocument();

        const eventContainer = newEventElement.parentElement?.parentElement;

        expect(eventContainer).toHaveTextContent(title);
        expect(eventContainer).toHaveTextContent(today);
        expect(eventContainer).toHaveTextContent('09:00');
        expect(eventContainer).toHaveTextContent('10:00');
        expect(eventContainer).toHaveTextContent('테스트 설명');
        expect(eventContainer).toHaveTextContent('테스트 위치');
        expect(eventContainer).toHaveTextContent('카테고리: 업무');
        expect(eventContainer).toHaveTextContent('알림: 10분 전');
      });
    });

    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      render(<App />);

      // 먼저 새 일정을 생성
      await user.type(screen.getByLabelText('제목'), '수정할 일정');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.type(screen.getByLabelText('설명'), '테스트 설명');
      await user.type(screen.getByLabelText('위치'), '테스트 위치');
      await user.selectOptions(screen.getByLabelText('카테고리'), '업무');

      const addButton = screen.getByRole('button', { name: '일정 추가' });

      await user.click(addButton);

      const editEventList = screen.getAllByLabelText('Edit event');
      expect(editEventList[editEventList.length - 1]).toBeInTheDocument();

      // 생성된 일정 수정
      await waitFor(async () => {
        await user.click(editEventList[editEventList.length - 1]);
        await user.type(
          screen.getByLabelText('제목'),
          '{selectall}{backspace}수정된 일정'
        );

        const editButton = screen.getByRole('button', { name: '일정 수정' });

        await user.click(editButton);
      });

      // 수정 되었는지 확인
      await waitFor(() => {
        const eventList = screen.getByTestId('event-list');
        expect(eventList).toHaveTextContent('수정된 일정');
      });
    });

    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      render(<App />);

      // 새 일정 생성
      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '삭제할 일정');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.type(screen.getByLabelText('설명'), '테스트 설명');
      await user.type(screen.getByLabelText('위치'), '테스트 위치');
      await user.click(screen.getByTestId('event-submit-button'));

      // 생성된 일정 삭제
      await user.click(screen.getByLabelText('Delete event'));

      await waitFor(() => {
        expect(screen.queryByText('삭제할 일정')).not.toBeInTheDocument();
      });
    });
  });

  describe('일정 뷰 및 필터링', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      server.resetHandlers(...mockApiHandlers);
      resetTestData();
    });

    test('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      await userEvent.selectOptions(screen.getByLabelText('view'), 'week');

      expect(screen.getByTestId('week-view')).toBeInTheDocument();
      expect(screen.queryByText(/\d{2}:\d{2}/)).not.toBeInTheDocument();
    });

    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);

      // 새 일정 생성
      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '주간 일정');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.click(screen.getByTestId('event-submit-button'));

      await user.selectOptions(screen.getByLabelText('view'), 'week');

      await waitFor(() => {
        expect(screen.getAllByText('주간 일정')[0]).toBeInTheDocument();
      });
    });

    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      await userEvent.selectOptions(screen.getByLabelText('view'), 'month');

      expect(screen.getByTestId('month-view')).toBeInTheDocument();
      expect(screen.queryByText(/\d{2}:\d{2}/)).not.toBeInTheDocument();
    });

    test('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);

      // 새 일정 생성
      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '월간 일정');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.click(screen.getByTestId('event-submit-button'));

      await user.selectOptions(screen.getByLabelText('view'), 'month');

      await waitFor(() => {
        expect(screen.getAllByText('월간 일정')[0]).toBeInTheDocument();
      });
    });
  });

  describe('검색 기능', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      server.resetHandlers(...mockApiHandlers);
      resetTestData();
    });

    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다', async () => {
      render(<App />);

      // 두 개의 일정 생성
      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '검색용 일정 1');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.click(screen.getByTestId('event-submit-button'));

      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '다른 일정');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '11:00');
      await user.type(screen.getByLabelText('종료 시간'), '12:00');
      await user.click(screen.getByTestId('event-submit-button'));

      // 검색 수행
      await user.type(screen.getByLabelText('일정 검색'), '검색용');

      await waitFor(() => {
        expect(screen.getAllByText('검색용 일정 1')[0]).toBeInTheDocument();
        expect(screen.queryByText('다른 일정')).not.toBeInTheDocument();
      });
    });

    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
      render(<App />);

      // 두 개의 일정 생성
      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '일정 1');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.click(screen.getByTestId('event-submit-button'));

      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '일정 2');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '11:00');
      await user.type(screen.getByLabelText('종료 시간'), '12:00');
      await user.click(screen.getByTestId('event-submit-button'));

      // 검색 수행
      await user.type(screen.getByLabelText('일정 검색'), '일정 1');

      // 검색어 지우기
      await user.clear(screen.getByLabelText('일정 검색'));

      await waitFor(() => {
        expect(screen.getAllByText('일정 1')[0]).toBeInTheDocument();
        expect(screen.getAllByText('일정 2')[0]).toBeInTheDocument();
      });
    });
  });

  describe('공휴일 표시', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      server.resetHandlers(...mockApiHandlers);
      resetTestData();
    });

    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);

      // 1월로 이동
      while (true) {
        const currentDate = await screen.findByText(/\d{4}년 \d{1,2}월/);
        if (currentDate.textContent?.includes('1월')) {
          break;
        }
        await user.click(screen.getByLabelText('Previous'));
      }

      await waitFor(() => {
        expect(screen.getByText('2024년 1월')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('신정')).toBeInTheDocument();
      });
    });

    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);

      // 5월로 이동
      while (true) {
        const currentDate = await screen.findByText(/\d{4}년 \d{1,2}월/);
        if (currentDate.textContent?.includes('5월')) {
          break;
        }
        await user.click(screen.getByLabelText('Previous'));
      }

      await waitFor(() => {
        expect(screen.getByText('어린이날')).toBeInTheDocument();
      });
    });
  });

  describe('일정 충돌 감지', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      server.resetHandlers(...mockApiHandlers);
      resetTestData();
    });

    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);

      // 첫 번째 일정 생성
      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '기존 일정');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.click(screen.getByTestId('event-submit-button'));

      // 겹치는 시간에 새 일정 추가
      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '겹치는 일정');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '09:30');
      await user.type(screen.getByLabelText('종료 시간'), '10:30');
      await user.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
      });
    });

    test('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);

      // 첫 번째 일정 생성
      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '일정 1');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '09:00');
      await user.type(screen.getByLabelText('종료 시간'), '10:00');
      await user.click(screen.getByTestId('event-submit-button'));

      // 두 번째 일정 생성
      await user.click(screen.getByTestId('event-submit-button'));
      await user.type(screen.getByLabelText('제목'), '일정 2');
      await user.type(screen.getByLabelText('날짜'), formatDate(new Date()));
      await user.type(screen.getByLabelText('시작 시간'), '11:00');
      await user.type(screen.getByLabelText('종료 시간'), '12:00');
      await user.click(screen.getByTestId('event-submit-button'));

      // 두 번째 일정 수정하여 첫 번째 일정과 겹치게 만들기
      await user.click(screen.getAllByLabelText('Edit event')[1]);
      await user.clear(screen.getByLabelText('시작 시간'));
      await user.type(screen.getByLabelText('시작 시간'), '09:30');
      await user.clear(screen.getByLabelText('종료 시간'));
      await user.type(screen.getByLabelText('종료 시간'), '10:30');
      await user.click(screen.getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
      });
    });
  });
});
