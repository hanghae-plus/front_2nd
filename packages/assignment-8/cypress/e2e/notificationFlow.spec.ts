describe('일정 관리 앱', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.clock(new Date('2024-07-01T10:00:00').getTime());
  });

  it('알림 테스트', () => {
    // 알림이 표시되기 전 상태 확인
    cy.get('[data-testid="notification-alert"]').should('not.exist');

    // 5분 경과 (이벤트 시작 시간)
    // cy.tick(5 * 60 * 1000);

    // notification-alert이 나타나는지 확인
    cy.get('[data-testid="notification-alert"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', '알림 테스트')
      .and('contain', '10분 후 알림 테스트 일정이 시작됩니다.');

    // 알림 닫기 버튼 클릭
    cy.get('[data-testid="notification-alert"]').find('button').click();

    // 알림이 사라졌는지 확인
    cy.get('[data-testid="notification-alert"]').should('not.exist');
  });
});
