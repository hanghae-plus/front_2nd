import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { mockApiHandlers } from "./mockApiHandlers";

const server = setupServer(...mockApiHandlers);

beforeAll(() => {
  server.listen();
  vi.useFakeTimers({
    toFake: ["setInterval", "Date"],
  });
  vi.setSystemTime("2024-08-02");
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  vi.useRealTimers();
  server.close();
});
