import { useMemo } from "react";

export function useMyRef<T>(initValue: T | null) {
  return useMemo(() => ({ current: initValue }), []);
}

//useMemo는 이전값이랑 비교를 해서 이전값이랑 같으면 렌더링을 안해
// 이전값이랑 다르면 렌더링을 해
