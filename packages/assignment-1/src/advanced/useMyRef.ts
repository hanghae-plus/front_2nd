import { useRef } from "react";

export function useMyRef<T>(initValue: T | null) {
  const myRef = useRef(initValue);

  return myRef;
}
