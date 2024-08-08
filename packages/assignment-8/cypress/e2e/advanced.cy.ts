describe("8주차 과제 advanced - e2e 테스트", () => {
  it("일정 추가 및 수정, 삭제하기, 각각 확인하기", () => {
    cy.visit("http://localhost:5173");

    // 날짜 설정
    const now = new Date(2024, 7, 9, 12, 0, 0);
    cy.clock(now.getTime());

    // 1. 일정 추가
    // 제목 입력
    cy.get('[data-cy="title"]').type("공연 보러가기");

    // 날짜 입력
    cy.get('[data-cy="date"]').type("2024-08-10");

    // 시작 시간 입력
    cy.get('[data-cy="time"]').first().type("18:00");

    // 종료 시간 입력
    cy.get('[data-cy="time"]').last().type("20:00");

    // 설명 입력
    cy.get('[data-cy="description"]').type(
      "돈 많이 벌어서 밴드 보러 맨날 다닐거야.. 돈을 벌어야해.."
    );

    // 위치 입력
    cy.get('[data-cy="location"]').type("서울, South Korea");

    // 카테고리 선택
    cy.get('[data-cy="category"]').select("취미");

    // 반복 일정 체크
    cy.get('[data-cy="repeat-check"]')
      .get(".chakra-checkbox__input")
      .check({ force: true });

    // 알림 설정
    cy.get('[data-cy="notification-time"]').select("1일 전");

    // 반복 유형 입력
    cy.get('[data-cy="repeat-type"]').select("매주");

    // 반복 간격 입력
    cy.get('[data-cy="repeat-interval"]').clear().invoke("val", "");
    cy.get('[data-cy="repeat-interval"]').type("1", { force: true });

    // 반복 종료일 입력
    cy.get('[data-cy="repeat-end-date"]').type("2024-12-31");

    // 추가 버튼 클릭
    cy.get('[data-testid="event-submit-button"]').click();

    // 입력된 데이터 확인
    // 월별 달력에서 확인
    // cy.get('[role="monthView"]')
    //   .find('[role="calendarItem"]')
    //   .filter((index, element) => element.innerText.trim() === "공연 보러가기") // dom 조작... ㄴ
    //   .should("be.visible")
    //   .should("have.length", 3);

    cy.get('[role="monthView"]')
      .find('[role="calendarItem"]')
      .filter(':contains("공연 보러가기")')
      .should("be.visible")
      .should("have.length", 4);

    // 주별 달력 선택
    cy.get('[aria-label="view"]').select("Week");

    // 주별 달력에서 확인
    cy.get('[role="weekView"]')
      .find('[role="calendarItem"]')
      .filter(':contains("공연 보러가기")')
      .should("be.visible")
      .should("have.length", 1);

    cy.get('[aria-label="view"]').select("Month");

    // 2. 일정 수정
    // 일정 선택 및 수정 아이콘 누르기
    cy.get('[role="searchItem"]')
      .eq(0)
      .find('[aria-label="Edit event"]')
      .click();

    // 제목 입력
    cy.get('[data-cy="title"]').clear().type("jisokury club gig");

    // 시작 시간 입력
    cy.get('[data-cy="time"]').first().clear().type("21:00");

    // 종료 시간 입력
    cy.get('[data-cy="time"]').last().clear().type("22:00");

    // 설명 입력
    cy.get('[data-cy="description"]').clear().type("아 제발 가게 해주세요..");

    // 수정 버튼 클릭
    cy.get('[data-testid="event-submit-button"]').click();

    //3. 일정 삭제
    cy.get('[role="searchItem"]')
      .eq(1)
      .find('[aria-label="Delete event"]')
      .click();
  });
});
