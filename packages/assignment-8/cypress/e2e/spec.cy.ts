describe('일정 관리 앱', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.clock(new Date('2024-07-01T10:00:00').getTime());
  });

  it('새로운 일정 등록', () => {
    // 1. EventForm의 항목을 채워 넣는다.
    cy.get('[data-cy="input-title"]').type('새로운 테스트 일정');
    cy.get('[data-cy="input-date"]').type('2024-07-15');
    cy.get('[data-cy="input-startTime"]').type('14:00');
    cy.get('[data-cy="input-endTime"]').type('15:00');
    cy.get('[data-cy="input-description"]').type('이것은 테스트 일정입니다.');
    cy.get('[data-cy="input-location"]').type('테스트 장소');
    cy.get('[data-cy="input-category"]').select('개인');

    // 2. data-testid=event-submit-button을 찾아 누른다.
    cy.get('[data-testid="event-submit-button"]').click();

    // 3. CalendarView에 잘 보이는지 확인한다.
    cy.get('[data-testid="month-view"]').should('be.visible');
    cy.get('[data-testid="month-cell-7-15"]').should(
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

  it('일정 수정', () => {
    // 1. EventList에서 id가 1인 event를 찾는다.
    cy.get('[data-testid="event-1"]').should('be.visible');

    // 2. 수정 버튼을 누른다.
    cy.get('[data-testid="event-1"]')
      .find('[data-cy="event-edit-button"]')
      .click();

    // 3. EventForm에서 날짜를 24년 7월 21일 11시 ~ 12시로 수정한다.
    cy.get('[data-cy="input-date"]').clear().type('2024-07-21');
    cy.get('[data-cy="input-startTime"]').clear().type('12:00');
    cy.get('[data-cy="input-endTime"]').clear().type('13:00');

    // 4. 일정 수정 버튼을 누른다.
    cy.get('[data-testid="event-submit-button"]').click();

    // 5. 일정 겹침 얼럿 확인
    cy.get('[data-cy="alert"]')
      .should('be.visible')
      .and('contain', '일정 겹침')
      .and('contain', '점심 약속 (2024-07-21 12:30-13:30)');

    // 6. 취소 버튼을 누르면 얼럿이 사라진다.
    cy.get('[data-cy="alert-cancel-button"]').click();
    // cy.wait(500);
    // cy.get('[data-cy="alert"]').should('not.exist');

    cy.get('[data-cy="alert"]').should('not.be.visible');

    // 7. 날짜를 24년 7월 22일 오전 10시 ~ 11시로 수정하고, 일정 수정 버튼을 누른다.
    // TODO: "force: true" 옵션 사용하지 않고도 해결할 수 있는지 찾아보기 (chakra modal이 닫히지 않음 ......)
    cy.get('[data-cy="input-date"]')
      .clear({ force: true })
      .type('2024-07-22', { force: true });
    cy.get('[data-cy="input-startTime"]')
      .clear({ force: true })
      .type('10:00', { force: true });
    cy.get('[data-cy="input-endTime"]')
      .clear({ force: true })
      .type('11:00', { force: true });
    cy.get('[data-testid="event-submit-button"]').click({ force: true });

    // 8. CalendarView와 EventList에 id가 1인 event의 정보가 수정되어 있는 것을 확인한다.
    cy.get('[data-testid="month-view"]').should('contain', '팀 회의');
    cy.get('[data-testid="month-cell-7-22"]').should('contain', '팀 회의');

    cy.get('[data-testid="event-1"]')
      .should('contain', '팀 회의')
      .and('contain', '2024-07-22')
      .and('contain', '10:00 - 11:00');
  });

  it('일정 삭제', () => {
    // 1. event-1인 일정을 EventList에서 찾는다.
    cy.get('[data-testid="event-1"]').should('exist');

    // 2. 삭제 버튼을 찾고 누른다.
    cy.get('[data-testid="event-1"]')
      .find('[data-cy="event-delete-button"]')
      .click();

    // 3. EventList에 event-1이 없는지 확인한다.
    cy.get('[data-testid="event-1"]').should('not.exist');

    // 4. CalendarView에서도 해당 이벤트가 사라졌는지 확인
    cy.get('[data-testid="month-view"]').should('not.contain', '팀 회의');
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
