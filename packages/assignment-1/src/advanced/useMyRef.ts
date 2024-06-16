import { useState } from 'react'

interface RefObject<T> {
  current : T | null
}

export function useMyRef<T>(initValue: T | null):RefObject<T> {
  const [ref] = useState<RefObject<T>>({ current: initValue });
  return ref;
}
