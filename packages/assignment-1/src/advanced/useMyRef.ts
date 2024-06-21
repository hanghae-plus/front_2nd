import { useMemo } from "react";

interface RefObject<T> {
  current: T | null;
}

export function useMyRef<T>(initValue: T | null): RefObject<T> {
  const item = { current: initValue };
  const ref = useMemo(() => item, []);
  return ref;
}
