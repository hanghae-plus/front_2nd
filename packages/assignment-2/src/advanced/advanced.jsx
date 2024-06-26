import { createContext, useContext, useState } from 'react';

/** 함수 객체를 키로 하여 함수 실행 결과를 저장하는 맵
 *
 * @link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 */
const cache = new WeakMap();

/**
 * memo1
 *
 * 함수가 달라지지 않으면 새로 생성하지 않음
 */
export const memo1 = (fn) => {
  if (!cache.has(fn)) {
    cache.set(fn, fn());
  }

  return cache.get(fn);
};

/**
 * memo2
 *
 * 함수 또는 의존성 배열이 달라지지 않으면 새로 생성하지 않음
 */
export const memo2 = (fn, dependencies) => {
  if (!cache.has(fn)) {
    cache.set(fn, { result: fn(), dependencies });
  }

  const cached = cache.get(fn);
  const isSame =
    dependencies.length === cached.dependencies.length &&
    dependencies.every((newDep, i) => newDep === cached.dependencies[i]);

  if (!isSame) {
    const result = fn();
    cache.set(fn, { result, dependencies });
    return result;
  }

  return cached.result;
};

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
