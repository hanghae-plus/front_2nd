import { render, screen, getByText } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import { ReactNode } from "react";

import EventForm from "../components/EventForm";
import WeekView from "../components/WeekView";
import MonthView from "../components/MonthView";
import { Event } from "../types/type";

const setup = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  return { user, ...render(component) };
};

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

describe("Advanced", () => {
  describe("EventForm 컴포넌트", () => {
    test("모든 필드가 채워지면 경고창이 뜨지 않는다.", async () => {
      const { user } = setup(
        <EventForm
          addOrUpdateEvent={() => {}}
          editingEvent={null}
          findOverlappingEvents={() => []}
          setEditingEvent={() => {}}
          setNewEvent={() => {}}
          setOverlappingEvents={() => {}}
          setIsOverlapDialogOpen={() => {}}
        />,
      );

      // 모든 필드 입력
      await typeInputs(user);
      const addButton = screen.getByRole("button", {
        name: /일정 추가/i,
      });
      await user.click(addButton);

      expect(screen.queryByText("필수 정보를 모두 입력해주세요.")).toBe(null);
    });
  });

  describe("일정보기 컴포넌트", () => {
    test("[ WeekView ] prop으로 넘겨진 데이터를 표시된다", async () => {
      vi.setSystemTime(new Date("2024-07-30 14:50:00"));
      const currentDate = new Date();
      const events: Event[] = [
        {
          id: 1,
          title: "팀 회의 msw",
          date: "2024-07-30",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 팀 미팅",
          location: "회의실 A",
          category: "업무",
          repeat: { type: "weekly", interval: 1 },
          notificationTime: 1,
        },
      ];
      setup(
        <WeekView
          currentDate={currentDate}
          weekDays={weekDays}
          filteredEvents={events}
          notifiedEvents={[]}
        />,
      );
      const weekCalendar = screen.getByTestId("week-view");
      expect(getByText(weekCalendar, "팀 회의 msw")).toBeInTheDocument();
    });
    test("[ MonthView ] prop으로 넘겨진 데이터를 표시된다", async () => {
      vi.setSystemTime(new Date("2024-07-30 14:50:00"));
      const currentDate = new Date();
      const events: Event[] = [
        {
          id: 1,
          title: "팀 회의 msw",
          date: "2024-07-20",
          startTime: "10:00",
          endTime: "11:00",
          description: "주간 팀 미팅",
          location: "회의실 A",
          category: "업무",
          repeat: { type: "weekly", interval: 1 },
          notificationTime: 1,
        },
      ];

      setup(
        <MonthView
          currentDate={currentDate}
          weekDays={weekDays}
          filteredEvents={events}
          holidays={{}}
          notifiedEvents={[1]}
        />,
      );
      const monthCalendar = screen.getByTestId("month-view");
      expect(getByText(monthCalendar, "팀 회의 msw")).toBeInTheDocument();
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
