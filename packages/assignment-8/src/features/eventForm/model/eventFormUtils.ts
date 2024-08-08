export interface ValidationResult {
  isValid: boolean;
  startTimeError: string | null;
  endTimeError: string | null;
}

export interface ValidateTimeProps {
  start: string;
  end: string;
}

export const validateTime = ({
  start,
  end,
}: ValidateTimeProps): ValidationResult => {
  // 시작 시간과 종료 시간이 모두 있는지 확인
  if (!start || !end) {
    return {
      isValid: false,
      startTimeError: '시작 시간과 종료 시간을 모두 입력해야 합니다.',
      endTimeError: '시작 시간과 종료 시간을 모두 입력해야 합니다.',
    };
  }

  const startTime = `2000-01-01T${start}`;
  const endTime = `2000-01-01T${end}`;

  // 시간이 올바른 형식인지 확인
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return {
      isValid: false,
      startTimeError: '유효하지 않은 시간 형식입니다.',
      endTimeError: '유효하지 않은 시간 형식입니다.',
    };
  }

  // 시작 시간이 종료 시간보다 빠른지 확인
  if (startDate >= endDate) {
    return {
      isValid: false,
      startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
    };
  }

  // 모든 검사를 통과하면 유효성 검사를 통과한 것으로 간주
  return {
    isValid: true,
    startTimeError: null,
    endTimeError: null,
  };
};
