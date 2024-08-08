export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export type EventFormState = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  isRecurring: boolean;
  notificationTime: number;
  recurringType: string;
  recurringInterval: number;
  recurringEndDate: string;
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
};

export interface EventFormContextType {
  state: EventFormState;
  updateField: <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K]
  ) => void;
  startTime: string;
  endTime: string;
  startTimeError: string | null;
  endTimeError: string | null;
  handleStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRepeating: boolean;
  setIsRepeating: (status: boolean) => void;
}
