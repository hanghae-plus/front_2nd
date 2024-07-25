import { createContext, useContext, useState, useRef, useEffect } from 'react';

// 실제로 값이 달라졌는지 확인하기 위해 사용
import { deepEquals } from '../basic/basic';

// basic - CustomNumber와 비슷하게 map을 사용함으로
// map에 이미 값이 있는지 중복확인하기 = 값을 캐시하기
const cache = new Map();

export const memo1 = (fn) => {
  if (cache.has(fn)) return cache.get(fn);

  const result = fn();
  cache.set(fn, result);

  return result;
};

export const memo2 = (fn, dependencies) => {
  const key = dependencies.join(',');

  if (cache.has(key)) return cache.get(key);

  const result = fn();
  cache.set(key, result);

  return result;
};

export const useCustomState = (initValue) => {
  // initValue as state
  const [state, setState] = useState(initValue);

  // setState 함수만 바꿔주기:
  // when new value comes in, check if that value is deepEqual to current value
  // if it is, don't update the state
  const customSetState = (newValue) => {
    if (deepEquals(newValue, state)) return;
    setState(newValue);
  };

  return [state, customSetState];
};

const textContextDefaultValue = {
  // user.name user.id
  user: null,
  // todoItems.id, todoItems.title, todoItems.completed
  todoItems: [],
  count: 0,
};

export const TestContext = createContext({
  value: textContextDefaultValue,
  setValue: () => null,
});

export const TestContextProvider = ({ children }) => {
  // use useRef to avoid unnecessary re-rendering
  const valueRef = useRef(textContextDefaultValue);
  const setValueRef = ({ key, newValue }) => {
    // only update value when it's changed
    if (!deepEquals(valueRef.current[key], newValue)) {
      valueRef.current = { ...valueRef.current, [key]: newValue };
    }
  };

  return (
    <TestContext.Provider
      value={{ value: valueRef.current, setValue: setValueRef }}
    >
      {children}
    </TestContext.Provider>
  );
};

const useTestContext = (key) => {
  // only re-render when the value of certain "key" changes to avoid unnecessary re-rendering
  const { value, setValue } = useContext(TestContext);

  // get values depending on the key, and have it as state
  const [state, setState] = useState(value[key]);

  // update the state when the value of the key changes
  // avoids unnecessary re-rendering because it only changes the values of "key"
  // and TestContextProvider uses setValueRef based on the "key" as well
  useEffect(() => {
    setValue(key, state);
  }, [state]);

  return [state, setState];
};

export const useUser = () => {
  return useTestContext('user');
};

export const useCounter = () => {
  return useTestContext('count');
};

export const useTodoItems = () => {
  return useTestContext('todoItems');
};
