import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { deepEquals } from "../basic/basic.js";

export const memo1 = (() => {
  let cache;

  return (fn) => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
})();

export const memo2 = (() => {
  const cache = new Map();

  return (fn, value) => {
    const key = JSON.stringify(value);
    if (cache.has(key)) return cache.get(key);

    cache.set(key, fn(...value));
    return cache.get(key);
  };
})();

export const useCustomState = (initValue) => {
  const [value, setValue] = useState(initValue);

  const setResultState = (state) => {
    if (!deepEquals(value, state)) {
      setValue(state);
    }
  };

  return [value, setResultState];
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
  const setValue = useCallback(
    (key, newValue) => {
      valueRef.current = { ...valueRef.current, [key]: newValue };
    },
    [valueRef],
  );

  return (
    <TestContext.Provider value={{ value: valueRef.current, setValue }}>
      {children}
    </TestContext.Provider>
  );
};

const useTestContext = (key) => {
  const { value, setValue } = useContext(TestContext);
  const [state, setState] = useState(value[key]);

  useEffect(() => {
    setValue(key, state);
  }, [state]);

  return [state, setState];
};

export const useUser = () => useTestContext("user");

export const useCounter = () => useTestContext("count");

export const useTodoItems = () => useTestContext("todoItems");
