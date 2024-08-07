import "@testing-library/jest-dom";

import createMockServer from "../../__mocks__/createMockServer";

export const server = createMockServer();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
