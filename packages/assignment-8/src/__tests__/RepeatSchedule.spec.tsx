import { render as renderComponent, screen, waitFor, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import App from "../App";
import { Event, RepeatInfo } from "../types";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";

// #region setup
const basicMockEvent: Omit<Event, "id"> = {
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
  await user.type(titleEl, basicMockEvent.title);
  await user.clear(descriptionEl);
  await user.type(descriptionEl, basicMockEvent.description);
  await user.clear(dateEl);
  await user.type(dateEl, basicMockEvent.date);
  await user.clear(startTiemEl);
  await user.type(startTiemEl, basicMockEvent.startTime);
  await user.clear(endTiemEl);
  await user.type(endTiemEl, basicMockEvent.endTime);
  await user.clear(loacationEl);
  await user.type(loacationEl, basicMockEvent.location);
  await user.selectOptions(categoryEl, basicMockEvent.category);
  await user.selectOptions(notificationTimeEl, `${basicMockEvent.notificationTime}`);
}

async function setMockRepeatAsync(user: UserEvent, mockRepeat: RepeatInfo) {
  const repeatEl = screen.getByRole("combobox", { name: /반복 유형/i });
  await user.selectOptions(repeatEl, mockRepeat.type);

  const repeatIntervalEl = screen.getByRole("spinbutton", { name: /반복 간격/i });
  await user.clear(repeatIntervalEl);
  await user.type(repeatIntervalEl, `${mockRepeat.interval}`);

  if (mockRepeat.endType) {
    const repeatEndTypeEl = screen.getByRole("combobox", { name: /반복 종료 조건/i });
    await user.selectOptions(repeatEndTypeEl, mockRepeat.endType);
  }

  if (mockRepeat.endDate) {
    const repeatEndDateEl = screen.getByLabelText(/반복 종료일/i);
    await user.clear(repeatEndDateEl);
    await user.type(repeatEndDateEl, mockRepeat.endDate);
  }

  if (mockRepeat.endCount) {
    const repeatEndCountEl = screen.getByLabelText(/반복 종료 횟수/i);
    await user.clear(repeatEndCountEl);
    await user.type(repeatEndCountEl, `${mockRepeat.endCount}`);
  }
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

describe("1~2. 반복 유형 및 간격을 선택하여 반복 일정을 만들 수 있다.", () => {
  it("8월 30일까지 2일마다 반복되는 일정을 생성한다.", async () => {
    const mockRepeat: RepeatInfo = {
      type: "daily",
      interval: 2,
      endType: "endDate",
      endDate: "2024-08-30",
    };
    const { user } = render(<App />);
    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickAddButtonAsync(user);

    const monthView = screen.getByTestId("month-view");
    expect(await within(monthView).findAllByText(basicMockEvent.title)).toHaveLength(13);
  });

  it("8월 30일까지 일주일에 한 번 반복되는 일정을 생성한다.", async () => {
    const mockRepeat: RepeatInfo = {
      type: "weekly",
      interval: 1,
      endType: "endDate",
      endDate: "2024-08-30",
    };
    const { user } = render(<App />);
    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickAddButtonAsync(user);

    const monthView = screen.getByTestId("month-view");
    expect(await within(monthView).findAllByText(basicMockEvent.title)).toHaveLength(4);
  });

  it("12월 31일까지 두달 마다 반복되는 일정을 생성한다.", async () => {
    const mockRepeat: RepeatInfo = {
      type: "monthly",
      interval: 2,
      endType: "endDate",
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

    expect(await within(monthView).findByText(basicMockEvent.title)).toBeInTheDocument();

    await user.click(nextButtonEl);
    await user.click(nextButtonEl);

    expect(await within(monthView).findByText(basicMockEvent.title)).toBeInTheDocument();
  });

  it("기존 일정을 8월 30일까지 2일마다 반복되는 일정으로 수정한다.", async () => {
    const mockRepeat: RepeatInfo = {
      type: "daily",
      interval: 2,
      endType: "endDate",
      endDate: "2024-08-30",
    };
    const { user } = render(<App />);

    await setBasicMockEventAsync(user);

    await clickAddButtonAsync(user);

    const eventCards = await screen.findAllByRole("listitem");
    const firstEvent = eventCards[2];
    const updateButton = within(firstEvent).getByRole("button", { name: /edit event/i });
    await user.click(updateButton);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickUpdateButtonAsync(user);

    const monthView = screen.getByTestId("month-view");

    expect(await within(monthView).findAllByText(basicMockEvent.title)).toHaveLength(13);
  });
});

describe("3. 캘린더 뷰에서 반복 일정이 일반 일정과 구분된다.", () => {
  it("월간 뷰에서 반복일정이 css-5c3854(파란색) 클래스를 가진다.", async () => {
    const mockRepeat: RepeatInfo = {
      type: "weekly",
      interval: 1,
      endType: "endDate",
      endDate: "2024-08-31",
    };

    const { user } = render(<App />);

    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickAddButtonAsync(user);

    const monthView = screen.getByTestId("month-view");
    const repeatEvents = await within(monthView).findAllByText(basicMockEvent.title);

    repeatEvents.forEach((repeatEvent) => {
      expect(repeatEvent).toHaveClass("css-5c3854");
    });
  });

  it("주간 뷰에서 반복일정이 css-5c3854(파란색) 클래스를 가진다.", async () => {
    const mockRepeat: RepeatInfo = {
      type: "weekly",
      interval: 1,
      endType: "endDate",
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

    const weekView = await screen.findByTestId("week-view");
    expect(within(weekView).getByText(basicMockEvent.title)).toHaveClass("css-5c3854");
  });
});

describe("4. 예외 날짜 처리", () => {
  it("반복 일정 중 특정날짜를 제외하거나 수정할 수 있다.", async () => {
    const { user } = render(<App />);
  });
});

describe("5. 반복 종료 조건", () => {
  it("반복 종료 조건에는 3가지가(종료없음, 특정 날짜까지, 특정 횟수만큼) 있다.", async () => {
    const { user } = render(<App />);

    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    const repeatEndTypeEl = await screen.findByRole("combobox", { name: /반복 종료 조건/i });

    await user.click(repeatEndTypeEl);

    const options = within(repeatEndTypeEl).getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("종료없음");
    expect(options[1]).toHaveTextContent("특정 날짜까지");
    expect(options[2]).toHaveTextContent("특정 횟수만큼");
  });

  it("반복 종료를 특정 횟수로 지정하면 그 횟수만큼 반복되어 이벤트가 생성된다.", async () => {
    const mockRepeat: RepeatInfo = {
      type: "daily",
      interval: 1,
      endType: "endCount",
      endCount: 5,
    };

    const { user } = render(<App />);

    await setBasicMockEventAsync(user);

    await activeRepeatCheckBoxAsync(user);

    await setMockRepeatAsync(user, mockRepeat);

    await clickAddButtonAsync(user);

    const eventsList = await screen.findByRole("list");

    const eventCards = await within(eventsList).findAllByText(/양재 스터디 카페/i);

    expect(eventCards).toHaveLength(5);
  });
});

describe("6. 요일 지정 (주간 반복의 경우)", () => {
  it("주간 반복 시 특정 요일을 선택할 수 있다.", () => {});
});

describe("7. 월간 반복 옵션", () => {
  it("월간 반복 시 특정 날짜에 반복되도록 설정할 수 있다.", () => {});
  it("매월 특정 순서의 요일에 반복되도록 설정할 수 있다.", () => {});
});

describe("8. 반복 일정 수정:", () => {
  it("반복 일정의 단일 일정을 수정할 수 있다.", () => {});
  it("반복 일정의 모든 일정을 수정할 수 있다.", () => {});
});
