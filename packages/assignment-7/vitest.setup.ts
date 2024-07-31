import "@testing-library/jest-dom";
import { beforeAll, afterAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { handlers, initializeHandler } from "./mock/handler";

const worker = setupServer(...handlers);

beforeAll(() => {
  worker.listen();
});

afterEach(() => {
  worker.resetHandlers();
  vi.useRealTimers();
  vi.clearAllMocks();
  initializeHandler();
});

afterAll(() => {
  worker.close();
});
