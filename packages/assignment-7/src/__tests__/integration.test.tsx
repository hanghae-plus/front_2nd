
import { setupServer } from "msw/node";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { mockApiHandlers } from "../mockApiHandlers";
import userEvent, { UserEvent } from '@testing-library/user-event'
import { render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import App from "../App";


const server = setupServer(...mockApiHandlers);

// Execute mock server before test
beforeAll(() => server.listen())

// Close mock server after test
afterAll(() => server.close())

// describe('할 일 목록 통합 테스트', () => {
//   let user:any

//   beforeEach(() => {
//     user = userEvent.setup();
//   })

//   test('초기 할일 목록이 올바르게 렌더링 된다', async () => {
//     render(<TestApp/>);

//     expect(await screen.findByText('테스트 할 일 1')).toBeInTheDocument()
//     expect(await screen.findByText('테스트 할 일 2')).toBeInTheDocument()
//   });

//   test('"새로운 할 일" 할 일이 올바르게 추가된다.', async () => {
//     render(<TestApp/>);

//     const input = screen.getByPlaceholderText('새 할 일');
//     const addButton = screen.getByText('추가');

//     await user.type(input, '새로운 할 일');
//     await user.click(addButton);

//     expect(screen.getByText('새로운 할 일')).toBeInTheDocument();
//   });

//   test('체크 박스를 클릭할 경우 할 일의 상태가 완료로 변경된다. 다시 클릭할 경우 미완료로 변경된다.', async () => {
//     render(<TestApp/>);

//     const allCheckbox = await screen.findAllByRole('checkbox');
//     const firstTodoCheckbox = allCheckbox[0] as HTMLInputElement;
//     await user.click(firstTodoCheckbox);

//     const todoText = screen.getByText('테스트 할 일 1');
//     expect(firstTodoCheckbox.checked).toBe(true);
//     expect(todoText).toHaveClass("completed");

//     await user.click(firstTodoCheckbox);

//     expect(firstTodoCheckbox.checked).toBe(false);
//     expect(todoText).not.toHaveClass("completed");
//   });

//   test('delete를 버튼을 클릭할 경우 할 일이 삭제된다.', async () => {
//     render(<TestApp/>);

//     const allDeletButton = await screen.findAllByText('삭제');
//     const firstDeleteButton = allDeletButton[0];
//     await user.click(firstDeleteButton);

//     expect(screen.queryByText('테스트 할 일 1')).not.toBeInTheDocument()
//   })
// })



describe('일정 관리 애플리케이션 통합 테스트', () => {
  describe('일정 CRUD 및 기본 기능', () => {
    // 유저 셋팅
    let user: UserEvent

    beforeEach(() => {
      user = userEvent.setup();
    })

    test('새로운 일정을 생성하고 해당 일정이 일정 리스트에 렌더링되는지 확인한다', async() => {
      render(<App/>);
      const id = crypto.randomUUID();
      const title = `새로운 이벤트-${id}`
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth() + 1
      const date = today.getDate() +1

      const titleInput = screen.getByTestId('title-input')
      const dateInput = screen.getByTestId("date-input")
      const startTimeInput = screen.getByTestId("start-time-input")
      const endTimeInput = screen.getByTestId("end-time-input")
      const descriptionInput = screen.getByTestId("description-input")
      const locationInput = screen.getByTestId("location-input")
      const categorySelect = screen.getByTestId("category-select")
      const submitButton = screen.getByTestId("event-submit-button")

      await user.type(titleInput, title);
      await user.type(dateInput, `${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`);
      await user.type(startTimeInput, '00:00');
      await user.type(endTimeInput, '23:59');
      await user.type(descriptionInput, '새로운 이벤트 설명');
      await user.type(locationInput, '스파르타 주둔지');

      await user.selectOptions(categorySelect, "업무");

      await user.click(submitButton);
      
      // 새로운 이벤트 정상적으로 이벤트 리스트에 추가되었는지 확인합니다.
      const eventList = screen.getByTestId("event-list")
      const newEventInEventList = within(eventList).getByText(title)
      expect(newEventInEventList).toBeInTheDocument()
    });

    test.fails('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async() => {
      render(<App />);
      // const target = screen.getByText("알림 테스트");
    });
    test.fails('일정을 삭제하고 더 이상 조회되지 않는지 확인한다');
  });

  describe('일정 뷰 및 필터링', () => {
    test.fails('주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.');
    test.fails('주별 뷰에 일정이 정확히 표시되는지 확인한다');
    test.fails('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.');
    test.fails('월별 뷰에 일정이 정확히 표시되는지 확인한다');
  });

  describe('알림 기능', () => {
    test.fails('일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다');
  });

  describe('검색 기능', () => {
    test.fails('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test.fails('제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다');
    test.fails('검색어를 지우면 모든 일정이 다시 표시되어야 한다');
  });

  describe('공휴일 표시', () => {
    test.fails('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다');
    test.fails('달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다');
  });

  describe('일정 충돌 감지', () => {
    test.fails('겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다');
    test.fails('기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다');
  });
});
