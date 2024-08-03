import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { resetMockData, createHandlers } from "../__mocks__/handlers";
import { setupServer } from "msw/node";

const server = setupServer(...createHandlers);

// 테스트 시작 전에 목 서버를 실행
beforeAll(() => server.listen());

// 각 테스트 후에 요청 핸들러를 초기화
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  resetMockData();
  vi.useRealTimers();
});

// 테스트 종료 후에 목 서버 종료
afterAll(() => {
  vi.resetAllMocks();
  server.close();
  vi.useRealTimers();
});

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe("일정 CRUD 및 기본 기능", () => {
    test("새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다 > 가족 모임이라는 일정 생성 후 해당 일정이 있는지 확인", async () => {
      render(<App />);

      await userEvent.type(screen.getByLabelText("제목"), "가족 모임");
      await userEvent.type(screen.getByLabelText("날짜"), "2024-08-01");
      await userEvent.type(screen.getByLabelText("시작 시간"), "20:00");
      await userEvent.type(screen.getByLabelText("종료 시간"), "22:00");
      await userEvent.type(screen.getByLabelText("설명"), "여름 휴가관련 모임");
      await userEvent.type(screen.getByLabelText("위치"), "본가");
      await userEvent.selectOptions(screen.getByLabelText("카테고리"), "가족");

      await userEvent.click(screen.getByTestId("event-submit-button"));

      const eventList = screen.getByTestId("event-list");
      await waitFor(() => {
        expect(eventList).toHaveTextContent("가족 모임");
        expect(eventList).toHaveTextContent("2024-08-01 20:00 - 22:00");
        expect(eventList).toHaveTextContent("여름 휴가관련 모임");
        expect(eventList).toHaveTextContent("본가");
        expect(eventList).toHaveTextContent("카테고리: 가족");
      });
    });
    test("기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다 > 기존 일정 중 첫번째 일정을 수정하고 반영되는지 확인", async () => {
      render(<App />);

      const editButton = await screen.findAllByRole("button", {
        name: "Edit event",
      });
      await userEvent.click(editButton[0]);

      await userEvent.clear(screen.getByLabelText("제목"));
      await userEvent.type(screen.getByLabelText("제목"), "가족 모임(수정)");
      await userEvent.clear(screen.getByLabelText("설명"));
      await userEvent.type(
        screen.getByLabelText("설명"),
        "여름 휴가관련 모임(수정)"
      );

      await userEvent.click(screen.getByTestId("event-submit-button"));

      const eventList = screen.getByTestId("event-list");
      await waitFor(() => {
        expect(eventList).toHaveTextContent("가족 모임(수정)");
        expect(eventList).toHaveTextContent("여름 휴가관련 모임(수정)");
      });
    });
    test("일정을 삭제하고 더 이상 조회되지 않는지 확인한다 > 기존 일정 중 첫번째 일정이 삭제되고 반영되는지 확인", async () => {
      render(<App />);

      // 삭제할 일정의 제목 (첫 번째 일정)
      const eventToDeleteTitle = "외부 업체 미팅";

      const deleteButton = await screen.findAllByRole("button", {
        name: "Delete event",
      });
      await userEvent.click(deleteButton[0]);

      const eventList = screen.getByTestId("event-list");
      await waitFor(() => {
        expect(
          within(eventList).queryByText(eventToDeleteTitle)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("일정 뷰 및 필터링", () => {
    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다. > 24년 7월 1주 확인했을 때 일정이 없는지 확인", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-07-01T00:00:00Z"));

      render(<App />);

      // 주별 뷰로 변경
      await userEvent.selectOptions(screen.getByLabelText("view"), "week");

      const weekView = screen.getByTestId("week-view");
      await waitFor(() => {
        expect(
          within(weekView).queryByText(/일정 제목/)
        ).not.toBeInTheDocument();
      });
    });
    test("주별 뷰에 일정이 정확히 표시되는지 확인한다 > Mock 데이터에 생성한 8월 5일이 있는 8월 1주차에 일정이 표시되는 지 확인", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-08-05T00:00:00Z"));

      render(<App />);

      await userEvent.selectOptions(screen.getByLabelText("view"), "week");

      const weekView = await screen.findByTestId("week-view");
      expect(weekView).toBeInTheDocument();
      // 테스트 일정 데이터가 올바르게 표시되는지 확인
      await waitFor(() => {
        expect(screen.getByText("PT 수업")).toBeInTheDocument();
      });
    });
    test("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다. > 일정이 없는 24년 9월 뷰로 이동하여 일정이 표시되지 않는 지 확인", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-09-01T00:00:00Z"));
      render(<App />);

      // 월별 뷰로 변경
      await userEvent.selectOptions(screen.getByLabelText("view"), "month");

      const view = screen.getByTestId("event-list");
      await waitFor(() => {
        expect(within(view).queryByText(/일정 제목/)).not.toBeInTheDocument();
      });
    });
    test("월별 뷰에 일정이 정확히 표시되는지 확인한다 > 24년 8월 기준으로 Mock 데이터의 일정이 표시되는 지 확인", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-08-05T00:00:00Z"));
      render(<App />);

      await userEvent.selectOptions(screen.getByLabelText("view"), "month");

      const view = screen.getByTestId("event-list");
      await waitFor(() => {
        expect(within(view).getByText("PT 수업")).toBeInTheDocument();
      });
    });
  });

  describe("알림 기능", () => {
    test("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다 > 시간 설정 후 10분 알림 테스트", async () => {
      // 현재 시간을 2024-08-01 09:50:00으로 설정
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-08-01T09:50:00"));

      render(<App />);

      // 새 일정 추가
      await userEvent.type(screen.getByLabelText("제목"), "알림 테스트");
      await userEvent.type(screen.getByLabelText("날짜"), "2024-08-01");
      await userEvent.type(screen.getByLabelText("시작 시간"), "10:00");
      await userEvent.type(screen.getByLabelText("종료 시간"), "11:00");

      // 알림 설정 (10분 전)
      await userEvent.selectOptions(screen.getByLabelText("알림 설정"), "10");

      await userEvent.click(screen.getByTestId("event-submit-button"));

      // 알림이 표시되었는지 확인
      await waitFor(() => {
        expect(
          screen.getByText("10분 후 알림 테스트 일정이 시작됩니다.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("검색 기능", () => {
    test("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다 > 8월 일정 중 '수업'으로 검색했을 때 해당 결과만 나오는 지 확인", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-08-01T00:00:00Z"));
      render(<App />);

      // 일정 데이터가 로드되기를 기다립니다.
      const view = await screen.getByTestId("event-list");

      // 검색 입력 필드를 찾습니다.
      const searchInput = screen.getByLabelText(/일정 검색/);
      await userEvent.type(searchInput, "수업");

      await waitFor(() => {
        expect(view).toHaveTextContent("PT 수업");
        expect(view).not.toHaveTextContent("검색 결과가 없습니다.");
      });
    });
    test("검색어를 지우면 모든 일정이 다시 표시되어야 한다", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-08-01T00:00:00Z"));

      render(<App />);

      // 일정 데이터가 로드되기를 기다립니다.
      const view = await screen.getByTestId("event-list");

      // 검색 입력 필드를 찾습니다.
      const searchInput = screen.getByLabelText(/일정 검색/);
      await userEvent.type(searchInput, "수업");
      expect(view).toHaveTextContent("PT 수업");
      expect(view).not.toHaveTextContent("알림 테스트");

      // 검색어 지우기
      await userEvent.clear(searchInput);

      await waitFor(() => {
        expect(view).toHaveTextContent("PT 수업");
        expect(view).toHaveTextContent("알림 테스트");
      });
    });
  });

  describe("공휴일 표시", () => {
    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-01-01"));
      render(<App />);

      await userEvent.selectOptions(screen.getByLabelText("view"), "month");

      await waitFor(() => {
        const firstDay = screen.getByText("1");
        const parentElement = firstDay.closest("td");
        expect(parentElement).toHaveTextContent("신정");
      });
    });
    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-05-01"));
      render(<App />);

      await userEvent.selectOptions(screen.getByLabelText("view"), "month");

      await waitFor(() => {
        const fifthDay = screen.getByText("5");
        const parentElement = fifthDay.closest("td");
        expect(parentElement).toHaveTextContent("어린이날");
      });
    });
  });

  describe("일정 충돌 감지", () => {
    test("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다"),
      async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date("2024-07-19T09:55:00Z"));

        render(<App />);

        // 일정을 추가
        await userEvent.type(screen.getByText("제목"), "알림 테스트");
        await userEvent.type(
          screen.getByText("날짜"),
          new Date().toISOString().split("T")[0]
        );
        await userEvent.type(screen.getByText("시작 시간"), "10:00");
        await userEvent.type(screen.getByText("종료 시간"), "11:00");
        await userEvent.type(
          screen.getByText("설명"),
          "알림 테스트를 위한 새 일정"
        );
        await userEvent.type(screen.getByText("카테고리"), "개인");
        await userEvent.type(screen.getByText("위치"), "집");
        await userEvent.type(screen.getByText("알림 설정"), "4분 전");

        // 저장 버튼 클릭
        const saveButton = await screen.findByTestId("event-submit-button");
        userEvent.click(saveButton);

        //알림창이 나타나는지 확인
        await waitFor(() => {
          const alertElement = screen.getByRole("alert");
          expect(alertElement).toBeInTheDocument();
          expect(alertElement).toHaveTextContent("일정 겹침 경고");
        });
      };

    test(
      "기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다"
    ),
      async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date("2024-07-19T00:00:00Z"));

        render(<App />);

        // 첫번째 수정 버튼 클릭
        const editButtons = await screen.findAllByRole("button", {
          name: "Edit event",
        });
        const firstEditButton = editButtons[0];
        userEvent.click(firstEditButton);

        //일정 수정-강제셋팅?
        await userEvent.type(screen.getByText("제목"), "일정 충돌 테스트");
        await userEvent.type(screen.getByText("날짜"), "2024-07-19");

        //일정 수정 버튼 클릭
        const editEventButton = await screen.findByTestId(
          "event-submit-button"
        );
        userEvent.click(editEventButton);

        //알림창이 나타나는지 확인
        await waitFor(() => {
          const alertElement = screen.getByRole("alert");
          expect(alertElement).toBeInTheDocument();
          expect(alertElement).toHaveTextContent("일정 겹침 경고");
        });
      };
  });
});
