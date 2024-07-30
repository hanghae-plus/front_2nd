import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { shallowEquals } from "../basic/basic.js";
// 캐싱 기능 검증 (클로저 활용)
export const memo1 = (() => {
  const cache = new Map(); // 자유 변수

  // 즉시실행함수가 반환한 함수는 memo1에 할당
  return (fn) => {
    if (!cache.has(fn)) {
      cache.set(fn, fn());
    }
    return cache.get(fn);
  };
})();

export const memo2 = (() => {
  const cache = new Map();

  return (fn, ...args) => {
    const key = `${fn}${args}`;

    if (!cache.has(key)) {
      cache.set(key, fn());
    }
    return cache.get(key);
  };
})();

export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);

  const memoizedSetState = useCallback(
    (newValue) => {
      if (!shallowEquals(state, newValue)) {
        setState(newValue);
      }
    },
    [initValue],
  );

  return [state, memoizedSetState];
};

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

export const TestContext = createContext({
  value: textContextDefaultValue,
  setValue: () => null,
});

export const TestContextProvider = ({ children }) => {
  const [value, setValue] = useState(textContextDefaultValue);

  return (
    <TestContext.Provider value={{ value, setValue }}>
      {children}
    </TestContext.Provider>
  );
};

const useTestContext = (key) => {
  const { value, setValue } = useContext(TestContext);
  const [state, setState] = useState(value[key]);

  const memoizedSetValue = useCallback(
    (newValue) => setValue({ state, newValue }),
    [value[key]],
  );

  const memoizedValue = useMemo(() => {
    return [state, setState];
  }, [value[key], memoizedSetValue]);

  return memoizedValue;
};

export const useUser = () => useTestContext("user");

export const useCounter = () => useTestContext("count");

export const useTodoItems = () => useTestContext("todoItems");
