import { createContext, useContext, useState } from 'react';
import { deepEquals } from '../basic/basic';

const memoMap = new Map();

export const memo1 = (fn) => {
  const key = fn;

  if (!memoMap.has(key)) {
    memoMap.set(key, fn());
  }

  return memoMap.get(key);
};

export const memo2 = (fn, arr) => {
  const key = arr.join('');

  if (!memoMap.has(key)) {
    memoMap.set(key, fn());
  }

  return memoMap.get(key);
};

export const useCustomState = (initValue) => {
  const [value, setValue] = useState(initValue);

  const setState = (newValue) => {
    if (deepEquals(value, newValue)) return;

    setValue(newValue);
  };

  return [value, setState];
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
