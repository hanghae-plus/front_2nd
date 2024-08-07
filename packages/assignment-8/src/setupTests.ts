import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { handlers, resetEvents } from "./__mocks__/handlers";

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
  vi.setSystemTime(new Date("2024-08-01"));
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
