describe('일정 관리 앱', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.clock(new Date('2024-07-01').getTime());
  });

  it('새로운 일정 등록', () => {
    // 1. EventForm의 항목을 채워 넣는다.
    cy.get('[data-cy="input-title"]').type('새로운 테스트 일정');
    cy.get('[data-cy="input-date"]').type('2024-07-15');
    cy.get('[data-cy="input-start-time"]').type('14:00');
    cy.get('[data-cy="input-end-time"]').type('15:00');
    cy.get('[data-cy="input-description"]').type('이것은 테스트 일정입니다.');
    cy.get('[data-cy="input-location"]').type('테스트 장소');
    cy.get('[data-cy="input-category"]').select('개인');

    // 2. data-testid=event-submit-button을 찾아 누른다.
    cy.get('[data-testid="event-submit-button"]').click();

    // 3. CalendarView에 잘 보이는지 확인한다.
    cy.get('[data-testid="month-view"]').should('be.visible');
    cy.get('[data-cy="month-view-cell-7-15"]').should(
      'contain',
      '새로운 테스트 일정'
    );

    // 4. EventList에 잘 보이는지 확인한다.
    cy.get('[data-testid="event-list"]').should(
      'contain',
      '새로운 테스트 일정'
    );
    cy.get('[data-testid="event-list"]').should('contain', '2024-07-15');
    cy.get('[data-testid="event-list"]').should('contain', '14:00 - 15:00');
  });

  it('일정 수정', () => {
    // 1. EventList에서 id가 1인 event를 찾는다.
    cy.get('[data-testid="event-item-1-0"]').should('be.visible');

    // 2. 수정 버튼을 누른다.
    cy.get('[data-testid="event-item-1-0"]')
      .find('[data-cy="event-edit-button"]')
      .click();

    // 3. EventForm에서 날짜를 24년 7월 21일 11시 ~ 12시로 수정한다.
    cy.get('[data-cy="input-date"]').clear().type('2024-07-21');
    cy.get('[data-cy="input-start-time"]').clear().type('12:00');
    cy.get('[data-cy="input-end-time"]').clear().type('13:00');

    // 4. 일정 수정 버튼을 누른다.
    cy.get('[data-testid="event-submit-button"]').click();

    // 5. 일정 겹침 얼럿 확인
    cy.get('[data-cy="alert"]')
      .should('be.visible')
      .and('contain', '일정 겹침')
      .and('contain', '점심 약속 (2024-07-21 12:30-13:30)');

    // 6. 취소 버튼을 누르면 얼럿이 사라진다.
    cy.get('[data-cy="alert-cancel-button"]').click();
    cy.get('[data-cy="alert"]').should('not.be.visible');

    // 7. 날짜를 24년 7월 23일 오전 10시 ~ 11시로 수정하고, 일정 수정 버튼을 누른다.
    cy.get('[data-cy="input-date"]')
      .clear({ force: true })
      .type('2024-07-23', { force: true });
    cy.get('[data-cy="input-start-time"]')
      .clear({ force: true })
      .type('10:00', { force: true });
    cy.get('[data-cy="input-end-time"]')
      .clear({ force: true })
      .type('11:00', { force: true });
    cy.get('[data-testid="event-submit-button"]').click({ force: true });

    // 8. CalendarView와 EventList에 id가 1인 event의 정보가 수정되어 있는 것을 확인한다.
    cy.get('[data-testid="month-view"]').should('contain', '팀 회의');
  });

  it('일정 삭제', () => {
    // 1. event-item-1-0인 일정을 EventList에서 찾는다.
    cy.get('[data-testid="event-item-1-0"]').should('exist');

    // 2. 삭제 버튼을 찾고 누른다.
    cy.get('[data-testid="event-item-1-0"]')
      .find('[data-cy="event-delete-button"]')
      .click();

    // 3. EventList에 event-item-1-0이 없는지 확인한다.
    cy.get('[data-testid="event-item-1-0"]').should('not.exist');

    // 4. CalendarView에서도 해당 이벤트가 사라졌는지 확인
    cy.get('[data-testid="month-view"]').should('not.contain', '팀 회의');
  });
});