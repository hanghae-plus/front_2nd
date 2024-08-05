export const EVENT_CATEGORIES = ['업무', '개인', '가족', '기타'] as const;

export const REPEAT_TYPES = [
  'none',
  'daily',
  'weekly',
  'monthly',
  'yearly',
] as const;

export const NOTIFICATION_OPTIONS = [
  { value: 0, label: '알림 없음' },
  { value: 5, label: '5분 전' },
  { value: 10, label: '10분 전' },
  { value: 15, label: '15분 전' },
  { value: 30, label: '30분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
] as const;

export const DEFAULT_EVENT_DURATION = 60; // 분 단위

export const MAX_TITLE_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 500;
