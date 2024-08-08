import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { createMockHandler, initalEvents } from "./mockCalendarApiHandler";

const server = setupServer();

beforeAll(() => server.listen());

beforeEach(() => {
  const handler = createMockHandler(initalEvents);
  server.use(...handler);
  vi.useFakeTimers({
    shouldAdvanceTime: true,
  });
  vi.setSystemTime(new Date("2024-08-06"));
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
