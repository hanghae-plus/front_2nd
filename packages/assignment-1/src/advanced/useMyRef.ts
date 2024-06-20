import { useRef } from 'react';

export function useMyRef<T>(initialValue: T | null) {
  const ref = useRef(initialValue);
  return ref;
}