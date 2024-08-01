import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import App from "../App";
import events from "../mocks/mockdata/events";
import { createHandlers } from "../mocks/mockServiceWorker/handlers";
import { Event, RepeatType } from "../types";

let server = setupServer(...createHandlers());

beforeEach(() => {
  const fakeTime = new Date("2024-07-25T08:00:00Z");
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(fakeTime);
});

afterEach(() => {
  vi.useRealTimers();
  server.close();
});

const clearEventForm = async () => {
  await userEvent.clear(screen.getByLabelText("제목"));
  await userEvent.clear(screen.getByLabelText("날짜"));
  await userEvent.clear(screen.getByLabelText("시작 시간"));
  await userEvent.clear(screen.getByLabelText("종료 시간"));
  await userEvent.clear(screen.getByLabelText("설명"));
  await userEvent.clear(screen.getByLabelText("위치"));
};

const typeEventForm = async (event: Omit<Event, "id">) => {
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
};

const expectEventListHasEvent = async (event: Omit<Event, "id">) => {
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

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe("일정 CRUD 및 기본 기능", () => {
    beforeEach(() => {
      server = setupServer(...createHandlers());
      server.listen();
    });

    test("[mock up] 일정의 초기 값을 서버에서 잘 받아올 수 있다.", async () => {
      render(<App />);

      await expectEventListHasEvent(events[0]);
      await expectEventListHasEvent(events[1]);
      await expectEventListHasEvent(events[2]);
      await expectEventListHasEvent(events[3]);
      await expectEventListHasEvent(events[4]);
    });

    test("[CREATE] form을 통해 새로운 일정을 생성하였을 때 이벤트 리스트에서 생성된 이벤트를 확인할 수 있다.", async () => {
      render(<App />);
      const testEvent: Omit<Event, "id"> = {
        title: "CREATE 테스트 이벤트",
        date: "2024-07-29",
        startTime: "00:01",
        endTime: "23:59",
        description: "지한 생일파티",
        location: "지한이네",
        category: "개인",
        repeat: { type: "yearly", interval: 1 },
        notificationTime: 10,
      };

      await typeEventForm(testEvent);
      await userEvent.click(screen.getByTestId("event-submit-button"));
      await expectEventListHasEvent(testEvent);
    });

    test("[UPDATE] 특정 이벤트를 form을 통해 수정하였을 때 수정이 반영된 이벤트를 이벤트 리스트에서 확인할 수 있다.", async () => {
      render(<App />);

      const $eventList = await screen.findByTestId("event-list");
      const $targetEvent = $eventList.children[1].children[0];
      const $EventEditButton = $targetEvent.children[1].children[0];

      await userEvent.click($EventEditButton);

      const updateEvent: Omit<Event, "id"> = {
        title: "UPDATE 테스트 이벤트",
        date: "2024-07-29",
        startTime: "00:01",
        endTime: "23:59",
        description: "지한 생일파티",
        location: "지한이네",
        category: "개인",
        repeat: { type: "yearly", interval: 1 },
        notificationTime: 10,
      };

      await clearEventForm();
      await typeEventForm(updateEvent);

      await userEvent.click(screen.getByTestId("event-submit-button"));

      await expectEventListHasEvent(updateEvent);
    });

    test("[DELETE] 이벤트 목록에서 삭제 버튼을 누르면 그 이벤트는 이벤트 목록에서 지워진다.", async () => {
      render(<App />);

      const $eventList = await screen.findByTestId("event-list");
      const $targetEvent = $eventList.children[1].children[0];
      const $eventDeleteButton = $targetEvent.children[1].children[1];
      const targetEventTitle =
        $targetEvent.children[0].children[0].children[0].innerHTML;

      expect($eventList.innerHTML).toContain($targetEvent.outerHTML);
      expect($eventList).toHaveTextContent(targetEventTitle);

      await userEvent.click($eventDeleteButton);

      await waitFor(() => {
        expect($eventList.innerHTML).not.toContain($targetEvent.outerHTML);
        expect($eventList).not.toHaveTextContent(targetEventTitle);
      });
    });
  });

  describe("일정 뷰 및 필터링", () => {
    test("선택한 주간에 일정이 없으면 주별 뷰에 일정이 표시되지 않는다.", async () => {
      server = setupServer(...createHandlers([])); // 이벤트가 없는 API 핸들러 생성
      server.listen();

      render(<App />);

      const $viewSelector = screen.getByLabelText("view");
      await userEvent.selectOptions($viewSelector, "week");

      const $weekView = screen.getByTestId("week-view");

      let maxLengthOfDayHTMLChildren = 0;
      for (const $day of $weekView.children[1].children[1].children[0]
        .children) {
        maxLengthOfDayHTMLChildren = Math.max(
          $day.children.length,
          maxLengthOfDayHTMLChildren
        );
      }

      expect(maxLengthOfDayHTMLChildren).toBe(1);
    });

    test("선택한 주간에 일정이 있으면 주별 뷰에 일정이 표시된다.", async () => {
      server = setupServer(...createHandlers()); // 목업 이벤트로 API 핸들러 생성
      server.listen();

      render(<App />);

      const $viewSelector = screen.getByLabelText("view");
      await userEvent.selectOptions($viewSelector, "week");

      const $weekView = screen.getByTestId("week-view");

      let maxLengthOfDayHTMLChildren = 0;
      for (const $day of $weekView.children[1].children[1].children[0]
        .children) {
        maxLengthOfDayHTMLChildren = Math.max(
          $day.children.length,
          maxLengthOfDayHTMLChildren
        );
      }

      expect(maxLengthOfDayHTMLChildren).toBe(2);
    });

    test("선택한 월간에 일정이 없으면 월별 뷰에 일정이 표시되지 않는다.", async () => {
      server = setupServer(...createHandlers([])); // 이벤트가 없는 API 핸들러 생성
      server.listen();

      render(<App />);

      const $viewSelector = screen.getByLabelText("view");
      await userEvent.selectOptions($viewSelector, "month");

      const $monthView = screen.getByTestId("month-view");

      let maxLengthOfDayHTMLChildren = 0;
      for (const $week of $monthView.children[1].children[1].children) {
        for (const $day of $week.children) {
          maxLengthOfDayHTMLChildren = Math.max(
            $day.children.length,
            maxLengthOfDayHTMLChildren
          );
        }
      }

      expect(maxLengthOfDayHTMLChildren).toBe(1);
    });

    test("선택한 월간에 일정이 있으면 월별 뷰에 일정이 표시된다.", async () => {
      server = setupServer(...createHandlers()); // 목업 이벤트로 API 핸들러 생성
      server.listen();

      render(<App />);

      const $viewSelector = screen.getByLabelText("view");
      await userEvent.selectOptions($viewSelector, "month");

      const $monthView = screen.getByTestId("month-view");

      let maxLengthOfDayHTMLChildren = 0;
      for (const $week of $monthView.children[1].children[1].children) {
        for (const $day of $week.children) {
          maxLengthOfDayHTMLChildren = Math.max(
            $day.children.length,
            maxLengthOfDayHTMLChildren
          );
        }
      }

      expect(maxLengthOfDayHTMLChildren).toBe(2);
    });
  });

  describe("알림 기능", () => {
    const fakeTime = new Date("2024-07-25T08:00:00Z");

    const testEvent = {
      id: 6,
      title: "알림 테스트",
      description: "알림 테스트",
      location: "알림 테스트",
      category: "개인",
      repeat: { type: "weekly" as RepeatType, interval: 1 },
      notificationTime: 10,
      ...(() => {
        const startTime = new Date(fakeTime.getTime() + 5 * 60000); // 5분 후
        const endTime = new Date(startTime.getTime() + 60 * 60000); // 시작시간으로부터 1시간 후

        const formatDate = (date: Date) => {
          return date.toISOString().split("T")[0];
        };

        const formatTime = (date: Date) => {
          return date.toTimeString().split(" ")[0].substring(0, 5);
        };

        return {
          date: formatDate(fakeTime),
          startTime: formatTime(startTime),
          endTime: formatTime(endTime),
        };
      })(),
    };

    test("초기 진입시 서버에서 받아온 일정 중 알림 조건에 맞는 일정에 대한 알림이 노출된다.", async () => {
      server = setupServer(...createHandlers([testEvent])); // 알림 이벤트를 포함한 API 핸들러 생성
      server.listen();
      vi.setSystemTime(fakeTime);
      render(<App />);

      await expectEventListHasEvent(testEvent);

      await waitFor(() => {
        expect(document.body).toHaveTextContent(
          "10분 후 알림 테스트 일정이 시작됩니다."
        );
      });
    });

    test("새로운 이벤트 생성시 현재 알림 조건에 맞는 시각이라면 알림이 노출된다.", async () => {
      server = setupServer(...createHandlers([])); // 이벤트가 없는 API 핸들러 생성
      server.listen();
      vi.setSystemTime(fakeTime);
      render(<App />);

      await typeEventForm(testEvent);
      await userEvent.click(screen.getByTestId("event-submit-button"));
      await expectEventListHasEvent(testEvent);

      await waitFor(() => {
        expect(document.body).toHaveTextContent(
          "10분 후 알림 테스트 일정이 시작됩니다."
        );
      });
    });

    test("알림이 설정된 이벤트의 알림 구간에 진입 시 알림이 노출된다.", async () => {
      server = setupServer(...createHandlers([testEvent])); // 알림 이벤트를 포함한 API 핸들러 생성
      server.listen();
      vi.setSystemTime(new Date("2024-07-25T07:54:00Z"));
      render(<App />);

      await expectEventListHasEvent(testEvent);

      await waitFor(() => {
        expect(document.body).not.toHaveTextContent(
          "10분 후 알림 테스트 일정이 시작됩니다."
        );
      });

      vi.setSystemTime(new Date("2024-07-25T07:54:59Z"));
      await waitFor(
        () => {
          expect(document.body).toHaveTextContent(
            "10분 후 알림 테스트 일정이 시작됩니다."
          );
        },
        { timeout: 3000 }
      );
    });
  });

  describe("검색 기능", () => {
    beforeEach(() => {
      server = setupServer(...createHandlers());
      server.listen();
    });

    test("이벤트 리스트 검색어에 값이 입력되면 입력된 값을 포함한 이벤트만 이벤트 목록을 보여준다.", async () => {
      render(<App />);

      await expectEventListHasEvent(events[0]);
      await expectEventListHasEvent(events[1]);
      await expectEventListHasEvent(events[2]);
      await expectEventListHasEvent(events[3]);
      await expectEventListHasEvent(events[4]);

      const $searchBar = screen.getByLabelText("일정 검색");
      await userEvent.type($searchBar, "야호");

      const $eventList = await screen.findByTestId("event-list");
      await waitFor(() => {
        expect($eventList).toHaveTextContent("검색 결과가 없습니다.");
      });

      await userEvent.clear($searchBar);
      await userEvent.type($searchBar, "점심 약속");
      await expectEventListHasEvent(events[1]);
    });

    test("이벤트 검색 후 검색어를 모두 지우면 선택한 구간의 이벤트가 다시 모두 보여진다.", async () => {
      render(<App />);

      await expectEventListHasEvent(events[0]);
      await expectEventListHasEvent(events[1]);
      await expectEventListHasEvent(events[2]);
      await expectEventListHasEvent(events[3]);
      await expectEventListHasEvent(events[4]);

      const $searchBar = screen.getByLabelText("일정 검색");
      await userEvent.type($searchBar, "야호");

      const $eventList = await screen.findByTestId("event-list");
      await waitFor(() => {
        expect($eventList).toHaveTextContent("검색 결과가 없습니다.");
      });

      await userEvent.clear($searchBar);

      await expectEventListHasEvent(events[0]);
      await expectEventListHasEvent(events[1]);
      await expectEventListHasEvent(events[2]);
      await expectEventListHasEvent(events[3]);
      await expectEventListHasEvent(events[4]);
    });
  });

  describe("공휴일 표시", () => {
    beforeEach(() => {
      server = setupServer(...createHandlers([]));
      server.listen();
    });

    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", async () => {
      render(<App />);

      const $calendarHeader = screen.getByRole("heading", {
        name: /2024년 7월/,
      });

      const $prevButton = screen.getByRole("button", {
        name: /previous/i,
      });

      while (!$calendarHeader.innerHTML.includes("1월")) {
        await userEvent.click($prevButton);
      }

      const $yearFirstDay = screen.getByRole("cell", {
        name: /신정/,
      });
      expect($yearFirstDay.children[0].innerHTML).toBe("1");
    });

    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", async () => {
      render(<App />);

      const $calendarHeader = screen.getByRole("heading", {
        name: /2024년 7월/,
      });

      const $prevButton = screen.getByRole("button", {
        name: /previous/i,
      });

      while (!$calendarHeader.innerHTML.includes("5월")) {
        await userEvent.click($prevButton);
      }

      const $yearFirstDay = screen.getByRole("cell", {
        name: /어린이날/,
      });
      expect($yearFirstDay.children[0].innerHTML).toBe("5");
    });
  });

  describe("일정 충돌 감지", () => {
    beforeEach(() => {
      server = setupServer(...createHandlers([]));
      server.listen();
    });

    test("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다.", async () => {
      render(<App />);

      const testEventA: Omit<Event, "id"> = {
        title: "일정 충돌 테스트 제목",
        date: "2024-07-29",
        startTime: "11:00",
        endTime: "15:00",
        description: "일정 충돌 테스트 설명",
        location: "피시방",
        category: "개인",
        repeat: { type: "yearly", interval: 1 },
        notificationTime: 10,
      };

      const testEventB: Omit<Event, "id"> = {
        title: "일정 충돌 테스트2 제목",
        date: "2024-07-29",
        startTime: "12:00",
        endTime: "16:00",
        description: "일정 충돌 테스트2 설명",
        location: "노래방",
        category: "업무",
        repeat: { type: "yearly", interval: 1 },
        notificationTime: 10,
      };

      await typeEventForm(testEventA);
      await userEvent.click(screen.getByTestId("event-submit-button"));
      await expectEventListHasEvent(testEventA);

      await typeEventForm(testEventB);
      await userEvent.click(screen.getByTestId("event-submit-button"));

      await waitFor(() => {
        expect(document.body).toHaveTextContent("일정 겹침 경고");
      });
    });

    test("기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다", async () => {
      render(<App />);

      const testEventA: Omit<Event, "id"> = {
        title: "일정 충돌 테스트 제목",
        date: "2024-07-29",
        startTime: "11:00",
        endTime: "15:00",
        description: "일정 충돌 테스트 설명",
        location: "피시방",
        category: "개인",
        repeat: { type: "yearly", interval: 1 },
        notificationTime: 10,
      };

      const testEventB: Omit<Event, "id"> = {
        title: "일정 충돌 테스트2 제목",
        date: "2024-07-30",
        startTime: "12:00",
        endTime: "16:00",
        description: "일정 충돌 테스트2 설명",
        location: "노래방",
        category: "업무",
        repeat: { type: "yearly", interval: 1 },
        notificationTime: 60,
      };

      await typeEventForm(testEventA);
      await userEvent.click(screen.getByTestId("event-submit-button"));
      await expectEventListHasEvent(testEventA);

      await typeEventForm(testEventB);
      await userEvent.click(screen.getByTestId("event-submit-button"));
      await expectEventListHasEvent(testEventB);

      const $editButtonTestEventB =
        screen.getByTestId("event-list").children[2].children[0].children[1]
          .children[0];
      await userEvent.click($editButtonTestEventB);

      await userEvent.clear(screen.getByLabelText("날짜"));
      await userEvent.type(screen.getByLabelText("날짜"), testEventA.date);
      await userEvent.click(screen.getByTestId("event-submit-button"));

      await waitFor(() => {
        expect(document.body).toHaveTextContent("일정 겹침 경고");
      });
    });
  });
});
