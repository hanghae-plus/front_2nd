import { createContext, useContext, useState } from "react";
import {deepEquals} from "../basic/basic.js";


/* [ 데이터 캐싱 ] */
const cache = new Map();
const checkCache = (key, func) => {
  if (!cache.has(key)) {
    const result = func();
    cache.set(key, result);
  }

  return cache.get(key);
}
export const memo1 = (fn) => checkCache(fn, fn);
export const memo2 = (fn, arr) => checkCache(`${fn.toString()}_${JSON.stringify(arr)}`, fn);


/* [useState를 이용한 캐싱] */
export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);
  const setCustomState = (val) => setState(prev => deepEquals(prev, val) ? prev : val);
  return [state, setCustomState];
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
