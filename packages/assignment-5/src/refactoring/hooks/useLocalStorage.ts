import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialData?: T) => {
  /**
   * key에 따라 로컬스토리지에 아이템을 저장하는 함수
   * @param key
   * @param initialData
   * @returns
   */
  const getStorageByKey = <T>(key: string, initialData?: T): T => {
    return JSON.parse(localStorage.getItem(key) as string) || initialData;
  };

  const [storedValue, setStoredValue] = useState<T>(() =>
    getStorageByKey(key, initialData)
  );

  const setStorageByKey = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  useEffect(() => {}, [storedValue]);

  return { getStorageByKey, setStorageByKey };
};
