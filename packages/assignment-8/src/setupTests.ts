import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { handlers, resetEvents } from "./__mocks__/handlers";

const server = setupServer(...handlers);

const originalError = console.error;
beforeAll(() => {
  server.listen();
  vi.setSystemTime(new Date("2024-08-01"));
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterEach(() => {
  resetEvents();
  server.resetHandlers();
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
