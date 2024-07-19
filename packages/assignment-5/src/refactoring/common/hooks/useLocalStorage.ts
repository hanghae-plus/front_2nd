import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // 초기 상태를 설정합니다.
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 로컬 스토리지에서 값을 가져옵니다.
      const item = window.localStorage.getItem(key);
      // 저장된 값이 있으면 파싱하여 반환, 없으면 초기값을 반환합니다.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // 값이 변경될 때마다 로컬 스토리지를 업데이트합니다.
  useEffect(() => {
    try {
      // 값을 문자열로 변환하여 로컬 스토리지에 저장합니다.
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
