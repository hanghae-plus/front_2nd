import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import App from '../App';
import { handlers, resetEvents } from '~shared/api/mocks/handlers';

const server = setupServer(...handlers);

// 테스트 시작 전에 목 서버를 실행
beforeAll(() => {
  server.listen();
  vi.setSystemTime(new Date('2024-08-01'));
});
// 테스트 종료 후에 목 서버 종료
afterAll(() => {
  server.close();
});

beforeEach(() => {
  server.resetHandlers();
  resetEvents();
});

afterEach(() => {
  server.resetHandlers();
});

async function addNewEventAsync() {
  await userEvent.type(
    screen.getByRole('textbox', { name: /제목/i }),
    '신규 이벤트',
  );
  await userEvent.type(screen.getByLabelText('날짜'), '2024-08-24');
  await userEvent.type(screen.getByLabelText('시작 시간'), '08:00');
  await userEvent.type(screen.getByLabelText('종료 시간'), '17:00');
  await userEvent.type(
    screen.getByRole('textbox', { name: /설명/i }),
    '신규 이벤트 설명',
  );
  await userEvent.type(
    screen.getByRole('textbox', { name: /위치/i }),
    '사무실',
  );
  await userEvent.selectOptions(
    screen.getByRole('combobox', {
      name: /카테고리/i,
    }),
    '업무',
  );
  await userEvent.selectOptions(
    screen.getByRole('combobox', { name: /알림 설정/i }),
    '60',
  );

  await userEvent.click(
    screen.getByRole('button', {
      name: '일정 추가',
    }),
  );
}

describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {
    it('새로운 일정을 추가하면 달력에 표시되는 지 확인한다.', async () => {
      render(<App />);

      const calendar = await screen.findByRole('table');
      expect(calendar).toBeInTheDocument();

      await addNewEventAsync();

      expect(
        await within(calendar).findByText('신규 이벤트'),
      ).toBeInTheDocument();
    });

    it('새로운 일정을 추가하면 Cart Item으로 추가되는 지 확인한다.', async () => {
      render(<App />);

      await addNewEventAsync();

      const eventCardList = await screen.findByRole('list');

      expect(
        await within(eventCardList).findByText('신규 이벤트'),
      ).toBeInTheDocument();
      expect(
        await within(eventCardList).findByText('2024-08-24 08:00 - 17:00'),
      ).toBeInTheDocument();
      expect(
        await within(eventCardList).findByText('신규 이벤트 설명'),
      ).toBeInTheDocument();
    });

    it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async () => {
      render(<App />);

      await addNewEventAsync();

      const eventCardList = await screen.findAllByRole('listitem');
      const newEventCard = eventCardList[2];
      expect(await within(newEventCard).findByText('신규 이벤트'));

      const modifyButton = within(newEventCard).getByRole('button', {
        name: /edit event/i,
      });
      await userEvent.click(modifyButton);
      await userEvent.clear(screen.getByRole('textbox', { name: /제목/i }));

      await userEvent.type(
        screen.getByRole('textbox', { name: /제목/i }),
        '수정된 이벤트',
      );

      const modifyConfirmButton = screen.getByRole('button', {
        name: '일정 수정',
      });
      await userEvent.click(modifyConfirmButton);

      expect(
        await within(newEventCard).findByText('수정된 이벤트'),
      ).toBeInTheDocument();
    });

    it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
      render(<App />);

      await addNewEventAsync();

      const eventCardList = await screen.findAllByRole('listitem');

      const newEventCard = eventCardList[2];
      expect(await within(newEventCard).findByText('신규 이벤트'));

      const deleteButton = within(newEventCard).getByRole('button', {
        name: /Delete event/i,
      });
      await userEvent.click(deleteButton);

      expect(
        await within(newEventCard).queryByText('신규 이벤트'),
      ).not.toBeInTheDocument();
    });
  });

  const changeWeeklyViewAsync = async () => {
    const calendarTypeSelect = screen.getByRole('combobox', {
      name: /view/i,
    });
    const weekOption = within(calendarTypeSelect).getByRole('option', {
      name: /week/i,
    });

    await userEvent.selectOptions(calendarTypeSelect, weekOption);
  };
  describe('일정 뷰 및 필터링', () => {
    it('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      await changeWeeklyViewAsync();

      expect(await screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
    it('주별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);

      await changeWeeklyViewAsync();

      const nextWeekButton = await screen.findByRole('button', {
        name: /next/i,
      });

      await userEvent.click(nextWeekButton);
      await userEvent.click(nextWeekButton);
      await userEvent.click(nextWeekButton);

      const eventCardList = await screen.findAllByRole('listitem');
      expect(eventCardList.length).toBe(2);
    });
    it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
      render(<App />);

      const nextMonthButton = screen.getByRole('button', {
        name: /next/i,
      });
      await userEvent.click(nextMonthButton);

      const eventCardList = await screen.queryByRole('listitem');
      expect(eventCardList).not.toBeInTheDocument();
    });
    it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
      render(<App />);
      const eventCardList = await screen.findAllByRole('listitem');

      const fistEventCart = eventCardList[0];
      expect(await within(fistEventCart).getByText('2024-08-20 10:00 - 11:00'));

      const secondEventCart = eventCardList[1];
      expect(
        await within(secondEventCart).getByText('2024-08-21 12:30 - 13:30'),
      );
    });
  });

  describe('알림 기능', () => {
    it('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다', async () => {
      render(<App />);

      const alerBeforeTime = new Date('2024-08-21 12:29:00');
      vi.setSystemTime(alerBeforeTime);

      await waitFor(
        () => {
          expect(screen.getByRole('alert')).toBeInTheDocument();
        },
        { timeout: 4000 },
      );

      expect(screen.getByRole('alert')).toHaveTextContent('일정이 시작됩니다.');
    });
  });

  describe('검색 기능', () => {
    it('제목으로 일정을 검색하고 검색 결과가 반환되는지 확인한다', async () => {
      render(<App />);

      const searchInput = screen.getByRole('textbox', {
        name: /일정 검색/i,
      });

      await userEvent.type(searchInput, '팀 회의');

      const eventCardList = await screen.findAllByRole('listitem');

      expect(eventCardList.length).toBe(1);
    });

    it('설명으로 일정을 검색하고 검색 결과가 반환되는지 확인한다', async () => {
      render(<App />);

      const searchInput = screen.getByRole('textbox', {
        name: /일정 검색/i,
      });

      await userEvent.type(searchInput, '주간 팀 미팅');

      const eventCardList = await screen.findAllByRole('listitem');

      expect(eventCardList.length).toBe(1);
    });
    it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {});
  });

  describe('공휴일 표시', () => {
    it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);

      const previousMonthButton = screen.getByRole('button', {
        name: /previous/i,
      });
      await userEvent.click(previousMonthButton);
      await userEvent.click(previousMonthButton);
      await userEvent.click(previousMonthButton);
      await userEvent.click(previousMonthButton);
      await userEvent.click(previousMonthButton);
      await userEvent.click(previousMonthButton);
      await userEvent.click(previousMonthButton);

      expect(screen.getByRole('cell', { name: /1 신정/i }));
    });

    it('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다', async () => {
      render(<App />);

      const previousMonthButton = screen.getByRole('button', {
        name: /previous/i,
      });
      await userEvent.click(previousMonthButton);
      await userEvent.click(previousMonthButton);
      await userEvent.click(previousMonthButton);

      expect(
        screen.getByRole('cell', {
          name: /5 어린이날/i,
        }),
      );
    });
  });

  describe('일정 충돌 감지', () => {
    it('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);

      await userEvent.type(
        screen.getByRole('textbox', { name: /제목/i }),
        '신규 이벤트',
      );
      await userEvent.type(screen.getByLabelText('날짜'), '2024-08-20');
      await userEvent.type(screen.getByLabelText('시작 시간'), '10:00');
      await userEvent.type(screen.getByLabelText('종료 시간'), '11:00');
      await userEvent.type(
        screen.getByRole('textbox', { name: /설명/i }),
        '신규 이벤트 설명',
      );

      await userEvent.click(
        screen.getByRole('button', {
          name: '일정 추가',
        }),
      );

      expect(
        await screen.findByText(
          /다음 일정과 겹칩니다:계속 진행하시겠습니까\?/i,
        ),
      );
    });
    it('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다', async () => {
      render(<App />);

      await addNewEventAsync();
      const eventCardList = await screen.findAllByRole('listitem');
      const newEventCard = eventCardList[2];
      expect(await within(newEventCard).findByText('신규 이벤트'));

      const modifyButton = within(newEventCard).getByRole('button', {
        name: /edit event/i,
      });
      await userEvent.click(modifyButton);
      await userEvent.clear(screen.getByLabelText(/날짜/i));
      await userEvent.type(screen.getByLabelText(/날짜/i), '2024-08-20');

      await userEvent.clear(screen.getByLabelText(/시작 시간/i));
      await userEvent.type(screen.getByLabelText(/시작 시간/i), '10:00');

      await userEvent.clear(screen.getByLabelText(/종료 시간/i));
      await userEvent.type(screen.getByLabelText(/종료 시간/i), '11:00');

      const modifyConfirmButton = screen.getByRole('button', {
        name: '일정 수정',
      });
      await userEvent.click(modifyConfirmButton);

      expect(
        await screen.findByText(
          /다음 일정과 겹칩니다:계속 진행하시겠습니까\?/i,
        ),
      );
    });
  });
});
