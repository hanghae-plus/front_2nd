import {
  findByText,
  queryAllByRole,
  render,
  screen,
} from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import App from "../App";

import { ReactNode } from "react";

const setup = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  return { user, ...render(component) };
};

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe("일정 CRUD 및 기본 기능", () => {
    test("새로운 일정을 생성하고, 검색 리스트에 새로운 일정이 입력한대로 저장되는지 확인한다", async () => {
      const { user } = setup(<App />);
      await typeInputs(user);
      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);
      const eventListDiv = await screen.findByTestId("event-list");
      expect(await findByText(eventListDiv, "회의")).toBeInTheDocument();
      expect(
        await findByText(eventListDiv, "2024-07-30 15:00 - 16:00"),
      ).toBeInTheDocument();
      expect(
        await findByText(eventListDiv, "앱 버전 2 기획 설명"),
      ).toBeInTheDocument();
      expect(await findByText(eventListDiv, "회의실 1")).toBeInTheDocument();
      expect(
        await findByText(eventListDiv, "카테고리: 기타"),
      ).toBeInTheDocument();
      expect(
        await findByText(eventListDiv, "알림: 10분 전"),
      ).toBeInTheDocument();
    });

    test("새로운 일정을 생성하고, 달력에 새로운 일정이 입력한대로 저장되는지 확인한다", async () => {
      const { user } = setup(<App />);
      await typeInputs(user);
      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);
      const monthView = await screen.findByTestId("month-view");
      expect(await findByText(monthView, "회의")).toBeInTheDocument();
    });
    test("새로운 일정을 생성하고 생성 토스트를 확인한다", async () => {
      const { user } = setup(<App />);
      await typeInputs(user);

      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);

      const alertdialog = await screen.findByRole("alertdialog");
      expect(alertdialog).toBeVisible();
    });
    test("기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다", async () => {
      const { user } = setup(<App />);
      const editBtns = await screen.findAllByLabelText("Edit event");
      const editBtn = editBtns[0];
      await user.click(editBtn);
      await typeInputs(user, user.clear);
      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);
      const eventListDiv = await screen.findByTestId("event-list");
      expect(await findByText(eventListDiv, "회의")).toBeInTheDocument();
      expect(
        await findByText(eventListDiv, "2024-07-30 15:00 - 16:00"),
      ).toBeInTheDocument();
      expect(
        await findByText(eventListDiv, "앱 버전 2 기획 설명"),
      ).toBeInTheDocument();
      expect(await findByText(eventListDiv, "회의실 1")).toBeInTheDocument();
      expect(
        await findByText(eventListDiv, "카테고리: 기타"),
      ).toBeInTheDocument();
      expect(
        await findByText(eventListDiv, "알림: 10분 전"),
      ).toBeInTheDocument();
    });
    test("일정을 삭제하고 더 이상 조회되지 않는지 확인한다", async () => {
      const { user } = setup(<App />);
      const delBtns = await screen.findAllByLabelText("Delete event");
      const delBtn = delBtns[0];
      await user.click(delBtn);
      expect(screen.queryByText("팀 회의 msw")).not.toBeInTheDocument();
    });
  });

  describe("일정 뷰 및 필터링", () => {
    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      const { user } = setup(<App />);
      // 일정 전부 삭제.
      const delBtns = await screen.findAllByLabelText("Delete event");
      for (let i = 0; i < delBtns.length; i++) {
        await user.click(delBtns[i]);
      }

      const dateSelect = screen.getByLabelText("view");
      await user.selectOptions(dateSelect, ["Week"]);
      const weekCalendar = screen.getByTestId("week-view");

      const weekTasks = queryAllByRole(weekCalendar, "week-task");
      expect(weekTasks.length).toBe(0);
    });
    test("주별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      const { user } = setup(<App />);
      await typeInputs(user);
      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);
      const dateSelect = screen.getByLabelText("view");
      await user.selectOptions(dateSelect, ["Week"]);
      const weekCalendar = screen.getByTestId("week-view");
      expect(await findByText(weekCalendar, "회의")).toBeInTheDocument();
    });
    test("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      const { user } = setup(<App />);
      // 일정 전부 삭제.
      const delBtns = await screen.findAllByLabelText("Delete event");
      for (let i = 0; i < delBtns.length; i++) {
        await user.click(delBtns[i]);
      }
      // delBtns.forEach(async (delBtn) => await user.click(delBtn)); ? 왜 삭제가 안 일어나지?..
      const monthCalendar = screen.getByTestId("month-view");
      const monthTasks = queryAllByRole(monthCalendar, "month-task");
      expect(monthTasks.length).toBe(0);
    });
    test("월별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      const { user } = setup(<App />);
      await typeInputs(user);
      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);
      const monthCalendar = screen.getByTestId("month-view");
      expect(await findByText(monthCalendar, "회의")).toBeInTheDocument();
    });
  });

  describe("알림 기능", () => {
    test("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다", async () => {
      const { user } = setup(<App />);
      await typeInputs(user);
      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);
      vi.setSystemTime(new Date("2024-07-30 14:50:00"));
      expect(
        await screen.findByText("10분 후 회의 일정이 시작됩니다."),
      ).toBeVisible();
    });
  });

  describe("검색 기능", () => {
    test("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다", async () => {
      const { user } = setup(<App />);
      const searchInput = screen.getByLabelText("일정 검색");
      await user.type(searchInput, "회의");
      const tasks = await screen.findAllByRole("task");
      expect(tasks.length).toBe(1);
    });

    test("일치하는 일정이 없으면 '검색 결과가 없습니다.'를 출력한다.", async () => {
      const { user } = setup(<App />);
      const searchInput = screen.getByLabelText("일정 검색");
      await user.type(searchInput, "random text");

      const eventList = screen.getByTestId("event-list");
      expect(
        await findByText(eventList, "검색 결과가 없습니다."),
      ).toBeInTheDocument();
    });

    test("검색어를 지우면 모든 일정이 다시 표시되어야 한다", async () => {
      const { user } = setup(<App />);
      const searchInput = screen.getByLabelText("일정 검색");
      await user.type(searchInput, "팀 회의 msw");
      await user.clear(searchInput);
      const tasks = await screen.findAllByRole("task");
      expect(tasks.length).toBe(1);
    });
  });

  describe("공휴일 표시", () => {
    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", async () => {
      const { user } = setup(<App />);
      const prevBtn = screen.getByLabelText("Previous");
      // 7월을 기준점으로 잡고 현재 몇 월이든 6번만 클릭하도록
      vi.setSystemTime(new Date("2024-07-30 14:50:00"));

      // 현재 7월, 6번 클릭
      for (let i = 0; i < 7; i++) {
        await user.click(prevBtn);
      }
      // 1월 달력
      const calendar = screen.getByTestId("month-view");
      expect(await findByText(calendar, "신정")).toBeInTheDocument();
    });
    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", async () => {
      const { user } = setup(<App />);
      const prevBtn = screen.getByLabelText("Previous");
      vi.setSystemTime(new Date("2024-07-30 14:50:00"));
      for (let i = 0; i < 2; i++) {
        await user.click(prevBtn);
      }
      const calendar = screen.getByTestId("month-view");
      expect(await findByText(calendar, "어린이날")).toBeInTheDocument();
    });
  });

  describe("일정 충돌 감지", () => {
    test("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다", async () => {
      const { user } = setup(<App />);
      const addButton = screen.getByTestId("event-submit-button");

      await typeInputs(user);
      await user.click(addButton);

      await typeInputs(user);
      await user.click(addButton);

      const alertdialog = await screen.findByRole("alertdialog");
      expect(alertdialog).toBeVisible();
    });
    test("기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다", async () => {
      const { user } = setup(<App />);

      await typeInputs(user);

      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      const editBtns = await screen.findAllByLabelText("Edit event");
      const editBtn = editBtns[1];
      await user.click(editBtn);

      const calendarInput = screen.getByLabelText("날짜");
      await user.type(calendarInput, "2024-07-30");

      await user.click(submitButton);

      const alertdialog = await screen.findByRole("alertdialog");
      expect(alertdialog).toBeVisible();
    });
  });
});

const typeInputs = async (user: UserEvent, clear?: any) => {
  const titleInput = screen.getByLabelText("제목");
  clear && (await clear(titleInput));
  await user.type(titleInput, "회의");

  const calendarInput = screen.getByLabelText("날짜");
  await user.type(calendarInput, "2024-07-30");

  const startTimeInput = screen.getByLabelText("시작 시간");
  clear && (await clear(startTimeInput));
  await user.type(startTimeInput, "15:00");

  const endTimeInput = screen.getByLabelText("종료 시간");
  clear && (await clear(endTimeInput));
  await user.type(endTimeInput, "16:00");

  const descriptionInput = screen.getByLabelText("설명");
  clear && (await clear(descriptionInput));
  await user.type(descriptionInput, "앱 버전 2 기획 설명");

  const locationInput = screen.getByLabelText("위치");
  clear && (await clear(locationInput));
  await user.type(locationInput, "회의실 1");

  const categrySelect = screen.getByLabelText("카테고리");
  await user.selectOptions(categrySelect, ["기타"]);

  const alarmSelect = screen.getByLabelText("알림 설정");
  await user.selectOptions(alarmSelect, ["10분 전"]);
};
