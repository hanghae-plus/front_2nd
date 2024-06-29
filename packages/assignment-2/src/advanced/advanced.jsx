import { createContext, useContext, useState, useRef } from "react";
import { deepEquals } from "../basic/basic";

const cache = new Map();
export const memo1 = (fn) => {
  if (cache.has(fn)) {
    return cache.get(fn);
  }
  const res = fn();
  cache.set(fn, res);
  return res;
};

export const memo2 = (fn, arr) => {
  const key = arr.toString();
  if (cache.has(key)) {
    return cache.get(key);
  }
  const res = fn();
  cache.set(key, res);
  return res;
};

export const useCustomState = (initValue) => {
  const [currentState, setCurrentState] = useState(initValue);

  const compareFunction = (newValue) => {
    if (deepEquals(currentState, newValue)) {
      return;
    } else {
      setCurrentState(newValue);
    }
  };
  return [currentState, compareFunction];
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

  const isChangeRealValue = (beforeState, nowState, key) => {
    let _result = !deepEquals(beforeState, nowState);
    if (_result) {
      valueRef.current[key] = nowState;
    }
    return _result || nowState === textContextDefaultValue[key];
  };

  return (
    <TestContext.Provider
      value={{ value: valueRef.current, isChangeRealValue }}
    >
      {children}
    </TestContext.Provider>
  );
};

const useTestContext = (key) => {
  const { value, isChangeRealValue } = useContext(TestContext);

  const [state, setState] = useState(value[key]);

  if (isChangeRealValue(value[key], state, key)) {
    return [state, setState];
  } else {
    return [state, () => {}];
  }
};

export const useUser = () => {
  return useTestContext("user");
};

export const useCounter = () => {
  return useTestContext("count");
};

export const useTodoItems = () => {
  return useTestContext("todoItems");
};
