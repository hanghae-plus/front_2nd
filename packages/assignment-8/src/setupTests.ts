import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { mockApiHandlers, resetEvents } from "./mocks/mockApiHandlers.ts";
import { currentDateStore } from "./store/currentDateStore.ts";

const server = setupServer(...mockApiHandlers);

// ~Each - 테스트마다 실행
beforeEach(() => {
  // 필요한 것만 리셋해야함! -> 치명적인 결함 생길 수 있음 (spyOn 등 리셋)
  // vi.clearAllMocks();
  // vi.resetAllMocks();
  // vi.restoreAllMocks();
  // vi.resetModules();
  resetEvents(); // 각 테스트마다 events 배열 초기화
  currentDateStore.getState().initializeForTest(new Date("2024-07-01"));
});

afterEach(() => {
  server.resetHandlers();
});

// ~All - 처음 한 번 실행
beforeAll(() => {
  server.listen();
  // vi.useFakeTimers({
  //   shouldAdvanceTime: true,
  // });
  // vi.setSystemTime(new Date("2024-07-01"));
});

afterAll(() => {
  // vi.runOnlyPendingTimers();
  // vi.useRealTimers();

  server.close();
});
