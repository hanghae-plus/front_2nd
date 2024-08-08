import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import {
  render,
  screen,
  waitFor,
  within,
  act,
  renderHook,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCalendarView } from "../useCalendarView.ts";
import { Event } from "../types.ts";
import createMockServer from "./createMockServer.ts";
import { useEventOperations } from "../useEventOperations.ts";
import { http, HttpResponse } from "msw";
// import { useNotifications } from "../useNotifications.ts";
// import { fillZero, formatDate } from "../../utils/dateUtils.ts";
import { useSearch } from "../useSearch.ts";
import App from "../../App";

const MOCK_EVENT_1: Event = {
  id: 99,
  title: "정기 회의",
  date: "2024-08-01",
  startTime: "09:00",
  endTime: "10:00",
  description: "정기 팀 미팅",
  location: "회의실 B",
  category: "업무",
  repeat: { type: "weekly", interval: 1 },
  notificationTime: 10,
};

const events: Event[] = [{ ...MOCK_EVENT_1 }];

const server = createMockServer(events);

const mockToast = vi.fn();

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: () => (props: never) => mockToast(props),
  };
});

beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
  vi.clearAllMocks();
});

describe("반복 일정 기능 테스트", () => {
  describe("1. 반복 유형 선택", () => {
    test("일정 생성 시 반복 유형을 선택할 수 있다", async () => {
      // Given
      const user = userEvent.setup();
      render(<App />);

      // When
      /** 반복 설정은 이미 체크가 되어있는 상태*/
      await user.type(
        screen.getByRole("spinbutton", {
          name: /반복 간격/i,
        }),
        "2"
      );
      await user.selectOptions(screen.getByLabelText("반복 유형"), "weekly");
      // Then
      expect(screen.getByLabelText("반복 유형")).toHaveValue("weekly");
    });

    test("모든 반복 유형(매일, 매주, 매월, 매년)을 선택할 수 있다", async () => {
      // Given
      const user = userEvent.setup();
      render(<App />);

      // When
      /** 반복설정이 체크되어있다 */

      const repeatTypeSelect = screen.getByRole("combobox", {
        name: /반복 유형/i,
      });
      const options = screen.getAllByRole("option");

      expect(repeatTypeSelect).toHaveLength(4); // 4개의 옵션이 있어야 함

      const optionValues = options.map((option) =>
        option.getAttribute("value")
      );
      expect(optionValues).toEqual(
        expect.arrayContaining(["daily", "weekly", "monthly", "yearly"])
      );

      const optionTexts = options.map((option) => option.textContent);
      expect(optionTexts).toEqual(
        expect.arrayContaining(["매일", "매주", "매월", "매년"])
      );

      // 각 옵션을 선택할 수 있는지 확인
      for (const value of ["daily", "weekly", "monthly", "yearly"]) {
        await user.selectOptions(repeatTypeSelect, value);
        expect(repeatTypeSelect).toHaveValue(value);
      }
    });
  });

  describe("2. 반복 간격 설정", () => {
    test("매주 반복에 대해 간격을 설정할 수 있다", async () => {
      // Given
      const user = userEvent.setup();
      render(<App />);
      await user.clear(screen.getByLabelText("반복 간격"));

      // When
      await user.selectOptions(screen.getByLabelText("반복 유형"), "weekly");
      await user.type(screen.getByLabelText("반복 간격"), "2");

      // Then
      expect(screen.getByLabelText("반복 간격")).toHaveValue(2);
    });
  });

  describe("3. 반복 일정 표시", () => {
    test("월간 뷰에서 반복 일정이 주기적으로 추가되어 표시된다", async () => {
      // Given
      const mockEvents: Event[] = [
        {
          id: 99,
          title: "주간 회의",
          date: "2024-08-01",
          startTime: "09:00",
          endTime: "10:00",
          description: "정기 팀 미팅",
          location: "회의실 A",
          category: "업무",
          repeat: { type: "weekly", interval: 1 },
          notificationTime: 10,
        },
      ];
      server.use(
        http.get("/api/events", () => {
          return HttpResponse.json(mockEvents);
        })
      );

      const { result } = renderHook(() => useEventOperations(false));
      await act(async () => {
        await result.current.fetchEvents();
      });

      const { result: searchResult } = renderHook(() =>
        useSearch(result.current.events, new Date(2024, 8, 1), "month")
      );

      // When
      const filteredEvents = searchResult.current.filteredEvents;

      // Then
      expect(filteredEvents.length).toBeGreaterThan(4);
      expect(filteredEvents[0].date).toBe("2024-08-01");
      expect(filteredEvents[1].date).toBe("2024-08-08");
      expect(filteredEvents[2].date).toBe("2024-08-15");
      expect(filteredEvents[3].date).toBe("2024-08-22");
      expect(filteredEvents[4].date).toBe("2024-08-29");
    });
  });

  describe("4. 예외 날짜 처리", () => {
    test("반복 일정 중 특정 날짜를 제외할 수 있다", () => {});

    test("반복 일정 중 특정 날짜의 일정을 수정할 수 있다", () => {});
  });

  describe("5. 반복 종료 조건", () => {
    test("특정 날짜까지 반복되도록 설정할 수 있다", () => {});

    test("특정 횟수만큼 반복되도록 설정할 수 있다", () => {});

    test("종료 없이 계속 반복되도록 설정할 수 있다", () => {});
  });

  describe("6. 요일 지정 (주간 반복의 경우)", () => {
    test("주간 반복 시 특정 요일을 선택할 수 있다", () => {});
  });

  describe("7. 월간 반복 옵션", () => {
    test("매월 특정 날짜에 반복되도록 설정할 수 있다", () => {});

    test("매월 특정 순서의 요일에 반복되도록 설정할 수 있다", () => {});
  });

  describe("8. 반복 일정 수정", () => {
    test("반복 일정의 단일 일정을 수정할 수 있다", () => {});

    test("반복 일정의 모든 일정을 수정할 수 있다", () => {});
  });
});
