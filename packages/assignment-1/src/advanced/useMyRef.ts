import { useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [ref] = useState<{ current: T | null }>({ current: initValue });
  return ref;
}
