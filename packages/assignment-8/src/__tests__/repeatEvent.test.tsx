import {
  findAllByLabelText,
  findAllByText,
  getAllByRole,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

import { ReactNode } from "react";
import {
  typeEndCondCount,
  typeRepeatEndEvent,
  typeRepeatEvent,
  typeThreeDaysRepeatEvent,
} from "./testUtils/utils";

const setup = (component: ReactNode) => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  return { user, ...render(component) };
};

describe("반복 일정 통합 테스트", () => {
  describe("반복 유형 선택", () => {
    describe("일정 생성 또는 수정 시 반복 유형을 선택할 수 있다.", () => {
      test("일정 생성 시 반복 유형을 선택할 수 있어야 한다.", async () => {
        const { user } = setup(<App />);

        const repeatEventCheckbox = screen.getByRole("repeat-event");
        await user.click(repeatEventCheckbox);

        const repeatEventTypeSelector = screen.getByLabelText("반복 유형");
        await user.selectOptions(repeatEventTypeSelector, "매일");

        const repeatFeqInput = screen.getByLabelText("반복 간격");
        user.clear(repeatFeqInput);
        await user.type(repeatFeqInput, "1");

        const repeatEndCondselect = screen.getByLabelText("반복 종료 조건");
        await user.selectOptions(repeatEndCondselect, "날짜");

        const repeatEndDateInput = screen.getByLabelText("반복 종료일");
        await user.type(repeatEndDateInput, "2024-08-06");

        const foundRepeatEventTypeSelector = (await screen.findByLabelText(
          "반복 유형",
        )) as HTMLInputElement;
        const foundRepeatFeqInput = (await screen.findByLabelText(
          "반복 간격",
        )) as HTMLInputElement;

        const foundRepeatEndDateInput = (await screen.findByLabelText(
          "반복 종료일",
        )) as HTMLInputElement;

        expect(foundRepeatEventTypeSelector.value).toBe("daily");
        expect(foundRepeatFeqInput.value).toBe("1");
        expect(foundRepeatEndDateInput.value).toBe("2024-08-06");
      });
      test("일정 수정 시 반복 유형을 선택할 수 있어야 한다.", async () => {
        const { user } = setup(<App />);

        const editBtns = await screen.findAllByLabelText("Edit event");
        const editBtn = editBtns[0];
        await user.click(editBtn);

        const repeatEventTypeSelector = screen.getByLabelText("반복 유형");
        await user.selectOptions(repeatEventTypeSelector, "매주");

        const repeatFeqInput = screen.getByLabelText("반복 간격");
        user.clear(repeatFeqInput);
        await user.type(repeatFeqInput, "2");

        const repeatEndCondselect = screen.getByLabelText("반복 종료 조건");
        await user.selectOptions(repeatEndCondselect, "날짜");

        const repeatEndDateInput = screen.getByLabelText("반복 종료일");
        await user.type(repeatEndDateInput, "2024-08-10");

        const foundRepeatEventTypeSelector = (await screen.findByLabelText(
          "반복 유형",
        )) as HTMLInputElement;
        const foundRepeatFeqInput = (await screen.findByLabelText(
          "반복 간격",
        )) as HTMLInputElement;

        const foundRepeatEndDateInput = (await screen.findByLabelText(
          "반복 종료일",
        )) as HTMLInputElement;
        expect(foundRepeatEventTypeSelector.value).toBe("weekly");
        expect(foundRepeatFeqInput.value).toBe("2");
        expect(foundRepeatEndDateInput.value).toBe("2024-08-10");
      });
    });
    describe("반복 유형은 다음과 같다: 매일, 매주, 매월, 매년", () => {
      test("반복 유형 설렉트의 옵션값은 매일, 매주, 매월, 매년이 있다.", async () => {
        const { user } = setup(<App />);

        const repeatEventCheckbox = screen.getByRole("repeat-event");
        await user.click(repeatEventCheckbox);

        const repeatEventTypeSelect = screen.getByLabelText("반복 유형");
        const options = getAllByRole(
          repeatEventTypeSelect,
          "option",
        ) as HTMLInputElement[];
        const optionValues = options.map((option) => option.value);

        expect(optionValues).toEqual([
          "none",
          "daily",
          "weekly",
          "monthly",
          "yearly",
        ]);
      });
    });
  });

  describe("반복 간격 설정", () => {
    test("각 반복 유형에 대해 간격을 설정할 수 있다", async () => {
      const { user } = setup(<App />);

      const repeatEventCheckbox = screen.getByRole("repeat-event");
      await user.click(repeatEventCheckbox);

      const repeatFeqInput = screen.getByLabelText("반복 간격");
      user.clear(repeatFeqInput);
      await user.type(repeatFeqInput, "1");

      const foundRepeatFeqInput = (await screen.findByLabelText(
        "반복 간격",
      )) as HTMLInputElement;

      expect(foundRepeatFeqInput.value).toBe("1");
    });
  });

  describe("반복 일정 표시", () => {
    test("반복 일정을 입력 후 일정을 생성할 수 있다.", async () => {
      const { user } = setup(<App />);

      await typeRepeatEvent(user);

      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);

      const eventListDiv = await screen.findByTestId("event-list");
      const lastGeneratedEvens = await findAllByText(
        eventListDiv,
        "반복: 1주마다 (종료: 2024-08-29)",
      );
      expect(
        lastGeneratedEvens[lastGeneratedEvens.length - 1],
      ).toBeInTheDocument();
    });
    test("3일 반복 일정 생성시 주별 뷰에 일정이 반복해서 표시되는지 확인한다.", async () => {
      const { user } = setup(<App />);

      await typeThreeDaysRepeatEvent(user);

      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);

      const dateSelect = screen.getByLabelText("view");
      await user.selectOptions(dateSelect, ["Week"]);

      // 반복 일정 3일인 일정
      const weekCalendar = screen.getByTestId("week-view");
      const repeatEvents = await findAllByText(weekCalendar, "회의1");
      expect(repeatEvents.length).toBe(2);
    });
    test("3일 반복 일정 생성시 월별 뷰에 일정이 반복해서 표시되는지 확인한다.", async () => {
      const { user } = setup(<App />);

      await typeThreeDaysRepeatEvent(user);

      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);

      // 반복 일정 3일인 일정
      const weekCalendar = screen.getByTestId("month-view");
      const repeatEvents = await findAllByText(weekCalendar, "회의1");
      expect(repeatEvents.length).toBe(8);
    });
    test("반복 종료일자 이후에 주별뷰에서 일정이 표시되면 안 된다.", async () => {
      const { user } = setup(<App />);

      await typeRepeatEndEvent(user);

      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);

      const dateSelect = screen.getByLabelText("view");
      await user.selectOptions(dateSelect, ["Week"]);
      const weekCalendar = screen.getByTestId("week-view");
      const repeatEvents = await findAllByText(weekCalendar, "반복 종료");
      expect(repeatEvents.length).toBe(4);
    });
    test("반복 종료일자 이후에 월별뷰에서 일정이 표시되면 안 된다.", async () => {
      const { user } = setup(<App />);

      await typeRepeatEndEvent(user);

      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);

      const monthCalendar = screen.getByTestId("month-view");
      const repeatEvents = await findAllByText(monthCalendar, "반복 종료");
      expect(repeatEvents.length).toBe(4);
    });
  });

  describe("반복 종료 조건을 선택 할 수 있다.", () => {
    test("반복 종료 조건으로 횟수를 선택 할 수 있다.", async () => {
      const { user } = setup(<App />);

      await typeEndCondCount(user);

      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);

      // 반복 종료 횟수 => 3
      const monthCalendar = screen.getByTestId("month-view");
      const repeatEvents = await findAllByText(monthCalendar, "반복 종료 조건");
      expect(repeatEvents.length).toBe(3);
    });
  });

  describe("반복 일정을 수정 및 삭제 할 수 있다.", () => {
    test("반복 일정의 단일 일정을 수정할 수 있다.", async () => {
      const { user } = setup(<App />);

      await typeEndCondCount(user);

      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);

      const eventListDiv = await screen.findByTestId("event-list");

      const editBtns = await findAllByLabelText(eventListDiv, "Edit event");
      await user.click(editBtns[2]);
      const titleInput = screen.getByLabelText("제목");
      await user.clear(titleInput);
      await user.type(titleInput, "반복 일정 수정");

      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      const editedEvents = await findAllByText(eventListDiv, "반복 일정 수정");
      expect(editedEvents.length).toBe(1);
    });

    test("반복 일정의 단일 일정을 삭제할 수 있다.", async () => {
      const { user } = setup(<App />);

      await typeEndCondCount(user);

      const addButton = screen.getByRole("button", { name: "일정 추가" });
      await user.click(addButton);

      const eventListDiv = await screen.findByTestId("event-list");

      const delBtns = await findAllByLabelText(eventListDiv, "Delete event");
      await user.click(delBtns[2]);

      // 3개 생성 후 1개 삭제
      const editedEvents = await findAllByText(eventListDiv, "반복 종료 조건");
      expect(editedEvents.length).toBe(2);
    });
  });
});
