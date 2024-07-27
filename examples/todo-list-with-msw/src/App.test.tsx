import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.tsx'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { setupServer } from "msw/node";
import { mockApiHandlers } from "./mockApiHandlers.ts";

const server = setupServer(...mockApiHandlers);

// 테스트 시작 전에 목 서버를 실행
beforeAll(() => server.listen())

// 테스트 종료 후에 목 서버 종료
afterAll(() => server.close())

describe('할 일 목록 통합 테스트', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  })

  test('초기 할일 목록이 올바르게 렌더링 된다', async () => {
    render(<App/>);

    expect(await screen.findByText('테스트 할 일 1')).toBeInTheDocument()
    expect(await screen.findByText('테스트 할 일 2')).toBeInTheDocument()
  });

  test('"새로운 할 일" 할 일이 올바르게 추가된다.', async () => {
    render(<App/>);

    const input = screen.getByPlaceholderText('새 할 일');
    const addButton = screen.getByText('추가');

    await user.type(input, '새로운 할 일');
    await user.click(addButton);

    expect(screen.getByText('새로운 할 일')).toBeInTheDocument();
  });

  test('체크 박스를 클릭할 경우 할 일의 상태가 완료로 변경된다. 다시 클릭할 경우 미완료로 변경된다.', async () => {
    render(<App/>);

    const allCheckbox = await screen.findAllByRole('checkbox');
    const firstTodoCheckbox = allCheckbox[0] as HTMLInputElement;
    await user.click(firstTodoCheckbox);

    const todoText = screen.getByText('테스트 할 일 1');
    expect(firstTodoCheckbox.checked).toBe(true);
    expect(todoText).toHaveClass("completed");

    await user.click(firstTodoCheckbox);

    expect(firstTodoCheckbox.checked).toBe(false);
    expect(todoText).not.toHaveClass("completed");
  });

  test('delete를 버튼을 클릭할 경우 할 일이 삭제된다.', async () => {
    render(<App/>);

    const allDeletButton = await screen.findAllByText('삭제');
    const firstDeleteButton = allDeletButton[0];
    await user.click(firstDeleteButton);

    expect(screen.queryByText('테스트 할 일 1')).not.toBeInTheDocument()
  })
})
