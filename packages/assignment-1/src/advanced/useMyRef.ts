import { useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [ref, setRef] = useState({ current: initValue });

  return ref;
}
