import { useState, useEffect } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [ref, setRef] = useState<{ current: T | null }>({ current: initValue });

  useEffect(() => {
    setRef({ current: initValue });
  }, []);

  return ref;
}
