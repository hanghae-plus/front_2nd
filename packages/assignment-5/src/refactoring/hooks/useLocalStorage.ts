import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

type UseLocalStorage<S> = [S, Dispatch<SetStateAction<S>>];

/**
 * localStorage에 값을 세팅하고 가져다 쓸 수 있는 커스텀 훅
 * @param key
 * @param initialData
 * @returns
 */
export const useLocalStorage = <T>(
  key: string,
  initialData: T
): UseLocalStorage<T> => {
  /**
   * key에 따라 로컬스토리지에 아이템을 저장하는 함수
   * @param key
   * @param initialData
   * @returns
   */
  const getStorageByKey = useCallback(<T>(): T => {
    return JSON.parse(localStorage.getItem(key) as string) || initialData;
  }, [key, initialData]);

  const [storedValue, setStoredValue] = useState<T>(() => getStorageByKey());

  const setStorageByKey = useCallback(<T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
  }, []);

  useEffect(() => {
    setStorageByKey(key, storedValue);
  }, [key, storedValue, setStorageByKey]);

  return [storedValue, setStoredValue];
};
