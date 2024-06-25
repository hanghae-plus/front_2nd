import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { deepEquals } from "../basic/basic";

export const memo1 = (() => {
  let isCached = false;
  let res;

  return (fn) => {
    if (isCached) {
      return res;
    }

    isCached = true;
    res = fn();
    return res;
  };
})();

export const memo2 = (() => {
  let isCached = false;
  let res;
  let cachedKeys = [];

  return (fn, cacheKeys) => {
    if (cachedKeys.length === cacheKeys.length) {
      isCached = true;
      for (const i in cacheKeys) {
        const key = cacheKeys[i];
        const cacheKey = cachedKeys[i];
        if (key !== cacheKey) {
          isCached = false;
          break;
        }
      }
    }

    if (isCached) {
      return res;
    }

    cachedKeys = cacheKeys;
    res = fn();
    return res;
  };
})();

export const useCustomState = (initValue) => {
  const [value, setValue] = useState(initValue);
  const cachedValue = useMemo(() => {
    return value;
  }, [value]);

  const setState = (newValue) => {
    if (!deepEquals(cachedValue, newValue)) {
      setValue(newValue);
    }
  };

  return [cachedValue, setState];
};

const testContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

export const TestContext = createContext({
  value: testContextDefaultValue,
  setValue: () => null,
});

export const TestContextProvider = ({ children }) => {
  const valueRef = useRef(testContextDefaultValue);
  const setValue = (newValue) => {
    valueRef.current = newValue;
  };

  return (
    <TestContext.Provider value={{ value: valueRef.current, setValue }}>
      {children}
    </TestContext.Provider>
  );
};

const useTestContext = (contextKey) => {
  const { value, setValue } = useContext(TestContext);
  const [contextValue, setContextValue] = useState(value[contextKey]);

  useEffect(() => {
    if (!deepEquals(contextValue, value[contextKey])) {
      setValue((prev) => ({ ...prev, [contextKey]: contextValue }));
    }
  }, [contextValue, contextKey, setValue]);

  return [contextValue, setContextValue];
};

const contextKeyNames = {
  USER: "user",
  COUNT: "count",
  TODO_ITEMS: "todoItems",
};

export const useUser = () => useTestContext(contextKeyNames.USER);
export const useCounter = () => useTestContext(contextKeyNames.COUNT);
export const useTodoItems = () => useTestContext(contextKeyNames.TODO_ITEMS);
