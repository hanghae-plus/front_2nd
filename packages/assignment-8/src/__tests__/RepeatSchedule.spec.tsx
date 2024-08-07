import { render as renderComponent, screen, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import App from "../App";
import { Event, RepeatInfo } from "../types";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";

// #region setup
const mockEvent: Omit<Event, "id"> = {
  title: "Rust 스터디",
  description: "Rust 스터디 in 양재",
  date: "2024-08-05",
  startTime: "19:00",
  endTime: "21:00",
  location: "양재 스터디 카페",
  category: "개인",
  repeat: {
    type: "none",
    interval: 0,
  },
  notificationTime: 1,
};

const render = (component: ReactNode) => {
  const user = userEvent.setup();

  return {
    user,
    ...renderComponent(<ChakraProvider>{component}</ChakraProvider>),
  };
};
// #endregion

// #region set mock data
async function setBasicMockEventAsync(user: UserEvent) {
  const titleEl = screen.getByRole("textbox", { name: /제목/i });
  const descriptionEl = screen.getByRole("textbox", { name: /설명/i });
  const dateEl = screen.getByLabelText(/날짜/i);
  const startTiemEl = screen.getByLabelText(/시작 시간/i);
  const endTiemEl = screen.getByLabelText(/종료 시간/i);
  const loacationEl = screen.getByRole("textbox", { name: /위치/i });
  const categoryEl = screen.getByRole("combobox", { name: /카테고리/i });
  const notificationTimeEl = screen.getByRole("combobox", { name: /알림 설정/i });

  await user.clear(titleEl);
  await user.type(titleEl, mockEvent.title);
  await user.clear(descriptionEl);
  await user.type(descriptionEl, mockEvent.description);
  await user.clear(dateEl);
  await user.type(dateEl, mockEvent.date);
  await user.clear(startTiemEl);
  await user.type(startTiemEl, mockEvent.startTime);
  await user.clear(endTiemEl);
  await user.type(endTiemEl, mockEvent.endTime);
  await user.clear(loacationEl);
  await user.type(loacationEl, mockEvent.location);
  await user.selectOptions(categoryEl, mockEvent.category);
  await user.selectOptions(notificationTimeEl, `${mockEvent.notificationTime}`);
}

async function setMockRepeatAsync(user: UserEvent, mockRepeat: Required<RepeatInfo>) {
  const repeatEl = screen.getByRole("combobox", { name: /반복 유형/i });
  await user.selectOptions(repeatEl, mockRepeat.type);

  const repeatIntervalEl = screen.getByRole("spinbutton", { name: /반복 간격/i });
  await user.clear(repeatIntervalEl);
  await user.type(repeatIntervalEl, `${mockRepeat.interval}`);

  const repeatEndDateEl = screen.getByLabelText(/반복 종료일/i);
  await user.clear(repeatEndDateEl);
  await user.type(repeatEndDateEl, mockRepeat.endDate);
}
// #endregion

// #region event
async function clickAddButtonAsync(user: UserEvent) {
  await user.click(
    screen.getByRole("button", {
      name: "일정 추가",
    })
  );
}
async function clickUpdateButtonAsync(user: UserEvent) {
  await user.click(
    screen.getByRole("button", {
      name: "일정 수정",
    })
  );
}
async function activeRepeatCheckBoxAsync(user: UserEvent) {
  const checkbox = screen.getByLabelText(/반복 설정/i) as HTMLInputElement;
  if (!checkbox.checked) {
    await user.click(checkbox);
  }
}
// #endregion

describe("반복 유형 및 간격을 선택하여 반복 일정을 만들 수 있다.", () => {
  it("8월 30일까지 2일마다 반복되는 일정을 생성한다.", async () => {
    const mockRepeat: Required<RepeatInfo> = {
      type: "daily",
      interval: 2,
      endDate: "2024-08-30",
    };
    const { user } = render(<App />);
    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickAddButtonAsync(user);

    const monthView = screen.getByTestId("month-view");
    expect(within(monthView).getAllByText(mockEvent.title)).toHaveLength(13);
  });

  it("8월 30일까지 일주일에 한 번 반복되는 일정을 생성한다.", async () => {
    const mockRepeat: Required<RepeatInfo> = {
      type: "weekly",
      interval: 1,
      endDate: "2024-08-30",
    };
    const { user } = render(<App />);
    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickAddButtonAsync(user);

    const monthView = screen.getByTestId("month-view");
    expect(within(monthView).getAllByText(mockEvent.title)).toHaveLength(4);
  });

  it("12월 31일까지 두달 마다 반복되는 일정을 생성한다.", async () => {
    const mockRepeat: Required<RepeatInfo> = {
      type: "monthly",
      interval: 2,
      endDate: "2024-12-31",
    };
    const { user } = render(<App />);

    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickAddButtonAsync(user);

    const monthView = screen.getByTestId("month-view");

    const nextButtonEl = screen.getByRole("button", { name: /next/i });
    await user.click(nextButtonEl);
    await user.click(nextButtonEl);

    expect(within(monthView).getByText(mockEvent.title)).toBeInTheDocument();

    await user.click(nextButtonEl);
    await user.click(nextButtonEl);

    expect(within(monthView).getByText(mockEvent.title)).toBeInTheDocument();
  });

  it("기존 일정을 8월 30일까지 2일마다 반복되는 일정으로 수정한다.", async () => {
    const mockRepeat: Required<RepeatInfo> = {
      type: "daily",
      interval: 2,
      endDate: "2024-08-30",
    };
    const { user } = render(<App />);

    await setBasicMockEventAsync(user);

    await clickAddButtonAsync(user);

    // Fetching이 필요하여 find
    const eventCards = await screen.findAllByRole("listitem");
    const firstEvent = eventCards[2];
    const updateButton = within(firstEvent).getByRole("button", { name: /edit event/i });
    await user.click(updateButton);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickUpdateButtonAsync(user);

    const monthView = screen.getByTestId("month-view");

    expect(await within(monthView).findAllByText(mockEvent.title)).toHaveLength(13);
  });
});

describe("캘린더 뷰에서 반복 일정이 일반 일정과 구분된다.", () => {
  it("월간 뷰에서 반복일정이 css-5c3854(파란색) 클래스를 가진다.", async () => {
    const mockRepeat: Required<RepeatInfo> = {
      type: "weekly",
      interval: 1,
      endDate: "2024-08-31",
    };

    const { user } = render(<App />);

    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickAddButtonAsync(user);

    const monthView = screen.getByTestId("month-view");
    const repeatEvents = within(monthView).getAllByText(mockEvent.title);

    repeatEvents.forEach((repeatEvent) => {
      expect(repeatEvent).toHaveClass("css-5c3854");
    });
  });

  it("주간 뷰에서 반복일정이 css-5c3854(파란색) 클래스를 가진다.", async () => {
    const mockRepeat: Required<RepeatInfo> = {
      type: "weekly",
      interval: 1,
      endDate: "2024-08-31",
    };

    const { user } = render(<App />);

    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickAddButtonAsync(user);

    const calendarTypeOptionEl = screen.getByRole("combobox", { name: /view/i });
    await user.selectOptions(calendarTypeOptionEl, "week");

    const nextButtonEl = screen.getByRole("button", { name: /next/i });
    await user.click(nextButtonEl);

    const weekView = screen.getByTestId("week-view");
    expect(within(weekView).getByText(mockEvent.title)).toHaveClass("css-5c3854");
  });
});
