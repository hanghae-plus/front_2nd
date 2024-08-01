import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { mockApiHandlers, resetMockEvents } from './mockApiHandlers';

const server = setupServer(...mockApiHandlers);

beforeEach(() => {
  vi.useFakeTimers({
    shouldAdvanceTime: true,
  });
  vi.setSystemTime(new Date('2024-08-08 09:50'));
});

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  resetMockEvents();
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
