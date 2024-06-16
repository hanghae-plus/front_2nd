export function useMyRef<T>(initValue: T | null) {
  /**고유 값이 있어야 하며 리렌더링 하더라도 기존 값을 유지해야함*/

  return { current: initValue };
}
