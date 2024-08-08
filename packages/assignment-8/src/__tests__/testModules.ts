import { Event } from "@/types";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";

export const clearEventForm = async () => {
  await userEvent.clear(screen.getByLabelText("제목"));
  await userEvent.clear(screen.getByLabelText("날짜"));
  await userEvent.clear(screen.getByLabelText("시작 시간"));
  await userEvent.clear(screen.getByLabelText("종료 시간"));
  await userEvent.clear(screen.getByLabelText("설명"));
  await userEvent.clear(screen.getByLabelText("위치"));
};

export const typeEventForm = async (event: Omit<Event, "id">) => {
  await userEvent.type(screen.getByLabelText("제목"), event.title);
  await userEvent.type(screen.getByLabelText("날짜"), event.date);
  await userEvent.type(screen.getByLabelText("시작 시간"), event.startTime);
  await userEvent.type(screen.getByLabelText("종료 시간"), event.endTime);
  await userEvent.type(screen.getByLabelText("설명"), event.description);
  await userEvent.type(screen.getByLabelText("위치"), event.location);
  await userEvent.selectOptions(
    screen.getByLabelText("카테고리"),
    event.category
  );
  await userEvent.selectOptions(
    screen.getByLabelText("알림 설정"),
    `${event.notificationTime}`
  );

  const $repetitionCheckBox = screen.getByLabelText(
    "반복 설정"
  ) as HTMLInputElement;
  const isRepetitionChecked = $repetitionCheckBox.checked;
  if (event.repeat.type === "none") {
    if (isRepetitionChecked) {
      await userEvent.click($repetitionCheckBox);
    }
    return;
  }

  if (!isRepetitionChecked) {
    await userEvent.click(screen.getByLabelText("반복 설정"));
  }
  await userEvent.selectOptions(
    screen.getByLabelText("반복 유형"),
    event.repeat.type
  );

  await userEvent.clear(screen.getByLabelText("반복 간격"));
  await userEvent.type(
    screen.getByLabelText("반복 간격"),
    event.repeat.interval.toString()
  );

  if (!event.repeat.endDate) {
    return;
  }

  await userEvent.type(
    screen.getByLabelText("반복 종료일"),
    event.repeat.endDate
  );
};

export const expectEventListHasEvent = async (event: Omit<Event, "id">) => {
  const $eventList = await screen.findByTestId("event-list");

  await waitFor(() => {
    const eventText = [
      event.title,
      event.date,
      event.startTime,
      event.endTime,
      event.description,
      event.location,
      event.category,
    ];

    eventText.forEach((text) => {
      expect($eventList).toHaveTextContent(text);
    });
  });
};
