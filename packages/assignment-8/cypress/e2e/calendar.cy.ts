beforeEach(() => {
  cy.visit("http://localhost:5173");
});

describe("캘린더 유효성 검사", () => {
  it("필수 정보를 입력하지 않으면 토스트가 노출된다.", () => {
    cy.get("button").contains("일정 추가").click();
    cy.get('[role="status"]')
      .contains("필수 정보를 모두 입력해주세요.")
      .should("be.visible");
  });

  it("시작 시간이 종료 시간보다 늦으면 토스트가 노출된다.", () => {
    cy.get("label").contains("시작 시간").type("00:10");
    cy.get("label").contains("종료 시간").type("00:00");

    cy.get('[role="tooltip"]')
      .contains("시작 시간은 종료 시간보다 빨라야 합니다.")
      .should("be.visible");

    cy.get('[role="tooltip"]')
      .contains("종료 시간은 시작 시간보다 늦어야 합니다.")
      .should("be.visible");
  });
});

describe("일정 추가, 수정, 삭제", () => {
  beforeEach(() => {
    cy.request("PUT", "http://localhost:5173/api/events/reset").then(
      (response) => {
        expect(response.status).to.eq(200);
      }
    );
  });

  it("일정을 추가하면 토스트가 노출된다.", () => {
    cy.get("label").contains("제목").type("테스트 일정");
    cy.get("label").contains("날짜").type("2024-08-05");

    cy.get("label").contains("시작 시간").type("00:00");
    cy.get("label").contains("종료 시간").type("00:10");

    cy.get("button").contains("일정 추가").click();
    cy.get('[role="status"]')
      .contains("일정이 추가되었습니다.")
      .should("be.visible");
  });

  it("일정을 수정하면 토스트가 노출된다.", () => {
    cy.get('[aria-label="Edit event"]').eq(0).click();
    cy.get("label").contains("제목").type("수정");
    cy.get("button").contains("일정 수정").click();
    cy.get('[role="status"]')
      .contains("일정이 수정되었습니다.")
      .should("be.visible");
  });

  it("일정을 삭제하면 토스트가 노출된다.", () => {
    cy.get('[aria-label="Delete event"]').eq(0).click();
    cy.get('[role="status"]')
      .contains("일정이 삭제되었습니다.")
      .should("be.visible");
  });
});

describe("일정 검색", () => {
  beforeEach(() => {
    cy.request("PUT", "http://localhost:5173/api/events/reset").then(
      (response) => {
        expect(response.status).to.eq(200);
      }
    );
  });

  it("검색 결과가 없으면 '검색 결과가 없습니다.' 메시지를 노출한다.", () => {
    cy.get("label").contains("일정 검색").type("테스트 일정");
    cy.get("p").contains("검색 결과가 없습니다.").should("be.visible");
  });
});

describe("알림 기능", () => {
  beforeEach(() => {
    cy.request("PUT", "http://localhost:5173/api/events/reset").then(
      (response) => {
        expect(response.status).to.eq(200);
      }
    );
  });

  it("알림 시간이 되면 알림이 노출된다.", () => {
    cy.get('[role="alert"]')
      .contains("10분 후 알림 테스트 일정이 시작됩니다.")
      .should("be.visible");
  });
});

describe("겹치는 일정 검사", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.request("PUT", "http://localhost:5173/api/events/reset").then(
      (response) => {
        expect(response.status).to.eq(200);
      }
    );

    cy.get("label").contains("제목").type("겹치는 일정");
    cy.get("label").contains("날짜").type("2024-08-05");

    cy.get("label").contains("시작 시간").type("00:00");
    cy.get("label").contains("종료 시간").type("00:10");

    cy.get("button").contains("일정 추가").click();

    cy.get("label").contains("제목").type("겹치는 일정");
    cy.get("label").contains("날짜").type("2024-08-05");

    cy.get("label").contains("시작 시간").type("00:05");
    cy.get("label").contains("종료 시간").type("00:15");

    cy.get("button").contains("일정 추가").click();
  });

  it("겹치는 일정이 있으면 일정 추가하기 전에 알럿을 노출한다.", () => {
    cy.get('[role="alertdialog"]')
      .contains("일정 겹침 경고")
      .should("be.visible");
  });

  it("계속 진행 버튼을 클릭하면 일정이 추가된다.", () => {
    cy.get("button").contains("계속 진행").click();
    cy.get('[role="status"]')
      .contains("일정이 추가되었습니다.")
      .should("be.visible");
  });
});

