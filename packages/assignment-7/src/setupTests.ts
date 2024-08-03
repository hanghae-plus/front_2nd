import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { mockHolidayApiHandlers } from './__mock__/handlers/mockHolidayApiHandlers';
import { mockEventApiHandlers } from './__mock__/handlers/mockEventApiHandlers';
import { initialEvents } from './__mock__/mockData';

// MSW 서버 설정

const server = setupServer();

// 테스트 전에 서버 시작
beforeAll(() => server.listen());

beforeEach(() => {
  const initMockEventApiHandlers = mockEventApiHandlers(initialEvents);
  server.use(...mockHolidayApiHandlers, ...initMockEventApiHandlers);
});

// 각 테스트 후에 핸들러 리셋
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

// 모든 테스트 후에 서버 종료
afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
