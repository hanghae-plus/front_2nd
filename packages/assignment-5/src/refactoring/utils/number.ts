/**
 * 주어진 값을 지정된 범위 내로 제한합니다.
 *
 * @param {number} value - 제한하려는 값
 * @param {number} min - 허용되는 최소값
 * @param {number} max - 허용되는 최대값
 * @returns {number} 주어진 범위 내로 제한된 값
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
