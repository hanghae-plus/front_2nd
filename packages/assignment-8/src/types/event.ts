export type RepeatType = "daily" | "weekly" | "monthly" | "yearly";

interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

export interface RepeatEvent {
  date: string;
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
}

export interface EventType {
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
