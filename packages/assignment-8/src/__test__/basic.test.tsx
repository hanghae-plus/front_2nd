import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  vi,
} from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { mockApiHandlers, resetEvents } from "../mocks/mockApiHandlers";

import App from "../App";
import { REPEAT_OPTIONS } from "../constants";

const server = setupServer(...mockApiHandlers);

beforeAll(() => server.listen()); // 테스트 시작 전에 목 서버를 실행
afterAll(() => server.close()); // 테스트 종료 후에 목 서버 종료

describe("반복 일정 요구사항 테스트", () => {
  beforeEach(() => {
    resetEvents(); // 각 테스트 전에 이벤트 초기화
  });

  afterEach(() => {
    server.resetHandlers(); // 각 테스트 후 핸들러 리셋
    vi.clearAllMocks();
  });

  describe("반복 유형 선택", () => {
    test("일정 생성 또는 수정 시 반복 유형을 선택할 수 있다.", async () => {
      const user = userEvent.setup();
      render(<App />);

      const repeatCheckbox = screen.getByLabelText("반복 일정");
      expect(repeatCheckbox).toBeInTheDocument();

      await user.click(repeatCheckbox);
      expect(repeatCheckbox).toBeChecked();

      const repeatTypeSelect = screen.getByLabelText("반복 유형");
      expect(repeatTypeSelect).toBeInTheDocument();

      await user.selectOptions(repeatTypeSelect, "daily");
      expect(repeatTypeSelect).toHaveValue("daily");

      await user.selectOptions(repeatTypeSelect, "weekly");
      expect(repeatTypeSelect).toHaveValue("weekly");

      await user.selectOptions(repeatTypeSelect, "monthly");
      expect(repeatTypeSelect).toHaveValue("monthly");

      await user.selectOptions(repeatTypeSelect, "yearly");
      expect(repeatTypeSelect).toHaveValue("yearly");
    });

    test("반복 유형은 다음과 같다: 매일, 매주, 매월, 매년", async () => {
      const user = userEvent.setup();
      render(<App />);

      const repeatCheckbox = screen.getByLabelText("반복 일정");
      await user.click(repeatCheckbox);

      const repeatTypeSelect = screen.getByLabelText("반복 유형");
      const options = within(repeatTypeSelect).getAllByRole("option");
      const optionValues = options.map(
        (option) => (option as HTMLOptionElement).value
      );

      expect(optionValues).toEqual(REPEAT_OPTIONS.map((item) => item.value));
    });
  });

  describe("반복 간격 설정", () => {
    test("각 반복 유형에 대해 간격을 설정할 수 있다. (예: 2일마다, 3주마다, 2개월마다 등)", async () => {
      const user = userEvent.setup();
      render(<App />);

      const repeatCheckbox = screen.getByLabelText("반복 일정");
      await user.click(repeatCheckbox);

      const repeatIntervalInput = screen.getByLabelText("반복 간격");
      expect(repeatIntervalInput).toBeInTheDocument();

      await user.clear(repeatIntervalInput);
      await user.type(repeatIntervalInput, "2");
      expect(repeatIntervalInput).toHaveValue(2);

      await user.clear(repeatIntervalInput);
      await user.type(repeatIntervalInput, "3");
      expect(repeatIntervalInput).toHaveValue(3);
    });
  });

  describe("반복 일정 표시", () => {
    test("캘린더 뷰에서 반복 일정을 시각적으로 구분하여 표시한다.", async () => {
      const user = userEvent.setup();
      render(<App />);

      const newEvent = {
        id: 99,
        title: "프론트엔드 주간회의",
        date: "2024-08-12",
        startTime: "10:00",
        endTime: "11:00",
        description: "프론트 팀 주간회의",
        location: "작은 회의실",
        category: "업무",
        repeat: { type: "weekly", interval: 2, endDate: "2024-08-31" },
      };

      await user.type(screen.getByLabelText("제목"), newEvent.title);
      await user.type(screen.getByLabelText("날짜"), newEvent.date);
      await user.type(screen.getByLabelText("시작 시간"), newEvent.startTime);
      await user.type(screen.getByLabelText("종료 시간"), newEvent.endTime);
      await user.type(screen.getByLabelText("설명"), newEvent.description);
      await user.type(screen.getByLabelText("위치"), newEvent.location);
      await user.selectOptions(
        screen.getByLabelText("카테고리"),
        newEvent.category
      );

      const repeatCheckbox = screen.getByLabelText("반복 일정");
      await user.click(repeatCheckbox);

      await user.selectOptions(
        screen.getByLabelText("반복 유형"),
        newEvent.repeat.type
      );
      await user.clear(screen.getByLabelText("반복 간격"));
      await user.type(
        screen.getByLabelText("반복 간격"),
        String(newEvent.repeat.interval)
      );
      await user.type(
        screen.getByLabelText("반복 종료일"),
        newEvent.repeat.endDate
      );

      await user.click(screen.getByTestId("event-submit-button")); // Using data-testid to select the button

      const datesToCheck = ["2024-08-12", "2024-08-26"];

      for (const date of datesToCheck) {
        const eventDate = Number(date.split("-")[2]);
        const eventTitle = newEvent.title;

        await waitFor(() => {
          const cell = screen.getByRole("cell", {
            name: `${eventDate} ${eventTitle}`,
          });

          expect(cell).toBeInTheDocument();
          expect(within(cell).getByText(newEvent.title)).toBeInTheDocument();
        });
      }
    });
  });
});
