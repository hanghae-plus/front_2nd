import { test, expect } from '@playwright/test';


const testData = {
    title: 'Test Event',
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

let repeatEventsExpectedCnt = 0

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

    if (data.repeat) {
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

    if (data.repeat) {
        const childCount = await eventList.locator('> *').count();
        expect(childCount).toBe(repeatEventsExpectedCnt);
    }
}


test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
});

test.afterEach(async ({ page }) => {
    await checkForm(page, testData);
});

test('반복일정을 생성', async ({ page }) => {
    const checkbox = page.locator('[data-testid="repeact-check-box"]');
    await expect(checkbox).toBeVisible();
    await checkbox.click({ force: true }); // 체크박스를 강제로 클릭
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBe(true);

    await typeForm(page, testData);
    await page.click('[data-testid="event-submit-button"]');
    repeatEventsExpectedCnt = 8
});