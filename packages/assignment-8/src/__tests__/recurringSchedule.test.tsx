import { describe, expect, test } from "vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import {
  getRandomDateString,
  mockApiHandlers,
  TEvents,
} from "../mockApiHandlers";
import App from "../App";

// Set up mock API server
const server = setupServer(...mockApiHandlers);
beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  vi.resetAllMocks();
  server.close();
});

const repeatEventData: TEvents = {
  id: Number(new Date()),
  title: "반복 일정 테스트",
  date: getRandomDateString(new Date()),
  startTime: "10:00",
  endTime: "11:00",
  description: "반복 일정 테스트",
  location: "내 집 방 안",
  category: "가족",
  repeat: { type: "weekly", interval: 1 },
  notificationTime: 1,
};
type TRepeat = "daily" | "weekly" | "monthly" | "yearly";
async function fillRepeatForm(repeatType: TRepeat, repeatInterval: string) {
  await userEvent.click(screen.getByLabelText("반복 설정"));
  await userEvent.selectOptions(screen.getByLabelText("반복 유형"), [
    repeatType,
  ]);
  await userEvent.clear(screen.getByLabelText("반복 간격"));
  await userEvent.type(screen.getByLabelText("반복 간격"), repeatInterval);
  await userEvent.type(
    screen.getByLabelText("반복 종료일"),
    getRandomDateString(
      new Date(new Date().setDate(new Date().getDate() + 30)),
    ),
  );
}
async function fillRepeatEventForm(
  repeatType: TRepeat,
  repeatInterval: string,
) {
  await userEvent.type(screen.getByLabelText("제목"), repeatEventData.title);
  await userEvent.type(screen.getByLabelText("날짜"), repeatEventData.date);
  await userEvent.type(
    screen.getByLabelText("시작 시간"),
    repeatEventData.startTime,
  );
  await userEvent.type(
    screen.getByLabelText("종료 시간"),
    repeatEventData.endTime,
  );
  await userEvent.type(
    screen.getByLabelText("설명"),
    repeatEventData.description,
  );
  await userEvent.type(screen.getByLabelText("위치"), repeatEventData.location);
  await userEvent.selectOptions(screen.getByLabelText("카테고리"), [
    repeatEventData.category,
  ]);
  await userEvent.selectOptions(screen.getByLabelText("알림 설정"), ["1"]);
  await fillRepeatForm(repeatType, repeatInterval);
}

async function clearEventForm() {
  await userEvent.clear(screen.getByLabelText("제목"));
  await userEvent.clear(screen.getByLabelText("날짜"));
  await userEvent.clear(screen.getByLabelText("시작 시간"));
  await userEvent.clear(screen.getByLabelText("종료 시간"));
  await userEvent.clear(screen.getByLabelText("설명"));
  await userEvent.clear(screen.getByLabelText("위치"));
  await userEvent.selectOptions(screen.getByLabelText("카테고리"), [
    "카테고리 선택",
  ]);
  await userEvent.selectOptions(screen.getByLabelText("알림 설정"), ["10"]);
  if (screen.getByLabelText("반복 설정").checked) {
    await userEvent.selectOptions(screen.getByLabelText("반복 유형"), [
      "daily",
    ]);
    await userEvent.clear(screen.getByLabelText("반복 간격"));
    await userEvent.type(screen.getByLabelText("반복 간격"), "1");
    await userEvent.clear(screen.getByLabelText("반복 종료일"));
    await userEvent.click(screen.getByLabelText("반복 설정"));
  }
}

async function findSingleEvent() {
  const eventInfoBoxes = screen.getAllByTestId("event-info-box");
  const eventBoxWithoutRepeatInfo = eventInfoBoxes.find((box) => {
    const repeatInfoElement = within(box).queryByTestId("repeat-info");
    return repeatInfoElement === null;
  });
  return eventBoxWithoutRepeatInfo;
}

async function clickEditButton(singleEvent) {
  const editButton = within(singleEvent).getByRole("button", {
    name: "Edit event",
  });
  editButton.click();
}

