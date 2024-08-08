import { Dispatch, SetStateAction } from "react";

export type ViewType = "week" | "month";

export type RepeatType =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "children";

export type Notification = { id: number; message: string };

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  weekdays?: Array<number>; // 매주 같은 요일 반복 설정, 요일 index 저장
  monthdays?: Array<number>; // 매월 같은 일자 반복 설정
  weekdayRepeatByMonth?: Array<[number, number]>; // (주차, 요일) 형태로 저장
}

export interface Event {
  id: number;
  parentId?: number; // 반복 일정 생성한 부모 일정의 아이디값
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number; // 분 단위로 저장
  children?: Array<Event>;
}

export type SetState<T> = Dispatch<SetStateAction<T>>;
