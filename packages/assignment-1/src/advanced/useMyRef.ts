import { useRef } from "react";

export function useMyRef<T>(initValue: T | null) {
  const ref = useRef<T | null>(initValue);
  return ref;
}
