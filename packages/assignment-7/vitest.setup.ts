import { beforeAll, afterEach, afterAll } from "vitest";
import { serviceWorker } from "./mock/worker";

beforeAll(() => {
  console.log("server start");
  serviceWorker.listen();
});

afterEach(() => {
  serviceWorker.resetHandlers();
});

afterAll(() => {
  serviceWorker.close();
});
