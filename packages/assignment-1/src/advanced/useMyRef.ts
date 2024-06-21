import { useEffect, useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  const [ref] = useState<{ current: T | null }>({ current: initValue });

  useEffect(() => {
    return () => {
      ref.current = null;
    };
  }, [ref]);

  return ref;
}
