const newData = {
  title: "항해 플러스 파티",
  date: "2024-09-25",
  startTime: "06:30",
  endTime: "11:30",
  category: "기타",
  description: "파티는 끝나지 않아..",
  location: "선릉역",
  notificationTime: "120",
  repeat: {
    endDate: undefined,
    interval: 10,
    type: "none",
  },
};

describe("캘린더 앱에 대해 e2e테스트를 진행합니다.", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");

    cy.intercept("GET", "/api/events").as("getData");

    cy.wait("@getData");
  });

  it("현재 날짜에 대한 달력을 보여줍니다.", () => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const currentDateFormat = `${currentYear}년 ${currentMonth}월`;
    cy.get("[data-cy=current-date]").should("have.text", currentDateFormat);
  });

  it("현재 날짜에 대해 일정이 화면에 보여지는지 확인합니다.", () => {
    // 알림 테스트는 현재 날짜 기준으로 계속 일정에 표시된다..
    cy.get("[data-cy=event-title]").should("have.text", "알림 테스트");
  });

  it("일정을 등록하게 되면 달력과 목록에 표시됩니다.", () => {
    // 시스템 시간을 설정합니다.
    const date = new Date("2024-09-01");
    cy.clock(date.getTime());

    // 다시 접속해야 시간이 제대로 설정된다..?
    cy.visit("http://localhost:5173");

    // // 폼 필드에 데이터를 입력합니다.
    cy.get("[data-cy=title]").type(newData.title);
    cy.get("[data-cy=date]").type(newData.date);
    cy.get("[data-cy=start-time]").type(newData.startTime);
    cy.get("[data-cy=end-time]").type(newData.endTime);
    cy.get("[data-cy=description]").type(newData.description);
    cy.get("[data-cy=location]").type(newData.location);
    cy.get("[data-cy=category]").select(newData.category);

    // // 제출 버튼을 클릭합니다.
    cy.get("[data-cy=submit-button]").click();

    // 각 필드가 올바르게 저장되었는지 확인합니다.
    cy.contains(newData.title).should("exist");
    cy.contains(
      `${newData.date} ${newData.startTime} - ${newData.endTime}`
    ).should("exist");
    cy.contains(newData.description).should("exist");
    cy.contains(newData.location).should("exist");
    cy.contains(newData.category).should("exist");
  });
});
