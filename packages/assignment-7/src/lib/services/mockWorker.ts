import { setupWorker } from 'msw/browser';
import { setupServer } from 'msw/node';
import { handlers } from './mockHandlers';

// Integration, Unit Test
export const mockServer = setupServer(...handlers);

// E2E Test
export const mockWorker = setupWorker(...handlers);
