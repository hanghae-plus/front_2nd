import { Dispatch, SetStateAction } from "react";

export type ViewType = "week" | "month";

export type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type Notification = { id: number; message: string };

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number; // 분 단위로 저장
}

export type SetState<T> = Dispatch<SetStateAction<T>>;
