import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { mockApiHandlers, resetEvents } from './mockApiHandlers';

export const server = setupServer(...mockApiHandlers);

beforeEach(() => {
  resetEvents();

  vi.useFakeTimers({
    shouldAdvanceTime: true,
  });

  vi.setSystemTime(new Date('2024-07-01'));
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();

  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
