import { describe, test, expect } from 'vitest';
import { validateTime, type ValidationResult } from './eventFormUtils';

describe('validateTime', () => {
  test('시작 시간과 종료 시간이 모두 비어있을 때', () => {
    const result = validateTime({ start: '', end: '' });
    const expected: ValidationResult = {
      isValid: false,
      startTimeError: '시작 시간과 종료 시간을 모두 입력해야 합니다.',
      endTimeError: '시작 시간과 종료 시간을 모두 입력해야 합니다.',
    };
    expect(result).toEqual(expected);
  });

  test('시작 시간만 비어있을 때', () => {
    const result = validateTime({ start: '', end: '14:00' });
    const expected: ValidationResult = {
      isValid: false,
      startTimeError: '시작 시간과 종료 시간을 모두 입력해야 합니다.',
      endTimeError: '시작 시간과 종료 시간을 모두 입력해야 합니다.',
    };
    expect(result).toEqual(expected);
  });

  test('종료 시간만 비어있을 때', () => {
    const result = validateTime({ start: '13:00', end: '' });
    const expected: ValidationResult = {
      isValid: false,
      startTimeError: '시작 시간과 종료 시간을 모두 입력해야 합니다.',
      endTimeError: '시작 시간과 종료 시간을 모두 입력해야 합니다.',
    };
    expect(result).toEqual(expected);
  });

  test('유효하지 않은 시간 형식일 때', () => {
    const result = validateTime({ start: '25:00', end: '14:00' });
    const expected: ValidationResult = {
      isValid: false,
      startTimeError: '유효하지 않은 시간 형식입니다.',
      endTimeError: '유효하지 않은 시간 형식입니다.',
    };
    expect(result).toEqual(expected);
  });

  test('시작 시간이 종료 시간보다 늦을 때', () => {
    const result = validateTime({ start: '15:00', end: '14:00' });
    const expected: ValidationResult = {
      isValid: false,
      startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
    };
    expect(result).toEqual(expected);
  });

  test('시작 시간과 종료 시간이 같을 때', () => {
    const result = validateTime({ start: '14:00', end: '14:00' });
    const expected: ValidationResult = {
      isValid: false,
      startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
    };
    expect(result).toEqual(expected);
  });

  test('유효한 시간 범위일 때', () => {
    const result = validateTime({ start: '13:00', end: '14:00' });
    const expected: ValidationResult = {
      isValid: true,
      startTimeError: null,
      endTimeError: null,
    };
    expect(result).toEqual(expected);
  });
});