describe("반복 일정", () => {
  it("매일 반복 일정을 추가할 수 있다.", () => {
    const startDate = new Date("2024-08-05");
    const endDate = new Date("2024-08-31");

    cy.get("label").contains("제목").type("매일 반복 일정");
    cy.get("label")
      .contains("날짜")
      .type(startDate.toISOString().split("T")[0]);

    cy.get("label").contains("시작 시간").type("00:00");
    cy.get("label").contains("종료 시간").type("00:10");

    cy.get("label").contains("반복 설정").click();
    cy.get("select[name='repeatType']").select("매일");

    while (startDate <= endDate) {
      const expectedDate = startDate.toISOString().split("T")[0];
      cy.get(`[data-testid="${expectedDate}"]`)
        .contains("반복 일정")
        .should("be.visible");

      startDate.setDate(startDate.getDate() + 1);
    }
  });

  it("매주 반복 일정을 추가할 수 있다.", () => {
    cy.get("label").contains("제목").type("반복 일정");
    cy.get("label").contains("날짜").type("2024-08-05");

    cy.get("label").contains("시작 시간").type("00:00");
    cy.get("label").contains("종료 시간").type("00:10");

    cy.get("label").contains("반복 설정").click();
    cy.get("select[name='repeatType']").select("매주");
    cy.get("[data-testid='2024-08-12']")
      .contains("반복 일정")
      .should("be.visible");
    cy.get("[data-testid='2024-08-19']")
      .contains("반복 일정")
      .should("be.visible");
    cy.get("[data-testid='2024-08-26']")
      .contains("반복 일정")
      .should("be.visible");
  });

  it("매월 반복 일정을 추가할 수 있다.", () => {
    cy.get("label").contains("제목").type("반복 일정");
    cy.get("label").contains("날짜").type("2024-08-05");

    cy.get("label").contains("시작 시간").type("00:00");
    cy.get("label").contains("종료 시간").type("00:10");

    cy.get("label").contains("반복 설정").click();
    cy.get("select[name='repeatType']").select("매월");

    cy.get("button[aria-label='Next']").click();
    cy.get("[data-testid='2024-09-05']")
      .contains("반복 일정")
      .should("be.visible");

    cy.get("button[aria-label='Next']").click();
    cy.get("[data-testid='2024-10-05']")
      .contains("반복 일정")
      .should("be.visible");

    cy.get("button[aria-label='Next']").click();
    cy.get("[data-testid='2024-11-05']")
      .contains("반복 일정")
      .should("be.visible");
  });

  it("매년 반복 일정을 추가할 수 있다.", () => {
    cy.get("label").contains("제목").type("반복 일정");
    cy.get("label").contains("날짜").type("2024-08-05");

    cy.get("label").contains("시작 시간").type("00:00");
    cy.get("label").contains("종료 시간").type("00:10");

    cy.get("label").contains("반복 설정").click();
    cy.get("select[name='repeatType']").select("매년");

    for (let i = 0; i < 12; i++) {
      cy.get("button[aria-label='Next']").click();
    }
    cy.get("[data-testid='2025-08-05']")
      .contains("반복 일정")
      .should("be.visible");
  });

  it("반복 간격을 설정할 수 있다.", () => {
    const startDate = new Date("2024-08-05");

    cy.get("label").contains("제목").type("매주 반복 일정");
    cy.get("label")
      .contains("날짜")
      .type(startDate.toISOString().split("T")[0]);

    cy.get("label").contains("반복 설정").click();
    cy.get("select[name='repeatType']").select("매일");
    cy.get("input[name='repeatInterval']").type("{selectall}").type("2");

    cy.get(`[data-testid="2024-08-06"]`)
      .contains("반복 일정")
      .should("not.exist");
    cy.get(`[data-testid="2024-08-07"]`)
      .contains("반복 일정")
      .should("be.visible");
  });

  it("반복 종료일을 지정하면 종료일까지 반복 일정을 표시한다.", () => {
    const startDate = new Date("2024-08-05");
    const endDate = new Date("2024-08-16");

    cy.get("label").contains("제목").type("매일 반복 일정");
    cy.get("label")
      .contains("날짜")
      .type(startDate.toISOString().split("T")[0]);

    cy.get("label").contains("시작 시간").type("00:00");
    cy.get("label").contains("종료 시간").type("00:10");

    cy.get("label").contains("반복 설정").click();
    cy.get("select[name='repeatType']").select("매일");
    cy.get("label")
      .contains("반복 종료일")
      .type(endDate.toISOString().split("T")[0]);

    cy.get(`[data-testid="2024-08-17"]`)
      .contains("반복 일정")
      .should("not.exist");
  });
});
