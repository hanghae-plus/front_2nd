import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { ReactNode } from "react";
import { events } from "../mockApiHandlers";

const setup = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  return {
    user,
    ...render(component),
  };
};

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe("일정 CRUD 및 기본 기능", () => {
    test("초기 일정 목록이 올바르게 렌더링 되어 목록에 노출된다.", async () => {
      // 테스트를 위한 환경 (렌더링)
      setup(<App />);

      // 검증하고자 하는 동작
      // API 호출과 렌더링이 완료될 때까지 기다리고, 요소를 반환받음
      const eventListElement = await waitFor(() => {
        const element = screen.getByTestId("event-list");
        expect(element).toBeInTheDocument();
        return element;
      });

      // 검증
      expect(eventListElement).toHaveTextContent("팀 회의");
      expect(eventListElement).toHaveTextContent("2024-07-20");
      expect(eventListElement).toHaveTextContent("10:00");
      expect(eventListElement).toHaveTextContent("11:00");
      expect(eventListElement).toHaveTextContent("주간 팀 미팅");
    });

    test("새로운 일정을 생성하면 목록에 추가된다.", async () => {
      // 테스트를 위한 환경 (렌더링)
      const { user } = setup(<App />);

      // 폼 필드 입력
      const titleInput = screen.getByLabelText("제목");
      const dateInput = screen.getByLabelText("날짜");
      const startTimeInput = screen.getByLabelText("시작 시간");
      const endTimeInput = screen.getByLabelText("종료 시간");

      await user.type(titleInput, "새 일정");
      await user.type(dateInput, "2024-07-30");
      await user.type(startTimeInput, "14:00");
      await user.type(endTimeInput, "15:00");

      // 폼 제출
      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      // 새로운 일정이 목록에 추가되었는지 확인
      await waitFor(() => {
        const eventListElement = screen.getByTestId("event-list");
        expect(eventListElement).toHaveTextContent("새 일정");
        expect(eventListElement).toHaveTextContent("2024-07-30");
        expect(eventListElement).toHaveTextContent("14:00");
        expect(eventListElement).toHaveTextContent("15:00");
      });
    });

    test("기존 일정을 수정하면 수정된 일정이 목록에 노출된다.", async () => {
      // 테스트를 위한 환경 (렌더링)
      const { user } = setup(<App />);

      // 기존 일정 로드 대기
      await waitFor(() => {
        expect(screen.getByTestId("event-list")).toBeInTheDocument();
      });

      // id가 1인 일정의 수정 버튼 찾기
      const eventList = await screen.findByTestId("event-list");
      const targetEventBox = await within(eventList).findByTestId("event-1");
      const targetEditButton =
        within(targetEventBox).getByLabelText("Edit event");

      await user.click(targetEditButton);

      // 폼 필드가 기존 데이터로 채워져 있는지 확인
      expect(screen.getByDisplayValue("팀 회의")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-07-20")).toBeInTheDocument();

      // 일정 정보 수정
      const titleInput = screen.getByLabelText("제목");
      const dateInput = screen.getByLabelText("날짜");
      const descriptionInput = screen.getByLabelText("설명");

      await user.clear(titleInput);
      await user.type(titleInput, "수정된 팀 회의");
      await user.clear(dateInput);
      await user.type(dateInput, "2024-07-21");
      await user.clear(descriptionInput);
      await user.type(descriptionInput, "주간 팀 미팅 // 이번 주만 일정 변경");

      // 수정된 폼 제출
      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      // 수정된 일정이 목록에 반영되었는지 확인
      await waitFor(() => {
        const eventList = screen.getByTestId("event-list");
        const updatedEventBox = within(eventList).getByTestId("event-1");
        expect(updatedEventBox).toHaveTextContent("수정된 팀 회의");
        expect(updatedEventBox).toHaveTextContent("2024-07-21");
        expect(updatedEventBox).toHaveTextContent(
          "주간 팀 미팅 // 이번 주만 일정 변경"
        );
      });
    });

    test("기존 일정을 삭제하면 해당 일정이 목록에서 사라진다", async () => {
      // 테스트를 위한 환경 (렌더링)
      const { user } = setup(<App />);

      // 기존 일정 로드 대기
      await waitFor(() => {
        expect(screen.getByTestId("event-list")).toBeInTheDocument();
      });

      // id가 2인 일정 찾기
      const eventList = screen.getByTestId("event-list");
      const targetEventBox = within(eventList).getByTestId("event-2");
      expect(targetEventBox).toBeInTheDocument();

      // 해당 항목의 삭제 버튼 찾아 클릭
      const deleteButton =
        within(targetEventBox).getByLabelText("Delete event");
      await user.click(deleteButton);

      // event-list 내에 id가 2인 항목이 없는지 확인
      await waitFor(() => {
        const deletedEvent = within(eventList).queryByTestId("event-2");
        expect(deletedEvent).not.toBeInTheDocument();
      });
    });
  });

  describe("일정 뷰 및 필터링", () => {
    test("일정 뷰 모드를 변경할 수 있다.", async () => {
      const { user } = setup(<App />);

      // 초기 상태 확인 (month view)
      await waitFor(() => {
        expect(screen.getByTestId("month-view")).toBeInTheDocument();
        expect(screen.queryByTestId("week-view")).not.toBeInTheDocument();
      });

      // view 선택 박스 찾기
      const viewSelect = screen.getByLabelText("view");
      expect(viewSelect).toBeInTheDocument();

      // week로 변경
      await user.selectOptions(viewSelect, "week");

      await waitFor(() => {
        expect(screen.getByTestId("week-view")).toBeInTheDocument();
        expect(screen.queryByTestId("month-view")).not.toBeInTheDocument();
      });

      // month로 다시 변경
      await user.selectOptions(viewSelect, "month");

      await waitFor(() => {
        expect(screen.getByTestId("month-view")).toBeInTheDocument();
        expect(screen.queryByTestId("week-view")).not.toBeInTheDocument();
      });
    });

    test("날짜를 이동할 수 있다. > 일정 뷰 모드가 month일 때, 월 변경", async () => {
      const { user } = setup(<App />);

      // 초기 상태 확인 (month view)
      const monthView = await waitFor(() => screen.getByTestId("month-view"));
      expect(monthView).toBeInTheDocument();

      // 초기 날짜 확인 (2024년 7월)
      expect(monthView).toHaveTextContent("2024년 7월");

      // 이전 달로 이동
      const prevButton = screen.getByLabelText("Previous");
      await user.click(prevButton);

      await waitFor(() => {
        expect(monthView).toHaveTextContent("2024년 6월");
      });

      // 다음 달로 두 번 이동
      const nextButton = screen.getByLabelText("Next");
      await user.click(nextButton);
      await user.click(nextButton);

      await waitFor(() => {
        expect(monthView).toHaveTextContent("2024년 8월");
      });
    });

    test("날짜를 이동할 수 있다. > 일정 뷰 모드가 week 때, 주 변경", async () => {
      const { user } = setup(<App />);

      // 초기 상태 확인 (month view)
      await waitFor(() => {
        expect(screen.getByTestId("month-view")).toBeInTheDocument();
        expect(screen.queryByTestId("week-view")).not.toBeInTheDocument();
      });

      // view 선택 박스 찾기
      const viewSelect = screen.getByLabelText("view");
      expect(viewSelect).toBeInTheDocument();

      // week로 변경
      await user.selectOptions(viewSelect, "week");

      // 뷰 상태 확인 (week view)
      const weekView = await waitFor(() => screen.getByTestId("week-view"));
      expect(weekView).toBeInTheDocument();

      // 초기 날짜 확인 (2024년 7월 1주 )
      expect(weekView).toHaveTextContent("2024년 7월 1주");

      // 이전 주로 이동
      const prevButton = screen.getByLabelText("Previous");
      await user.click(prevButton);

      await waitFor(() => {
        expect(weekView).toHaveTextContent("2024년 6월 4주");
      });

      // 다음 주로 두 번 이동
      const nextButton = screen.getByLabelText("Next");
      await user.click(nextButton);
      await user.click(nextButton);

      await waitFor(() => {
        expect(weekView).toHaveTextContent("2024년 7월 2주");
      });
    });

    test("해당 주차에 일정이 없으면, 캘린더 뷰와 목록에 이벤트 항목이 없어야 한다. ('검색 결과가 없습니다.' 문구 노출)", async () => {
      const { user } = setup(<App />);

      // month view에서 week view로 변경
      const viewSelect = screen.getByLabelText("view");
      await user.selectOptions(viewSelect, "week");

      // week-view 요소 찾기
      const weekView = await screen.findByTestId("week-view");

      // event-list 요소 찾기
      const eventList = screen.getByTestId("event-list");

      // week-view 내부의 모든 이벤트 요소 가져오기
      const eventsInWeekView = within(weekView).queryAllByTestId(/^event-\d+$/);

      // event-list 내부의 모든 이벤트 요소 가져오기
      const eventsInEventList =
        within(eventList).queryAllByTestId(/^event-\d+$/);

      // week-view에 이벤트 요소가 없어야 함
      expect(eventsInWeekView).toHaveLength(0);

      // event-list에 이벤트 요소가 없어야 함
      expect(eventsInEventList).toHaveLength(0);

      // event-list에 '검색 결과가 없습니다.' 메시지가 있어야 함
      expect(
        within(eventList).getByText("검색 결과가 없습니다.")
      ).toBeInTheDocument();
    });

    test("주별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      const { user } = setup(<App />);

      // 뷰 모드를 week로 변경
      const viewSelect = screen.getByLabelText("view");
      await user.selectOptions(viewSelect, "week");

      // week-view 요소 찾기
      const weekView = await screen.findByTestId("week-view");

      // 7월 3주차로 이동 (Next 버튼 두 번 클릭)
      const nextButton = screen.getByLabelText("Next");
      await user.click(nextButton);
      await user.click(nextButton);
      expect(weekView).toHaveTextContent("2024년 7월 3주");

      // 캘린더 셀 확인
      const cell20 = within(weekView).getByTestId("week-cell-20");
      const cell21 = within(weekView).getByTestId("week-cell-21");

      // 20일 셀 확인
      expect(cell20).toHaveTextContent("20");
      expect(within(cell20).getByTestId("event-1")).toBeInTheDocument();

      // 21일 셀 확인
      expect(cell21).toHaveTextContent("21");
      expect(within(cell21).getByTestId("event-2")).toBeInTheDocument();

      // event-list 확인
      const eventList = screen.getByTestId("event-list");
      expect(within(eventList).getByTestId("event-1")).toBeInTheDocument();
      expect(within(eventList).getByTestId("event-2")).toBeInTheDocument();

      // event-1과 event-2의 내용 확인
      const event1 = within(eventList).getByTestId("event-1");
      const event2 = within(eventList).getByTestId("event-2");

      expect(event1).toHaveTextContent("팀 회의");
      expect(event1).toHaveTextContent("2024-07-20");
      expect(event1).toHaveTextContent("10:00 - 11:00");

      expect(event2).toHaveTextContent("점심 약속");
      expect(event2).toHaveTextContent("2024-07-21");
      expect(event2).toHaveTextContent("12:30 - 13:30");
    });

    test("해당 월에 일정이 없으면, 캘린더 뷰와 목록에 이벤트 항목이 없어야 한다. ('검색 결과가 없습니다.' 문구 노출)", async () => {
      const { user } = setup(<App />);

      // month-view 요소 찾기
      const monthView = await screen.findByTestId("month-view");
      expect(monthView).toHaveTextContent("2024년 7월");

      // 이전 달로 이동
      const prevButton = screen.getByLabelText("Previous");
      await user.click(prevButton);

      await waitFor(() => {
        expect(monthView).toHaveTextContent("2024년 6월");
      });

      // event-list 요소 찾기
      const eventList = screen.getByTestId("event-list");

      // week-view 내부의 모든 이벤트 요소 가져오기
      const eventsInWeekView =
        within(monthView).queryAllByTestId(/^event-\d+$/);

      // event-list 내부의 모든 이벤트 요소 가져오기
      const eventsInEventList =
        within(eventList).queryAllByTestId(/^event-\d+$/);

      // week-view에 이벤트 요소가 없어야 함
      expect(eventsInWeekView).toHaveLength(0);

      // event-list에 이벤트 요소가 없어야 함
      expect(eventsInEventList).toHaveLength(0);

      // event-list에 '검색 결과가 없습니다.' 메시지가 있어야 함
      expect(
        within(eventList).getByText("검색 결과가 없습니다.")
      ).toBeInTheDocument();
    });

    test("월별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      setup(<App />);

      const monthView = await screen.findByTestId("month-view");
      expect(monthView).toHaveTextContent("2024년 7월");

      // 캘린더 셀 확인
      const cell20 = within(monthView).getByTestId("month-cell-20");
      const cell21 = within(monthView).getByTestId("month-cell-21");
      const cell22 = within(monthView).getByTestId("month-cell-22");
      const cell25 = within(monthView).getByTestId("month-cell-25");
      const cell28 = within(monthView).getByTestId("month-cell-28");

      // 20일 셀 확인
      expect(cell20).toHaveTextContent("20");
      expect(within(cell20).getByTestId("event-1")).toBeInTheDocument();

      // 21일 셀 확인
      expect(cell21).toHaveTextContent("21");
      expect(within(cell21).getByTestId("event-2")).toBeInTheDocument();

      // 22일 셀 확인
      expect(cell22).toHaveTextContent("22");
      expect(within(cell22).getByTestId("event-5")).toBeInTheDocument();

      // 25일 셀 확인
      expect(cell25).toHaveTextContent("25");
      expect(within(cell25).getByTestId("event-3")).toBeInTheDocument();

      // 28일 셀 확인
      expect(cell28).toHaveTextContent("28");
      expect(within(cell28).getByTestId("event-4")).toBeInTheDocument();

      // event-list 확인
      const eventList = screen.getByTestId("event-list");
      expect(within(eventList).getByTestId("event-1")).toBeInTheDocument();
      expect(within(eventList).getByTestId("event-2")).toBeInTheDocument();
      expect(within(eventList).getByTestId("event-3")).toBeInTheDocument();
      expect(within(eventList).getByTestId("event-4")).toBeInTheDocument();
      expect(within(eventList).getByTestId("event-5")).toBeInTheDocument();

      // event-1과 event-2의 내용 확인
      const event1 = within(eventList).getByTestId("event-1");
      const event2 = within(eventList).getByTestId("event-2");
      const event3 = within(eventList).getByTestId("event-3");
      const event4 = within(eventList).getByTestId("event-4");
      const event5 = within(eventList).getByTestId("event-5");

      expect(event1).toHaveTextContent("팀 회의");
      expect(event1).toHaveTextContent("2024-07-20");
      expect(event1).toHaveTextContent("10:00 - 11:00");

      expect(event2).toHaveTextContent("점심 약속");
      expect(event2).toHaveTextContent("2024-07-21");
      expect(event2).toHaveTextContent("12:30 - 13:30");

      expect(event3).toHaveTextContent("프로젝트 마감");
      expect(event3).toHaveTextContent("2024-07-25");
      expect(event3).toHaveTextContent("09:00 - 18:00");

      expect(event4).toHaveTextContent("생일 파티");
      expect(event4).toHaveTextContent("2024-07-28");
      expect(event4).toHaveTextContent("19:00 - 22:00");

      expect(event5).toHaveTextContent("운동");
      expect(event5).toHaveTextContent("2024-07-22");
      expect(event5).toHaveTextContent("18:00 - 19:00");
    });
  });

  describe.skip("알림 기능", () => {
    beforeEach(() => {
      // events 배열에 접근
      const event6 = events.find((event: any) => event.id === 6);

      if (!event6) {
        throw new Error("Event with id 6 not found");
      }

      const eventDate = new Date(`${event6.date}T${event6.startTime}`);
      const tenMinutesBefore = new Date(eventDate.getTime() - 10 * 60 * 1000);

      // 시스템 시간을 이벤트 시작 10분 전으로 설정
      vi.setSystemTime(tenMinutesBefore);
    });

    test("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다", async () => {
      setup(<App />);

      // 알림이 나타날 때까지 기다리고 확인
      await waitFor(
        () => {
          const alertElement = screen.getByRole("alert");
          expect(alertElement).toBeInTheDocument();
          expect(alertElement).toHaveTextContent("알림 테스트");
        },
        { timeout: 11000 }
      );
    });
  });

  describe.skip("검색 기능", () => {
    test("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다", async () => {
      const { user } = setup(<App />);

      // 일정 목록이 로드될 때까지 기다립니다.
      await waitFor(() => {
        expect(screen.getByTestId("event-list")).toBeInTheDocument();
      });

      // 검색 입력 필드를 찾습니다.
      const searchInput = screen.getByPlaceholderText("검색어를 입력하세요");
      expect(searchInput).toBeInTheDocument();

      // '팀' 검색어를 입력합니다.
      await user.type(searchInput, "팀");

      // 검색 결과를 확인합니다.
      await waitFor(() => {
        const eventList = screen.getByTestId("event-list");
        const eventItems = within(eventList).getAllByTestId(/^event-/);

        // 검색 결과가 하나만 있어야 합니다.
        expect(eventItems).toHaveLength(1);

        // 검색된 일정이 '팀 회의'여야 합니다.
        const eventItem = eventItems[0];
        expect(eventItem).toHaveTextContent("팀 회의");
        expect(eventItem).toHaveAttribute("data-testid", "event-1");
      });

      // 다른 일정들은 보이지 않아야 합니다.
      expect(screen.queryByText("점심 약속")).not.toBeInTheDocument();
      expect(screen.queryByText("프로젝트 마감")).not.toBeInTheDocument();
      expect(screen.queryByText("생일 파티")).not.toBeInTheDocument();
      expect(screen.queryByText("운동")).not.toBeInTheDocument();
    });
    test("검색어를 지우면 모든 일정이 다시 표시되어야 한다", async () => {
      const { user } = setup(<App />);

      // 일정 목록이 로드될 때까지 기다립니다.
      await waitFor(() => {
        expect(screen.getByTestId("event-list")).toBeInTheDocument();
      });

      // 검색 입력 필드를 찾습니다.
      const searchInput = screen.getByPlaceholderText("검색어를 입력하세요");
      expect(searchInput).toBeInTheDocument();

      // 초기 일정 개수를 확인합니다.
      const initialEventCount = within(
        screen.getByTestId("event-list")
      ).getAllByTestId(/^event-/).length;

      // '팀' 검색어를 입력합니다.
      await user.type(searchInput, "팀");

      // 검색 결과를 확인합니다.
      await waitFor(() => {
        const eventList = screen.getByTestId("event-list");
        const eventItems = within(eventList).getAllByTestId(/^event-/);
        expect(eventItems).toHaveLength(1);
        expect(eventItems[0]).toHaveTextContent("팀 회의");
      });

      // 검색어를 지웁니다.
      await user.clear(searchInput);

      // 모든 일정이 다시 표시되는지 확인합니다.
      await waitFor(() => {
        const eventList = screen.getByTestId("event-list");
        const eventItems = within(eventList).getAllByTestId(/^event-/);
        expect(eventItems).toHaveLength(initialEventCount);
      });

      // 특정 일정들이 다시 표시되는지 확인합니다.
      const eventList = screen.getByTestId("event-list");
      expect(within(eventList).getByText("팀 회의")).toBeInTheDocument();
      expect(within(eventList).getByText("점심 약속")).toBeInTheDocument();
      expect(within(eventList).getByText("프로젝트 마감")).toBeInTheDocument();
      expect(within(eventList).getByText("생일 파티")).toBeInTheDocument();
      expect(within(eventList).getByText("운동")).toBeInTheDocument();
    });
    test('존재하지 않는 일정 검색 시 "검색 결과가 없습니다." 메시지가 표시된다', async () => {
      const { user } = setup(<App />);

      // 일정 목록이 로드될 때까지 기다립니다.
      await waitFor(() => {
        expect(screen.getByTestId("event-list")).toBeInTheDocument();
      });

      // 검색 입력 필드를 찾습니다.
      const searchInput = screen.getByPlaceholderText("검색어를 입력하세요");
      expect(searchInput).toBeInTheDocument();

      // 존재하지 않는 일정 'abc'를 검색합니다.
      await user.type(searchInput, "abc");

      // "검색 결과가 없습니다." 메시지가 표시되는지 확인합니다.
      await waitFor(() => {
        const eventList = screen.getByTestId("event-list");
        expect(
          within(eventList).getByText("검색 결과가 없습니다.")
        ).toBeInTheDocument();
      });

      // 기존 일정들이 표시되지 않는지 확인합니다.
      const eventList = screen.getByTestId("event-list");
      expect(within(eventList).queryByText("팀 회의")).not.toBeInTheDocument();
      expect(
        within(eventList).queryByText("점심 약속")
      ).not.toBeInTheDocument();
      expect(
        within(eventList).queryByText("프로젝트 마감")
      ).not.toBeInTheDocument();
      expect(
        within(eventList).queryByText("생일 파티")
      ).not.toBeInTheDocument();
      expect(within(eventList).queryByText("운동")).not.toBeInTheDocument();

      // 검색어를 지웁니다.
      await user.clear(searchInput);

      // 모든 일정이 다시 표시되는지 확인합니다.
      await waitFor(() => {
        expect(
          within(eventList).queryByText("검색 결과가 없습니다.")
        ).not.toBeInTheDocument();
        expect(within(eventList).getByText("팀 회의")).toBeInTheDocument();
        expect(within(eventList).getByText("점심 약속")).toBeInTheDocument();
        expect(
          within(eventList).getByText("프로젝트 마감")
        ).toBeInTheDocument();
        expect(within(eventList).queryByText("생일 파티")).toBeInTheDocument();
        expect(within(eventList).queryByText("운동")).toBeInTheDocument();
      });
    });
  });

  describe.skip("공휴일 표시", () => {
    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", async () => {
      // 테스트 날짜를 24년 1월 1일로 변경
      vi.setSystemTime(new Date("2024-01-01"));

      // App을 렌더링
      setup(<App />);

      // month-view를 찾고, 그 안에서 month-cell-1을 찾는다
      const monthView = await screen.findByTestId("month-view");
      const januaryFirst = within(monthView).getByTestId("month-cell-1");

      // '신정'이라는 글자가 있는지 확인
      const holidayText = within(januaryFirst).getByText("신정");
      expect(holidayText).toBeInTheDocument();
    });
    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", async () => {
      // 테스트 날짜를 24년 5월 1일로 변경
      vi.setSystemTime(new Date("2024-05-01"));

      // App을 렌더링
      setup(<App />);

      // month-view를 찾고, 그 안에서 month-cell-5를 찾는다
      const monthView = await screen.findByTestId("month-view");
      const januaryFirst = within(monthView).getByTestId("month-cell-5");

      // '어린이날'이라는 글자가 있는지 확인
      const holidayText = within(januaryFirst).getByText("어린이날");
      expect(holidayText).toBeInTheDocument();
    });
  });

  describe.skip("일정 충돌 감지", () => {
    test("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다", async () => {
      const { user } = setup(<App />);

      // 일정 입력 필드들을 찾습니다
      const titleInput = screen.getByLabelText("제목");
      const dateInput = screen.getByLabelText("날짜");
      const startTimeInput = screen.getByLabelText("시작 시간");
      const endTimeInput = screen.getByLabelText("종료 시간");

      // 새로운 일정 정보를 입력합니다
      await user.type(titleInput, "새 회의");
      await user.type(dateInput, "2024-07-20");
      await user.type(startTimeInput, "10:30");
      await user.type(endTimeInput, "11:30");

      // 일정 등록 버튼을 클릭합니다
      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      // 경고 대화상자가 나타나는지 확인합니다
      const alertDialog = await screen.findByRole("alertdialog");
      expect(alertDialog).toBeInTheDocument();

      // 경고 대화상자에 "일정 겹침 경고" 텍스트가 있는지 확인합니다
      expect(
        within(alertDialog).getByText("일정 겹침 경고")
      ).toBeInTheDocument();

      // 충돌된 일정 정보가 표시되는지 확인합니다
      expect(alertDialog).toHaveTextContent("팀 회의");
      expect(alertDialog).toHaveTextContent("2024-07-20");
      expect(alertDialog).toHaveTextContent("10:00");
      expect(alertDialog).toHaveTextContent("11:00");
    });
    test("기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다", async () => {
      // 테스트를 위한 환경 (렌더링)
      const { user } = setup(<App />);

      // 기존 일정 로드 대기
      await waitFor(() => {
        expect(screen.getByTestId("event-list")).toBeInTheDocument();
      });

      // id가 1인 일정의 수정 버튼 찾기
      const eventList = await screen.findByTestId("event-list");
      const targetEventBox = await within(eventList).findByTestId("event-2");
      const targetEditButton =
        within(targetEventBox).getByLabelText("Edit event");

      await user.click(targetEditButton);

      // 일정 정보 수정
      const titleInput = screen.getByLabelText("제목");
      const dateInput = screen.getByLabelText("날짜");
      const startTimeInput = screen.getByLabelText("시작 시간");
      const endTimeInput = screen.getByLabelText("종료 시간");

      await user.clear(titleInput);
      await user.type(titleInput, "저녁 약속");
      await user.clear(dateInput);
      await user.type(dateInput, "2024-07-22");
      await user.clear(startTimeInput);
      await user.type(startTimeInput, "18:30");
      await user.clear(endTimeInput);
      await user.type(endTimeInput, "19:30");

      // 일정 수정 버튼 클릭
      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      // 경고 대화상자가 나타나는지 확인
      const alertDialog = await screen.findByRole("alertdialog");
      expect(alertDialog).toBeInTheDocument();

      // 경고 대화상자에 "일정 겹침 경고" 텍스트가 있는지 확인
      expect(
        within(alertDialog).getByText("일정 겹침 경고")
      ).toBeInTheDocument();

      // 충돌된 일정 정보가 표시되는지 확인
      expect(alertDialog).toHaveTextContent("운동");
      expect(alertDialog).toHaveTextContent("2024-07-22");
      expect(alertDialog).toHaveTextContent("18:00");
      expect(alertDialog).toHaveTextContent("19:00");
    });
  });
});
