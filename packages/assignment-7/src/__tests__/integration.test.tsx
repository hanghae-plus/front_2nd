import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { setupServer } from "msw/node";
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
import { mockApiHandlers, resetMockData } from "../mockApiHandlers";
import App from "../App";

const server = setupServer(...mockApiHandlers);

const findAllElementsLength = async (text: string) => {
  try {
    const foundElements = await screen.findAllByText(text);
    return foundElements.length;
  } catch (e) {
    return 0;
  }
};

const getAllElementsLength = (text: string) => {
  const foundElements = screen.queryAllByText(text);
  return foundElements.length;
};

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  vi.clearAllMocks();
  server.resetHandlers();

  resetMockData();
});
afterAll(() => {
  server.close();
  vi.resetAllMocks();
});

describe("일정 관리 애플리케이션 통합 테스트", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe("일정 CRUD 및 기본 기능", () => {
    test("새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-09-10"));
      render(<App />);

      const repeatInput = screen.getByLabelText("반복 설정");
      await user.click(repeatInput);

      const inputLabels = [
        "제목",
        "날짜",
        "시작 시간",
        "종료 시간",
        "설명",
        "위치",
        "카테고리",
        "알림 설정",
        "반복 유형",
        "반복 간격",
        "반복 종료일",
      ];

      const inputData = [
        "새로운 일정",
        "2024-09-02",
        "12:30",
        "13:30",
        "새로 추가하는 일정",
        "집",
        { option: "개인" },
        { option: 10 },
        { option: "daily" },
        1,
        "2024-11-09",
      ];

      for (const index in inputLabels) {
        const input = screen.getByLabelText(inputLabels[index]);
        const value = inputData[index];
        if (typeof value === "object") {
          await user.selectOptions(input, String(value.option));
        } else {
          await user.clear(input);
          await user.type(input, String(value));
        }
      }

      const submitBtn = screen.getByTestId("event-submit-button");
      await user.click(submitBtn);

      await waitFor(() => {
        expect(getAllElementsLength("새로운 일정")).not.toBe(0);
        expect(getAllElementsLength("2024-09-02 12:30 - 13:30")).not.toBe(0);
        expect(getAllElementsLength("새로 추가하는 일정")).not.toBe(0);
        expect(getAllElementsLength("집")).not.toBe(0);
        expect(getAllElementsLength("새로운 일정")).not.toBe(0);
        expect(getAllElementsLength("카테고리: 개인")).not.toBe(0);
        expect(getAllElementsLength("알림: 10분 전")).not.toBe(0);
      });
    });

    test("기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-07-10"));
      render(<App />);

      const editBtns = await screen.findAllByRole("button", {
        name: "Edit event",
      });
      await user.click(editBtns[0]); // 수정 버튼 클릭

      const input = screen.getByLabelText("제목");
      await user.clear(input);
      await user.type(input, "수정된 회의 일정");

      const submitBtn = screen.getByTestId("event-submit-button");
      await user.click(submitBtn);

      await waitFor(() => {
        expect(getAllElementsLength("팀 회의")).toBe(0);
        expect(screen.getAllByText("수정된 회의 일정").length).not.toBe(0);
      });
    });
    test("일정을 삭제하고 더 이상 조회되지 않는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-07-21"));
      render(<App />);

      expect(await findAllElementsLength("점심 약속")).not.toBe(0);

      const test = await screen.findAllByRole("button", {
        name: "Delete event",
      });
      await user.click(test[1]); // 삭제 버튼 클릭

      await waitFor(() => {
        expect(getAllElementsLength("점심 약속")).toBe(0);
      });
      const searchInput = screen.getByLabelText("일정 검색");
      await user.clear(searchInput);
      await user.type(searchInput, "점심 약속");

      expect(await findAllElementsLength("점심 약속")).toBe(0);
    });
  });

  describe("일정 뷰 및 필터링", () => {
    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      vi.setSystemTime(new Date("2024-07-10"));
      render(<App />);

      const test = await screen.findByRole("combobox", { name: "view" });
      await user.selectOptions(test, "Week");

      expect(await screen.findByText("2024년 7월 2주")).toBeInTheDocument();
      expect(await screen.findByTestId("week-view")).toBeInTheDocument();
      expect(
        await screen.findByPlaceholderText("검색어를 입력하세요")
      ).toBeInTheDocument();
      expect(
        await screen.findByText("검색 결과가 없습니다.")
      ).toBeInTheDocument();
    });

    test("주별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-07-25"));
      render(<App />);

      const selectElement = await screen.findByRole("combobox", {
        name: "view",
      });
      await user.selectOptions(selectElement, "Week");

      expect(await screen.findByText("2024년 7월 4주")).toBeInTheDocument();
      expect(
        await screen.findByPlaceholderText("검색어를 입력하세요")
      ).toBeInTheDocument();

      const weekView = await screen.findByTestId("week-view");
      expect(weekView).toBeInTheDocument();
      expect(
        await within(weekView).findByText("프로젝트 마감")
      ).toBeInTheDocument();
      expect(
        await within(weekView).findByText("생일 파티")
      ).toBeInTheDocument();
    });
    test("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      vi.setSystemTime(new Date("2023-07-20"));
      render(<App />);

      expect(await screen.findByText("2023년 7월")).toBeInTheDocument();
      expect(await screen.findByTestId("month-view")).toBeInTheDocument();
      expect(
        await screen.findByPlaceholderText("검색어를 입력하세요")
      ).toBeInTheDocument();
      expect(
        await screen.findByText("검색 결과가 없습니다.")
      ).toBeInTheDocument();
    });
    test("월별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-07-20"));
      render(<App />);

      expect(await screen.findByText("2024년 7월")).toBeInTheDocument();
      expect(
        await screen.findByPlaceholderText("검색어를 입력하세요")
      ).toBeInTheDocument();

      const monthView = await screen.findByTestId("month-view");
      expect(monthView).toBeInTheDocument();
      expect(await within(monthView).findByText("팀 회의")).toBeInTheDocument();
      expect(
        await within(monthView).findByText("점심 약속")
      ).toBeInTheDocument();
      expect(
        await within(monthView).findByText("프로젝트 마감")
      ).toBeInTheDocument();
      expect(
        await within(monthView).findByText("생일 파티")
      ).toBeInTheDocument();
      expect(await within(monthView).findByText("운동")).toBeInTheDocument();
    });
  });

  describe("알림 기능", () => {
    test("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-07-31 17:50"));
      render(<App />);

      expect(
        await screen.findByText("10분 후 알림 테스트 일정이 시작됩니다.")
      ).toBeInTheDocument();
    });
  });

  describe("검색 기능", () => {
    test("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-07-20"));
      render(<App />);

      const searchInput =
        await screen.findByPlaceholderText("검색어를 입력하세요");
      await user.clear(searchInput);
      await user.type(searchInput, "팀");

      const eventList = screen.getByTestId("event-list");
      expect(await within(eventList).findByText("팀 회의")).toBeInTheDocument();
      expect(
        await within(eventList).findByText("2024-07-20 10:00 - 11:00")
      ).toBeInTheDocument();
      expect(
        await within(eventList).findByText("주간 팀 미팅")
      ).toBeInTheDocument();
      expect(
        await within(eventList).findByText("회의실 A")
      ).toBeInTheDocument();
      expect(
        await within(eventList).findByText("카테고리: 업무")
      ).toBeInTheDocument();
      expect(
        await within(eventList).findByText("반복: 1주마다")
      ).toBeInTheDocument();
      expect(
        await within(eventList).findByText("알림: 1분 전")
      ).toBeInTheDocument();
    });

    test("검색어를 지우면 모든 일정이 다시 표시되어야 한다", async () => {
      vi.setSystemTime(new Date("2024-07-20"));
      render(<App />);

      const searchInput =
        await screen.findByPlaceholderText("검색어를 입력하세요");
      await user.clear(searchInput);
      await user.type(searchInput, "팀");

      const eventList = screen.getByTestId("event-list");

      await waitFor(() => {
        expect(within(eventList).queryByText("점심 약속")).toEqual(null);
        expect(within(eventList).queryByText("프로젝트 마감")).toEqual(null);
        expect(within(eventList).queryByText("생일 파티")).toEqual(null);
        expect(within(eventList).queryByText("운동")).toEqual(null);
      });

      await user.clear(searchInput);

      expect(await within(eventList).findByText("팀 회의")).toBeInTheDocument();
      expect(
        await within(eventList).findByText("점심 약속")
      ).toBeInTheDocument();
      expect(
        await within(eventList).findByText("프로젝트 마감")
      ).toBeInTheDocument();
      expect(
        await within(eventList).findByText("생일 파티")
      ).toBeInTheDocument();
      expect(await within(eventList).findByText("운동")).toBeInTheDocument();
    });
  });

  describe("공휴일 표시", () => {
    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-01-01"));
      render(<App />);

      const monthView = await screen.findByTestId("month-view");

      expect(await screen.findByText("2024년 1월")).toBeInTheDocument();

      const holidayText = await within(monthView).findByText("신정");
      expect(holidayText).toBeInTheDocument();

      const holidayBlock = holidayText.parentElement || holidayText;
      expect(await within(holidayBlock).findByText("1")).toBeInTheDocument();
    });
    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-05-01"));
      render(<App />);

      const monthView = await screen.findByTestId("month-view");

      expect(await screen.findByText("2024년 5월")).toBeInTheDocument();

      const holidayText = await within(monthView).findByText("어린이날");
      expect(holidayText).toBeInTheDocument();

      const holidayBlock = holidayText.parentElement || holidayText;
      expect(await within(holidayBlock).findByText("5")).toBeInTheDocument();
    });
  });

  describe("일정 충돌 감지", () => {
    test("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-07-01"));
      render(<App />);

      const inputLabels = ["제목", "날짜", "시작 시간", "종료 시간", "설명"];
      const inputDatas = [
        "새 일정",
        "2024-07-20",
        "10:00",
        "11:00",
        "겹치는 일정",
      ];

      for (const index in inputLabels) {
        const input = screen.getByLabelText(inputLabels[index]);
        await user.clear(input);
        await user.type(input, inputDatas[index]);
      }

      const submitBtn = screen.getByTestId("event-submit-button");
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText("일정 겹침 경고")).toBeInTheDocument();
        expect(
          screen.getByText("팀 회의 (2024-07-20 10:00-11:00)")
        ).toBeInTheDocument();
      });
    });
    test("기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-07-10"));
      render(<App />);

      const editBtns = await screen.findAllByRole("button", {
        name: "Edit event",
      });
      await user.click(editBtns[0]); // 수정 버튼 클릭

      const inputLabels = ["날짜", "시작 시간", "종료 시간"];
      const newInputValues = ["2024-07-21", "12:30", "13:30"];

      for (const index in inputLabels) {
        const input = screen.getByLabelText(inputLabels[index]);
        await user.clear(input);
        await user.type(input, newInputValues[index]);
      }

      const submitBtn = screen.getByTestId("event-submit-button");
      await user.click(submitBtn);
      // screen.logTestingPlaygroundURL(); // 결과 보기 쉽게 띄워주는 url console에 찍어줌

      await waitFor(() => {
        expect(screen.getByText("일정 겹침 경고")).toBeInTheDocument();
        expect(
          screen.getByText("점심 약속 (2024-07-21 12:30-13:30)")
        ).toBeInTheDocument();
      });
    });
  });
});
