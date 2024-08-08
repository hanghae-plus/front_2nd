import { ReactNode } from "react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
import App from "../App.tsx";

const setupInitItems = (component: ReactNode) => {
  // const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const user = userEvent.setup();
  return {
    user,
    ...render(component),
  };
};

const fillEventInputs = async (user: UserEvent) => {
  // 제목 입력 (text)
  const titleInput = screen.getByLabelText("제목"); // 정규식 사용한 예: const titleInput = screen.getByLabelText(/제목/i); //i: 영어라면, 대소문자 상관없이 만들어줌
  await user.type(titleInput, "새로운 이벤트");

  // 날짜 입력 (date)
  const dateInput = screen.getByLabelText("날짜");
  await user.type(dateInput, "2024-07-02");

  // 시작 시간 정하기 (time)
  const startTimeInput = screen.getByLabelText("시작 시간");
  await user.type(startTimeInput, "13:00");

  // 종료 시간 정하기 (time)
  const endTimeInput = screen.getByLabelText("종료 시간");
  await user.type(endTimeInput, "15:00");

  // 설명 입력 (text)
  const descriptionInput = screen.getByLabelText("설명");
  await user.type(descriptionInput, "설명은 이거입니다~");

  // 위치 입력 (text)
  const locationInput = screen.getByLabelText("위치");
  await user.type(locationInput, "경기도");

  // 카테고리 선택 (select)
  await user.selectOptions(screen.getByLabelText("카테고리"), ["가족"]);

  // 알림 설정 (select)
  await user.selectOptions(screen.getByLabelText("알림 설정"), ["10분 전"]);
};

describe("일정 관리 애플리케이션 통합 테스트 8주차 basic", () => {
  describe("반복 일정에 대한 요구사항 추가", () => {
    test("일정 생성 시 반복 유형을 선택하고 각 반복 유형에 대해 간격을 설정할 수 있다.", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 새로운 이벤트 생성을 위해 입력값들 입력하기
      await fillEventInputs(user);

      // 3. "반복 일정" 체크박스 체크
      const repeatCheckbox = screen.getByRole("repeatCheckbox");
      await user.click(repeatCheckbox);

      // 4. 반복 유형 선택
      const repeatTypeSelect = await screen.findByLabelText("반복 유형");
      await user.selectOptions(repeatTypeSelect, ["매주"]);

      // 5. 반복 간격 선택
      const repeatIntervalInput = await screen.findByLabelText("반복 간격");
      await user.clear(repeatIntervalInput);
      await user.type(repeatIntervalInput, "2");

      // 6. 일정 추가하기
      const addEventBtn = screen.getByRole("button", {
        name: "일정 추가",
      });
      await user.click(addEventBtn);

      // 7. 생성 및 수정된 이벤트의 반복 유형 확인
      const searchItems = (await screen.findAllByRole(
        "searchItem"
      )) as HTMLElement[];

      const searchItem = searchItems[3]; // 새로운 이벤트

      expect(
        await within(searchItem).findByText("반복: 2주마다")
      ).toBeInTheDocument();
    });

    test("일정 수정 시 반복 유형을 선택하고 각 반복 유형에 대해 간격을 설정할 수 있다..", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 수정할 일정 찾기
      const searchItems = (await screen.findAllByRole(
        "searchItem"
      )) as HTMLElement[];

      const searchItem = searchItems[2]; // 실리카겔 공연 msw

      // 3. 수정할 일정의 수정 아이콘 누르기
      const editIcon = await within(searchItem).findByLabelText("Edit event");
      await user.click(editIcon);

      // 4. "반복 일정" 체크박스 체크 (전 테스트 영향으로 체크가 유지되어있음. 그러므로 클릭 생략)
      // const repeatCheckbox = screen.getByRole("repeatCheckbox");
      // await user.click(repeatCheckbox);

      // 5. 반복 유형 선택
      const repeatTypeSelect = await screen.findByLabelText("반복 유형");
      await user.selectOptions(repeatTypeSelect, ["매주"]);

      // 6. 반복 간격 선택
      const repeatIntervalInput = await screen.findByLabelText("반복 간격");
      await user.clear(repeatIntervalInput);
      await user.type(repeatIntervalInput, "2");

      // 7. 일정 수정 하기
      const editEventBtn = screen.getByRole("button", {
        name: "일정 수정",
      });
      await user.click(editEventBtn);

      // 8. 생성 및 수정된 이벤트의 반복 유형 확인
      expect(
        await within(searchItem).findByText("반복: 2주마다")
      ).toBeInTheDocument();
    });

    test("캘린더 뷰에서 반복 일정을 시각적으로 구분하여 표시한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 새로운 이벤트 생성을 위해 입력값들 입력하기
      await fillEventInputs(user);

      // 3. "반복 일정" 체크박스 체크
      const repeatCheckbox = screen.getByRole("repeatCheckbox");
      await user.click(repeatCheckbox);

      // 4. 반복 유형 선택
      const repeatTypeSelect = await screen.findByLabelText("반복 유형");
      await user.selectOptions(repeatTypeSelect, ["매주"]);

      // 5. 반복 간격 선택
      const repeatIntervalInput = await screen.findByLabelText("반복 간격");
      await user.clear(repeatIntervalInput);
      await user.type(repeatIntervalInput, "1");

      // 6. 일정 추가하기
      const addEventBtn = screen.getByRole("button", {
        name: "일정 추가",
      });
      await user.click(addEventBtn);

      // 7. 추가된 반복 일정에 따라 일정이 반복해서 캘린더에 나타나는지 확인
      const viewSelect = screen.getByRole("combobox", {
        name: /view/i,
      });

      await user.selectOptions(viewSelect, ["Week"]); // week view 선택

      const weekView = screen.getByRole("weekView");

      expect(
        (await within(weekView).findAllByText("새로운 이벤트")).length
      ).toBe(1);

      await user.selectOptions(viewSelect, ["Month"]); // month view 선택

      const monthView = screen.getByRole("monthView");

      expect(
        (await within(monthView).findAllByText("새로운 이벤트")).length
      ).toBe(5);
    });
  });

  describe("예외 날짜 처리", () => {
    test("반복 일정 중 특정 날짜를 제외할 수 있다.", async () => {});
    test("반복 일정 중 특정 날짜의 일정을 수정할 수 있다.", async () => {});
  });

  describe("반복 종료 조건", () => {
    test("반복 종료 조건을 지정할 수 있다.(옵션: 특정 날짜까지, 특정 횟수만큼, 또는 종료 없음)", async () => {});
  });

  describe("요일 지정 (주간 반복의 경우)", () => {
    test("주간 반복 시 특정 요일을 선택할 수 있다.", async () => {});
  });

  describe("월간 반복 옵션", () => {
    test("매월 특정 날짜에 반복되도록 설정할 수 있다.", async () => {});
    test("매월 특정 순서의 요일에 반복되도록 설정할 수 있다.", async () => {});
  });

  describe("반복 일정 수정", () => {
    test("반복 일정의 단일 일정을 수정할 수 있다.", async () => {});
    test("반복 일정의 모든 일정을 수정할 수 있다.", async () => {});
  });
});
