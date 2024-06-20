import { useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [ref, setRef] = useState({ current: initValue });
  // if (ref.current !== initValue) setRef({ ...ref, current: initValue });
  return ref;
}
