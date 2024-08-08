export type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface RepeatChild {
  id: string;
  date: string;
}

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  children: RepeatChild[];
}

export type ViewType = "week" | "month";

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
