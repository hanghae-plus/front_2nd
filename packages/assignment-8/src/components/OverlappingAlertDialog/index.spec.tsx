import { render, screen } from "@testing-library/react";
import OverlappingAlertDialog from ".";
import { RepeatType } from "../../types/event";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";

const mockOverlappingEvents = [
  {
    id: 1,
    title: "test",
    date: "2024-08-02",
    startTime: "10:00",
    endTime: "11:00",
    description: "test",
    location: "test",
    category: "test",
    repeat: { type: "daily" as RepeatType, interval: 1 },
    notificationTime: 1,
  },
];

const setup = (component: ReactNode) => {
  const user = userEvent.setup();

  return {
    user,
    ...render(component),
  };
};

const mockCloseFn = vi.fn();
const mockContinueFn = vi.fn();

describe("OverlappingAlertDialog", () => {
  it("취소 버튼을 클릭하면 onClose 함수가 호출된다", async () => {
    const { user } = setup(
      <OverlappingAlertDialog
        onClose={mockCloseFn}
        onContinue={mockContinueFn}
        overlappingEvents={mockOverlappingEvents}
        isOpen={true}
      />
    );
    await user.click(screen.getByText("취소"));

    expect(mockCloseFn).toBeCalledTimes(1);
  });

  it("계속 진행 버튼을 클릭하면 onContinue 함수가 호출된다", async () => {
    const { user } = setup(
      <OverlappingAlertDialog
        onClose={mockCloseFn}
        onContinue={mockContinueFn}
        overlappingEvents={mockOverlappingEvents}
        isOpen={true}
      />
    );
    await user.click(screen.getByText("계속 진행"));

    expect(mockContinueFn).toBeCalledTimes(1);
  });

  it("겹치는 일정이 노출된다", () => {
    setup(
      <OverlappingAlertDialog
        onClose={mockCloseFn}
        onContinue={mockContinueFn}
        overlappingEvents={mockOverlappingEvents}
        isOpen={true}
      />
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    mockOverlappingEvents.forEach((event) => {
      const eventText = `${event.title} (${event.date} ${event.startTime}-${event.endTime})`;
      expect(screen.getByText(eventText)).toBeInTheDocument();
    });
  });
});
