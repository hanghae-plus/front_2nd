import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import App from "../App";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { mockApiHandlers } from "../mockApiHandlers";
import { RepeatType } from "../type/schedule.type";

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

const setTestDate = (date: string) => {
  const testDate = new Date(date);
  vi.setSystemTime(testDate.toString());
};

const setCalenderDate = async (date: string) => {
  const testDate = new Date(date);

  // 월별 뷰로 변경
  const calenderTypeOption = screen.getByTestId("calender-type-select");
  await userEvent.selectOptions(calenderTypeOption, "month");

  const targetMonthYear = `${testDate.getFullYear()}년 ${testDate.getMonth() + 1}월`;

  // 현재 표시된 월/년 확인
  const currentMonthYear = screen.getByText(/^\d{4}년 \d{1,2}월$/);

  // 목표 월/년과 현재 월/년 비교
  while (currentMonthYear.textContent !== targetMonthYear) {
    if (
      new Date(currentMonthYear.textContent!.replace(/년|월/g, "-")) > testDate
    ) {
      // 현재 월이 목표 월보다 미래인 경우 이전 버튼 클릭
      await userEvent.click(screen.getByTestId("calender-prev-button"));
    } else {
      // 현재 월이 목표 월보다 과거인 경우 다음 버튼 클릭
      await userEvent.click(screen.getByTestId("calender-next-button"));
    }
    await waitFor(() => {
      expect(screen.getByText(/^\d{4}년 \d{1,2}월$/)).not.toHaveTextContent(
        currentMonthYear.textContent!
      );
    });
  }
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

  describe("반복 일정", () => {
    const repeatOptions = ["매일", "매주", "매월", "매년"];

    const repeatOptionMap: { [key: string]: RepeatType } = {
      매일: "daily",
      매주: "weekly",
      매월: "monthly",
      매년: "yearly",
    };

    describe("반복 유형 선택", () => {
      test("일정 생성 시, 반복 유형 매일, 매주, 매월, 매년을 선택할 수 있다.", async () => {
        render(<App />);

        await userEvent.click(screen.getByLabelText("반복 설정"));

        // 주별 뷰가 렌더링될 때까지 대기
        await waitFor(() => {
          expect(screen.getByLabelText("반복 유형")).toBeInTheDocument();
        });

        const repeatTypeSelect = screen.getByLabelText("반복 유형");

        // 옵션이 존재하는지 확인
        repeatOptions.forEach((option) => {
          expect(
            screen.getByRole("option", { name: option })
          ).toBeInTheDocument();
        });

        // 각 옵션을 선택할 수 있는지 확인 (forEach를 사용하면, 비동기 작업을 기다리지 않고 진행함)
        for (const option of repeatOptions) {
          await userEvent.selectOptions(repeatTypeSelect, option);
          await expect(repeatTypeSelect).toHaveValue(repeatOptionMap[option]);
        }
      });

      test("일정 수정 시, 반복 유형 매일, 매주, 매월, 매년을 선택할 수 있다.", async () => {
        setTestDate("2024-01-15");
        render(<App />);
        await setCalenderDate("2024-01-15");
        // 입력 필드들을 찾아 값을 입력합니다
        await addEvent({
          title: "테스트 일정 반복",
          date: "2024-01-15",
          startTime: "09:00",
          endTime: "10:00",
          description: "테스트 설명",
          location: "테스트 장소",
          category: "업무",
        });
        const submitButton = screen.getByTestId("event-submit-button");
        await userEvent.click(submitButton);
        await waitFor(() => {
          // 일정 목록 확인
          const eventList = screen.getByTestId("event-list");
          expect(eventList).toHaveTextContent("테스트 일정 반복");
        });

        const editButtons = await screen.findAllByLabelText("Edit event");
        await userEvent.click(editButtons[0]);

        await userEvent.click(screen.getByLabelText("반복 설정"));

        // 주별 뷰가 렌더링될 때까지 대기
        await waitFor(() => {
          expect(screen.getByLabelText("반복 유형")).toBeInTheDocument();
        });

        const repeatTypeSelect = screen.getByLabelText("반복 유형");

        // 옵션이 존재하는지 확인
        repeatOptions.forEach((option) => {
          expect(
            screen.getByRole("option", { name: option })
          ).toBeInTheDocument();
        });

        // 각 옵션을 선택할 수 있는지 확인 (forEach를 사용하면, 비동기 작업을 기다리지 않고 진행함)
        for (const option of repeatOptions) {
          await userEvent.selectOptions(repeatTypeSelect, option);
          await expect(repeatTypeSelect).toHaveValue(repeatOptionMap[option]);
        }
      });
      test("일정 생성 시, 반복 유형 간격을 선택할 수 있다", async () => {
        render(<App />);

        await userEvent.click(screen.getByLabelText("반복 설정"));

        // 주별 뷰가 렌더링될 때까지 대기
        await waitFor(() => {
          expect(screen.getByLabelText("반복 유형")).toBeInTheDocument();
        });

        const repeatInterval = screen.getByLabelText("반복 간격");
        await userEvent.type(repeatInterval, "3");

        await waitFor(() => {
          expect(repeatInterval).toHaveValue(13);
        });
      });
      test("일정 수정 시, 반복 유형 간격을 선택할 수 있다", async () => {
        setTestDate("2024-02-15");
        render(<App />);
        await setCalenderDate("2024-02-15");
        // 입력 필드들을 찾아 값을 입력합니다
        await addEvent({
          title: "테스트 일정 반복 유형 간격",
          date: "2024-02-15",
          startTime: "09:00",
          endTime: "10:00",
          description: "테스트 설명",
          location: "테스트 장소",
          category: "업무",
        });
        const submitButton = screen.getByTestId("event-submit-button");
        await userEvent.click(submitButton);
        await waitFor(() => {
          // 일정 목록 확인
          const eventList = screen.getByTestId("event-list");
          expect(eventList).toHaveTextContent("테스트 일정 반복 유형 간격");
        });

        const editButtons = await screen.findAllByLabelText("Edit event");
        await userEvent.click(editButtons[0]);

        await userEvent.click(screen.getByLabelText("반복 설정"));

        // 주별 뷰가 렌더링될 때까지 대기
        await waitFor(() => {
          expect(screen.getByLabelText("반복 간격")).toBeInTheDocument();
        });

        const repeatInterval = screen.getByLabelText("반복 간격");
        await userEvent.type(repeatInterval, "3");

        await waitFor(() => {
          expect(repeatInterval).toHaveValue(13);
        });
      });
    });
    describe("반복 달력 내 확인", () => {
      test("일정 생성 시, 반복 일정을 달력에서 확인할 수 있다", async () => {
        setTestDate("2024-03-15");
        render(<App />);
        await setCalenderDate("2024-03-15");

        // 입력 필드들을 찾아 값을 입력합니다
        await addEvent({
          title: "테스트 일정 반복 달력 확인",
          date: "2024-03-15",
          startTime: "09:00",
          endTime: "10:00",
          description: "테스트 설명",
          location: "테스트 장소",
          category: "업무",
        });

        await userEvent.click(screen.getByLabelText("반복 설정"));

        // 주별 뷰가 렌더링될 때까지 대기
        await waitFor(() => {
          expect(screen.getByLabelText("반복 간격")).toBeInTheDocument();
        });

        const repeatInterval = screen.getByLabelText("반복 간격");
        await userEvent.clear(repeatInterval);
        await userEvent.type(repeatInterval, "1");

        const repeatTypeSelect = screen.getByLabelText("반복 유형");
        await userEvent.selectOptions(repeatTypeSelect, "daily");

        const submitButton = screen.getByTestId("event-submit-button");
        await userEvent.click(submitButton);

        await waitFor(() => {
          const eventCells = screen.getAllByRole("cell");

          let foundEvent = false;
          for (const cell of eventCells) {
            const cellContent = cell.textContent || "";
            if (cellContent.includes("테스트 일정 반복 달력 확인")) {
              foundEvent = true;
              break;
            }
          }

          expect(foundEvent).toBe(true);
        });
      });
      test("일정 수정 시, 반복 일정을 달력에서 확인할 수 있다", async () => {
        setTestDate("2024-04-15");
        render(<App />);
        await setCalenderDate("2024-04-15");

        // 입력 필드들을 찾아 값을 입력합니다
        await addEvent({
          title: "테스트 일정 반복 달력 확인 수정",
          date: "2024-04-15",
          startTime: "09:00",
          endTime: "10:00",
          description: "테스트 설명",
          location: "테스트 장소",
          category: "업무",
        });

        const submitButton = screen.getByTestId("event-submit-button");
        await userEvent.click(submitButton);
        await waitFor(() => {
          // 일정 목록 확인
          const eventList = screen.getByTestId("event-list");
          expect(eventList).toHaveTextContent(
            "테스트 일정 반복 달력 확인 수정"
          );
        });

        const editButtons = await screen.findAllByLabelText("Edit event");
        await userEvent.click(editButtons[0]);

        await userEvent.click(screen.getByLabelText("반복 설정"));

        // 주별 뷰가 렌더링될 때까지 대기
        await waitFor(() => {
          expect(screen.getByLabelText("반복 간격")).toBeInTheDocument();
        });

        const repeatInterval = screen.getByLabelText("반복 간격");
        await userEvent.clear(repeatInterval);
        await userEvent.type(repeatInterval, "1");

        const repeatTypeSelect = screen.getByLabelText("반복 유형");
        await userEvent.selectOptions(repeatTypeSelect, "daily");

        await userEvent.click(submitButton);

        await waitFor(() => {
          const eventCells = screen.getAllByRole("cell");

          let foundEvent = false;
          for (const cell of eventCells) {
            const cellContent = cell.textContent || "";
            if (cellContent.includes("테스트 일정 반복 달력 확인")) {
              foundEvent = true;
              break;
            }
          }

          expect(foundEvent).toBe(true);
        });
      });
    });
  });
});
