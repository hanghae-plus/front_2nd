import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { ReactElement } from 'react';
import { act, render, screen, within } from '@testing-library/react';
import App from '../App';
import { userEvent } from '@testing-library/user-event';
import createMockServer from './createMockServer';
import { Event, RepeatType } from '../types';
import { ChakraProvider } from '@chakra-ui/react';

const setup = (element: ReactElement) => {
  const user = userEvent.setup();
  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user };
};

const MOCK_EVENT_1: Event = {
  id: 1,
  title: '기존 회의',
  date: '2024-07-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '기존 팀 미팅',
  location: '회의실 B',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

const events: Event[] = [{ ...MOCK_EVENT_1 }];

const server = createMockServer(events);

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setInterval', 'Date'],
  });
  vi.setSystemTime(new Date(2024, 6, 1));
});

beforeAll(() => server.listen());

afterAll(() => server.close());

afterEach(() => {
  events.length = 0;
  events.push({ ...MOCK_EVENT_1 });
  vi.useRealTimers();
});

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {
    test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async () => {
      const { user } = setup(<App />);

      // 새 일정 추가 버튼 클릭
      await user.click(screen.getAllByText('일정 추가')[0]);

      // 일정 정보 입력
      await user.type(screen.getByLabelText('제목'), '새 회의');
      await user.type(screen.getByLabelText('날짜'), '2024-07-20');
      await user.type(screen.getByLabelText('시작 시간'), '14:00');
      await user.type(screen.getByLabelText('종료 시간'), '15:00');
      await user.type(screen.getByLabelText('설명'), '프로젝트 진행 상황 논의');
      await user.type(screen.getByLabelText('위치'), '회의실 A');
      await user.selectOptions(screen.getByLabelText('카테고리'), '업무');

      // 저장 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      // 새로 추가된 일정이 목록에 표시되는지 확인
      const eventList = screen.getByTestId('event-list');
      expect(eventList).toHaveTextContent('새 회의');
      expect(eventList).toHaveTextContent('2024-07-20');
      expect(eventList).toHaveTextContent('14:00 - 15:00');
      expect(eventList).toHaveTextContent('프로젝트 진행 상황 논의');
      expect(eventList).toHaveTextContent('회의실 A');
      expect(eventList).toHaveTextContent('업무');
    });

    test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      const { user } = setup(<App />);

      // 기존 일정 수정 버튼 클릭
      await user.click(await screen.findByLabelText('Edit event'));

      // 일정 정보 수정
      await user.clear(screen.getByLabelText('제목'));
      await user.type(screen.getByLabelText('제목'), '수정된 회의');
      await user.clear(screen.getByLabelText('설명'));
      await user.type(screen.getByLabelText('설명'), '회의 내용 변경');

      // 저장 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      // 새로 추가된 일정이 목록에 표시되는지 확인
      const eventList = screen.getByTestId('event-list');
      expect(eventList).toHaveTextContent('수정된 회의');
      expect(eventList).toHaveTextContent('회의 내용 변경');
    });

    test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      events.push({
        id: 2,
        title: '삭제할 회의',
        date: '2024-07-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '삭제할 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });

      const { user } = setup(<App />);
      const eventList = screen.getByTestId('event-list');
      const targetTitle = await within(eventList).findByText('삭제할 회의');

      expect(targetTitle).toHaveTextContent('삭제할 회의');

      // 삭제 버튼 클릭
      const allDeleteButton = await screen.findAllByLabelText('Delete event');
      await user.click(allDeleteButton[1]);

      expect(within(eventList).queryByText('삭제할 회의')).not.toBeInTheDocument();
    });
  });

  describe('일정 뷰 및 필터링', () => {
    test('주별 부에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      // 2024년 1월 1일을 현재 날짜로 설정
      vi.setSystemTime(new Date(2024, 0, 1));

      const { user } = setup(<App />);

      // 주별 뷰로 변경
      await user.selectOptions(screen.getByLabelText('view'), 'week');

      // 이벤트 목록에서 확인
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();

      // 현재 날짜 초기화
      vi.useRealTimers();
    });

    test('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      const date = new Date();
      const fillZero = (n: number) => String(n).padStart(2, '0');
      const fullDate = `${date.getFullYear()}-${fillZero(date.getMonth() + 1)}-${fillZero(date.getDate())}`;

      events.length = 0;
      events.push({
        id: 1,
        title: '이번주 팀 회의',
        date: fullDate,
        startTime: '09:00',
        endTime: '10:00',
        description: '이번주 팀 회의입니다.',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });

      const { user } = setup(<App />);

      // 주별 뷰로 변경
      await user.selectOptions(screen.getByLabelText('view'), 'week');

      // 주별 뷰에서 일정 확인
      const weekView = screen.getByTestId('week-view');
      expect(within(weekView).getByText('이번주 팀 회의')).toBeInTheDocument();

      // 이벤트 목록에서 확인
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText('이번주 팀 회의')).toBeInTheDocument();
      expect(within(eventList).getByText(`${fullDate} 09:00 - 10:00`)).toBeInTheDocument();
      expect(within(eventList).getByText(`회의실 A`)).toBeInTheDocument();
    });

    test('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      // 2024년 1월 1일을 현재 날짜로 설정
      vi.setSystemTime(new Date(2024, 0, 1));

      setup(<App />);

      // 이벤트 목록에서 확인
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();

      // 현재 날짜 초기화
      vi.useRealTimers();
    });

    test('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      const date = new Date();
      const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-1`;
      events.length = 0;
      events.push({
        id: 1,
        title: '이번달 팀 회의',
        date: fullDate,
        startTime: '09:00',
        endTime: '10:00',
        description: '이번달 팀 회의입니다.',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });

      setup(<App />);

      // 월별 뷰에서 일정 확인
      const monthView = screen.getByTestId('month-view');
      const monthEventTitleEl = await within(monthView).findByText('이번달 팀 회의');

      expect(monthEventTitleEl).toHaveTextContent('이번달 팀 회의');
      expect(within(monthEventTitleEl.closest('td')!).queryByText('1')).toBeInTheDocument();

      // 이벤트 목록에서 확인
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText('이번달 팀 회의')).toBeInTheDocument();
      expect(within(eventList).getByText(`${fullDate} 09:00 - 10:00`)).toBeInTheDocument();
      expect(within(eventList).getByText(`회의실 A`)).toBeInTheDocument();
    });
  });

  describe('검색 기능', () => {
    beforeEach(() => {
      // 테스트 데이터 설정
      events.length = 0;
      events.push(
        {
          id: 1,
          title: '팀 회의',
          date: '2024-07-15',
          startTime: '09:00',
          endTime: '10:00',
          description: '주간 팀 미팅',
          location: '회의실 A',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
        {
          id: 2,
          title: '프로젝트 계획',
          date: '2024-07-16',
          startTime: '14:00',
          endTime: '15:00',
          description: '새 프로젝트 계획 수립',
          location: '회의실 B',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        }
      );
    });

    test('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
      const { user } = setup(<App />);

      // 검색어 입력
      const searchInput = await screen.findByPlaceholderText('검색어를 입력하세요');

      await user.type(searchInput, '존재하지 않는 일정');

      // 결과 확인
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });

    test('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다', async () => {
      const { user } = setup(<App />);

      // 검색어 입력
      const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
      await user.type(searchInput, '팀 회의');

      // 결과 확인
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-07-15 09:00 - 10:00')).toBeInTheDocument();
      expect(within(eventList).queryByText('프로젝트 계획')).not.toBeInTheDocument();
    });

    test('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
      const { user } = setup(<App />);

      // 먼저 검색 수행
      const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
      await user.type(searchInput, '팀 회의');
      await user.clear(searchInput);

      // 모든 일정이 표시되는지 확인
      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
      expect(within(eventList).getByText('프로젝트 계획')).toBeInTheDocument();
    });
  });

  describe('공휴일 표시', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    test('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      vi.setSystemTime(new Date(2024, 0, 1));
      setup(<App />);

      const monthView = screen.getByTestId('month-view');

      // 1월 1일 셀 확인
      const jan1Cell = within(monthView).getByText('1').closest('td');
      expect(within(jan1Cell!).getByText('신정')).toBeInTheDocument();
      expect(within(jan1Cell!).getByText('신정')).toHaveStyle('color: red.500');
    });

    test('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다', async () => {
      vi.setSystemTime(new Date(2024, 4, 1));
      setup(<App />);

      const monthView = screen.getByTestId('month-view');

      // 5월 5일 셀 확인
      const may5Cell = within(monthView).getByText('5').closest('td');
      expect(within(may5Cell!).getByText('어린이날')).toBeInTheDocument();
      expect(within(may5Cell!).getByText('어린이날')).toHaveStyle('color: red.500');
    });
  });

  describe('일정 충돌 감지', () => {
    test('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다', async () => {
      const { user } = setup(<App />);

      // 새 일정 추가 버튼 클릭
      await user.click(screen.getAllByText('일정 추가')[0]);

      // 겹치는 시간에 새 일정 정보 입력
      await user.type(screen.getByLabelText('제목'), '새 회의');
      await user.type(screen.getByLabelText('날짜'), '2024-07-15');
      await user.type(screen.getByLabelText('시작 시간'), '09:30');
      await user.type(screen.getByLabelText('종료 시간'), '10:30');

      // 저장 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));

      // 경고 다이얼로그 확인
      expect(await screen.findByText('일정 겹침 경고')).toBeInTheDocument();
      expect(screen.getByText(/다음 일정과 겹칩니다/)).toBeInTheDocument();
      expect(screen.getByText('기존 회의 (2024-07-15 09:00-10:00)')).toBeInTheDocument();
    });

    test('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다', async () => {
      // 추가 일정 생성 (충돌 대상)
      events.push({
        id: 2,
        title: '다른 회의',
        date: '2024-07-15',
        startTime: '08:00',
        endTime: '09:00',
        description: '충돌 대상 회의',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });

      const { user } = setup(<App />);

      // 기존 일정 수정 버튼 클릭
      const allEditButton = await screen.findAllByLabelText('Edit event');
      await user.click(allEditButton[0]);

      // 시간 수정하여 다른 일정과 충돌 발생
      await user.clear(screen.getByLabelText('시작 시간'));
      await user.type(screen.getByLabelText('시작 시간'), '08:30');
      await user.clear(screen.getByLabelText('종료 시간'));
      await user.type(screen.getByLabelText('종료 시간'), '10:30');
      await user.click(screen.getByTestId('event-submit-button'));

      // 경고 다이얼로그 확인
      expect(await screen.findByText('일정 겹침 경고')).toBeInTheDocument();
      expect(screen.getByText(/다음 일정과 겹칩니다/)).toBeInTheDocument();
      expect(screen.getByText('다른 회의 (2024-07-15 08:00-09:00)')).toBeInTheDocument();
    });
  });

  describe('알림 기능', () => {
    test('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다', async () => {
      // 현재 시간 설정
      const fillZero = (n: number) => String(n).padStart(2, '0');
      const now = Date.now();
      const startTime = new Date(Date.now() + 20 * 60000); // 20분 후
      const endTime = new Date(Date.now() + 30 * 60000); // 30분 후
      const y = startTime.getFullYear();
      const m = fillZero(startTime.getMonth() + 1);
      const d = fillZero(startTime.getDate());
      const fullDate = [y, m, d].join('-');
      const title = '알림 테스트 회의';
      const notificationTime = 10;
      const expectedMessage = `${notificationTime}분 후 ${title} 일정이 시작됩니다.`;

      events.length = 0;
      events.push({
        id: 1,
        title,
        date: fullDate,
        startTime: [startTime.getHours(), startTime.getMinutes()].map(fillZero).join(':'),
        endTime: [endTime.getHours(), endTime.getMinutes()].map(fillZero).join(':'),
        description: '알림 테스트 회의입니다.',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime,
      });

      setup(<App />);

      expect(await within(screen.getByTestId('event-list')).findByText(title)).toBeInTheDocument();

      // 9분 후로 시간 이동 (알림 발생 1분 전)
      vi.setSystemTime(new Date(now + 9 * 60 * 1000));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // 알림이 아직 발생하지 않았는지 확인
      expect(screen.queryByText(expectedMessage)).not.toBeInTheDocument();

      // 10분 후로 이동
      vi.setSystemTime(new Date(now + 10 * 60 * 1000));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // 알림이 발생하는지 확인
      expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    });
  });

  describe('반복 간격 설정', () => {
    // 헬퍼 함수: 일정 생성
    const createEvent = async (user: ReturnType<typeof userEvent.setup>, eventData: Partial<Event>) => {
      // 기본 일정 정보 입력
      await user.type(screen.getByLabelText('제목'), eventData.title || '');
      await user.type(screen.getByLabelText('날짜'), eventData.date || '');
      await user.type(screen.getByLabelText('시작 시간'), eventData.startTime || '');
      await user.type(screen.getByLabelText('종료 시간'), eventData.endTime || '');
      await user.type(screen.getByLabelText('설명'), eventData.description || '');
      await user.type(screen.getByLabelText('위치'), eventData.location || '');
      await user.selectOptions(screen.getByLabelText('카테고리'), eventData.category || '');

      // 반복 설정
      if (eventData.repeat) {
        const repeatCheckbox = screen.getByLabelText('반복 설정');

        if (!(repeatCheckbox as HTMLInputElement).checked) {
          await user.click(repeatCheckbox);
        }
        await user.selectOptions(screen.getByLabelText('반복 유형'), eventData.repeat.type);
        await user.clear(screen.getByLabelText('반복 간격'));
        await user.type(screen.getByLabelText('반복 간격'), eventData.repeat.interval.toString());
      }

      // 저장 버튼 클릭
      await user.click(screen.getByTestId('event-submit-button'));
    };

    // 테스트 데이터
    const baseEventData = {
      title: '새 회의',
      date: '2024-07-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '프로젝트 진행 상황 논의',
      location: '회의실 A',
      category: '업무',
    };

    test('반복 간격을 1일로 설정할 수 있다.', async () => {
      // 예상되는 일정 개수
      const eventCount = 12;

      const { user } = setup(<App />);

      await createEvent(user, { ...baseEventData, repeat: { type: 'daily', interval: 1 } });

      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getAllByText(/새 회의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/14:00 - 15:00/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/프로젝트 진행 상황 논의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/회의실 A/)).toHaveLength(eventCount);
      // expect(within(eventList).getAllByText(/업무/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/1일마다/)).toHaveLength(eventCount);
    });

    test('반복 간격을 2일로 설정할 수 있다.', async () => {
      // 예상되는 일정 개수
      const eventCount = 6;

      const { user } = setup(<App />);

      await createEvent(user, { ...baseEventData, repeat: { type: 'daily', interval: 2 } });

      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getAllByText(/새 회의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/14:00 - 15:00/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/프로젝트 진행 상황 논의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/회의실 A/)).toHaveLength(eventCount);
      // expect(within(eventList).getAllByText(/업무/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/2일마다/)).toHaveLength(eventCount);
    });

    test('반복 간격을 1주로 설정할 수 있다.', async () => {
      // 예상되는 일정 개수
      const eventCount = 2;

      const { user } = setup(<App />);

      await createEvent(user, { ...baseEventData, repeat: { type: 'weekly', interval: 1 } });

      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getAllByText(/새 회의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/14:00 - 15:00/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/프로젝트 진행 상황 논의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/회의실 A/)).toHaveLength(eventCount);
      // expect(within(eventList).getAllByText(/업무/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/1주마다/)).toHaveLength(eventCount);
    });

    test('반복 간격을 2주로 설정할 수 있다.', async () => {
      // 예상되는 일정 개수
      const eventCount = 1;

      const { user } = setup(<App />);

      await createEvent(user, { ...baseEventData, repeat: { type: 'weekly', interval: 2 } });

      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getAllByText(/새 회의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/14:00 - 15:00/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/프로젝트 진행 상황 논의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/회의실 A/)).toHaveLength(eventCount);
      // expect(within(eventList).getAllByText(/업무/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/2주마다/)).toHaveLength(eventCount);
    });

    test('반복 간격을 한 달로 설정할 수 있다.', async () => {
      // 예상되는 일정 개수
      const eventCount = 1;

      const { user } = setup(<App />);

      await createEvent(user, { ...baseEventData, repeat: { type: 'monthly', interval: 1 } });

      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getAllByText(/새 회의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/14:00 - 15:00/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/프로젝트 진행 상황 논의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/회의실 A/)).toHaveLength(eventCount);
      // expect(within(eventList).getAllByText(/업무/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/1월마다/)).toHaveLength(eventCount);

      const nextMonthButton = screen.getByLabelText('Next');
      await user.click(nextMonthButton);

      expect(within(eventList).getAllByText(/새 회의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/14:00 - 15:00/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/프로젝트 진행 상황 논의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/회의실 A/)).toHaveLength(eventCount);
      // expect(within(eventList).getAllByText(/업무/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/1월마다/)).toHaveLength(eventCount);
    });

    test('반복 간격을 2달로 설정할 수 있다.', async () => {
      // 예상되는 일정 개수
      const eventCount = 1;

      const { user } = setup(<App />);

      await createEvent(user, { ...baseEventData, repeat: { type: 'monthly', interval: 2 } });

      const eventList = screen.getByTestId('event-list');
      expect(within(eventList).getAllByText(/새 회의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/14:00 - 15:00/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/프로젝트 진행 상황 논의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/회의실 A/)).toHaveLength(eventCount);
      // expect(within(eventList).getAllByText(/업무/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/2월마다/)).toHaveLength(eventCount);

      const nextMonthButton = screen.getByLabelText('Next');
      await user.click(nextMonthButton);

      // 다음 달에는 반복되는 일정이 없어야 한다.
      expect(within(eventList).queryAllByText(/새 회의/)).not.toHaveLength(eventCount);
      expect(within(eventList).queryAllByText(/14:00 - 15:00/)).not.toHaveLength(eventCount);
      expect(within(eventList).queryAllByText(/프로젝트 진행 상황 논의/)).not.toHaveLength(eventCount);
      expect(within(eventList).queryAllByText(/회의실 A/)).not.toHaveLength(eventCount);
      // expect(within(eventList).queryAllByText(/업무/)).toHaveLength(eventCount);
      expect(within(eventList).queryAllByText(/2월마다/)).not.toHaveLength(eventCount);

      await user.click(nextMonthButton);

      // 다음 달에는 반복되는 일정이 있어야 한다.
      expect(within(eventList).getAllByText(/새 회의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/14:00 - 15:00/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/프로젝트 진행 상황 논의/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/회의실 A/)).toHaveLength(eventCount);
      // expect(within(eventList).getAllByText(/업무/)).toHaveLength(eventCount);
      expect(within(eventList).getAllByText(/2월마다/)).toHaveLength(eventCount);
    });

    test('반복 간격이 0인 경우 에러 메시지가 표시된다.', async () => {
      const { user } = setup(<App />);

      await createEvent(user, { ...baseEventData, repeat: { type: 'monthly', interval: 0 } });
      expect(await screen.findByText(/반복 간격은 1 이상이어야 합니다\./i)).toBeInTheDocument();
    });
  });

  describe('반복 일정 표시 기능', () => {
    test.each([
      ['daily', '1일마다 반복'],
      ['weekly', '1주마다 반복'],
      ['monthly', '1월마다 반복'],
      ['yearly', '1년마다 반복'],
    ])('캘린더 뷰에서 %c%s되는 일정을 구분하여 표시할 수 있다.', async (repeatType: string, expectedText: string) => {
      const { user } = setup(<App />);

      events.push({
        id: 2,
        title: '반복 일정',
        date: '2024-07-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '반복되는 일정',
        location: '회의실 B',
        category: '업무',
        repeat: { type: repeatType as RepeatType, interval: 1 },
        notificationTime: 0,
      });

      const monthView = screen.getByTestId('month-view');

      const [schedule] = await within(monthView).findAllByText(/반복 일정/);
      expect(schedule).toBeInTheDocument();

      // tooltip 형태로 반복 타입이 표시되는지 확인
      await user.hover(schedule);
      expect(await screen.findByText(expectedText)).toBeInTheDocument();
    });

    test.fails('캘린더 뷰에서 반복되지 않는 일정은 툴팁이 표시되지 않는다.', async () => {
      const { user } = setup(<App />);

      vi.setSystemTime(new Date(2024, 7, 1));

      events.push({
        id: 2,
        title: '그냥 일정',
        date: '2024-07-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '그냥 일정',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      });

      const monthView = screen.getByTestId('month-view');

      const schedule = await within(monthView).findByText('그냥 일정');
      expect(schedule).toBeInTheDocument();

      await user.hover(schedule);
      expect(await screen.findByText('그냥 일정')).toBeInTheDocument();
    });
  });
});
