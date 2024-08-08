import { Event } from "../../../src/types";

describe("e2e 시나리오 테스트", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("반복 일정 생성 및 수정, 삭제를 확인한다.", () => {
    const newEvent: Event = {
      id: 2,
      title: "항해",
      date: "2024-08-03",
      startTime: "13:00",
      endTime: "18:00",
      description: "발제",
      location: "스파르타 본진",
      category: "업무",
      repeat: { type: "weekly", interval: 1, endDate: "2024-08-24" },
      notificationTime: 1,
    };

    cy.get("[data-cy=title]").type(newEvent.title);
    cy.get("[data-cy=date]").type(newEvent.date);
    cy.get("[data-cy=start-time]").type(newEvent.startTime);
    cy.get("[data-cy=end-time]").type(newEvent.endTime);
    cy.get("[data-cy=description]").type(newEvent.description);
    cy.get("[data-cy=location]").type(newEvent.location);
    cy.get("[data-cy=category]").select(newEvent.category);

    cy.get("[data-cy=repeatEvent]")
      .get(".chakra-checkbox__input")
      .check({ force: true });
    cy.get("[data-cy=notificationTime]").select(newEvent.notificationTime);
    cy.get("[data-cy=repeatType]").select(newEvent.repeat.type);

    cy.get("[data-cy=repeatInterval]").clear();
    cy.get("[data-cy=repeatInterval]").invoke("val", "");
    cy.get("[data-cy=repeatInterval]").type(
      newEvent.repeat.interval.toString(),
    );

    cy.get("[data-cy=repeatEndCondition]").select("날짜");
    cy.get("[data-cy=repeatEndDate]").type(newEvent.repeat.endDate as string);
    cy.get("[data-testid=event-submit-button]").click();

    // 일정 카드
    cy.get("[data-cy=event-card]")
      .filter(':contains("항해")')
      .should("have.length", 4);
    // 월별 뷰
    cy.get("[data-cy=event]")
      .filter(':contains("항해")')
      .should("have.length", 4);
    // 주별 뷰
    cy.get("[data-cy=modeSelect]").select("Week");
    cy.get("[data-cy=event]")
      .filter(':contains("항해")')
      .should("have.length", 1);

    cy.get("[data-cy=modeSelect]").select("Month");

    // 일정 수정
    cy.get("[data-cy=event-card]")
      .filter(':contains("항해")')
      .last()
      .find('button[aria-label="Edit event"]')
      .click();

    cy.get("[data-cy=title]").type("항해 + 쫑파티!!");
    cy.get("[data-cy=end-time]").type("23:00");
    cy.get("[data-cy=description]").type("우리 마지막은 아니겠죠??? ㅠㅠㅠㅠ");

    cy.get("[data-testid=event-submit-button]").click();
    cy.get("[data-cy=event-card]")
      .filter(':contains("항해 + 쫑파티!!")')
      .should("have.length", 1);

    // 지난 일정 삭제
    cy.get("[data-cy=event-card]")
      .filter(':contains("항해")')
      .first()
      .find('button[aria-label="Delete event"]')
      .click();

    cy.get("[data-cy=event-card]")
      .filter(':contains("항해")')
      .should("have.length", 3);
    cy.get("[data-cy=event]")
      .filter(':contains("항해")')
      .should("have.length", 3);
  });
});
