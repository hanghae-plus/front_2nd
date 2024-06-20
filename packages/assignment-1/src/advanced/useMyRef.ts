import { useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [ref, _setRef] = useState(() => ({ current: initValue }));

  return ref;
}
