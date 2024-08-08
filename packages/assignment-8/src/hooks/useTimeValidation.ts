import { useState, useCallback } from 'react';

interface TimeValidationResult {
  startTimeError: string | null;
  endTimeError: string | null;
  validateTime: (start: string, end: string) => void;
  isTimeValid: boolean;
}

export default function useTimeValidation(): TimeValidationResult {
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  const validateTime = useCallback((start: string, end: string) => {
    if (!start || !end) {
      setStartTimeError(null);
      setEndTimeError(null);
      return;
    }

    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);

    if (startDate >= endDate) {
      setStartTimeError('시작 시간은 종료 시간보다 빨라야 합니다.');
      setEndTimeError('종료 시간은 시작 시간보다 늦어야 합니다.');
    } else {
      setStartTimeError(null);
      setEndTimeError(null);
    }
  }, []);

  const isTimeValid = !startTimeError && !endTimeError;

  return {
    startTimeError,
    endTimeError,
    validateTime,
    isTimeValid,
  };
}
