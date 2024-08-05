import { describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import App from "../App";
import { ReactNode } from "react";
import { Event } from "../types/types";
import { DUMMY_DATA } from "../../mock/handler";

const setup = (componet: ReactNode) => {
  const user = userEvent.setup();

  return {
    user,
    ...render(componet),
  };
};

const fillInputElement = async (
  element: HTMLInputElement,
  user: UserEvent,
  value: string
) => {
  await user.clear(element);
  await user.type(element, value);
};

describe("일정 관리 애플리케이션 통합 테스트", () => {
  const newData = {
    title: "항해 플러스 파티",
    date: "2024-08-24",
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

  describe("msw를 통한 api호출이 되는지 검증", () => {
    test("msw에서 세팅한 get요청", async () => {
      const res = await fetch("/api/events");
      const data = await res.json();
      expect(data).toEqual(DUMMY_DATA);
    });

    test("msw에서 세팅한 post요청", async () => {
      const newData: Event = {
        id: 10,
        title: "스터디 시간",
        date: "2024-07-01",
        startTime: "13:00",
        endTime: "15:00",
        category: "기타",
        description: "자율 스터디",
        location: "안양",
        repeat: { type: "weekly", interval: 1 },
        notificationTime: 1,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(newData),
      });

      const body = await res.json();
      expect(body).toEqual(newData);
    });

    test("msw에서 세팅한 put요청", async () => {
      const tempData: Event = {
        id: 5,
        title: "운동",
        date: "2024-07-22",
        startTime: "18:00",
        endTime: "19:00",
        description: "주간 운동",
        location: "헬스장",
        category: "개인",
        repeat: { type: "weekly", interval: 1 },
        notificationTime: 1,
      };

      const getRes = await fetch("/api/events");
      const getResData = (await getRes.json()) as Event[];

      // 배열에 특정 요소가 있는지 확인(초기값 확인)
      expect(getResData).toEqual(expect.arrayContaining([tempData]));

      const newData: Event = {
        id: 5,
        title: "클라이밍",
        date: "2024-07-22",
        startTime: "18:00",
        endTime: "19:00",
        description: "주간 운동",
        location: "클라이밍장",
        category: "개인",
        repeat: { type: "weekly", interval: 10 },
        notificationTime: 1,
      };

      const putRes = await fetch(`/api/events/${tempData.id}`, {
        method: "PUT",
        body: JSON.stringify(newData),
      });

      const putResData = (await putRes.json()) as Event;
      expect(putResData).toEqual(newData);
    });

    test("msw에서 세팅한 delete요청", async () => {
      const tempData: Event = {
        id: 5,
        title: "운동",
        date: "2024-07-22",
        startTime: "18:00",
        endTime: "19:00",
        description: "주간 운동",
        location: "헬스장",
        category: "개인",
        repeat: { type: "weekly", interval: 1 },
        notificationTime: 1,
      };

      const deleteRes = await fetch(`/api/events/${tempData.id}`, {
        method: "DELETE",
      });

      await deleteRes.json();

      const res = await fetch("/api/events");
      const data = (await res.json()) as Event[];

      expect(data.find((event) => event.id === tempData.id)).toBeUndefined();
    });
  });

  describe("일정 CRUD 및 기본 기능", () => {
    test("새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다", async () => {
      const date = new Date("2024-08-01");

      vi.setSystemTime(date);
      const { user } = setup(<App />);

      await fillInputElement(
        screen.getByLabelText("제목"),
        user,
        newData.title
      );

      await fillInputElement(screen.getByLabelText("날짜"), user, newData.date);

      await fillInputElement(
        screen.getByLabelText("시작 시간"),
        user,
        newData.startTime
      );

      await fillInputElement(
        screen.getByLabelText("종료 시간"),
        user,
        newData.endTime
      );

      await fillInputElement(
        screen.getByLabelText("설명"),
        user,
        newData.description
      );

      await fillInputElement(
        screen.getByLabelText("위치"),
        user,
        newData.location
      );

      const categoryInput = screen.getByLabelText("카테고리");
      await user.selectOptions(categoryInput, newData.category);

      const repeatCheckbox = screen.getByRole("checkbox");
      await user.click(repeatCheckbox);
      expect(repeatCheckbox).toBeChecked();

      // 체크 되었을 때 렌더링 되는지 확인하고 가는게 좋을까?? 그냥 element 테스트 하면 확인되는게 아닐까?
      const alarmSelectBox = screen.getByLabelText("알림 설정");
      await user.selectOptions(alarmSelectBox, "2시간 전");

      const repeatTypeSelectBox = screen.getByLabelText("반복 유형");
      await user.selectOptions(repeatTypeSelectBox, "매주");

      await fillInputElement(
        screen.getByRole("spinbutton", {
          name: "반복 간격",
        }),
        user,
        newData.location
      );

      await fillInputElement(
        screen.getByLabelText("반복 종료일"),
        user,
        newData.repeat.endDate
      );

      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      const titleElements = await screen.findAllByText(newData.title);
      expect(titleElements.length).toBeGreaterThan(0);
      expect(
        await screen.findByText(
          `${newData.date} ${newData.startTime} - ${newData.endTime}`
        )
      ).toBeInTheDocument();
      expect(await screen.findByText(newData.description)).toBeInTheDocument();
      expect(await screen.findByText(newData.location)).toBeInTheDocument();
      expect(await screen.findByText(newData.category)).toBeInTheDocument();
      expect(await screen.findByText("알림: 2시간 전")).toBeInTheDocument();
    });

    test("기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다", async () => {
      const date = new Date("2024-08-01");

      vi.setSystemTime(date);
      const { user } = setup(<App />);
      const editButton = await screen.findAllByRole("button", {
        name: "Edit event",
      });

      await user.click(editButton[0]);

      await fillInputElement(
        screen.getByLabelText("제목"),
        user,
        newData.title
      );

      await fillInputElement(screen.getByLabelText("날짜"), user, newData.date);

      await fillInputElement(
        screen.getByLabelText("시작 시간"),
        user,
        newData.startTime
      );

      await fillInputElement(
        screen.getByLabelText("종료 시간"),
        user,
        newData.endTime
      );

      const categoryInput = screen.getByLabelText("카테고리");
      await user.selectOptions(categoryInput, "");
      expect(categoryInput).toHaveValue("");
      await user.selectOptions(categoryInput, newData.category);
      expect(categoryInput).toHaveValue(newData.category);

      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      const titleElements = await screen.findAllByText(newData.title);
      expect(titleElements.length).toBeGreaterThan(0);
      expect(
        await screen.findByText(
          `${newData.date} ${newData.startTime} - ${newData.endTime}`
        )
      ).toBeInTheDocument();
      expect(await screen.findByText(newData.category)).toBeInTheDocument();
    });

    test("일정을 삭제하고 더 이상 조회되지 않는지 확인한다", async () => {
      const { user } = setup(<App />);

      const deleteButton = await screen.findAllByRole("button", {
        name: "Delete event",
      });

      const textElement = await screen.findAllByTestId("event-title");
      const targetTitle = textElement[0].textContent;

      await user.click(deleteButton[0]);

      const elements = screen.queryAllByText(targetTitle as string);
      expect(elements).toHaveLength(0);
    });
  });

  describe("일정 뷰 및 필터링", () => {
    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      const date = new Date("2024-07-03");
      vi.setSystemTime(date);
      const { user } = setup(<App />);

      // 주별 뷰로 전환
      const viewSelect = screen.getByLabelText("view") as HTMLSelectElement;
      await user.selectOptions(viewSelect, "week");
      expect(viewSelect.value).toBe("week");

      expect(
        await screen.findByText("검색 결과가 없습니다.")
      ).toBeInTheDocument();
    });

    test("주별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      const date = new Date("2024-07-22");
      vi.setSystemTime(date);
      const { user } = setup(<App />);

      const viewSelect = screen.getByLabelText("view");
      await user.selectOptions(viewSelect, "week");

      const elements = screen.queryAllByText("검색 결과가 없습니다.");

      expect(elements).toHaveLength(0);
    });
    test("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      const date = new Date("2024-06-01");
      vi.setSystemTime(date);
      const { user } = setup(<App />);

      // 월별 뷰로 전환
      const viewSelect = screen.getByLabelText("view");
      await user.selectOptions(viewSelect, "month");

      expect(
        await screen.findByText("검색 결과가 없습니다.")
      ).toBeInTheDocument();
    });
    test("월별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-07-24"));
      const { user } = setup(<App />);

      const viewSelect = screen.getByLabelText("view");
      await user.selectOptions(viewSelect, "month");

      const elements = screen.queryAllByText("검색 결과가 없습니다.");
      expect(elements).toHaveLength(0);
    });
  });

  describe("알림 기능", () => {
    test("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다", async () => {
      const date = new Date("2024-07-22T17:59:15");
      vi.setSystemTime(date);

      setup(<App />);

      expect(
        await screen.findByText("1분 후 운동 일정이 시작됩니다.")
      ).toBeInTheDocument();
    });
  });

  describe("검색 기능", () => {
    test("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다", async () => {
      const date = new Date("2024-07-24");

      vi.setSystemTime(date);
      const { user } = setup(<App />);

      await fillInputElement(screen.getByLabelText("일정 검색"), user, "운동");

      const eventTitleElements = screen.getAllByTestId("event-title");

      const exerciseEvent = eventTitleElements.find((element) =>
        within(element).getByText("운동")
      );

      expect(exerciseEvent?.textContent).toBe("운동");
    });
    test("검색어를 지우면 모든 일정이 다시 표시되어야 한다", async () => {
      const date = new Date("2024-07-01");

      vi.setSystemTime(date);
      const { user } = setup(<App />);

      const searchInput = screen.getByLabelText(
        "일정 검색"
      ) as HTMLInputElement;
      await fillInputElement(searchInput, user, "운동");

      const eventTitleElements = screen.getAllByTestId("event-title");

      const exerciseEvent = eventTitleElements.find((element) =>
        within(element).getByText("운동")
      );

      expect(exerciseEvent?.textContent).toBe("운동");
      await user.clear(searchInput);

      const originEventTitleElements = screen.getAllByTestId("event-title");
      const [travelTitleElement, excersizeTitleElement] =
        originEventTitleElements;

      expect(travelTitleElement.textContent).toBe("여행");
      expect(excersizeTitleElement.textContent).toBe("운동");
    });
  });

  describe("공휴일 표시", () => {
    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-01-01"));
      setup(<App />);

      expect(await screen.findByText("신정")).toBeInTheDocument();
    });
    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", async () => {
      vi.setSystemTime(new Date("2024-05-05"));
      setup(<App />);

      expect(await screen.findByText("어린이날")).toBeInTheDocument();
    });
  });

  describe("일정 충돌 감지", () => {
    const duplicateData = {
      title: "피자 파티",
      date: "2024-07-22",
      startTime: "18:00",
      endTime: "19:00",
      category: "기타",
      description: "피자헛...",
      location: "우리집",
      notificationTime: "120",
      repeat: {
        endDate: "2024-07-29",
        interval: 10,
        type: "weekly",
      },
    };
    test("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다", async () => {
      const date = new Date("2024-07-01");

      vi.setSystemTime(date);
      const { user } = setup(<App />);

      await fillInputElement(
        screen.getByLabelText("제목"),
        user,
        duplicateData.title
      );

      await fillInputElement(
        screen.getByLabelText("날짜"),
        user,
        duplicateData.date
      );

      await fillInputElement(
        screen.getByLabelText("시작 시간"),
        user,
        duplicateData.startTime
      );

      await fillInputElement(
        screen.getByLabelText("종료 시간"),
        user,
        duplicateData.endTime
      );

      const alarmSelectBox = screen.getByLabelText("알림 설정");
      await user.selectOptions(alarmSelectBox, "2시간 전");
      expect(alarmSelectBox).toHaveValue(duplicateData.notificationTime);

      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      // 알림 확인
      expect(await screen.findByText("일정 겹침 경고")).toBeInTheDocument();

      // 일정 등록
      const alertProgressButton = screen.getByRole("button", {
        name: "계속 진행",
      });
      await user.click(alertProgressButton);

      // 화면에 나타나는지 확인
      const titleElements = await screen.findAllByText(duplicateData.title);
      expect(titleElements.length).toBeGreaterThan(0);
    });
    test("기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다", async () => {
      const date = new Date("2024-07-01");

      vi.setSystemTime(date);
      const { user } = setup(<App />);
      const editButton = await screen.findAllByRole("button", {
        name: "Edit event",
      });

      await user.click(editButton[0]);

      await fillInputElement(
        screen.getByLabelText("제목"),
        user,
        duplicateData.title
      );

      await fillInputElement(
        screen.getByLabelText("날짜"),
        user,
        duplicateData.date
      );

      await fillInputElement(
        screen.getByLabelText("시작 시간"),
        user,
        duplicateData.startTime
      );

      await fillInputElement(
        screen.getByLabelText("종료 시간"),
        user,
        duplicateData.endTime
      );

      const alarmSelectBox = screen.getByLabelText("알림 설정");
      await user.selectOptions(alarmSelectBox, "2시간 전");
      expect(alarmSelectBox).toHaveValue(duplicateData.notificationTime);

      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      // 알림 확인
      expect(await screen.findByText("일정 겹침 경고")).toBeInTheDocument();

      // 일정 등록
      const alertProgressButton = screen.getByRole("button", {
        name: "계속 진행",
      });
      await user.click(alertProgressButton);

      // 화면에 나타나는지 확인
      const titleElements = await screen.findAllByText(duplicateData.title);
      expect(titleElements.length).toBeGreaterThan(0);
    });
  });
});
