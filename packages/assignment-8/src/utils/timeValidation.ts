export interface TimeValidationResult {
  startTimeError: string | null;
  endTimeError: string | null;
}

export function getTimeErrorMessage(start: string, end: string): TimeValidationResult {
  if (!start || !end) {
    return { startTimeError: null, endTimeError: null };
  }

  const startDate = new Date(`2000-01-01T${start}`);
  const endDate = new Date(`2000-01-01T${end}`);

  if (startDate >= endDate) {
    return {
      startTimeError: "시작 시간은 종료 시간보다 빨라야 합니다.",
      endTimeError: "종료 시간은 시작 시간보다 늦어야 합니다."
    };
  }

  return { startTimeError: null, endTimeError: null };
}
