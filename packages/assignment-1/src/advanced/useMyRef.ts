import { useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [init] = useState({
    current: initValue,
  });

  return init;
}
