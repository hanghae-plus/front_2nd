import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { mockHolidayApiHandlers } from './__mock__/handlers/mockHolidayApiHandlers';
import { mockEventApiHandlers } from './__mock__/handlers/mockEventApiHandlers';

// MSW 서버 설정
const server = setupServer(...mockHolidayApiHandlers, ...mockEventApiHandlers);

// 테스트 전에 서버 시작
beforeAll(() => server.listen());

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
