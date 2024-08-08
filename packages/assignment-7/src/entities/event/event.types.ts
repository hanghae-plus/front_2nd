export interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo | null;
  notificationTime: number; // 분 단위로 저장
}

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
