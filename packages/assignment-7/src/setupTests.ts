import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { mockApiHandlers, resetEvents } from './mocks/handlers';

const server = setupServer(...mockApiHandlers);

beforeEach(() => {
  resetEvents();
  vi.useFakeTimers({
    shouldAdvanceTime: true,
  });

  vi.setSystemTime(new Date('2024-08-01'));
});

afterEach(() => {
  vi.clearAllMocks();

  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());
