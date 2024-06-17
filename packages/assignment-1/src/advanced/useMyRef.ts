import { useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [refObj] = useState<{ current: T | null }>(() => ({
    current: initValue,
  }));
  return refObj;
}
