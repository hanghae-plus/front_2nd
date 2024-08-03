import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { mockCalendarApiHandler } from "./mockCalendarApiHandler";

const server = setupServer(...mockCalendarApiHandler);

beforeAll(() => server.listen());

beforeEach(() => {
  server.use(...mockCalendarApiHandler);

  vi.useFakeTimers({
    shouldAdvanceTime: true,
  });
  vi.setSystemTime(new Date("2024-07-30"));
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();

  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
