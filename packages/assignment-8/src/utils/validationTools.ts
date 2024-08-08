export interface TimeValidation {
  startTimeError: string | null;
  endTimeError: string | null;
}

export const validateTime = (start: string, end: string): TimeValidation => {
  let startTimeError = null;
  let endTimeError = null;

  if (!start || !end) {
    return { startTimeError, endTimeError };
  }

  const startDate = new Date(`2000-01-01T${start}`);
  const endDate = new Date(`2000-01-01T${end}`);

  if (startDate >= endDate) {
    startTimeError = "시작 시간은 종료 시간보다 빨라야 합니다.";
    endTimeError = "종료 시간은 시작 시간보다 늦어야 합니다.";
  }

  return { startTimeError, endTimeError };
};
