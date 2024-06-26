import { useState } from 'react';

<<<<<<< HEAD
export function useMyRef<T>(initValue: T | null) {
  const [ref] = useState({ current: initValue });
  return ref;
}
=======

export const useMyRef = ((initValue) => {
  const ref = { current: initValue };
  return () => ref;
})();
>>>>>>> b0653f97 (feat 2주차 basic 문제 구현)
