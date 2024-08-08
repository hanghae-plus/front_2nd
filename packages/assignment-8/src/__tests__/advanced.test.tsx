import { setupServer } from "msw/node";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { createHandlers } from "../mockApiHandlers";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import App from "../App";

// 기본값 없는 빈 배열에서 시작 
const server = setupServer(...createHandlers([]));

beforeAll(() => {
  vi.useFakeTimers({
    toFake: ['setInterval', 'Date']
  })
  server.listen();
});
beforeEach(() => {
  vi.setSystemTime(new Date('2024-09-02'));
  // 데이터는 초기화하지 않음
})
afterEach(() => {
  vi.clearAllMocks();
  server.resetHandlers();
});
afterAll(() => {
  server.close();
  vi.resetAllMocks();
})

describe("추가 요구사항에 대한 시나리오 테스트", () => {
  let user: UserEvent;

  const userType = async (element: HTMLElement, text: string) => {
    await user.clear(element);
    await user.type(element, text);
  }
  const submit = async () => {
    const submitBtn = await screen.findByTestId("event-submit-button");
    await user.click(submitBtn);
  }

  const findAllElementsLength = async (text: string, base?: HTMLElement) => {
    try {
      if(base) {
        const foundElements = await within(base).findAllByText(text);
        return foundElements.length;  
      }
      const foundElements = await screen.findAllByText(text);
      return foundElements.length;
    } catch (e) {
      return 0;
    }
  };

  const moveToPrevView = async (count: number=1) => {
    const prevViewBtn = screen.getByRole("button", {
      name: "Previous",
    })

    for(let i=0; i<count; i++) {
      await user.click(prevViewBtn);
    }
  }

  const moveToNextView = async (count: number=1) => {
    const nextViewBtn = screen.getByRole("button", {
      name: "Next",
    })

    for(let i=0; i<count; i++) {
      await user.click(nextViewBtn);
    }
  }

  beforeEach(() => {
    user = userEvent.setup();
  });

  test("매주 월요일 오전 10시에 있는 팀 회의를 캘린더에 등록", async () => {
    vi.setSystemTime(new Date('2024-07-01 09:40'));
    render(<App/>);

    const titleInput = await screen.findByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const locationInput = screen.getByLabelText('위치');
    const descriptionInput = screen.getByLabelText('설명');
    const notificationInput = screen.getByLabelText('알림 설정');
    const repeatCheck = screen.getByLabelText('반복 설정');
    await user.click(repeatCheck);

    const repeatTypeInput = await screen.findByLabelText('반복 유형');
    const repeatIntervalInput = screen.getByLabelText('반복 간격');
    const repeatEndInput = screen.getByLabelText('반복 종료일');
    
    const monthView = screen.getByTestId('month-view');

    await userType(titleInput, '주간 팀 회의');
    await userType(dateInput, '2024-07-01');
    await userType(startTimeInput, '10:00');
    await userType(endTimeInput, '11:00');
    await userType(locationInput, '회의실 A');
    await userType(descriptionInput, '주간 업무 보고 및 계획 수립');
    await user.selectOptions(repeatTypeInput, '매주');
    await userType(repeatIntervalInput, '1');
    await userType(repeatEndInput, '2024-12-31');
    await user.selectOptions(notificationInput, '10분 전');
    
    await submit();

    // 7월 중 월요일은 5번
    expect(await findAllElementsLength('주간 팀 회의', monthView)).toBe(5);
  })
  test("2024/12/31까지 반복 후 2025/01/01부터는 반복되는 일정 없음", async () => {
    vi.setSystemTime(new Date('2024-12-01'));
    render(<App/>);

    const monthView = screen.getByTestId('month-view');

    // 12월에 5번 반복
    expect(await findAllElementsLength('주간 팀 회의', monthView)).toBe(5);

    // 1월로 이동
    await moveToNextView();

    // 1월에 반복 없음
    expect(await findAllElementsLength('주간 팀 회의', monthView)).toBe(0);
  })
  test("모든 일정에 대해 종료 시간 11:30으로 수정", async () => {
    render(<App/>);

    const editBtns = await screen.findAllByRole("button", {
      name: "Edit event",
    })
    await user.click(editBtns[0]);

    const endTimeInput = screen.getByLabelText('종료 시간');
    await userType(endTimeInput, '11:30');

    await submit();

    const checkTime = async () => {
      await waitFor(() => {
        expect(screen.queryAllByText(/10:00 - 11:00/i).length).toBe(0);
      })
      expect(screen.queryAllByText(/10:00 - 11:30/i).length).not.toBe(0);
    }
    
    // 현재 달에서 체크
    await checkTime();

    // 이전 달에서 체크(이후 모든 일정 수정 구현X)
    await moveToPrevView();
    await checkTime();

    // 다음 달에서 체크
    await moveToNextView(2);
    await checkTime();
  })
  test("9월 셋째 주 공휴일 일정 삭제", async () => {
    render(<App/>);

    // 추석 일정 확인
    expect(await findAllElementsLength('추석')).not.toBe(0);
    
    const beforeMonthView = screen.getByTestId('month-view');
    
    // 기존 데이터는 5개
    expect(await findAllElementsLength('주간 팀 회의', beforeMonthView)).toBe(5);

    // 주별 뷰로 변경
    const viewSelectBox = screen.getByRole("combobox", { name: "view" });
    await user.selectOptions(viewSelectBox, "Week");

    // 9월 3째주로 이동(현재 9/1 > 1째주)
    await moveToNextView(2);

    // 16일 데이터 확인
    await waitFor(() => {
      expect(screen.queryByText(/2024-09-16 10:00 - 11:30/)).toBeInTheDocument();
    })

    const deleteBtn = await screen.findByRole("button", {
      name: "Delete event",
    })
    await user.click(deleteBtn);

    expect(await findAllElementsLength('주간 팀 회의')).toBe(0);

    // 월별 뷰로 변경
    await user.selectOptions(viewSelectBox, "Month");

    const afterMonthView = screen.getByTestId('month-view');

    // 9월에 남은 일정은 4개
    expect(await findAllElementsLength('주간 팀 회의', afterMonthView)).toBe(4);

    // 16일에 등록된 일정 없음
    expect(screen.queryByText(/2024-09-16 10:00 - 11:30/)).not.toBeInTheDocument();
  })
})