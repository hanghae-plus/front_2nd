import { render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import EventList from "../EventList";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { ReactNode } from "react";
import { Event } from "../../../App";

const setup = (componet: ReactNode) => {
  const user = userEvent.setup();

  return {
    user,
    ...render(componet),
  };
};

// const fillInputElement = async (
//   element: HTMLInputElement,
//   user: UserEvent,
//   value: string
// ) => {
//   await user.clear(element);
//   await user.type(element, value);
// };

describe("EventList에 대해 테스트를 합니다.", () => {
  const mockSetSearchTerm = vi.fn();
  const mockEditEvent = vi.fn();
  const mockDeleteEvent = vi.fn();

  const mockEvents = [
    {
      id: 1,
      title: "회의",
      date: "2024-08-01",
      startTime: "10:00",
      endTime: "11:00",
      description: "팀 미팅",
      location: "회의실 A",
      category: "업무",
      repeat: { type: "none", interval: 0 },
      notificationTime: 10,
    },
    {
      id: 2,
      title: "점심 약속",
      date: "2024-08-03",
      startTime: "12:00",
      endTime: "13:00",
      description: "동료와 점심",
      location: "레스토랑",
      category: "개인",
      repeat: { type: "none", interval: 0 },
      notificationTime: 60,
    },
  ];

  const defaultProps = {
    searchTerm: "",
    setSearchTerm: mockSetSearchTerm,
    filteredEvents: mockEvents as Event[],
    notifiedEvents: [1],
    editEvent: mockEditEvent,
    deleteEvent: mockDeleteEvent,
  };

  test("props를 받아서 제대로 렌더링 되는지 확인합니다.", async () => {
    const date = new Date("2024-08-01");

    vi.setSystemTime(date);

    render(<EventList {...defaultProps} />);
    expect(await screen.findByText("회의")).toBeInTheDocument();
    expect(await screen.findByText("점심 약속")).toBeInTheDocument();
  });

  test('데이터가 존재하지 않는 다면 "검색 결과가 없습니다"를 표기합니다.', async () => {
    render(<EventList {...defaultProps} filteredEvents={[]} />);
    expect(
      await screen.findByText("검색 결과가 없습니다.")
    ).toBeInTheDocument();
  });

  test("수정 버튼을 누르면 edit함수가 실행됩니다.", async () => {
    const { user } = setup(<EventList {...defaultProps} />);
    const editButtons = screen.getAllByLabelText("Edit event");
    await user.click(editButtons[0]);
    expect(mockEditEvent).toHaveBeenCalledWith(mockEvents[0]);
  });

  test("삭제 버튼을 누르면 더 이상 조회되지 않습니다.", async () => {
    const date = new Date("2024-08-01");

    vi.setSystemTime(date);
    const { user } = setup(<EventList {...defaultProps} />);

    const deleteButton = await screen.findAllByRole("button", {
      name: "Delete event",
    });

    await user.click(deleteButton[0]);
  });
});
