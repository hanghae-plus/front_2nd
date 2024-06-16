import { useCallback, useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [refState] = useState<{ current: T | null }>(() => ({
    current: initValue,
  }));
  const getRef = useCallback(() => refState, [refState]);
  return getRef;
}
