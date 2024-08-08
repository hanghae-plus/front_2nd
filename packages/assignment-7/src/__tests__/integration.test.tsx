import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import { setupServer } from "msw/node";
import { ReactNode } from "react";
import App, { Event } from "../App";
import { EventProvider } from "../hooks/useEvents";
import { mockApiHandlers, resetEvents } from "../mockApiHandlers";
import { REPEAT_TYPE_SELECTS } from "../constants/date";
import { getRepeatedEvents } from "../services/getRepeatedEvents";

const TEST_IDS = {
  eventSubmitButton: "event-submit-button",
  eventList: "event-list",
};

const server = setupServer(...mockApiHandlers);

beforeAll(() => server.listen());
afterAll(() => server.close());

const setup = (component: ReactNode) => {
  const user = userEvent.setup();

  return { user, ...render(<EventProvider>{component}</EventProvider>) };
};

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe("일정 CRUD 및 기본 기능", () => {
    beforeEach(resetEvents);
    test("새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다", async () => {
      const TEST_EVENT = {
        title: "새로운 일정",
        date: "2024-08-01",
        startTime: "14:30",
        endTime: "15:30",
        description: "새로운 일정 설명",
        location: "서울대입구역",
        category: "업무",
      };

      const { user } = setup(<App />);

      const titleInput = screen.getByRole("textbox", { name: "제목" });
      await user.type(titleInput, TEST_EVENT.title);
      expect(titleInput).toHaveValue(TEST_EVENT.title);

      const dateInput = screen.getByLabelText("날짜");
      await user.type(dateInput, TEST_EVENT.date);
      expect(dateInput).toHaveValue(TEST_EVENT.date);

      const startTimeInput = screen.getByLabelText("시작 시간");
      await user.type(startTimeInput, TEST_EVENT.startTime);
      expect(startTimeInput).toHaveValue(TEST_EVENT.startTime);

      const endTimeInput = screen.getByLabelText("종료 시간");
      await user.type(endTimeInput, TEST_EVENT.endTime);
      expect(endTimeInput).toHaveValue(TEST_EVENT.endTime);

      const descriptionInput = screen.getByLabelText("설명");
      await user.type(descriptionInput, TEST_EVENT.description);
      expect(descriptionInput).toHaveValue(TEST_EVENT.description);

      const locationInput = screen.getByLabelText("위치");
      await user.type(locationInput, TEST_EVENT.location);
      expect(locationInput).toHaveValue(TEST_EVENT.location);

      const categorySelect = screen.getByLabelText("카테고리");
      await user.selectOptions(categorySelect, TEST_EVENT.category);
      expect(categorySelect).toHaveValue(TEST_EVENT.category);

      const submitButton = screen.getByTestId(TEST_IDS.eventSubmitButton);
      await user.click(submitButton);

      [
        titleInput,
        dateInput,
        startTimeInput,
        endTimeInput,
        descriptionInput,
        locationInput,
        categorySelect,
      ].forEach((input) => {
        expect(input).toHaveValue("");
      });

      const eventList = screen.getByTestId(TEST_IDS.eventList);
      expect(eventList).toHaveTextContent(TEST_EVENT.title);
    });

    test("기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다", async () => {
      const TEST_EVENT = {
        title: "수정된 테스트 일정 1",
        date: "2024-08-02",
        startTime: "15:30",
        endTime: "16:30",
      };

      const { user } = setup(<App />);

      const eventList = screen.getByTestId(TEST_IDS.eventList);

      const eventItem = await within(eventList).findByText("테스트 일정 1");
      expect(eventItem).toBeInTheDocument();

      const [editButton] = screen.getAllByLabelText("Edit event");
      await user.click(editButton);

      const titleInput = screen.getByRole("textbox", { name: "제목" });
      await user.clear(titleInput);
      await user.type(titleInput, TEST_EVENT.title);

      const dateInput = screen.getByLabelText("날짜");
      await user.clear(dateInput);
      await user.type(dateInput, TEST_EVENT.date);

      const startTimeInput = screen.getByLabelText("시작 시간");
      await user.clear(startTimeInput);
      await user.type(startTimeInput, TEST_EVENT.startTime);

      const endTimeInput = screen.getByLabelText("종료 시간");
      await user.clear(endTimeInput);
      await user.type(endTimeInput, TEST_EVENT.endTime);

      const submitButton = screen.getByTestId(TEST_IDS.eventSubmitButton);
      await user.click(submitButton);

      expect(titleInput).toHaveValue("");
      expect(dateInput).toHaveValue("");

      expect(
        await within(eventList).findByText(TEST_EVENT.title)
      ).toBeInTheDocument();
      expect(
        await within(eventList).findByText(
          `${TEST_EVENT.date} ${TEST_EVENT.startTime} - ${TEST_EVENT.endTime}`
        )
      ).toBeInTheDocument();
    });

    test("일정을 삭제하고 더 이상 조회되지 않는지 확인한다", async () => {
      const { user } = setup(<App />);

      const eventList = screen.getByTestId(TEST_IDS.eventList);

      // 이벤트 아이템들이 비동기적으로 로드되기를 기다림
      await waitFor(() => {
        const eventItem = within(eventList).getByText("수정된 테스트 일정 1");
        expect(eventItem).toBeInTheDocument();
      });

      const [deleteButton] = screen.getAllByLabelText("Delete event");
      await user.click(deleteButton);

      expect(eventList).not.toHaveTextContent("테스트 일정 1");
    });
  });

  describe("일정 뷰 및 필터링", () => {
    beforeEach(resetEvents);
    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      // 일정이 있는 주로 설정
      vi.setSystemTime(new Date("2024-08-16"));
      const { user } = setup(<App />);

      const weekSelector = screen.getByRole("combobox", { name: "view" });
      await user.selectOptions(weekSelector, "week");

      // 주로 설정했으므로 tbody 내부의 자식이 한 줄인지 확인
      const table = await screen.findByRole("table");
      const tbody = table.querySelector("tbody");
      expect(tbody?.children.length).toBe(1);

      expect(table).toHaveTextContent(/테스트 일정/);

      const nextWeekButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextWeekButton);

      expect(table).not.toHaveTextContent(/테스트 일정/);
    });
    test("주별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-08-16"));
      const { user } = setup(<App />);

      const weekSelector = screen.getByRole("combobox", { name: "view" });
      await user.selectOptions(weekSelector, "week");

      const table = await screen.findByRole("table");
      const tbody = table.querySelector("tbody");
      expect(tbody?.children.length).toBe(1);

      expect(table).toHaveTextContent(/테스트 일정/);
    });
    test("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      vi.setSystemTime(new Date("2024-07-16"));
      const { user } = setup(<App />);

      const weekSelector = screen.getByRole("combobox", { name: "view" });
      await user.selectOptions(weekSelector, "month");

      const table = await screen.findByRole("table");
      const tbody = table.querySelector("tbody");
      expect(tbody?.children.length).toBeGreaterThan(1);

      expect(table).not.toHaveTextContent(/테스트 일정/);
    });
    test("월별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-08-16"));
      const { user } = setup(<App />);

      const weekSelector = screen.getByRole("combobox", { name: "view" });
      await user.selectOptions(weekSelector, "month");

      const table = await screen.findByRole("table");
      const tbody = table.querySelector("tbody");
      expect(tbody?.children.length).toBeGreaterThan(1);

      expect(table).toHaveTextContent(/테스트 일정/);
    });
  });

  describe("공휴일 표시", () => {
    beforeEach(resetEvents);
    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", () => {
      vi.setSystemTime(new Date("2024-01-01"));
      setup(<App />);

      const target = screen.getByText("1");
      expect(target).toBeInTheDocument();

      const 신정 = target.nextSibling;
      expect(신정).toHaveTextContent("신정");
    });
    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", () => {
      vi.setSystemTime(new Date("2024-05-05"));
      setup(<App />);

      const target = screen.getByText("5");
      expect(target).toBeInTheDocument();

      const 어린이날 = target.nextSibling;
      expect(어린이날).toHaveTextContent("어린이날");
    });
  });

  describe("반복 일정 테스트", () => {
    beforeEach(resetEvents);
    test("반복 일정 옵션을 선택하면 반복 일정 옵션이 표시되는지 확인한다", async () => {
      const { user } = setup(<App />);

      const 반복일정옵션 = screen.getByText("반복 일정");
      await user.click(반복일정옵션);

      const 반복유형 = screen.getByText("반복 유형");
      const 반복간격 = screen.getByText("반복 간격");
      const 반복종료일 = screen.getByText("반복 종료일");
      expect(반복유형).toBeInTheDocument();
      expect(반복간격).toBeInTheDocument();
      expect(반복종료일).toBeInTheDocument();
    });
    test("반복 유형을 선택하면 반복 유형이 표시되는지 확인하고 옵션들이 일치하는지 확인한다", async () => {
      const { user } = setup(<App />);

      const 반복일정옵션 = screen.getByText("반복 일정");
      await user.click(반복일정옵션);

      const 반복유형 = screen.getByLabelText("반복 유형") as HTMLSelectElement;

      REPEAT_TYPE_SELECTS.forEach(({ label }) => {
        expect(screen.getByRole("option", { name: label })).toBeInTheDocument();
      });

      const options = [
        ...REPEAT_TYPE_SELECTS,
        { value: null, label: "반복 유형 선택" },
      ];

      expect(반복유형.options.length).toBe(options.length);

      await user.selectOptions(반복유형, REPEAT_TYPE_SELECTS[0].value);
      expect(반복유형).toHaveValue(REPEAT_TYPE_SELECTS[0].value);
    });

    test("각 반복 유형에 대해 간격을 설정할 수 있다.", async () => {
      const { user } = setup(<App />);

      const 반복일정옵션 = screen.getByText("반복 일정");
      await user.click(반복일정옵션);
    });
    test("반복 설정한 일정을 추가하면 모든 반복 일정이 달력에 표시되는지 확인한다.", async () => {
      vi.setSystemTime(new Date("2024-08-01"));

      const { user } = setup(<App />);

      await user.type(screen.getByLabelText("제목"), "반복 테스트 일정");
      await user.type(screen.getByLabelText("날짜"), "2024-08-01");
      await user.type(screen.getByLabelText("시작 시간"), "10:00");
      await user.type(screen.getByLabelText("종료 시간"), "11:00");

      const 반복일정옵션 = screen.getByLabelText("반복 일정");
      await user.click(반복일정옵션);

      const 반복유형 = screen.getByLabelText("반복 유형");
      await user.selectOptions(반복유형, "daily");

      const 반복간격 = screen.getByLabelText("반복 간격");
      await user.type(반복간격, "1");

      const 반복종료일 = screen.getByLabelText("반복 종료일");
      await user.type(반복종료일, "2024-08-07");

      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      const viewSelect = screen.getByLabelText("view");
      await user.selectOptions(viewSelect, "week");

      await waitFor(() => {
        const weekView = screen.getByTestId("week-view");
        const eventItems = weekView.querySelectorAll(".chakra-text");
        const repeatEvents = Array.from(eventItems).filter(
          (item) => item.textContent === "반복 테스트 일정"
        );
        expect(repeatEvents).toHaveLength(7);
      });

      await user.selectOptions(viewSelect, "month");

      await waitFor(() => {
        const monthView = screen.getByTestId("month-view");
        const eventItems = monthView.querySelectorAll(".chakra-text");
        const repeatEvents = Array.from(eventItems).filter(
          (item) => item.textContent === "반복 테스트 일정"
        );
        expect(repeatEvents).toHaveLength(7);
      });
    });
  });
  describe("getRepeatedEvents 함수 통합 테스트", () => {
    test("반복 일정이 올바르게 생성되는지 확인한다", async () => {
      const baseEvent: Event = {
        id: 1,
        description: "테스트 설명",
        location: "테스트 장소",
        category: "테스트 카테고리",
        notificationTime: 10,
        title: "반복 테스트 일정",
        date: "2024-08-01",
        startTime: "10:00",
        endTime: "11:00",
        repeat: {
          type: "daily",
          interval: 1,
          endDate: "2024-08-07",
        },
      };

      const startDate = new Date("2024-08-01");
      const endDate = new Date("2024-08-31");

      const repeatedEvents = getRepeatedEvents({
        event: baseEvent,
        startDate,
        endDate,
      });

      expect(repeatedEvents).toHaveLength(7);
      expect(repeatedEvents[0].date).toBe("2024-08-01");
      expect(repeatedEvents[6].date).toBe("2024-08-07");

      repeatedEvents.forEach((event, index) => {
        expect(event.title).toBe(baseEvent.title);
        expect(event.startTime).toBe(baseEvent.startTime);
        expect(event.endTime).toBe(baseEvent.endTime);
        expect(event.id).not.toBe(baseEvent.id);
        if (index > 0) {
          const prevDate = new Date(repeatedEvents[index - 1].date);
          const currentDate = new Date(event.date);
          const diffDays =
            (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
          expect(diffDays).toBe(1);
        }
      });
    });
  });
});