describe("반복 유형 선택:", () => {
  describe("일정 생성 시 반복 유형을 선택할 수 있다.", () => {
    test("반복 유형을 매일로 설정한다.", async () => {
      render(<App />);
      await fillRepeatEventForm("daily", "1");
      await waitFor(() => {
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 유형")).toHaveValue("daily");
      });
      await clearEventForm();
    });
    test("반복 유형을 매주로 설정한다.", async () => {
      render(<App />);
      await fillRepeatEventForm("weekly", "1");
      await waitFor(() => {
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 유형")).toHaveValue("weekly");
      });
      await clearEventForm();
    });
    test("반복 유형을 매달로 설정한다.", async () => {
      render(<App />);
      await fillRepeatEventForm("monthly", "1");
      await waitFor(() => {
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 유형")).toHaveValue("monthly");
      });
      await clearEventForm();
    });
    test("반복 유형을 매년으로 설정한다.", async () => {
      render(<App />);
      await fillRepeatEventForm("yearly", "1");
      await waitFor(() => {
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 유형")).toHaveValue("yearly");
      });
      await clearEventForm();
    });
  });

  describe("반복이 아닌 일정 수정 시 반복 유형을 선택할 수 있다.", () => {
    test("반복 유형을 매일로 설정한다.", async () => {
      render(<App />);
      await waitFor(async () => {
        const singleEvent = await findSingleEvent();
        // if(!singleEvent) // TODO: 단일 이벤트가 없는 경우 단일 이벤트 생성

        await clickEditButton(singleEvent);
        expect(screen.getByLabelText("Repeat checkbox")).not.toBeChecked();

        await fillRepeatForm("daily", "1");
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 유형")).toHaveValue("daily");
      });
      await clearEventForm();
    });
    test("반복 유형을 매주로 설정한다.", async () => {
      render(<App />);
      await waitFor(async () => {
        const singleEvent = await findSingleEvent();

        await clickEditButton(singleEvent);
        expect(screen.getByLabelText("Repeat checkbox")).not.toBeChecked();

        await fillRepeatForm("weekly", "1");
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 유형")).toHaveValue("weekly");
      });
      await clearEventForm();
    });
    test("반복 유형을 매달로 설정한다.", async () => {
      render(<App />);
      await waitFor(async () => {
        const singleEvent = await findSingleEvent();

        await clickEditButton(singleEvent);
        expect(screen.getByLabelText("Repeat checkbox")).not.toBeChecked();

        await fillRepeatForm("monthly", "1");
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 유형")).toHaveValue("monthly");
      });
      await clearEventForm();
    });
    test("반복 유형을 매년으로 설정한다.", async () => {
      render(<App />);
      await waitFor(async () => {
        const singleEvent = await findSingleEvent();

        await clickEditButton(singleEvent);
        expect(screen.getByLabelText("Repeat checkbox")).not.toBeChecked();

        await fillRepeatForm("yearly", "1");
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 유형")).toHaveValue("yearly");
      });
      await clearEventForm();
    });
  });
});

describe("반복 간격 설정:", () => {
  describe("일정 생성 시 반복 유형을 선택할 수 있다.", () => {
    test("반복 간격을 격일로 설정한다.", async () => {
      render(<App />);
      await fillRepeatEventForm("daily", "2");
      await waitFor(() => {
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 간격")).toHaveValue(2);
      });
      await clearEventForm();
    });
    test("반복 간격을 3주로 설정한다.", async () => {
      render(<App />);
      await fillRepeatEventForm("weekly", "3");
      await waitFor(() => {
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 간격")).toHaveValue(3);
      });
      await clearEventForm();
    });
    test("반복 간격을 4달로 설정한다.", async () => {
      render(<App />);
      await fillRepeatEventForm("monthly", "4");
      await waitFor(() => {
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 간격")).toHaveValue(4);
      });
      await clearEventForm();
    });
    test("반복 간격을 5년으로 설정한다.", async () => {
      render(<App />);
      await fillRepeatEventForm("yearly", "5");
      await waitFor(() => {
        expect(screen.getByLabelText("Repeat checkbox")).toBeChecked();
        expect(screen.getByLabelText("반복 간격")).toHaveValue(5);
      });
      await clearEventForm();
    });
  });
});

describe("반복 일정 표시:", () => {
  describe("반복 일정 생성 시 캘린더 뷰에서 반복 일정을 시각적으로 구분하여 표시한다.", () => {
    test("반복 일정 생성 시 Month view에서 반복되는 일정을 확인할 수 있다.", async () => {
      render(<App />);
      await fillRepeatEventForm("weekly", "3");
      await userEvent.click(screen.getByTestId("event-submit-button"));
      await waitFor(() => {
        // 일정 겹침 경고 발생 시 계속 진행 처리
        const duplicatedDialogButton = screen.queryByTestId(
          "duplicated-continue-button",
        );
        if (duplicatedDialogButton) userEvent.click(duplicatedDialogButton);
      });

      const today = new Date();
      const nextEventDay = new Date(today);
      nextEventDay.setDate(today.getDate() + 7 * 3);
      const nextEventDate = nextEventDay.getDate();
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(nextEventDay);
      const dateList = screen
        .getAllByTestId("month-view-date")
        .filter((td) => td.children.length > 0);

      const eventExpectedDay = dateList[nextEventDate];
      expect(eventExpectedDay.textContent?.includes("반복 일정 테스트")).toBe(
        true,
      );

      vi.useRealTimers();
    });
    test("반복 일정 생성 시 Week view에서 반복되는 일정을 확인할 수 있다.", async () => {
      render(<App />);
      await fillRepeatEventForm("daily", "4");
      await userEvent.click(screen.getByTestId("event-submit-button"));
      await waitFor(() => {
        // 일정 겹침 경고 발생 시 계속 진행 처리
        const duplicatedDialogButton = screen.queryByTestId(
          "duplicated-continue-button",
        );
        if (duplicatedDialogButton) userEvent.click(duplicatedDialogButton);
      });

      const today = new Date();
      const nextEventDay = new Date(today);
      nextEventDay.setDate(today.getDate() + 4);
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.setSystemTime(nextEventDay);

      // week view로 변환
      const $selector = screen.getByLabelText("view");
      await userEvent.selectOptions($selector, ["week"]);

      const dateList = screen.getAllByTestId("week-view-date");

      const eventExpectedDay = dateList[nextEventDay.getDay()];
      expect(eventExpectedDay.textContent?.includes("반복 일정 테스트")).toBe(
        true,
      );

      vi.useRealTimers();
    });
  });
});
