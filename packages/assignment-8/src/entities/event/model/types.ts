export interface IRepeat {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
}
export interface EventItem {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: IRepeat;
  notificationTime: number;
}
