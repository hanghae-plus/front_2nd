<<<<<<< HEAD
import { useRef } from 'react';

export function useMyRef<T>(initialValue: T | null) {
  const ref = useRef(initialValue);
  return ref;
}
=======
export function useMyRef<T>(initValue: T | null) {
  return { current: initValue }
}
>>>>>>> 8d60bb2a28c4c53eb92efd0ae9e77e45d6912d83
