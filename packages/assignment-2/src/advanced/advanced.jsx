import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { deepEquals } from '../basic/basic';

export const memo1 = (() => {
  let cache = null;
  return fn => {
    return cache ? cache : (cache = fn());
  };
})();

export const memo2 = (() => {
  let cache = {};
  return (fn, value) => {
    return cache[value] ? cache[value] : (cache[value] = fn());
  };
})();

export const useCustomState = initValue => {
  const [state, setState] = useState(initValue);

  const memoSetState = newState => {
    if (!deepEquals(state, newState)) {
      setState(newState);
    }
  };
  return [state, memoSetState];
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
  const valueRef = useRef(textContextDefaultValue);
  const setValue = (key, newValue) => {
    if (!deepEquals(valueRef.current[key], newValue)) {
      valueRef.current = { ...valueRef.current, [key]: newValue };
    }
  };

  return <TestContext.Provider value={{ value: valueRef.current, setValue }}>{children}</TestContext.Provider>;
};

const useTestContext = key => {
  const { value, setValue } = useContext(TestContext);
  const [state, setState] = useState(value[key]);

  useEffect(() => {
    setValue(key, state);
  }, [state]);

  return [state, setState];
};

export const useUser = () => useTestContext('user');

export const useCounter = () => useTestContext('count');

export const useTodoItems = () => useTestContext('todoItems');
