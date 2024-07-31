import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "./mock/handler";

const worker = setupServer(...handlers);

beforeAll(() => {
  worker.listen();
});

afterEach(() => {
  worker.resetHandlers();
});

afterAll(() => {
  vi.useRealTimers();
  worker.close();
});
