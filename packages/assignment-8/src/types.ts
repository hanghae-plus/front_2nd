export type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  excludeDates?: Date[]; // 반복 일정 중 삭제한 일정의 날짜값
  // endCondition?: 'date' | 'count';
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
  isRepeat?: boolean; // 반복 일정인지 판별
}

export interface EventFormLabel {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  isRepeating: boolean;
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
  notificationTime: number;
}
