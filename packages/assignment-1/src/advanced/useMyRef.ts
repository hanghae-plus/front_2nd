import { useMemo } from "react";

export function useMyRef<T>(initValue: T | null) {
  return useMemo(
    () => ({
      current: initValue,
    }),
    []
  );
}
