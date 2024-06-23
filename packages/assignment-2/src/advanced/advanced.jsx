import { createContext, useCallback, useContext, useState } from "react";
import { deepEquals } from '../basic/basic';

const cache = new Map();

export const memo1 = (fn) => {
  if (cache.has(fn)) {
    return cache.get(fn);
  }
  const result = fn();
  cache.set(fn, result);
  return result;
};

export const memo2 = (fn, dependencies = []) => {
  const key = JSON.stringify({ fn: fn.toString(), dependencies });
  if (cache.has(key)) {
    return cache.get(key);
  }
  const result = fn();
  cache.set(key, result);
  return result;
};


export const useCustomState = (initValue) => {
  const [value, originalSetValue] = useState(initValue);

  const setValue = useCallback((newValue) => {
    originalSetValue(prevValue => {
      if (deepEquals(prevValue, newValue)) {
        return prevValue;
      }
      
      return typeof newValue === 'function' ? newValue(newValue) : newValue
    });
  }, [originalSetValue])

  return [value, setValue];
}

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
  )
}

const useTestContext = () => {
  return useContext(TestContext);
}

export const useUser = () => {
  const { value, setValue } = useTestContext();

  return [
    value.user,
    (user) => setValue({ ...value, user })
  ];
}

export const useCounter = () => {
  const { value, setValue } = useTestContext();

  return [
    value.count,
    (count) => setValue({ ...value, count })
  ];
}

export const useTodoItems = () => {
  const { value, setValue } = useTestContext();

  return [
    value.todoItems,
    (todoItems) => setValue({ ...value, todoItems })
  ];
}
