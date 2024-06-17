import { useMemo } from "react";

export function useMyRef<T>(initValue: T | null) {
  /**고유 값이 있어야 하며 리렌더링 하더라도 기존 값을 유지해야함*/

  /**의존성 배열을 비워, 초기 렌더링 이후 재렌더링이 되더라도 참조되지 않게 함.
   * 의존성이 없어야함.
   */
  const memoValue = useMemo(() => {
    return { current: initValue };
  }, []);

  return memoValue;
  // return { current: initValue };
}
