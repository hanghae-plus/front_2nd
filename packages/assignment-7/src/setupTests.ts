import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, vi } from 'vitest';
import { mockApiHandlers } from './mocks/handlers';

const server = setupServer(...mockApiHandlers);

beforeEach(() => {
  vi.useFakeTimers({
    shouldAdvanceTime: true,
  });

  vi.setSystemTime(new Date('2024-08-01'));
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();

  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});
