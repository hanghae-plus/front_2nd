import { ReactNode } from "react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import App from "../App.tsx";
import { currentDateStore } from "../store/currentDateStore.ts";

const setupInitItems = (component: ReactNode) => {
  // const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const user = userEvent.setup();
  return {
    user,
    ...render(component),
  };
};

const clearEventInputs = async (user: UserEvent) => {
  // 제목 입력 (text)
  const titleInput = screen.getByLabelText("제목"); // 정규식 사용한 예: const titleInput = screen.getByLabelText(/제목/i); //i: 영어라면, 대소문자 상관없이 만들어줌
  await user.clear(titleInput);

  // 날짜 입력 (date)
  const dateInput = screen.getByLabelText("날짜");
  await user.clear(dateInput);

  // 시작 시간 정하기 (time)
  const startTimeInput = screen.getByLabelText("시작 시간");
  await user.clear(startTimeInput);

  // 종료 시간 정하기 (time)
  const endTimeInput = screen.getByLabelText("종료 시간");
  await user.clear(endTimeInput);

  // 설명 입력 (text)
  const descriptionInput = screen.getByLabelText("설명");
  await user.clear(descriptionInput);

  // 위치 입력 (text)
  const locationInput = screen.getByLabelText("위치");
  await user.clear(locationInput);

  // 카테고리 선택 (select)
  await user.selectOptions(screen.getByLabelText("카테고리"), ["기타"]);

  // 알림 설정 (select)
  await user.selectOptions(screen.getByLabelText("알림 설정"), ["1분 전"]);
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

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe("일정 CRUD 및 기본 기능", () => {
    test("새로운 일정을 생성하고, '검색 리스트 및 달력'에 새로운 일정이 입력한대로 저장되는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 수동 쿼리 예시 (권장 x)
      // const {container} = render(<App />)
      // const foo = container.querySelector('[data-foo="bar"]')

      // 2. 필수 input 모두 채우기
      await fillEventInputs(user);

      // 3. 일정 추가 버튼 클릭
      const addEventBtn = screen.getByRole("button", {
        name: "일정 추가",
      });
      await user.click(addEventBtn);

      // 4. 추가된 일정 확인하기
      // expect(screen.getByText("새로운 이벤트")).toBeInTheDocument(); // 달력에도 추가가 되어서 중복이 뜸
      // 4-1) 검색 리스트 확인하기
      const searchItemsContainer = screen.getByRole("searchItemsContainer"); // 유저 동작 비슷하게 하기 위해 testId x -> role 추가해서 사용
      expect(
        await within(searchItemsContainer).findByText("새로운 이벤트")
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText(
          "2024-07-02 13:00 - 15:00"
        ) // 정규식 사용한 예: await within(searchItemsContainer).findByText(/10:00\s*-\s*12:00/) // \s*: 공백 문자가 0개 이상 있는지 확인하는 패턴
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText("설명은 이거입니다~")
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText("경기도")
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText("카테고리: 가족")
      ).toBeInTheDocument();

      expect(
        await within(searchItemsContainer).findByText("알림: 10분 전")
      ).toBeInTheDocument();

      // 4-2) 달력에 새로 추가한 일정 제목 확인
      const calendarItems = screen.getByRole("monthView");
      expect(
        await within(calendarItems).findByText("새로운 이벤트")
      ).toBeInTheDocument();
    });

    test("기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 수정할 일정 찾기

      // 인덱스 사용하지 않고 찾은 방법 (비효율적)
      // const searchItemsContainer = screen.getByRole("searchItemsContainer");
      // const titleElement = await within(searchItemsContainer).findByText("팀 회의 msw");
      // const searchItem = titleElement.parentElement?.parentElement
      //   ?.parentElement as HTMLElement;

      const searchItems = (await screen.findAllByRole(
        "searchItem"
      )) as HTMLElement[];

      const searchItem = searchItems[0]; // 팀 회의 msw

      // 3. 수정할 일정의 수정 아이콘 누르기
      const editIcon = await within(searchItem).findByLabelText("Edit event");
      await user.click(editIcon);

      // 4. 일정 수정하기
      await clearEventInputs(user);
      await fillEventInputs(user);

      // 5. 일정 수정 버튼 클릭
      const editEventBtn = screen.getByRole("button", {
        name: "일정 수정",
      });
      await user.click(editEventBtn);

      // 6. 수정된 일정 확인하기
      // 6-1) 검색 리스트 중 수정한 일정 내용 확인하기
      const formerEventTitle = screen.queryByText("팀 회의 msw");
      expect(formerEventTitle).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("새로운 이벤트")
      ).toBeInTheDocument();

      const formerEventDate = screen.queryByText("2024-07-03 10:00 - 11:00");
      expect(formerEventDate).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("2024-07-02 13:00 - 15:00") // 정규식 사용한 예: await within(searchItemsContainer).findByText(/10:00\s*-\s*12:00/) // \s*: 공백 문자가 0개 이상 있는지 확인하는 패턴
      ).toBeInTheDocument();

      const formerEventDescription = screen.queryByText("주간 팀 미팅");
      expect(formerEventDescription).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("설명은 이거입니다~")
      ).toBeInTheDocument();

      const formerEventLocation = screen.queryByText("회의실 A");
      expect(formerEventLocation).not.toBeInTheDocument();
      expect(await within(searchItem).findByText("경기도")).toBeInTheDocument();

      const formerEventCategory = screen.queryByText("카테고리: 업무");
      expect(formerEventCategory).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("카테고리: 가족")
      ).toBeInTheDocument();

      const formerEventAlarm = screen.queryByText("알림: 1분 전");
      expect(formerEventAlarm).not.toBeInTheDocument();
      expect(
        await within(searchItem).findByText("알림: 10분 전")
      ).toBeInTheDocument();

      // 6-2) 달력에 새로 추가한 일정 제목 확인
      const calendarItems = screen.getByRole("monthView");

      const formerEventTitleInCalendar =
        within(calendarItems).queryByText("팀 회의 msw");
      expect(formerEventTitleInCalendar).not.toBeInTheDocument();
      expect(
        await within(calendarItems).findByText("새로운 이벤트")
      ).toBeInTheDocument();
    });

    test("일정을 삭제하고 더 이상 조회되지 않는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 삭제할 일정 찾기
      const searchItems = (await screen.findAllByRole(
        "searchItem"
      )) as HTMLElement[];

      const searchItem = searchItems[1]; // 점심 약속 msw

      // 3. 삭제할 일정의 삭제 아이콘 누르기
      const deleteIcon = await within(searchItem).findByLabelText(
        "Delete event"
      );
      await user.click(deleteIcon);

      // 4. 삭제되었는지 확인하기
      // getBy~나 findBy~로 가져오면 에러남(삭제된 것 찾으려고 해서)
      // queryBy~로 가져와야 삭제되었거나 없어도 에러 안 남
      const deletedEventTitle = screen.queryByText("점심 약속 msw");
      expect(deletedEventTitle).not.toBeInTheDocument();
      // expect(deletedTitle).toBeNull(); // toBeNull()도 가능

      const deletedEventDate = screen.queryByText("2024-07-21 12:30 - 13:30");
      expect(deletedEventDate).not.toBeInTheDocument();

      const deletedEventDescription = screen.queryByText("동료와 점심 식사");
      expect(deletedEventDescription).not.toBeInTheDocument();

      const deletedEventLocation = screen.queryByText("회사 근처 식당");
      expect(deletedEventLocation).not.toBeInTheDocument();

      const deletedEventCategory = screen.queryByText("업무: 개인");
      expect(deletedEventCategory).not.toBeInTheDocument();

      const deletedEventAlarm = screen.queryByText("알림: 2시간 전");
      expect(deletedEventAlarm).not.toBeInTheDocument();
    });
  });

  describe("일정 뷰 및 필터링", () => {
    test("주별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. Week 선택
      const viewSelect = screen.getByRole("combobox", {
        name: /view/i,
      });
      await user.selectOptions(viewSelect, ["Week"]);

      // 3. weekView element 가져오기
      const weekView = await screen.findByRole("weekView");

      // 4.calendarItems 변수 선언
      let calendarItems = [];

      // 5. 일정 있는지 없는지 확인후 일정 표시 여부 검증
      // 비동기적으로 calendarItem이 생성 + 아예 없는 경우 고려
      // = waitFor + queryAllByRole 사용
      await waitFor(async () => {
        // queryAllByRole을 통해 없는 경우까지 처리
        calendarItems = within(weekView).queryAllByRole("calendarItem");

        // 갯수 구하기
        const calendarItemsCount = calendarItems.length;

        // 하나도 없을 때 (갯수 0일 때)는 weekView에 없어야한다.
        if (calendarItemsCount === 0) {
          expect(
            within(weekView).queryByRole("calendarItem")
          ).not.toBeInTheDocument();
        }

        // 일정이 존재 할 때는 weekView에 있어야한다.
        if (calendarItemsCount < 0) {
          expect(
            within(weekView).queryByRole("calendarItem")
          ).toBeInTheDocument();
        }
      });
    });

    test("월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. Month 선택
      const viewSelect = screen.getByRole("combobox", {
        name: /view/i,
      });
      await user.selectOptions(viewSelect, ["Month"]);

      // 3. monthView element 가져오기
      const monthView = await screen.findByRole("monthView");

      // 4.calendarItems 변수 선언
      let calendarItems = [];

      // 5. 일정 있는지 없는지 확인후 일정 표시 여부 검증
      await waitFor(async () => {
        // queryAllByRole을 통해 없는 경우까지 처리
        calendarItems = within(monthView).queryAllByRole("calendarItem");

        // 갯수 구하기
        const calendarItemsCount = calendarItems.length;
        // 하나도 없을 때 (갯수 0일 때)는 monthView에 없어야한다.
        if (calendarItemsCount === 0) {
          expect(
            within(monthView).queryByRole("calendarItem")
          ).not.toBeInTheDocument();
        }

        // 일정이 존재 할 때는 monthView에 있어야한다.
        if (calendarItemsCount < 0) {
          expect(
            within(monthView).queryByRole("calendarItem")
          ).toBeInTheDocument();
        }
      });
    });

    test("주별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. Week view 선택
      const viewSelect = screen.getByRole("combobox", {
        name: /view/i,
      });
      await user.selectOptions(viewSelect, ["Week"]);

      // 3. weekly 달력 element
      const weekView = await screen.findByRole("weekView");

      // 4. 달력 내 일정 제목 element 모두 가져오기
      expect(weekView).toHaveTextContent("팀 회의 msw");
    });

    test("월별 뷰에 일정이 정확히 표시되는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. Month view 선택
      const viewSelect = screen.getByRole("combobox", {
        name: /view/i,
      });
      await user.selectOptions(viewSelect, ["Month"]);

      // 3. monthly 달력 element
      const monthView = screen.getByRole("monthView");

      // 5. 해당 월에 해당하는 모든 일정 있는지 확인
      const events = ["팀 회의 msw", "점심 약속 msw", "실리카겔 공연 msw"];

      events.forEach((event) => {
        expect(monthView).toHaveTextContent(event);
      });
    });
  });

  describe("알림 기능", () => {
    test("일정 알림을 설정하고 지정된 시간에 알림이 발생하는지 확인한다", async () => {
      // 1. 원래 날짜 저장 및 새로운 날짜 설정
      const originalDate = new Date("2024-07-01");
      vi.setSystemTime(new Date("2024-07-02 12:50:00"));

      const { user } = setupInitItems(<App />);

      // 2. 새로운 일정 추가 (10분 전 알림)
      await fillEventInputs(user);

      // 3. 일정 추가 버튼 클릭
      const addEventBtn = screen.getByRole("button", {
        name: "일정 추가",
      });
      await user.click(addEventBtn);

      // 알림을 기다리기 위해 waitFor 사용
      // await waitFor(
      //   () => {
      //     const alert = screen.getByText(/10분 후.*새로운 이벤트.*시작됩니다/);
      //     expect(alert).toBeVisible();
      //   },
      //   { timeout: 5000 }
      // ); // 타임아웃을 5초로 설정

      const alert = await screen.findByText(
        /10분 후.*새로운 이벤트.*시작됩니다/,
        { exact: false },
        { timeout: 5000 }
      );
      expect(alert).toBeVisible();

      vi.setSystemTime(originalDate);
    });
  });

  describe("검색 기능", () => {
    test("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다(제목, 날짜, 설명)", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 일정 검색창에 "실리카겔 공연 msw" 입력
      const searchInput = screen.getByLabelText("일정 검색");
      await user.clear(searchInput);
      await user.type(searchInput, "실리카겔 공연 msw");

      // 3. searchItem이 리스트에 나타나는지 확인
      const searchItemsContainer = screen.getByRole("searchItemsContainer");

      // 제목
      expect(
        await within(searchItemsContainer).findByText("실리카겔 공연 msw")
      ).toBeInTheDocument();

      // 날짜
      expect(
        await within(searchItemsContainer).findByText(
          "2024-07-26 18:00 - 19:00"
        )
      ).toBeInTheDocument();

      // 설명
      expect(
        await within(searchItemsContainer).findByText("실리카겔")
      ).toBeInTheDocument();
    });

    test("제목으로 일정을 검색하고 정확한 결과가 반환되는지 확인한다(위치, 카테고리, 알림)", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 일정 검색창에 "실리카겔 공연" 입력
      const searchInput = screen.getByLabelText("일정 검색");
      await user.clear(searchInput);
      await user.type(searchInput, "실리카겔 공연 msw");

      // 3. searchItem이 리스트에 나타나는지 확인
      const searchItemsContainer = screen.getByRole("searchItemsContainer");

      // 위치
      expect(
        await within(searchItemsContainer).findByText("킨텍스")
      ).toBeInTheDocument();

      // 카테고리
      expect(
        await within(searchItemsContainer).findByText("카테고리: 취미")
      ).toBeInTheDocument();

      // 알림
      expect(
        await within(searchItemsContainer).findByText("알림: 2일 전")
      ).toBeInTheDocument();
    });

    test("검색어를 지우면 모든 일정이 다시 표시되어야 한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 일정 검색창에 "실리카겔 공연" 입력
      const searchInput = screen.getByLabelText("일정 검색");
      await user.clear(searchInput);
      await user.type(searchInput, "실리카겔 공연 msw");

      // 3. 검색한 것만 나타나는지 확인
      const searchItemsContainer = screen.getByRole("searchItemsContainer");
      expect(searchItemsContainer).toHaveTextContent(
        "실리카겔 공연 msw2024-07-26 18:00 - 19:00실리카겔킨텍스카테고리: 취미반복: 1주마다알림: 2일 전"
      );

      // dom 접근 지양하기!!
      // const searchItems = (await screen.findAllByRole(
      //   "searchItem"
      // )) as HTMLElement[];

      // const searchedItemContents = searchItems.map(
      //   (content) => content.textContent
      // );
      // expect(searchedItemContents).toEqual(
      //   expect.arrayContaining([
      //     "실리카겔 공연 msw2024-07-26 18:00 - 19:00실리카겔킨텍스카테고리: 취미반복: 1주마다알림: 2일 전",
      //   ])
      // );

      // 4. 일정 검색창 비우기
      await user.clear(searchInput);

      // 5. 모든 일정 다시 표시되는지 확인
      // dom 접근 지양하기!!!
      // const afterSearchItems = (await screen.findAllByRole(
      //   "searchItem"
      // )) as HTMLElement[];
      // const allItemContents = afterSearchItems.map(
      //   (content) => content.textContent
      // );
      // expect(allItemContents).toHaveTextContent(
      //   expect.arrayContaining([
      //     "팀 회의 msw2024-07-03 10:00 - 11:00주간 팀 미팅회의실 A카테고리: 업무반복: 1주마다알림: 1분 전",
      //     "점심 약속 msw2024-07-21 12:30 - 13:30동료와 점심 식사회사 근처 식당카테고리: 개인알림: 2시간 전",
      //     "실리카겔 공연 msw2024-07-26 18:00 - 19:00실리카겔킨텍스카테고리: 취미반복: 1주마다알림: 2일 전",
      //   ])
      // );

      const events = [
        "팀 회의 msw2024-07-03 10:00 - 11:00주간 팀 미팅회의실 A카테고리: 업무반복: 1주마다알림: 1분 전",
        "점심 약속 msw2024-07-21 12:30 - 13:30동료와 점심 식사회사 근처 식당카테고리: 개인알림: 2시간 전",
        "실리카겔 공연 msw2024-07-26 18:00 - 19:00실리카겔킨텍스카테고리: 취미반복: 1주마다알림: 2일 전",
      ];

      events.forEach((event) => {
        expect(searchItemsContainer).toHaveTextContent(event);
      });
    });
  });

  describe("공휴일 표시", () => {
    test("달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다", () => {
      // 1. 새로운 날짜 설정
      currentDateStore.getState().initializeForTest(new Date("2024-01-01"));

      // 2. userEvent 가져오기 및 render
      setupInitItems(<App />);

      // 3. 신정 element 가져오기
      const firstDayOfYear = screen.getByText(/신정/i);

      // 4. 공휴일 스타일이 적용되었는지 확인
      expect(firstDayOfYear).toHaveStyle({
        color: "var(--chakra-colors-red-500)",
        fontSize: "var(--chakra-fontSizes-sm)",
      });
    });

    test("달력에 5월 5일(어린이날)이 공휴일로 표시되는지 확인한다", () => {
      // 1. 새로운 날짜 설정
      currentDateStore.getState().initializeForTest(new Date("2024-05-05"));
      // 2. userEvent 가져오기 및 render
      setupInitItems(<App />);

      // 3. 어린이날 element 가져오기
      const childrensDay = screen.getByText(/어린이날/i);

      // 4. 공휴일 스타일이 적용되었는지 확인
      expect(childrensDay).toHaveStyle({
        color: "var(--chakra-colors-red-500)",
        fontSize: "var(--chakra-fontSizes-sm)",
      });
    });
  });

  describe("일정 충돌 감지", () => {
    test("겹치는 시간에 새 일정을 추가할 때 경고가 표시되는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      // 2. 필수 input 모두 채우기
      await fillEventInputs(user);

      // 3. 일정 추가 버튼 클릭
      const addEventBtn = screen.getByRole("button", {
        name: "일정 추가",
      });
      await user.click(addEventBtn);

      // 4. 똑같이 채우고
      await fillEventInputs(user);

      // 5. 일정 추가 버튼 클릭
      await user.click(addEventBtn);

      expect(await screen.findByText("일정 겹침 경고")).toBeInTheDocument();
    });

    test("기존 일정의 시간을 수정하여 충돌이 발생할 때 경고가 표시되는지 확인한다", async () => {
      // 1. userEvent 가져오기 및 render
      const { user } = setupInitItems(<App />);

      const searchItems = (await screen.findAllByRole(
        "searchItem"
      )) as HTMLElement[];

      const searchItem = searchItems[1]; // 팀 회의 msw

      // 3. 수정할 일정의 수정 아이콘 누르기
      const editIcon = await within(searchItem).findByLabelText("Edit event");
      await user.click(editIcon);

      // 4. 일정 수정하기
      // 날짜 입력 (date)
      const dateInput = screen.getByLabelText("날짜");
      await user.clear(dateInput);
      await user.type(dateInput, "2024-07-03");

      // 시작 시간 정하기 (time)
      const startTimeInput = screen.getByLabelText("시작 시간");
      await user.clear(startTimeInput);
      await user.type(startTimeInput, "10:00");

      // 종료 시간 정하기 (time)
      const endTimeInput = screen.getByLabelText("종료 시간");
      await user.clear(endTimeInput);
      await user.type(endTimeInput, "11:00");

      // 5. 일정 수정 버튼 클릭
      const editEventBtn = screen.getByRole("button", {
        name: "일정 수정",
      });
      await user.click(editEventBtn);

      expect(await screen.findByText("일정 겹침 경고")).toBeInTheDocument();
    });
  });
});
