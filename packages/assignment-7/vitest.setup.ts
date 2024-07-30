import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "./mock/handler";

const worker = setupServer(...handlers);

beforeAll(() => {
  console.log("server start");
  worker.listen();
});

afterEach(() => {
  worker.resetHandlers();
});

afterAll(() => {
  worker.close();
});
