import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { deepEquals } from "../basic/basic";

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

  return (fn, args) => {
    const key = args.map((arg) => JSON.stringify(arg)).join("|");

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
})();

export const useCustomState = (initValue) => {
  const [value, setValue] = useState(initValue);

  const setDeepEqualsState = (state) => {
    if (!deepEquals(value, state)) {
      setValue(state);
    }
  };

  return [value, setDeepEqualsState];
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
  const ref = useRef(textContextDefaultValue);
  const setValue = useCallback(
    (key, value) => {
      ref.current = { ...ref.current, [key]: value };
    },
    [ref]
  );

  return (
    <TestContext.Provider value={{ value: ref.current, setValue }}>
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

export const useUser = () => {
  return useTestContext("user");
};

export const useCounter = () => {
  return useTestContext("count");
};

export const useTodoItems = () => {
  return useTestContext("todoItems");
};
