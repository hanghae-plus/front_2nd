import { beforeEach, describe, expect, test, vi } from "vitest";
import { waitFor, render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { Event } from "../types";
import EventList from "../components/EventList";

const events: Event[] = [
  {
    id: 1,
    title: "팀 회의",
    date: "2024-07-20",
    startTime: "10:00",
    endTime: "11:00",
    description: "주간 팀 미팅",
    location: "회의실 A",
    category: "업무",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 2,
    title: "점심 약속",
    date: "2024-07-21",
    startTime: "12:30",
    endTime: "13:30",
    description: "동료와 점심 식사",
    location: "회사 근처 식당",
    category: "개인",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
  {
    id: 3,
    title: "프로젝트 마감",
    date: "2024-07-25",
    startTime: "09:00",
    endTime: "18:00",
    description: "분기별 프로젝트 마감",
    location: "사무실",
    category: "업무",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
];

describe("component 테스트: list", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  vi.setSystemTime(new Date("2024-07-21"));
  const setSearchTerm = vi.fn();
  const setEditEvent = vi.fn();
  const fetchEvent = vi.fn();

  const eventListProp = {
    searchTerm: "",
    setSearchTerm: setSearchTerm,
    events,
    view: "month" as "month" | "week",
    currentDate: new Date(),
    notifiedEvents: [],
    setEditingEvent: setEditEvent,
    fetchEvents: fetchEvent,
  };

  test("현재 캘린더에 보이는 모든 일정 목록 출력", async () => {
    render(<EventList {...eventListProp} />);

    expect(await screen.findByText("팀 회의")).toBeInTheDocument();
    expect(await screen.findByText("점심 약속")).toBeInTheDocument();
    expect(await screen.findByText("프로젝트 마감")).toBeInTheDocument();
  });

  test("현재 캘린더에 보이는 일정 상세 정보 출력", async () => {
    render(<EventList {...eventListProp} />);

    expect(await screen.findByText("점심 약속")).toBeInTheDocument();
    expect(
      await screen.findByText("2024-07-21 12:30 - 13:30")
    ).toBeInTheDocument();
    expect(await screen.findByText("동료와 점심 식사")).toBeInTheDocument();
    expect(await screen.findByText("회사 근처 식당")).toBeInTheDocument();
    expect(await screen.findByText("점심 약속")).toBeInTheDocument();
    expect(await screen.findByText("카테고리: 개인")).toBeInTheDocument();
  });

  test("삭제 버튼 클릭 시 일정 삭제", async () => {
    render(<EventList {...eventListProp} />);

    const deleteBtn = await screen.findAllByRole("button", {
      name: "Delete event",
    });

    await user.click(deleteBtn[0]);

    await waitFor(() => {
      expect(screen.queryByText("팀 회의")).not.toEqual(null);
    });
  });

  test("일정이 없으면 검색 결과 없음 출력", async () => {
    vi.setSystemTime("2020-01-01");
    render(<EventList {...eventListProp} currentDate={new Date()} />);

    expect(
      await screen.findByText("검색 결과가 없습니다.")
    ).toBeInTheDocument();
  });
});
