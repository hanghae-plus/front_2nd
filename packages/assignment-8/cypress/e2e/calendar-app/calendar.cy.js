/// <reference types="cypress" />

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
    // 실제 API
    cy.request("/api/events/reset").then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.equal("reset");
    });

    cy.visit("http://localhost:5173");
    cy.intercept("GET", "/api/events").as("getData");
    cy.wait("@getData");
  });

  it("현재 날짜에 대한 달력을 보여줍니다.", () => {
    // 시스템 시간을 설정합니다.
    const date = new Date("2024-09-01");
    cy.clock(date.getTime());

    // 다시 접속해야 시간이 제대로 설정된다..?
    cy.visit("http://localhost:5173");
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const currentDateFormat = `${currentYear}년 ${currentMonth}월`;
    cy.get("[data-cy=current-date]").should("have.text", currentDateFormat);
  });

  it("일정을 등록하게 되면 달력과 목록에 표시됩니다.", () => {
    // 시스템 시간을 설정합니다.
    const date = new Date("2024-09-01");
    cy.clock(date.getTime());

    // 다시 접속해야 시간이 제대로 설정된다..?
    cy.visit("http://localhost:5173");

    // 폼 필드에 데이터를 입력합니다.
    cy.get("[data-cy=title]").type(newData.title);
    cy.get("[data-cy=date]").type(newData.date);
    cy.get("[data-cy=start-time]").type(newData.startTime);
    cy.get("[data-cy=end-time]").type(newData.endTime);
    cy.get("[data-cy=description]").type(newData.description);
    cy.get("[data-cy=location]").type(newData.location);
    cy.get("[data-cy=category]").select(newData.category);

    // 제출 버튼을 클릭합니다.
    cy.get("[data-cy=submit-button]").click();

    // 저장한 값들이 화면에 반영되는지 확인합니다.
    cy.contains(newData.title).should("exist");
    cy.contains(
      `${newData.date} ${newData.startTime} - ${newData.endTime}`
    ).should("exist");
    cy.contains(newData.description).should("exist");
    cy.contains(newData.location).should("exist");
    cy.contains(newData.category).should("exist");
  });

  it("일정을 수정하게 되면 화면에 반영이 됩니다.", () => {
    const date = new Date("2024-09-01");
    cy.clock(date.getTime());

    // 다시 접속해야 시간이 제대로 설정된다..?
    cy.visit("http://localhost:5173");

    cy.get("[data-cy=edit-event]").first().click();

    // 폼 필드에 데이터를 입력합니다.
    cy.get("[data-cy=location]").clear();
    cy.get("[data-cy=location]").type("안양");

    // 제출 버튼을 클릭합니다.
    cy.get("[data-cy=submit-button]").click();

    cy.contains("안양").should("exist");
  });

  it("일정을 삭제하면 더 이상 조회되지 않습니다.", () => {
    // 시스템 시간을 설정합니다.
    const date = new Date("2024-09-01");
    cy.clock(date.getTime());
    // 다시 접속해야 시간이 제대로 설정된다..?
    cy.visit("http://localhost:5173");

    cy.contains("여행가고 싶다..").should("exist");

    cy.get("[data-cy=delete-event]").first().click();

    cy.contains("여행가고 싶다..").should("not.exist");
  });
});
