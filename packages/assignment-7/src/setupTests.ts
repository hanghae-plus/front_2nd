import { setupServer } from "msw/node";
import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { mockApiHandlers } from "./mockApiHandlers";

const server = setupServer(...mockApiHandlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
