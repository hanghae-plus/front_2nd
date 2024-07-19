import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerID = setTimeout(() => {
      console.log('콜백호출');
      setDebouncedValue(value);
    }, delay);

    // 다음 useEffect가 실행되기 전에 return문이 실행
    return () => {
      clearTimeout(timerID);
    };
  }, [value, delay]);

  return [debouncedValue];
}
