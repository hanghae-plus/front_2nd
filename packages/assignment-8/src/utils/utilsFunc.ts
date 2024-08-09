import {Event} from "../types/types.ts";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(monday);
        nextDate.setDate(monday.getDate() + i);
        weekDates.push(nextDate);
    }
    return weekDates;
};

export const formatWeek = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const weekNumber = Math.ceil(date.getDate() / 7);
    return `${year}년 ${month}월 ${weekNumber}주`;
};

export const formatMonth = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
};

// 날짜 문자열을 Date 객체로 변환하는 함수
export const parseDateTime = (date: string, time: string): Date => {
    return new Date(`${date}T${time}`);
};

// 두 일정이 겹치는지 확인하는 함수
export const isOverlapping = (event1: Event, event2: Event): boolean => {
    const start1 = parseDateTime(event1.date, event1.startTime);
    const end1 = parseDateTime(event1.date, event1.endTime);
    const start2 = parseDateTime(event2.date, event2.startTime);
    const end2 = parseDateTime(event2.date, event2.endTime);

    return start1 < end2 && start2 < end1;
};

// 최소 endDate를 계산하는 함수
export const calculateEndDate = (currentDate, type, adjustedInterval) => {
    if(type === 'daily') return currentDate.add(adjustedInterval, 'day');
    if(type === 'weekly') return currentDate.add(adjustedInterval * 7, 'day');
    if(type === 'monthly') return currentDate.add(adjustedInterval * 30, 'day');
    if(type === 'yearly') return currentDate.add(adjustedInterval * 365, 'day');

    return currentDate;
}


// 반복일정 생성 함수
export const addRepeatedEvent = (mockData) => {
    const { title, date, repeat, startTime, endTime, notificationTime, description, location, category } = mockData;
    const { type, interval, endDate } = repeat;

    let currentDate = dayjs(date); // 반복 시작 날짜
    const endRepeatDate = endDate ? dayjs(endDate) : calculateEndDate(currentDate, type, interval); // 반복 종료 날짜

    const totalDays = endRepeatDate.diff(currentDate, 'day'); // 반복이 끝나는 날짜와 시작날짜 사이의 전체 날짜수 계산
    const adjustedInterval = Math.min(interval, totalDays); // interval , totalDays 둘중 작은수 선택

    const events = [];
    let index = 1;

    // currentDate 가 endRepeatDate보다 이전날짜 인 동안 반복
    while (currentDate.isBefore(endRepeatDate)) {
        const event = {
            id: Date.now() + index,
            title: `${title}${index++}`,
            date: currentDate.format('YYYY-MM-DD'),
            startTime,
            endTime,
            description,
            location,
            category,
            repeat,
            notificationTime,
        };

        events.push(event);

        currentDate = calculateEndDate(currentDate, type, adjustedInterval);
    }

    return events;
};

// 타입체크 함수
export const checkType = (element) => {
    if (Array.isArray(element)) {
        return "Array";
    } else if (typeof element === "object") {
        if (element === null) return "Null";
        else return "Object";
    } else {
        return typeof element;
    }
}