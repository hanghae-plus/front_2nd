export const REPEAT_TYPE = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export const REPEAT_TYPE_SELECTS = [
  { value: REPEAT_TYPE.DAILY, label: "매일" },
  { value: REPEAT_TYPE.WEEKLY, label: "매주" },
  { value: REPEAT_TYPE.MONTHLY, label: "매월" },
  { value: REPEAT_TYPE.YEARLY, label: "매년" },
] as const;

export type RepeatType = (typeof REPEAT_TYPE)[keyof typeof REPEAT_TYPE];
