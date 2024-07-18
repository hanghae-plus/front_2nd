export function clamp(value: number, max: number): number;
export function clamp(value: number, min: number, max: number): number;
export function clamp(value: number, bound1: number, bound2?: number): number {
  if (bound2 == null) {
    return Math.min(value, bound1);
  }

  return Math.min(bound2, Math.max(bound1, value));
}
