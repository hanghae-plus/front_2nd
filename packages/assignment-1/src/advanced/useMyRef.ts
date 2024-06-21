import { useMemo } from "react";

export function useMyRef<T>(initValue: T | null) {
  const ref = useMemo(() => {
    return { current: initValue };
  }, []);
  return ref;
}
