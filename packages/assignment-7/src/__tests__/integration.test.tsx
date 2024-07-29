import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { setupServer } from "msw/node";
import { handlers } from "../../mock/handler";

const server = setupServer(...handlers);

describe("일정 관리 애플리케이션 통합 테스트", () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  describe("일정 CRUD 및 기본 기능", () => {
    // dummy test
    // const eventExample = {
    //   id: 2,
    //   title: "점심 약속",
    //   date: "2024-07-21",
    //   startTime: "12:30",
    //   endTime: "13:30",
    //   description: "동료와 점심 식사",
    //   location: "회사 근처 식당",
    //   category: "개인",
    //   repeat: {
    //     type: "none",
    //     interval: 0,
    //   },
    //   notificationTime: 1,
    // };
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
    });

    test.only("새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다", async () => {
      render(<App />);

      const newData = {
        title: "항해 플러스 파티",
        date: "2024-07-23",
        startTime: "06:30",
        endTime: "11:30",
        category: "기타",
        description: "파티는 끝나지 않아..",
        location: "선릉역",
        notificationTime: "120",
        repeat: {
          endDate: "2024-07-29",
          interval: 10,
          type: "weekly",
        },
      };

      //초기 데이터
      // expect(await screen.findByText("팀 회의")).toBeInTheDocument();
      // expect(await screen.findByText("점심 약속")).toBeInTheDocument();

      // Name이 label이지만 Input요소 접근이 가능..?
      const titleInput = screen.getByRole("textbox", { name: "제목" });
      await user.type(titleInput, newData.title);
      expect(titleInput).toHaveValue(newData.title);

      const dateInput = screen.getByLabelText("날짜");
      await user.type(dateInput, newData.date);
      expect(dateInput).toHaveValue(newData.date);

      const startTimeInput = screen.getByLabelText("시작 시간");
      await user.type(startTimeInput, newData.startTime);
      expect(startTimeInput).toHaveValue(newData.startTime);

      const endTimeInput = screen.getByLabelText("종료 시간");
      await user.type(endTimeInput, newData.endTime);
      expect(endTimeInput).toHaveValue(newData.endTime);

      const descriptionInput = screen.getByLabelText("설명");
      await user.type(descriptionInput, newData.description);
      expect(descriptionInput).toHaveValue(newData.description);

      const positionInput = screen.getByLabelText("위치");
      await user.type(positionInput, newData.location);
      expect(positionInput).toHaveValue(newData.location);

      const categoryInput = screen.getByLabelText("카테고리");
      expect(categoryInput).toHaveValue("");
      await user.selectOptions(categoryInput, newData.category);
      expect(categoryInput).toHaveValue(newData.category);

      const repeatCheckbox = screen.getByRole("checkbox");
      await user.click(repeatCheckbox);
      expect(repeatCheckbox).toBeChecked();

      // 체크 되었을 때 렌더링 되는지 확인하고 가는게 좋을까?? 그냥 element 테스트 하면 확인되는게 아닐까?
      const alarmSelectBox = screen.getByLabelText("알림 설정");
      expect(alarmSelectBox).toHaveValue("10");
      await user.selectOptions(alarmSelectBox, "2시간 전");
      expect(alarmSelectBox).toHaveValue(newData.notificationTime);

      const repeatTypeSelectBox = screen.getByLabelText("반복 유형");
      expect(repeatTypeSelectBox).toHaveValue("daily");
      await user.selectOptions(repeatTypeSelectBox, "매주");
      expect(repeatTypeSelectBox).toHaveValue(newData.repeat.type);

      // 이건 왜 spinbutton이래..?
      const alarmTermInput = screen.getByRole("spinbutton", {
        name: "반복 간격",
      });
      expect(alarmTermInput).toHaveValue(1);
      await user.clear(alarmTermInput);
      await user.type(alarmTermInput, "10");
      expect(alarmTermInput).toHaveValue(10);

      const repeatEndDateInput = screen.getByLabelText("반복 종료일");
      await user.type(repeatEndDateInput, "2024-07-29");
      expect(repeatEndDateInput).toHaveValue("2024-07-29");

      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      const res = await fetch("/api/events");
      const data = await res.json();

      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: newData.title,
            date: newData.date,
            startTime: newData.startTime,
            endTime: newData.endTime,
          }),
        ])
      );
    });

    test.fails(
      "기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다"
    );
    test.fails("일정을 삭제하고 더 이상 조회되지 않는지 확인한다");
  });

  describe("일정 뷰 및 필터링", () => {
    const user = userEvent.setup();
    beforeAll(() => server.listen());

    afterAll(() => server.close());

    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      render(<App />);

      const selectBox = screen.getByRole("combobox", {
        name: "view",
      }) as HTMLSelectElement;

      await user.selectOptions(selectBox, "week");

      expect(selectBox).toHaveValue("week");
    });

    test.fails("주별 뷰에 일정이 정확히 표시되는지 확인한다");
    test.fails("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.");
    test.fails("월별 뷰에 일정이 정확히 표시되는지 확인한다");
  });

  describe("알림 기능", () => {
    test.fails("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다");
  });

  describe("검색 기능", () => {
    test.fails("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다");
    test.fails("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다");
    test.fails("검색어를 지우면 모든 일정이 다시 표시되어야 한다");
  });

  describe("공휴일 표시", () => {
    test.fails("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다");
    test.fails("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다");
  });

  describe("일정 충돌 감지", () => {
    test.fails("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다");
    test.fails(
      "기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다"
    );
  });
});
