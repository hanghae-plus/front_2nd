import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import App from "../App";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { mockApiHandlers } from "../mockApiHandlers";

const server = setupServer(...mockApiHandlers);

const addEvent = async ({
  title,
  date,
  startTime,
  endTime,
  description = "",
  location = "",
  category = "업무",
}: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
  category?: string;
}): Promise<void> => {
  await userEvent.type(screen.getByLabelText("제목"), title);
  await userEvent.type(screen.getByLabelText("날짜"), date);
  await userEvent.type(screen.getByLabelText("시작 시간"), startTime);
  await userEvent.type(screen.getByLabelText("종료 시간"), endTime);
  if (description)
    await userEvent.type(screen.getByLabelText("설명"), description);
  if (location) await userEvent.type(screen.getByLabelText("위치"), location);
  await userEvent.selectOptions(screen.getByLabelText("카테고리"), category);
  await userEvent.click(screen.getByTestId("event-submit-button"));
};

describe("일정 관리 애플리케이션 통합 테스트", () => {
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
    cleanup();
  });
  afterAll(() => {
    server.close();
  });

  describe("일정 CRUD 및 기본 기능", () => {
    test("새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다", async () => {
      render(<App />);

      // 입력 필드들을 찾아 값을 입력합니다
      await addEvent({
        title: "테스트 일정1",
        date: "2024-08-01",
        startTime: "09:00",
        endTime: "10:00",
        description: "테스트 설명",
        location: "테스트 장소",
        category: "업무",
      });

      // 일정 추가 버튼 클릭
      const submitButton = screen.getByTestId("event-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        // 일정 목록 확인
        const eventList = screen.getByTestId("event-list");

        expect(eventList).toHaveTextContent("테스트 일정1");
        expect(eventList).toHaveTextContent("2024-08-01 09:00 - 10:00");
        expect(eventList).toHaveTextContent("테스트 설명");
        expect(eventList).toHaveTextContent("테스트 장소");
        expect(eventList).toHaveTextContent("업무");
      });
    });

    test("기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다", async () => {
      render(<App />);

      await addEvent({
        title: "테스트 일정2",
        date: "2024-08-01",
        startTime: "10:30",
        endTime: "11:40",
        description: "테스트 설명",
        location: "테스트 장소",
        category: "업무",
      });

      const submitButton = screen.getByTestId("event-submit-button");
      await userEvent.click(submitButton);

      const eventList = screen.getByTestId("event-list");
      await waitFor(() => {
        expect(eventList).toHaveTextContent("테스트 일정2");
      });

      const editButtons = await screen.findAllByLabelText("Edit event");
      await userEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText("제목")).toBeInTheDocument();
      });
      await userEvent.type(screen.getByLabelText("제목"), "수정된 Test 일정");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(eventList).toHaveTextContent("수정된 Test 일정");
      });
    });

    test("일정을 삭제하고 더 이상 조회되지 않는지 확인한다", async () => {
      render(<App />);

      await addEvent({
        title: "테스트 일정3",
        date: "2024-08-01",
        startTime: "12:00",
        endTime: "13:00",
        description: "테스트 설명",
        location: "테스트 장소",
        category: "업무",
      });

      const submitButton = screen.getByTestId("event-submit-button");
      await userEvent.click(submitButton);

      const eventList = screen.getByTestId("event-list");
      await waitFor(() => {
        expect(eventList).toHaveTextContent("테스트 일정3");
      });

      const editButtons = await screen.findAllByLabelText("Delete event");
      await userEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(eventList).not.toHaveTextContent("수정된 Test 일정");
      });
    });
  });

  describe("일정 뷰 및 필터링", () => {
    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      render(<App />);

      // 주별 뷰로 변경
      const calenderTypeOption = screen.getByTestId("calender-type-select");
      await userEvent.selectOptions(calenderTypeOption, "week");

      // 주별 뷰가 렌더링될 때까지 대기
      await waitFor(() => {
        expect(screen.getByTestId("week-view")).toBeInTheDocument();
      });

      const calenderNextButton = screen.getByTestId("calender-next-button");
      await userEvent.click(calenderNextButton);

      // 모든 날짜 셀을 가져옴
      const dates = screen.getAllByRole("cell");

      // 각 날짜 셀에 일정이 없는지 확인
      dates.forEach((date) => {
        const eventBoxes = date.querySelectorAll("event-box");
        expect(eventBoxes.length).toBe(0);
      });

      // 일정 목록이 비어있는지 확인
      const eventList = screen.getByTestId("event-list");
      expect(eventList).toHaveTextContent("검색 결과가 없습니다.");
    });

    test("주별 뷰에 일정이 지정된 날짜에 맞게 표시되는지 확인한다", async () => {
      render(<App />);

      // 주별 뷰로 변경
      const calenderTypeOption = screen.getByTestId("calender-type-select");
      await userEvent.selectOptions(calenderTypeOption, "week");

      // 일정 추가
      await addEvent({
        title: "주간 테스트 일정",
        date: "2024-08-10",
        startTime: "10:00",
        endTime: "11:00",
      });
      await userEvent.click(screen.getByTestId("event-submit-button"));

      // 주별 뷰가 렌더링될 때까지 대기
      await waitFor(() => {
        expect(screen.getByTestId("week-view")).toBeInTheDocument();
      });

      // 2024-08-10이 포함된 주로 이동
      while (!screen.queryByText("2024년 8월 1주")) {
        await userEvent.click(screen.getByTestId("calender-next-button"));
      }

      // 해당 날짜의 셀을 찾아 일정이 표시되는지 확인
      const dateCell = screen
        .getAllByRole("cell")
        .find((cell) => cell.textContent?.includes("10"));
      expect(dateCell).toHaveTextContent("주간 테스트 일정");
    });

    test("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      render(<App />);

      const viewSelect = screen.getByLabelText("view");
      await userEvent.selectOptions(viewSelect, "Month");

      const monthView = screen.getByTestId("month-view");
      const nextMonthButton = screen.getByLabelText("Next");

      // 최대 12개월까지만 확인 (무한 루프 방지)
      for (let i = 0; i < 12; i++) {
        const cells = monthView.querySelectorAll("td");
        const hasEvent = Array.from(cells).some((cell) =>
          cell.querySelector("div")
        );

        // 이벤트가 없는 월을 찾았으므로 테스트 종료
        if (!hasEvent) break;
        // 마지막 반복에서는 다음 달로 이동하지 않음
        if (i < 11) await userEvent.click(nextMonthButton);
      }

      const eventList = screen.getByTestId("event-list");
      expect(eventList).toHaveTextContent("검색 결과가 없습니다.");
    });

    test("월별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      render(<App />);

      // 월별 뷰로 변경
      const calenderTypeOption = screen.getByTestId("calender-type-select");
      await userEvent.selectOptions(calenderTypeOption, "month");

      // 일정 추가
      await addEvent({
        title: "월간 테스트 일정",
        date: "2024-09-15",
        startTime: "14:00",
        endTime: "15:00",
      });
      await userEvent.click(screen.getByTestId("event-submit-button"));

      // 월별 뷰가 렌더링될 때까지 대기
      await waitFor(() => {
        expect(screen.getByTestId("month-view")).toBeInTheDocument();
      });

      // 2024년 9월로 이동
      while (!screen.queryByText("2024년 9월")) {
        await userEvent.click(screen.getByTestId("calender-next-button"));
      }

      // 15일 셀 찾기
      const dateCell = screen
        .getAllByRole("cell")
        .find((cell) => cell.textContent?.includes("15"));

      // 해당 날짜의 셀에 일정이 표시되는지 확인
      expect(dateCell).toHaveTextContent("월간 테스트 일정");
    });
  });

  describe("알림 기능", () => {
    test("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      render(<App />);
      const now = new Date("2024-07-15");
      vi.setSystemTime(now);
      // 5분 후의 일정 생성
      const eventAfterTime = new Date(now.getTime() + 5 * 60 * 1000);
      const eventDate = eventAfterTime.toISOString().split("T")[0];
      const eventTime = eventAfterTime.toTimeString().slice(0, 5);
      // 일정 생성
      await userEvent.type(screen.getByLabelText("제목"), "테스트 타이머");
      await userEvent.type(screen.getByLabelText("날짜"), eventDate);
      await userEvent.type(screen.getByLabelText("시작 시간"), eventTime);
      await userEvent.type(
        screen.getByLabelText("종료 시간"),
        new Date(eventAfterTime.getTime() + 60 * 60 * 1000)
          .toTimeString()
          .slice(0, 5)
      );
      await userEvent.type(screen.getByLabelText("설명"), "테스트 설명");
      await userEvent.selectOptions(screen.getByLabelText("알림 설정"), "1");
      const submitButton = screen.getByTestId("event-submit-button");
      await userEvent.click(submitButton);
      // 알림 발생 1초 전으로 시간 이동
      vi.advanceTimersByTime(4 * 60 * 1000 - 1000);
      // 추가 1초
      vi.advanceTimersByTime(1000);
      // 알림이 표시되었는지 확인
      await waitFor(
        () => {
          const alert = screen.queryAllByText(
            /1분 후 테스트 타이머 일정이 시작됩니다/
          );
          expect(alert).toBeTruthy();
          expect(alert[0]).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
      vi.useRealTimers();
    });
  });

  describe("검색 기능", () => {
    test("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다", async () => {
      render(<App />);

      // 입력 필드들을 찾아 값을 입력합니다
      await addEvent({
        title: "테스트 검색 일정",
        date: "2024-08-15",
        startTime: "09:00",
        endTime: "10:00",
        description: "설명 검색",
        location: "테스트 장소",
        category: "업무",
      });
      // 일정 추가 버튼 클릭
      const submitButton = screen.getByTestId("event-submit-button");
      await userEvent.click(submitButton);

      const searchInput = screen.getByPlaceholderText("검색어를 입력하세요");
      await userEvent.type(searchInput, "테스트 검색 일정");

      await waitFor(() => {
        const eventList = screen.getByTestId("event-list");
        expect(eventList).toHaveTextContent("테스트 검색 일정");
      });
    });

    test("설명으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다", async () => {
      render(<App />);

      // 입력 필드들을 찾아 값을 입력합니다
      await addEvent({
        title: "테스트 검색 일정",
        date: "2024-08-15",
        startTime: "09:00",
        endTime: "10:00",
        description: "설명 검색",
        location: "테스트 장소",
        category: "업무",
      });

      // 일정 추가 버튼 클릭
      const submitButton = screen.getByTestId("event-submit-button");
      await userEvent.click(submitButton);

      const searchInput = screen.getByPlaceholderText("검색어를 입력하세요");
      await userEvent.type(searchInput, "설명 검색");

      await waitFor(() => {
        const eventList = screen.getByTestId("event-list");
        expect(eventList).toHaveTextContent("설명 검색");
      });
    });

    test("검색어를 지우면 모든 일정이 다시 표시되어야 한다", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(new Date("2024-07-15"));

      render(<App />);

      // 테스트를 위한 일정 추가
      await addEvent({
        title: "점심 약속",
        date: "2024-07-15",
        startTime: "12:00",
        endTime: "13:00",
      });

      await addEvent({
        title: "회의",
        date: "2024-07-15",
        startTime: "14:00",
        endTime: "15:00",
      });

      const eventList = screen.getByTestId("event-list");
      const searchInput = screen.getByLabelText(/일정 검색/);

      // 초기 상태 확인
      expect(eventList).toHaveTextContent("점심 약속");
      expect(eventList).toHaveTextContent("회의");

      // 검색어 입력
      await userEvent.type(searchInput, "점심 약속");

      await waitFor(() => {
        expect(eventList).toHaveTextContent("점심 약속");
        expect(eventList).not.toHaveTextContent("회의");
      });

      // 검색어 지우기
      await userEvent.clear(searchInput);

      // 모든 일정이 다시 표시되는지 확인
      await waitFor(() => {
        expect(eventList).toHaveTextContent("점심 약속");
        expect(eventList).toHaveTextContent("회의");
        expect(eventList).not.toHaveTextContent("검색 결과가 없습니다.");
      });

      vi.useRealTimers();
    });
  });

  describe("공휴일 표시", () => {
    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", async () => {
      render(<App />);

      // 월별 뷰로 변경
      const calenderTypeOption = screen.getByTestId("calender-type-select");
      await userEvent.selectOptions(calenderTypeOption, "month");

      // 2024년 1월로 이동
      while (!screen.queryByText("2024년 1월")) {
        await userEvent.click(screen.getByTestId("calender-prev-button"));
      }

      // 1일 셀 찾기
      const firstDayCell = screen
        .getAllByRole("cell")
        .find((cell) => cell.textContent?.includes("1"));

      // 신정이 표시되는지 확인
      expect(firstDayCell).toHaveTextContent("신정");
      expect(firstDayCell).toHaveTextContent("1");
    });
    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", async () => {
      render(<App />);

      // 2024년 5월로 이동
      while (!screen.queryByText("2024년 5월")) {
        await userEvent.click(screen.getByTestId("calender-prev-button"));
      }

      // 5일 셀 찾기
      const firstDayCell = screen
        .getAllByRole("cell")
        .find((cell) => cell.textContent?.includes("5"));

      // 신정이 표시되는지 확인
      expect(firstDayCell).toHaveTextContent("어린이날");
      expect(firstDayCell).toHaveTextContent("5");
    });
  });

  describe("일정 충돌 감지", () => {
    test("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다", async () => {
      render(<App />);

      // 첫 번째 일정 추가
      await addEvent({
        title: "일정 1",
        date: "2024-08-02",
        startTime: "09:00",
        endTime: "10:00",
      });
      await userEvent.click(screen.getByTestId("event-submit-button"));

      // 겹치는 두 번째 일정 추가
      await addEvent({
        title: "일정 2",
        date: "2024-08-02",
        startTime: "09:30",
        endTime: "10:30",
      });
      await userEvent.click(screen.getByTestId("event-submit-button"));

      // 경고 메시지 확인
      expect(screen.getByText("일정 겹침 경고")).toBeInTheDocument();
    });

    test("기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다", async () => {
      render(<App />);

      // 세 번째 일정 추가
      await addEvent({
        title: "일정 3",
        date: "2024-08-02",
        startTime: "11:00",
        endTime: "12:00",
      });

      // 일정 추가 버튼 클릭
      const submitButton = screen.getByTestId("event-submit-button");
      await userEvent.click(submitButton);

      await waitFor(() => {
        // 일정 목록 확인
        const eventList = screen.getByTestId("event-list");
        expect(eventList).toHaveTextContent("일정 3");
      });

      // 네 번째 일정 추가
      await addEvent({
        title: "일정 4",
        date: "2024-08-02",
        startTime: "13:00",
        endTime: "14:00",
      });

      // 일정 추가 버튼 클릭
      await userEvent.click(submitButton);

      await waitFor(() => {
        // 일정 목록 확인
        const eventList = screen.getByTestId("event-list");
        expect(eventList).toHaveTextContent("일정 4");
      });

      const editButtons = await screen.findAllByLabelText("Edit event");
      await userEvent.click(editButtons[0]);

      // 입력 필드들을 찾아 값을 입력합니다
      await userEvent.type(screen.getByLabelText("시작 시간"), "11:00");
      await userEvent.type(screen.getByLabelText("종료 시간"), "12:00");

      // 일정 추가 버튼 클릭
      await userEvent.click(submitButton);

      // 경고 메시지 확인
      expect(screen.getByText("일정 겹침 경고")).toBeInTheDocument();
    });
  });
});
