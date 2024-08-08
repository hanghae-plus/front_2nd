import { test, expect } from '@playwright/test';

const testData = {
    title: "테스트 일정",
    description: "일정추가",
    location: "테스트 지역",
    category: "개인",
    "repeat": {
        "type": "none",
        "interval": 1
    },
    notificationTime: '10분 전',
    date: "2024-08-26",
    startTime: "20:40",
    endTime: "21:40"
}

const repeatData = {
    title: 'Repeat Event',
    date: '2024-08-15',
    startTime: '09:00',
    endTime: '10:00',
    description: 'This is a test event',
    location: 'Test Location',
    category: '업무',
    notificationTime: '10분 전',
    repeat: {
        type: '매일',
        interval: 1,
        endDate: '2024-08-20'
    }
};

let repeatEventsExpectedCnt = 2 + 1

// [ FORM type 함수 ]
const typeForm = async (page, data) => {
    await page.fill('label:has-text("제목")', data.title);
    if (data.date) await page.fill('label:has-text("날짜")', data.date);
    if (data.startTime) await page.fill('label:has-text("시작 시간")', data.startTime);
    if (data.endTime) await page.fill('label:has-text("종료 시간")', data.endTime);
    if (data.description) await page.fill('label:has-text("설명")', data.description);
    if (data.location) await page.fill('label:has-text("위치")', data.location);
    if (data.category) await page.locator('[data-testid="form_category"]').selectOption({ label: data.category });
    if (data.notificationTime) await  page.locator('[data-testid="form_notification"]').selectOption({ label: data.notificationTime.toString() });

    if(data.repeat?.type !== "none"){
        if (data.repeat.type) await page.locator('[data-testid="form_repeat_type"]').selectOption({ label: data.repeat.type });
        if (data.repeat.interval) await page.fill('label:has-text("반복 간격")', data.repeat.interval.toString());
        if (data.repeat.endDate) await page.fill('label:has-text("반복 종료일")', data.repeat.endDate);
    }
}

// [ FORM type check 함수 ]
const checkForm = async (page, data) => {
    const eventList = await page.locator('[data-testid="event-list"]');
    await expect(eventList).toContainText(data.title);
    if (data.date) await expect(eventList).toContainText(data.date);
    if (data.startTime) await expect(eventList).toContainText(data.startTime);
    if (data.endTime) await expect(eventList).toContainText(data.endTime);
    if (data.description) await expect(eventList).toContainText(data.description);
    if (data.location) await expect(eventList).toContainText(data.location);
    if (data.category) await expect(eventList).toContainText(data.category);
    if (data.notificationTime) await expect(eventList).toContainText(data.notificationTime);

    if(data.repeat?.type !== "none"){
        const childCount = await eventList.locator('> *').count();
        expect(childCount).toBe(repeatEventsExpectedCnt);
    }
}


test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
});


test('새로운 일정을 생성하고 모든 필드가 정확히 저장되는지 확인한다', async ({ page }) => {
    await typeForm(page, testData);
    await page.click('[data-testid="event-submit-button"]');
    await checkForm(page, testData);
});

test('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영되는지 확인한다', async ({ page }) => {
    // Given
    // Find the event list and the first event
    const eventList = page.locator('[data-testid="event-list"]');
    const firstEvent = eventList.locator('> *').nth(1);
    const editButton = firstEvent.locator('button').first();

    // When
    await editButton.click();
    await typeForm(page, testData);
    await page.click('[data-testid="event-submit-button"]');

    // Then
    await checkForm(page, testData);
});

test('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async ({ page }) => {
    // Given
    const eventList = page.locator('[data-testid="event-list"]');
    const firstEvent = eventList.locator('> *').nth(1); // 두 번째 자식 요소 선택 (0 기반 인덱스)
    const deleteButton = firstEvent.locator('button').nth(1); // 두 번째 버튼 선택 (0 기반 인덱스)

    // When
    await deleteButton.click(); // 삭제 버튼 클릭

    // Then
    await expect(firstEvent.locator(`text=FIRST TEST`)).toHaveCount(0); // 제목이 없는지 확인
});

test('반복 유형과 간격 선택후 반복 일정 표시', async ({ page }) => {
    const checkbox = page.locator('[data-testid="repeact-check-box"]');
    await expect(checkbox).toBeVisible();
    await checkbox.click({ force: true }); // 체크박스를 강제로 클릭
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBe(true);

    await typeForm(page, repeatData);
    await page.click('[data-testid="event-submit-button"]');
    repeatEventsExpectedCnt += 5

    await checkForm(page, repeatData);
});