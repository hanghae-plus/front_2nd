import { useMemo } from "react";

export function useMyRef<T>(initValue: T | null) {
  const ref = useMemo(
    () => ({
      current: initValue,
    }),
    [initValue]
  );
  return ref;
}
