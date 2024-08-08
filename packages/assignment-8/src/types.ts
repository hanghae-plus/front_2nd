export type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type RepeatEndType = "endDate" | "endCount" | "endless";

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endType?: RepeatEndType;
  endCount?: number;
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
  notificationTime: number;
  exceptions?: Map<string, Partial<Event> | null>;
}

export type Category = "업무" | "개인" | "가족" | "기타";
