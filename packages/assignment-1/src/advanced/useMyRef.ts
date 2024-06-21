import { useState } from 'react';

export function useMyRef<T>(initValue: T | null) {
  const [value] = useState({ current: initValue });

  return value;
}
