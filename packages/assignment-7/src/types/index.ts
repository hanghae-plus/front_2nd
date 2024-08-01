import { EVENT_CATEGORIES, REPEAT_TYPES, CALENDAR_VIEWS } from '../constants';

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type RepeatType = (typeof REPEAT_TYPES)[number];

export type CalendarView = (typeof CALENDAR_VIEWS)[number];

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // 'YYYY-MM-DD' 형식
  startTime: string; // 'HH:mm' 형식
  endTime: string; // 'HH:mm' 형식
  category: EventCategory;
  location?: string;
  repeat: RepeatInfo;
  notificationTime: number; // 분 단위
}

export interface User {
  id: number;
  username: string;
  email: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultView: CalendarView;
  defaultNotificationTime: number;
  theme: 'light' | 'dark';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  pageSize: number;
}

export interface EventFormData extends Omit<Event, 'id' | 'repeat'> {
  id?: number;
  repeat?: RepeatInfo;
  isRepeating: boolean;
  repeatType?: RepeatType;
  repeatInterval?: number;
  repeatEndDate?: string;
}

export interface CalendarState {
  view: CalendarView;
  currentDate: Date;
  selectedDate: Date;
}

export interface NotificationItem {
  id: number;
  eventId: number;
  message: string;
  time: Date;
  isRead: boolean;
}

export type EventAction =
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: number }
  | { type: 'SET_EVENTS'; payload: Event[] };

export type CalendarAction =
  | { type: 'SET_VIEW'; payload: CalendarView }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_SELECTED_DATE'; payload: Date };
