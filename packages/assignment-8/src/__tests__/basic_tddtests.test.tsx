import { setupServer } from "msw/node";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { createHandlers, initialMockEvents } from "../mockApiHandlers";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import App from "../App";

const server = setupServer(...createHandlers(initialMockEvents));

beforeAll(() => {
  server.listen();
});
beforeEach(() => {
  vi.setSystemTime(new Date('2024-07-01'));
  server.use(...createHandlers(initialMockEvents));
})
afterEach(() => {
  vi.clearAllMocks();
  server.resetHandlers();
});
afterAll(() => {
  server.close();
  vi.resetAllMocks();
})

describe("일정 관리 애플리케이션 추가 요청사항에 대한 통합 테스트", () => {
  let user: UserEvent;

  const fillRequired = async () => {
    const titleInput = await screen.findByLabelText('제목');
    await user.clear(titleInput);
    await user.type(titleInput, '새 일정');

    const dateInput = screen.getByLabelText('날짜');
    await user.clear(dateInput);
    await user.type(dateInput, '2024-07-27');

    const startTimeInput = screen.getByLabelText('시작 시간');
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '13:00');

    const endTimeInput = screen.getByLabelText('종료 시간');
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '15:00');
  }

  const submit = async () => {
    const submitBtn = await screen.findByTestId("event-submit-button");
    await user.click(submitBtn);
  }

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe("반복 유형 선택: 일정 생성 또는 수정 시 반복 유형을 선택할 수 있다.", () => {
    test("일정 생성 시 반복 설정에서 '매월'을 선택할 수 있다.", async () => {
      render(<App/>);

      await user.click(screen.getByLabelText('반복 설정'));

      const repeatTypeInput = await screen.findByLabelText('반복 유형');

      await user.selectOptions(repeatTypeInput, '매월');
      
      expect(await screen.findByText('매월')).toBeInTheDocument();
    })
    test("일정 수정 시 반복 설정에서 '매년'을 선택할 수 있다.", async () => {
      render(<App/>);

      const editBtns = await screen.findAllByRole("button", {
        name: "Edit event",
      });
      await user.click(editBtns[0]);

      expect(await screen.findByText('매주')).toBeInTheDocument(); // 기존 데이터 확인

      const repeatTypeInput = screen.getByLabelText('반복 유형');
      await user.selectOptions(repeatTypeInput, '매년');
      
      expect(await screen.findByText('매년')).toBeInTheDocument();
    })
  })

  describe("반복 간격 설정: 각 반복 유형에 대해 간격을 설정할 수 있다.", () => {
    test("반복 간격 추가: 5년마다", async () => {
      render(<App/>);

      await waitFor(() => {
        expect(screen.queryByText(/반복: 5년마다/i)).toEqual(null);
      })

      await fillRequired();
      
      const repeatCheck = await screen.findByLabelText('반복 설정');
      await user.click(repeatCheck);

      const repeatType = await screen.findByLabelText('반복 유형');
      await user.selectOptions(repeatType, '매년');

      const repeatInterval = await screen.findByLabelText('반복 간격');
      await user.clear(repeatInterval);
      await user.type(repeatInterval, '5')

      await submit();

      expect(await screen.findByText(/반복: 5년마다/i)).toBeInTheDocument();
    })
    test("반복 간격 수정: 1주 -> 3주마다", async () => {
      render(<App/>);

      const eventItem = await screen.findByTestId('listitem_1'); // 팀 회의 일정 선택

      expect(within(eventItem).getByText(/반복: 1주마다/i)).toBeInTheDocument(); // 기존 데이터 확인

      const editBtn = await within(eventItem).findByRole("button", {
        name: "Edit event",
      });
      await user.click(editBtn);

      const repeatInterval = await screen.findByLabelText('반복 간격');
      await user.clear(repeatInterval);
      await user.type(repeatInterval, '3')

      await submit();

      expect(await within(eventItem).findByText(/반복: 3주마다/i)).toBeInTheDocument();
    })
    test("반복 간격 수정: X -> 2일마다", async () => {
      render(<App/>);

      const eventItem = await screen.findByTestId('listitem_2'); // 점심 약속 일정 선택

      expect(screen.queryByLabelText('반복 간격')).toEqual(null); // 반복 설정 없는 것 확인

      const editBtn = await within(eventItem).findByRole("button", {
        name: "Edit event",
      });
      await user.click(editBtn);

      const repeatCheck = await screen.findByLabelText('반복 설정');
      await user.click(repeatCheck);
      
      const repeatInterval = await screen.findByLabelText('반복 간격');
      await user.clear(repeatInterval);
      await user.type(repeatInterval, '2');

      await submit();

      expect(await within(eventItem).findByText(/반복: 2일마다/i)).toBeInTheDocument();
    })
  })

  describe("반복 일정 표시: 캘린더 뷰에서 반복 일정을 시각적으로 구분하여 표시한다.", () => {
    test("매주 반복되는 일정: 일정 시작한 주차부터 표시(이전 주차 미표시)", async () => {
      render(<App/>);

      const monthView = await screen.findByTestId('month-view');

      expect(within(monthView).getByText('2024년 7월')).toBeInTheDocument();
      expect(within(monthView).queryAllByText('팀 회의').length).toBe(2); // 7월에 2개 표시
    })
    test("매주 반복되는 일정: 일정 시작한 다음달은 모든 주차에 표시", async () => {
      vi.setSystemTime(new Date('2024-08-01'));
      render(<App/>);

      const monthView = await screen.findByTestId('month-view');

      expect(within(monthView).getByText('2024년 8월')).toBeInTheDocument();
      expect(within(monthView).queryAllByText('팀 회의').length).toBe(5); // 8월에 5개 표시
    })
    test("매년 반복되는 일정: 전년도 미표시", async () => {
      vi.setSystemTime(new Date('2023-07-01'));
      render(<App/>);

      const monthView = await screen.findByTestId('month-view');

      expect(within(monthView).getByText('2023년 7월')).toBeInTheDocument();
      expect(within(monthView).queryByText('생일 파티')).not.toBeInTheDocument(); // 23년에 미표시
    })
    test("매년 반복되는 일정: 다음연도 표시", async () => {
      vi.setSystemTime(new Date('2025-07-01'));
      render(<App/>);

      const monthView = await screen.findByTestId('month-view');

      expect(within(monthView).getByText('2025년 7월')).toBeInTheDocument();
      expect(within(monthView).getByText('생일 파티')).toBeInTheDocument(); // 25년에 표시
    })
  })

  describe("예외 날짜 처리", () => {
    test("반복 일정 중 특정 날짜를 제외할 수 있다.", async () => {
      vi.setSystemTime(new Date('2024-09-01')); // 반복 일정만 가져오도록 9월로 이동
      render(<App/>);

      const monthView = await screen.findByTestId('month-view');

      expect(within(monthView).getByText('2024년 9월')).toBeInTheDocument();

      const listItem1 = screen.getByTestId('listitem_1_1');
      const listItem2 = screen.getByTestId('listitem_1_2');
      expect(within(listItem1).getByText(/2024-09-14 10:00 - 11:00/)).toBeInTheDocument(); // 반복 일정 확인
      expect(within(listItem2).getByText(/2024-09-21 10:00 - 11:00/)).toBeInTheDocument(); // 반복 일정 확인

      const deleteBtn = within(listItem2).getByRole("button", {
        name: "Delete event",
      });
      await user.click(deleteBtn);

      await waitFor(() => {
        expect(within(listItem2).queryByText(/2024-09-21 10:00 - 11:00/)).not.toBeInTheDocument(); // 반복 일정 삭제 확인
      })
    })
    // test.fails("반복 일정 중 특정 날짜의 일정을 수정할 수 있다.") // => 특정 날짜 일정을 수정하려면 RepeatInfo에 추가 값 필요
  })

  describe('반복 종료 조건', () => {
    test('특정 날짜로 반복 종료 조건을 지정할 수 있다.', async () => {
      vi.setSystemTime(new Date('2024-08-05'));
      render(<App/>);

      await fillRequired();

      const repeatCheck = await screen.findByLabelText('반복 설정');
      await user.click(repeatCheck); // 반복 체크 후 다른 값 변경 안하면 매일 반복

      const repeatEndInput = await screen.findByLabelText('반복 종료일');
      await user.clear(repeatEndInput);
      await user.type(repeatEndInput, '2024-08-05'); // 종료일 8/5로 설정

      await submit();

      expect(await screen.findByText(/2024-08-05 13:00 - 15:00/)).toBeInTheDocument(); // 종료일까지 데이터 존재
      expect(screen.queryByText(/2024-08-06 13:00 - 15:00/)).not.toBeInTheDocument(); // 종료일 이후부터 데이터 없음
    })
  })
  
  describe('반복 일정 수정', () => {
    test('반복 일정의 모든 일정을 수정할 수 있다.', async () => {
      vi.setSystemTime(new Date('2024-08-05'));
      render(<App/>);

      const searchInput = await screen.findByPlaceholderText(/검색어를 입력하세요/);
      await user.clear(searchInput);
      await user.type(searchInput, '팀 회의')

      expect(screen.queryAllByText(/회의실 A/).length).not.toBe(0); // 모든 반복 일정의 장소는 회의실 A
      expect(screen.queryAllByText(/회의실 B/).length).toBe(0); // 회의실 B 데이터 없음
      
      const eventItem = screen.getByTestId('listitem_1_2');
      const editBtn = await within(eventItem).findByRole("button", {
        name: "Edit event",
      });
      await user.click(editBtn);

      const locationInput = await screen.findByLabelText('위치');
      await user.clear(locationInput);
      await user.type(locationInput, '회의실 B');
      
      await submit();
      
      waitFor(() => {
        expect(screen.queryAllByText(/회의실 B/).length).not.toBe(0); // 모든 반복 일정의 장소 회의실 B로 변경
        expect(screen.queryAllByText(/회의실 A/).length).toBe(0); // 회의실 A 데이터 없음
      })
    })
  })
})
/*
1. (필수) 반복 유형 선택: 완료
    - 일정 생성 또는 수정 시 반복 유형을 선택할 수 있다.
    - 반복 유형은 다음과 같다: 매일, 매주, 매월, 매년
2. (필수) 반복 간격 설정: 완료
    - 각 반복 유형에 대해 간격을 설정할 수 있다.
    - 예: 2일마다, 3주마다, 2개월마다 등
3. (필수) 반복 일정 표시: 완료
    - 캘린더 뷰에서 반복 일정을 시각적으로 구분하여 표시한다.
4. 예외 날짜 처리: 일부 완료(특정 날짜 제외)
    - 반복 일정 중 특정 날짜를 제외할 수 있다. - 완료
    - 반복 일정 중 특정 날짜의 일정을 수정할 수 있다.
      - Event type에 추가한 excludeDates를 확장해 {date, type:'DEL'|'PUT', newData?} 
        형식으로 사용하면 구현되지않을까
5. 반복 종료 조건: 일부 완료(특정 날짜까지/종료 없음)
    - 반복 종료 조건을 지정할 수 있다.
    - 옵션: 특정 날짜까지, 특정 횟수만큼, 또는 종료 없음
      - select를 통해 조건을 입력받고 입력받은 조건에 따라 date/number 입력받거나 종료하지 않게 설정
      - utils.ts의 generateEventInstances()에서 count를 활용해 endDate로 break한 것 처럼 
        RepeatInfo에 endCount?를 추가해 break하면 구현되지않을까
6. 요일 지정 (주간 반복의 경우): X
    - 주간 반복 시 특정 요일을 선택할 수 있다.
      - select를 통해 요일을 입력받아 date 지정하면 구현되지않을까
7. 월간 반복 옵션: X
    - 매월 특정 날짜에 반복되도록 설정할 수 있다.
      - 6번과 동일
    - 매월 특정 순서의 요일에 반복되도록 설정할 수 있다.
      - weekView에서 n주차를 출력하는 로직을 활용하면 구현되지않을까
8. 반복 일정 수정: 일부 완료(모든 일정 수정)
    - 반복 일정의 단일 일정을 수정할 수 있다.
      - 4번과 동일?
    - 반복 일정의 모든 일정을 수정할 수 있다. - 완료
 */