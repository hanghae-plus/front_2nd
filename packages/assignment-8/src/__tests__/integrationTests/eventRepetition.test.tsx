import { createHandlers } from "@/mocks/mockServiceWorker/handlers";
import { Event } from "@/types";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Scheduler from "../../Scheduler";
import {
  clearEventForm,
  expectEventListHasEvent,
  typeEventForm,
} from "../testModules";

let server = setupServer(...createHandlers([]));

beforeEach(() => {
  const fakeTime = new Date("2024-07-25T08:00:00Z");
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(fakeTime);
  server = setupServer(...createHandlers([]));
  server.listen();
});

afterEach(() => {
  vi.useRealTimers();
  server.close();
});

// 반복 종료일 default 설정, 반복 간격 말고 반복 횟수로 반복 일정 생성 기능 등
describe("반복 일정 테스트", () => {
  describe("일정 생성 또는 수정 시 일정 반복 설정값들을 선택 및 입력할 수 있다.", () => {
    test("event form에 일정 반복 설정을 위한 요소들이 존재한다.", async () => {
      render(<Scheduler />);

      const $repetitionCheckBox = screen.getByLabelText("반복 설정");

      expect(document.body).toContainElement($repetitionCheckBox);
      await userEvent.click($repetitionCheckBox);

      const $repetitionType = screen.getByLabelText("반복 유형");
      const $repetitionInterval = screen.getByLabelText("반복 간격");
      const $repetitionEndDate = screen.getByLabelText("반복 종료일");

      expect(document.body).toContainElement($repetitionType);
      expect(document.body).toContainElement($repetitionInterval);
      expect(document.body).toContainElement($repetitionEndDate);
    });

    test("event form에 일정 반복 설정의 위한 요소들이 반복 유형에 따라 다르게 렌더링된다.", async () => {
      render(<Scheduler />);

      const $repetitionCheckBox = screen.getByLabelText("반복 설정");

      expect(document.body).toContainElement($repetitionCheckBox);
      await userEvent.click($repetitionCheckBox);

      const $repetitionType = screen.getByLabelText("반복 유형");
      await userEvent.selectOptions($repetitionType, "weekly");
      const $weekdaySelector = screen.getByLabelText("요일 설정");
      expect(document.body).toContainElement($weekdaySelector);

      await userEvent.selectOptions($repetitionType, "monthly");
      expect(document.body).not.toContainElement($weekdaySelector);
      const $monthdaySelector = screen.getByLabelText("날짜 설정");
      expect(document.body).toContainElement($monthdaySelector);
      const $monthRepetitionWeekSelector =
        screen.getByLabelText("주 기준 반복 설정");
      expect(document.body).toContainElement($monthRepetitionWeekSelector);

      await userEvent.selectOptions($repetitionType, "daily");
      expect(document.body).not.toContainElement($monthdaySelector);
      expect(document.body).not.toContainElement($monthRepetitionWeekSelector);
    });
  });

  describe("반복 일정 생성", () => {
    describe("반복 일정 생성 시 설정한 반복 유형과 반복 주기에 따라 반복 일정이 생성된다.", async () => {
      test("일 단위 반복 일정 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
          date: "2024-07-01",
          startTime: "12:00",
          endTime: "12:30",
          description: "daily scrum",
          location: "회의실",
          category: "개인",
          repeat: { type: "daily", interval: 2 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-03" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-05" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-07" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-09" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-11" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-13" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-15" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-17" });
      });

      test("주 단위 반복 일정 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
          date: "2024-07-01",
          startTime: "14:00",
          endTime: "14:30",
          description: "weekly meeting",
          location: "회의실",
          category: "개인",
          repeat: { type: "weekly", interval: 2 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-15" });
        await expectEventListHasEvent({ ...testEvent, date: "2024-07-29" });

        const $nextButton = screen.getByRole("button", {
          name: /next/i,
        });

        await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2024-08-12" });
      });

      test("월 단위 반복 일정 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
          date: "2024-07-01",
          startTime: "10:00",
          endTime: "12:00",
          description: "월간 업무 보고",
          location: "회의실",
          category: "개인",
          repeat: { type: "monthly", interval: 1 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);

        const $nextButton = screen.getByRole("button", {
          name: /next/i,
        });

        await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2024-08-01" });

        await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2024-09-01" });

        await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2024-10-01" });

        await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2024-11-01" });
      });

      test("연 단위 반복 일정 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
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

        const $nextButton = screen.getByRole("button", {
          name: /next/i,
        });

        for (let i = 0; i < 12; i++) await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2025-07-29" });

        for (let i = 0; i < 12; i++) await userEvent.click($nextButton);
        await expectEventListHasEvent({ ...testEvent, date: "2026-07-29" });
      });
    });

    describe("반복 일정으로 생성된 일정은 반복 일정이 아닌 다른 일정과 시각적으로 구분되어야 한다.", () => {
      test("반복 일정은 event list에서 반복 일정이라는 row를 포함한다.", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
          date: "2024-07-01",
          startTime: "12:00",
          endTime: "12:30",
          description: "daily scrum",
          location: "회의실",
          category: "개인",
          repeat: { type: "daily", interval: 2 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);

        const $eventsInEventList = screen.getAllByTestId("event-in-event-list");

        const repetitionDates = [
          "2024-07-03",
          "2024-07-05",
          "2024-07-07",
          "2024-07-09",
          "2024-07-11",
          "2024-07-13",
          "2024-07-15",
          "2024-07-17",
          "2024-07-19",
          "2024-07-21",
          "2024-07-23",
          "2024-07-25",
          "2024-07-27",
          "2024-07-29",
          "2024-07-31",
        ];

        let repetitionCount = 0;
        for (const $event of $eventsInEventList) {
          const isRepetition = repetitionDates.some((date) => {
            return $event.innerHTML.includes(date);
          });
          if (isRepetition) {
            repetitionCount++;
            expect($event).toHaveTextContent("반복 event");
          }
        }

        expect(repetitionCount).toBe(repetitionDates.length);
      });

      test("반복 일정은 calendar view에서 (반복)이라는 단어를 포함한다.", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
          date: "2024-07-01",
          startTime: "12:00",
          endTime: "12:30",
          description: "daily scrum",
          location: "회의실",
          category: "개인",
          repeat: { type: "daily", interval: 2 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);

        const $monthViewDays = screen.getAllByTestId("monthview-day");

        for (const $day of $monthViewDays) {
          if ($day.children.length === 0) {
            continue;
          }
          if (parseInt($day.children[0].innerHTML) % 2 === 1) {
            expect($day.children[1]).toHaveTextContent("반복");
          }
        }
      });
    });
  });

  describe("선택한 반복 유형에 따라 여러 옵션이 나타나며, 설정값에 따라 반복 일정이 생성된다.", () => {
    describe("일간 반복을 선택할 경우 반복 간격에 따라 반복 일정이 생성된다.", () => {
      test("1일 간격 반복 일정 생성 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
          date: "2024-07-01",
          startTime: "12:00",
          endTime: "12:30",
          description: "daily scrum",
          location: "회의실",
          category: "개인",
          repeat: { type: "daily", interval: 1 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);

        const $eventsInEventList = screen.getAllByTestId("event-in-event-list");

        const repetitionDates = [
          "2024-07-01",
          "2024-07-02",
          "2024-07-03",
          "2024-07-04",
          "2024-07-05",
          "2024-07-06",
          "2024-07-07",
          "2024-07-08",
          "2024-07-09",
          "2024-07-10",
          "2024-07-11",
          "2024-07-12",
          "2024-07-13",
          "2024-07-14",
          "2024-07-15",
          "2024-07-16",
          "2024-07-17",
          "2024-07-18",
          "2024-07-19",
          "2024-07-20",
          "2024-07-21",
          "2024-07-22",
          "2024-07-23",
          "2024-07-24",
          "2024-07-25",
          "2024-07-26",
          "2024-07-27",
          "2024-07-28",
          "2024-07-29",
          "2024-07-30",
          "2024-07-31",
        ];

        let repetitionCount = 0;
        for (const $event of $eventsInEventList) {
          const isRepetition = repetitionDates.some((date) => {
            return $event.innerHTML.includes(date);
          });
          if (isRepetition) {
            repetitionCount++;
            expect($event).toHaveTextContent("반복 event");
          }
        }

        expect(repetitionCount).toBe(repetitionDates.length);
      });

      test("2일 간격 반복 일정 생성 테스트", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
          date: "2024-07-01",
          startTime: "12:00",
          endTime: "12:30",
          description: "daily scrum",
          location: "회의실",
          category: "개인",
          repeat: { type: "daily", interval: 2 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);

        const $eventsInEventList = screen.getAllByTestId("event-in-event-list");

        const repetitionDates = [
          "2024-07-03",
          "2024-07-05",
          "2024-07-07",
          "2024-07-09",
          "2024-07-11",
          "2024-07-13",
          "2024-07-15",
          "2024-07-17",
          "2024-07-19",
          "2024-07-21",
          "2024-07-23",
          "2024-07-25",
          "2024-07-27",
          "2024-07-29",
          "2024-07-31",
        ];

        let repetitionCount = 0;
        for (const $event of $eventsInEventList) {
          const isRepetition = repetitionDates.some((date) => {
            return $event.innerHTML.includes(date);
          });
          if (isRepetition) {
            repetitionCount++;
            expect($event).toHaveTextContent("반복 event");
          }
        }

        expect(repetitionCount).toBe(repetitionDates.length);
      });
    });

    describe("주간 반복을 선택한 경우", () => {
      describe("반복 간격에 따라 반복 일정이 생성된다.", () => {
        test("반복 간격을 1주로 설정한 경우 1주마다 같은 일정이 생성된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "weekly", interval: 1 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = [
            "2024-07-08",
            "2024-07-15",
            "2024-07-22",
            "2024-07-29",
          ];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);
        });

        test("반복 간격을 2주로 설정한 경우 2주마다 같은 일정이 생성된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "weekly", interval: 1 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = ["2024-07-15", "2024-07-29"];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);
        });
      });

      describe("특정 요일을 선택하여 주기마다 그 요일에 반복 일정을 생성할 수 있다.", () => {
        test("반복 간격을 1주로 설정하고 반복 요일은 월, 수, 금마다로 선택할 경우 1주마다 월, 수, 금에 같은 일정이 생성된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "weekly", interval: 1, weekdays: [0, 2, 4] },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = [
            "2024-07-03",
            "2024-07-05",
            "2024-07-08",
            "2024-07-10",
            "2024-07-12",
            "2024-07-15",
            "2024-07-17",
            "2024-07-19",
            "2024-07-22",
            "2024-07-24",
            "2024-07-26",
            "2024-07-29",
            "2024-07-31",
          ];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);
        });

        test("반복 간격을 2주로 설정하고 반복 요일은 화, 목, 토마다로 선택할 경우 2주마다 화, 목, 토에 같은 일정이 생성된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "weekly", interval: 2, weekdays: [1, 3, 5] },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = [
            "2024-07-02",
            "2024-07-04",
            "2024-07-06",
            "2024-07-16",
            "2024-07-18",
            "2024-07-20",
            "2024-07-30",
          ];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);
        });
      });
    });

    describe("월간 반복을 선택한 경우", () => {
      describe("매월 특정 날짜에 반복되도록 설정할 수 있다.", () => {
        test("반복 간격을 1개월로 설정한 경우 1개월마다 같은 일정이 생성된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "monthly", interval: 1 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $nextButton = screen.getByRole("button", {
            name: /next/i,
          });

          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-08-01" });
          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-09-01" });
          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-10-01" });
          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-11-01" });
        });
        test("반복 간격을 2개월로 설정한 경우 2개월마다 같은 일정이 생성된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "monthly", interval: 2 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $nextButton = screen.getByRole("button", {
            name: /next/i,
          });

          await userEvent.click($nextButton);
          const $eventList = await screen.findByTestId("event-list");
          await waitFor(() => {
            expect($eventList).toHaveTextContent("검색 결과가 없습니다.");
          });

          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-09-01" });

          await userEvent.click($nextButton);
          await waitFor(() => {
            expect($eventList).toHaveTextContent("검색 결과가 없습니다.");
          });

          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-11-01" });
        });
      });

      describe("매월 특정 주차의 특정 요일에 반복되도록 설정할 수 있다.", () => {
        test("반복 간격을 1개월로 설정하고 반복 요일을 2주차 수요일로 선택할 경우 1개월마다 2주차 수요일에 같은 일정이 생성된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "monthly", interval: 1 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);
          await expectEventListHasEvent({ ...testEvent, date: "2024-07-10" });

          const $nextButton = screen.getByRole("button", {
            name: /next/i,
          });

          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-08-07" });
          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-09-11" });
          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-10-09" });
        });

        test("반복 간격을 2개월로 설정하고 반복 요일을 3주차 목요일로 선택할 경우 2개월마다 3주차 목요일에 같은 일정이 생성된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "monthly", interval: 1 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);
          await expectEventListHasEvent({ ...testEvent, date: "2024-07-18" });

          const $nextButton = screen.getByRole("button", {
            name: /next/i,
          });

          await userEvent.click($nextButton);
          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-09-19" });
          await userEvent.click($nextButton);
          await userEvent.click($nextButton);
          await expectEventListHasEvent({ ...testEvent, date: "2024-11-14" });
        });
      });
    });
  });

  describe("반복 일정 중 특정 날짜의 일정을 수정 및 삭제할 수 있다.", () => {
    describe("반복 일정 중 부모 일정을 수정 및 삭제할 경우 모든 일정이 수정 및 삭제된다.", () => {
      test("반복 일정 중 부모 일정을 수정할 경우 모든 자식 일정이 수정된다.", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
          date: "2024-07-01",
          startTime: "12:00",
          endTime: "12:30",
          description: "daily scrum",
          location: "회의실",
          category: "개인",
          repeat: { type: "daily", interval: 1 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);

        const $eventsInEventList = screen.getAllByTestId("event-in-event-list");

        let repetitionDates = [
          "2024-07-01",
          "2024-07-02",
          "2024-07-03",
          "2024-07-04",
          "2024-07-05",
          "2024-07-06",
          "2024-07-07",
          "2024-07-08",
          "2024-07-09",
          "2024-07-10",
          "2024-07-11",
          "2024-07-12",
          "2024-07-13",
          "2024-07-14",
          "2024-07-15",
          "2024-07-16",
          "2024-07-17",
          "2024-07-18",
          "2024-07-19",
          "2024-07-20",
          "2024-07-21",
          "2024-07-22",
          "2024-07-23",
          "2024-07-24",
          "2024-07-25",
          "2024-07-26",
          "2024-07-27",
          "2024-07-28",
          "2024-07-29",
          "2024-07-30",
          "2024-07-31",
        ];

        let repetitionCount = 0;
        for (const $event of $eventsInEventList) {
          const isRepetition = repetitionDates.some((date) => {
            return $event.innerHTML.includes(date);
          });
          if (isRepetition) {
            repetitionCount++;
            expect($event).toHaveTextContent("반복 event 생성 테스트");
          }
        }

        expect(repetitionCount).toBe(repetitionDates.length);

        const updateEvent: Omit<Event, "id"> = {
          title: "반복 event 수정 테스트",
          date: "2024-07-02",
          startTime: "12:00",
          endTime: "12:30",
          description: "daily scrum",
          location: "회의실",
          category: "개인",
          repeat: { type: "daily", interval: 2 },
          notificationTime: 10,
        };

        const $targetEvent = $eventsInEventList.filter(
          (event) => !event.innerHTML.includes("반복 일정")
        )[0];
        const $EventEditButton =
          $targetEvent.children[0].children[1].children[0];

        await userEvent.click($EventEditButton);

        await clearEventForm();
        await typeEventForm(updateEvent);

        await userEvent.click(screen.getByTestId("event-submit-button"));

        await expectEventListHasEvent(updateEvent);

        repetitionDates = [
          "2024-07-04",
          "2024-07-06",
          "2024-07-08",
          "2024-07-10",
          "2024-07-12",
          "2024-07-14",
          "2024-07-16",
          "2024-07-18",
          "2024-07-20",
          "2024-07-22",
          "2024-07-24",
          "2024-07-26",
          "2024-07-28",
          "2024-07-30",
        ];
        repetitionCount = 0;

        const $newEventsInEventList = screen.getAllByTestId(
          "event-in-event-list"
        );
        for (const $event of $newEventsInEventList) {
          const isRepetition = repetitionDates.some((date) => {
            return $event.innerHTML.includes(date);
          });
          if (isRepetition) {
            repetitionCount++;
            expect($event).toHaveTextContent("반복 event 수정 테스트");
          }
        }

        expect(repetitionCount).toBe(repetitionDates.length);
      });

      test("반복 일정 중 부모 일정을 삭제할 경우 모든 자식 일정이 삭제된다.", async () => {
        render(<Scheduler />);
        const testEvent: Omit<Event, "id"> = {
          title: "반복 event 생성 테스트",
          date: "2024-07-01",
          startTime: "12:00",
          endTime: "12:30",
          description: "daily scrum",
          location: "회의실",
          category: "개인",
          repeat: { type: "daily", interval: 1 },
          notificationTime: 10,
        };

        await typeEventForm(testEvent);
        await userEvent.click(screen.getByTestId("event-submit-button"));
        await expectEventListHasEvent(testEvent);

        const $eventsInEventList = screen.getAllByTestId("event-in-event-list");

        const repetitionDates = [
          "2024-07-01",
          "2024-07-02",
          "2024-07-03",
          "2024-07-04",
          "2024-07-05",
          "2024-07-06",
          "2024-07-07",
          "2024-07-08",
          "2024-07-09",
          "2024-07-10",
          "2024-07-11",
          "2024-07-12",
          "2024-07-13",
          "2024-07-14",
          "2024-07-15",
          "2024-07-16",
          "2024-07-17",
          "2024-07-18",
          "2024-07-19",
          "2024-07-20",
          "2024-07-21",
          "2024-07-22",
          "2024-07-23",
          "2024-07-24",
          "2024-07-25",
          "2024-07-26",
          "2024-07-27",
          "2024-07-28",
          "2024-07-29",
          "2024-07-30",
          "2024-07-31",
        ];

        let repetitionCount = 0;
        for (const $event of $eventsInEventList) {
          const isRepetition = repetitionDates.some((date) => {
            return $event.innerHTML.includes(date);
          });
          if (isRepetition) {
            repetitionCount++;
            expect($event).toHaveTextContent("반복 event 생성 테스트");
          }
        }

        expect(repetitionCount).toBe(repetitionDates.length);

        const $targetEvent = $eventsInEventList.filter(
          (event) => !event.innerHTML.includes("반복 일정")
        )[0];
        const $eventDeleteButton =
          $targetEvent.children[0].children[1].children[1];

        await userEvent.click($eventDeleteButton);
        const $eventList = await screen.findByTestId("event-list");
        await waitFor(() => {
          expect($eventList).toHaveTextContent("검색 결과가 없습니다.");
        });
      });
    });

    describe("반복 일정 중 자식 일정을 수정 및 삭제할 경우 선택한 일정에만 반영할 것인지 전체 반복 일정에 반영할 것인지 선택할 수 있다.", () => {
      describe("반복 일정 중 자식 일정을 수정 및 삭제할 경우 전체 반영 여부를 묻는 UI가 노출된다.", () => {
        test("반복 일정 중 자식 일정을 수정할 경우 전체 반영 여부를 묻는 UI가 노출된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "daily", interval: 2 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = [
            "2024-07-01",
            "2024-07-03",
            "2024-07-05",
            "2024-07-07",
            "2024-07-09",
            "2024-07-11",
            "2024-07-13",
            "2024-07-15",
            "2024-07-17",
            "2024-07-19",
            "2024-07-21",
            "2024-07-23",
            "2024-07-25",
            "2024-07-27",
            "2024-07-29",
            "2024-07-31",
          ];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event 생성 테스트");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);

          const updateEvent: Omit<Event, "id"> = {
            title: "반복 event 수정 테스트",
            date: "2024-07-02",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "daily", interval: 2 },
            notificationTime: 10,
          };

          const $targetEvent = $eventsInEventList.filter((event) =>
            event.innerHTML.includes("반복 일정")
          )[0];
          const $EventEditButton = $targetEvent.children[1].children[0];

          await userEvent.click($EventEditButton);

          await clearEventForm();
          await typeEventForm(updateEvent);

          await userEvent.click(screen.getByTestId("event-submit-button"));

          expect(document.body).toHaveTextContent(
            "반복 일정에 대한 수정을 요청하였습니다."
          );
          expect(document.body).toHaveTextContent(
            "해당 일정에만 수정사항을 반영하시겠습니까?"
          );
          expect(document.body).toHaveTextContent("전체 반영");
          expect(document.body).toHaveTextContent("해당 일정에만 반영");
        });

        test("반복 일정 중 자식 일정을 삭제할 경우 전체 반영 여부를 묻는 UI가 노출된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "daily", interval: 2 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = [
            "2024-07-01",
            "2024-07-03",
            "2024-07-05",
            "2024-07-07",
            "2024-07-09",
            "2024-07-11",
            "2024-07-13",
            "2024-07-15",
            "2024-07-17",
            "2024-07-19",
            "2024-07-21",
            "2024-07-23",
            "2024-07-25",
            "2024-07-27",
            "2024-07-29",
            "2024-07-31",
          ];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event 생성 테스트");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);

          const $targetEvent = $eventsInEventList.filter((event) =>
            event.innerHTML.includes("반복 일정")
          )[0];
          const $eventDeleteButton =
            $targetEvent.children[0].children[1].children[1];

          await userEvent.click($eventDeleteButton);

          expect(document.body).toHaveTextContent(
            "반복 일정에 대한 삭제를 요청하였습니다."
          );
          expect(document.body).toHaveTextContent(
            "해당 일정만 삭제하시겠습니까?"
          );
          expect(document.body).toHaveTextContent("전체 삭제");
          expect(document.body).toHaveTextContent("해당 일정만 삭제");
        });
      });

      describe("선택한 일정에만 반영한다고 선택할 경우 반복 일정 중 선택한 일정에만 수정 및 삭제가 반영된다.", () => {
        test("선택한 일정에만 반영한다고 선택할 경우 반복 일정 중 선택한 일정에만 수정이 반영된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "daily", interval: 2 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = [
            "2024-07-01",
            "2024-07-03",
            "2024-07-05",
            "2024-07-07",
            "2024-07-09",
            "2024-07-11",
            "2024-07-13",
            "2024-07-15",
            "2024-07-17",
            "2024-07-19",
            "2024-07-21",
            "2024-07-23",
            "2024-07-25",
            "2024-07-27",
            "2024-07-29",
            "2024-07-31",
          ];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event 생성 테스트");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);

          const updateEvent: Omit<Event, "id"> = {
            title: "반복 event 수정 테스트",
            date: "2024-07-02",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "daily", interval: 2 },
            notificationTime: 10,
          };

          const $targetEvent = $eventsInEventList.filter((event) =>
            event.innerHTML.includes("반복 일정")
          )[0];
          const $EventEditButton = $targetEvent.children[1].children[0];

          await userEvent.click($EventEditButton);

          await clearEventForm();
          await typeEventForm(updateEvent);

          await userEvent.click(screen.getByTestId("event-submit-button"));

          await userEvent.click(
            screen.getByTestId("edit-only-repetition-event-confirm-button")
          );

          await expectEventListHasEvent(testEvent);

          await expectEventListHasEvent(updateEvent);
        });

        test("선택한 일정에만 반영한다고 선택할 경우 반복 일정 중 선택한 일정에만 삭제가 반영된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "daily", interval: 2 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = [
            "2024-07-01",
            "2024-07-03",
            "2024-07-05",
            "2024-07-07",
            "2024-07-09",
            "2024-07-11",
            "2024-07-13",
            "2024-07-15",
            "2024-07-17",
            "2024-07-19",
            "2024-07-21",
            "2024-07-23",
            "2024-07-25",
            "2024-07-27",
            "2024-07-29",
            "2024-07-31",
          ];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event 생성 테스트");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);

          const $targetEvent = $eventsInEventList.filter((event) =>
            event.innerHTML.includes("반복 일정")
          )[0];
          const $eventDeleteButton =
            $targetEvent.children[0].children[1].children[1];

          await userEvent.click($eventDeleteButton);

          await userEvent.click(
            screen.getByTestId("delete-only-repetition-event-confirm-button")
          );

          await expectEventListHasEvent(testEvent);

          const $eventList = await screen.findByTestId("event-list");
          await waitFor(() => {
            expect($eventList.innerHTML).not.toContain($targetEvent.outerHTML);
            expect($eventList).not.toHaveTextContent(testEvent.title);
          });
        });
      });

      describe("전체 반복 일정에 반영할 것이라 선택한 경우 같은 부모 일정을 가진 반복 일정에 대해 모두 수정 및 삭제가 반영된다.", () => {
        test("전체 반복 일정에 반영할 것이라 선택한 경우 같은 부모 일정을 가진 반복 일정에 대해 모두 수정이 반영된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "daily", interval: 2 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = [
            "2024-07-03",
            "2024-07-05",
            "2024-07-07",
            "2024-07-09",
            "2024-07-11",
            "2024-07-13",
            "2024-07-15",
            "2024-07-17",
            "2024-07-19",
            "2024-07-21",
            "2024-07-23",
            "2024-07-25",
            "2024-07-27",
            "2024-07-29",
            "2024-07-31",
          ];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event 생성 테스트");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);

          const updateEvent: Omit<Event, "id"> = {
            title: "반복 event 수정 테스트",
            date: "2024-07-02",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "daily", interval: 2 },
            notificationTime: 10,
          };

          const $targetEvent = $eventsInEventList.filter((event) =>
            event.innerHTML.includes("반복 일정")
          )[0];
          const $EventEditButton = $targetEvent.children[1].children[0];

          await userEvent.click($EventEditButton);

          await clearEventForm();
          await typeEventForm(updateEvent);

          await userEvent.click(screen.getByTestId("event-submit-button"));

          await userEvent.click(
            screen.getByTestId("edit-all-event-confirm-button")
          );

          await waitFor(() => {
            expect(screen.getAllByText("반복 event 수정 테스트").length).toBe(
              repetitionDates.length + 1
            );
          });
        });

        test("전체 반복 일정에 반영할 것이라 선택한 경우 같은 부모 일정을 가진 반복 일정에 대해 모두 삭제가 반영된다.", async () => {
          render(<Scheduler />);
          const testEvent: Omit<Event, "id"> = {
            title: "반복 event 생성 테스트",
            date: "2024-07-01",
            startTime: "12:00",
            endTime: "12:30",
            description: "daily scrum",
            location: "회의실",
            category: "개인",
            repeat: { type: "daily", interval: 2 },
            notificationTime: 10,
          };

          await typeEventForm(testEvent);
          await userEvent.click(screen.getByTestId("event-submit-button"));
          await expectEventListHasEvent(testEvent);

          const $eventsInEventList = screen.getAllByTestId(
            "event-in-event-list"
          );

          const repetitionDates = [
            "2024-07-01",
            "2024-07-03",
            "2024-07-05",
            "2024-07-07",
            "2024-07-09",
            "2024-07-11",
            "2024-07-13",
            "2024-07-15",
            "2024-07-17",
            "2024-07-19",
            "2024-07-21",
            "2024-07-23",
            "2024-07-25",
            "2024-07-27",
            "2024-07-29",
            "2024-07-31",
          ];

          let repetitionCount = 0;
          for (const $event of $eventsInEventList) {
            const isRepetition = repetitionDates.some((date) => {
              return $event.innerHTML.includes(date);
            });
            if (isRepetition) {
              repetitionCount++;
              expect($event).toHaveTextContent("반복 event 생성 테스트");
            }
          }

          expect(repetitionCount).toBe(repetitionDates.length);

          const $targetEvent = $eventsInEventList.filter((event) =>
            event.innerHTML.includes("반복 일정")
          )[0];
          const $eventDeleteButton =
            $targetEvent.children[0].children[1].children[1];

          await userEvent.click($eventDeleteButton);

          await userEvent.click(
            screen.getByTestId("delete-all-event-confirm-button")
          );

          const $eventList = await screen.findByTestId("event-list");
          await waitFor(() => {
            expect($eventList).toHaveTextContent("검색 결과가 없습니다.");
          });
        });
      });
    });
  });
});
