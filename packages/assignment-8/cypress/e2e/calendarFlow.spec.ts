describe('캘린더 테스트', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.clock(new Date('2024-07-01').getTime());
  });

  it('캘린더 뷰 변경', () => {
    // 1. 2024년 7월 month-view가 보이는지 확인한다.
    cy.get('[data-testid="month-view"]').should('be.visible');
    cy.contains('2024년 7월').should('be.visible');

    // 2. prev 버튼을 누른다.
    cy.get('[data-cy="calendar-prev-button"]').click();

    // 3. 2024년 6월 month-view가 보이는지 확인한다.
    cy.get('[data-testid="month-view"]').should('be.visible');
    cy.contains('2024년 6월').should('be.visible');

    // 4. next 버튼을 2번 누른다.
    cy.get('[data-cy="calendar-next-button"]').click().click();

    // 5. 2024년 8월 month-view가 보이는지 확인한다.
    cy.get('[data-testid="month-view"]').should('be.visible');
    cy.contains('2024년 8월').should('be.visible');

    // 6. view를 week-view로 변경한다.
    cy.get('[data-cy="calendar-view-select"]').select('week');

    // 7. week-view가 보이는지 확인한다.
    cy.get('[data-testid="week-view"]').should('be.visible');
  });
});
