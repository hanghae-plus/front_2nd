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
import { act, renderHook } from "@testing-library/react";
import { useCalendarView } from "../hooks/useCalendarView.ts";
import { Event } from "../types.ts";
import createMockServer from "./createMockServer.ts";
import { useEventOperations } from "../hooks/useEventOperations.ts";
import { http, HttpResponse } from "msw";
import { useNotifications } from "../hooks/useNotifications.ts";
import { fillZero, formatDate } from "../utils/dateUtils.ts";
import { useSearch } from "../hooks/useSearch.ts";

const MOCK_EVENT_1: Event = {
  id: 1,
  title: "기존 회의",
  date: "2024-07-15",
  startTime: "09:00",
  endTime: "10:00",
  description: "기존 팀 미팅",
  location: "회의실 B",
  category: "업무",
  repeat: { type: "none", interval: 0 },
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

beforeAll(() => server.listen());
afterAll(() => {
  server.close();
  vi.clearAllMocks();
});

describe("커스텀훅 테스트 샘플 ", () => {
  describe("customHook > ", () => {
    test("초기 상태가 올바르게 설정되어야 한다", () => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(new Date(2024, 6, 1));
      const { result } = renderHook(() => useCalendarView());

      expect(result.current.view).toBe("month");
      expect(result.current.currentDate).toBeInstanceOf(Date);
      expect(result.current.holidays).toEqual({});

      vi.useRealTimers();
    });
  });
});
