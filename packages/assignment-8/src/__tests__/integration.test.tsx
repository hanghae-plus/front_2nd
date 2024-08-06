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
    date: "2024-08-25",
    startTime: "06:30",
    endTime: "11:30",
    category: "기타",
    description: "파티는 끝나지 않아..",
    location: "선릉역",
    notificationTime: "120",
    repeat: {
      endDate: undefined,
      interval: 10,
      type: "none",
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

      // 반복 일정 체크
      const repeatCheckbox = screen.getByRole("checkbox");
      await user.click(repeatCheckbox);

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
        endDate: undefined,
        interval: 1,
        type: "none",
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

      // 반복 일정 체크
      const repeatCheckbox = screen.getByRole("checkbox");
      await user.click(repeatCheckbox);

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

  describe("반복 일정 테스트", () => {
    // 기본 요구사항
    // 1. 사용자 김항해는 매주 월요일 오전 10시에 있는 팀 회의를 캘린더에 등록하려고 한다.
    // 2. 김항해는 새 일정 추가 버튼을 클릭하고 다음과 같이 정보를 입력한다:
    //     - 제목: "주간 팀 회의"
    //     - 날짜: 2024년 7월 1일 (월요일)
    //     - 시작 시간: 오전 10:00
    //     - 종료 시간: 오전 11:00
    //     - 위치: "회의실 A"
    //     - 설명: "주간 업무 보고 및 계획 수립"
    // 3. 반복 설정에서 "매주"를 선택하고, 반복 간격을 1주로 설정한다.
    // 4. 알림 설정을 "10분 전"으로 선택한다.
    // 5. 일정을 저장하면, 캘린더에 2024년 7월 1일부터 반복 간격으로 해당 회의가 표시된다.
    test.only("반복 일정을 등록하며, 일정에 나타나는지 확인한다.", async () => {
      vi.setSystemTime(new Date("2024-09-01"));
      const { user } = setup(<App />);

      await fillInputElement(
        screen.getByLabelText("제목"),
        user,
        "주간 팀 회의"
      );

      await fillInputElement(screen.getByLabelText("날짜"), user, "2024-09-02");

      await fillInputElement(screen.getByLabelText("시작 시간"), user, "10:00");

      await fillInputElement(screen.getByLabelText("종료 시간"), user, "11:00");

      await fillInputElement(screen.getByLabelText("위치"), user, "회의실 A");

      await fillInputElement(
        screen.getByLabelText("설명"),
        user,
        "주간 업무 보고 및 계획 수립"
      );

      // 반복 일정 체크
      const repeatCheckbox = screen.getByRole("checkbox");
      await user.click(repeatCheckbox);

      const repeatTypeSelectBox = screen.getByLabelText("반복 유형");
      await user.selectOptions(repeatTypeSelectBox, "매주");

      /**
       * 간격 설정은 무한대로 받을 수 있으니 Input으로?
       * 일,주,월,년 단위가 될 수 있기 때문에 숫자로만 받기
       */
      await fillInputElement(screen.getByLabelText("반복 간격"), user, "1");

      const alarmSelectBox = screen.getByLabelText("알림 설정");
      await user.selectOptions(alarmSelectBox, "10분 전");

      const submitButton = screen.getByTestId("event-submit-button");
      await user.click(submitButton);

      // 설정한 간격대로 일정이 화면에 보이게 된다.

      // 9월 2일부터 일주일 마다 등록하게 되면 2,9,16,23,30일 등록이된다.
      // 결과적으로 4개가 등록되는지 확인한다. 리스트 쪽까지 총 10개.

      // const find = screen.getByRole("paragraph");
      expect((await screen.findAllByText("주간 팀 회의")).length).toBe(10);
    });

    test("반복 종료 날짜를 지정하면, 종료 날짜까지만 표시된다.", async () => {
      // 반복 종료 조건으로 "종료일 지정"을 선택하고, 2024년 12월 31일로 설정한다.
      vi.setSystemTime(new Date("2024-12-01"));

      const { user } = setup(<App />);

      await fillInputElement(
        screen.getByLabelText("제목"),
        user,
        "주간 팀 회의"
      );

      await fillInputElement(screen.getByLabelText("날짜"), user, "2024-07-01");

      await fillInputElement(screen.getByLabelText("시작 시간"), user, "10:00");

      await fillInputElement(screen.getByLabelText("종료 시간"), user, "11:00");

      await fillInputElement(screen.getByLabelText("위치"), user, "회의실 A");

      await fillInputElement(
        screen.getByLabelText("설명"),
        user,
        "주간 업무 보고 및 계획 수립"
      );

      // 반복 일정 체크
      const repeatCheckbox = screen.getByRole("checkbox");
      await user.click(repeatCheckbox);

      const repeatTypeSelectBox = screen.getByLabelText("반복 유형");
      await user.selectOptions(repeatTypeSelectBox, "매주");

      /**
       * 간격 설정은 무한대로 받을 수 있으니 Input으로?
       * 일,주,월,년 단위가 될 수 있기 때문에 숫자로만 받기
       */
      await fillInputElement(screen.getByLabelText("반복 간격"), user, "1");

      const alarmSelectBox = screen.getByLabelText("알림 설정");
      await user.selectOptions(alarmSelectBox, "10분 전");

      // 반복 종료 날짜 체크
      const repeatEndCheckbox = screen.getByRole("checkbox", {
        name: "반복 종료 지정",
      });
      await user.click(repeatEndCheckbox);

      await fillInputElement(
        screen.getByLabelText("반복 종료 날짜"),
        user,
        "2024-12-16"
      );

      // 2024-12-16 까지 등록되는지 확인해야함.
      // 2024년 12월은 월요일이 2,9,16일 3개이므로 일정은 3개가 나와야함.
      expect(screen.queryAllByText("주간 팀 회의").length).toBe(3);
    });
  });
});
