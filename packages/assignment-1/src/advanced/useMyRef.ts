import {useEffect, useState} from "react";

export function useMyRef<T>(initValue: T | null) {
  const [ref] = useState({ current: initValue });

  useEffect(() => {
    // 마운트 시 실행
    if (initValue != null) {
      ref.current = initValue;
    }
  }, []);

  return ref;
}
