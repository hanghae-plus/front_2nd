export const CALENDAR_VIEWS = ['day', 'week', 'month'] as const;

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const MONTHS = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
] as const;

export const COLOR_SCHEME = {
  primary: '#3182CE',
  secondary: '#ED8936',
  success: '#38A169',
  danger: '#E53E3E',
  warning: '#D69E2E',
  info: '#3182CE',
};

export const FORM_VALIDATION_MESSAGES = {
  required: '이 필드는 필수입니다.',
  invalidDate: '올바른 날짜를 입력해주세요.',
  invalidTime: '올바른 시간을 입력해주세요.',
  endTimeBeforeStart: '종료 시간은 시작 시간 이후여야 합니다.',
  maxLengthExceeded: (max: number) => `최대 ${max}자까지 입력 가능합니다.`,
};
