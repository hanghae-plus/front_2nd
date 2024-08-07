export type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type ViewType = "week" | "month";

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  repeatNumber?: string;
  repeatDay?: string[];
}

export interface Event {
  id: number;
  repeatId?: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  repeatNumber?: string;
  repeatDay?: string[];
  notificationTime: number;
}

export interface Notification {
  id: number;
  message: string;
}
