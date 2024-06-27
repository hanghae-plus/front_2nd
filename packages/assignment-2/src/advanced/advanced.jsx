import { createContext, useContext, useState } from "react";

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
  return useState(initValue);
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

const useTestContext = () => {
  return useContext(TestContext);
};

export const useUser = () => {
  const { value, setValue } = useTestContext();

  return [value.user, (user) => setValue({ ...value, user })];
};

export const useCounter = () => {
  const { value, setValue } = useTestContext();

  return [value.count, (count) => setValue({ ...value, count })];
};

export const useTodoItems = () => {
  const { value, setValue } = useTestContext();

  return [value.todoItems, (todoItems) => setValue({ ...value, todoItems })];
};
