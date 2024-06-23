import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { deepEquals } from '../basic/basic';

const cache = new Map();

export const memo1 = (fn) => {
  const key = fn.toString();
  if (cache.has(key)) {
    return cache.get(key);
  }
  const result = fn();
  cache.set(key, result);
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
    const computedValue = typeof newValue === 'function' ? newValue(value) : newValue;
    if (deepEquals(value, computedValue)) {
      return;
    }
    originalSetValue(computedValue);
  }, [originalSetValue, value]); 

  return [value, setValue];
}

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

export const TestContext = createContext({
  get: () => null,
  set: () => null,
  subscribe: () => null,
});

export const TestContextProvider = ({ children }) => {
  const valueRef = useRef(textContextDefaultValue);
  const subscribersRef = useRef(new Set());

  const set = useCallback((newValue) => {
    valueRef.current = { ...valueRef.current, ...newValue };
    subscribersRef.current.forEach((fn) => fn());
  }, []);

  const get = useCallback(() => {
    return valueRef.current;
  }, []);

  const subscribe = useCallback((fn) => {
    subscribersRef.current.add(fn);
    return () => {
      subscribersRef.current.delete(fn);
    };
  }, []);

  const value = useMemo(() => ({ get, set, subscribe }), [get, set, subscribe]);

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  )
}

const useTestContext = () => {
  return useContext(TestContext);
}

const useStore = (selector) => {
  const { get, set, subscribe } = useTestContext();
  const state = useSyncExternalStore(subscribe, () => selector(get()), get);

  return [state, set];
}

export const useUser = () => {
  const [state, set] = useStore(state => state.user);

  const setUser = useCallback((user) => {
    set({ user });
  }, [set]);

  return [
    state,
    setUser
  ];
}

export const useCounter = () => {
  const [state, set] = useStore(state => state.count);

  const setCount = useCallback((count) => {
    set({ count });
  }, [set]);

  return [
    state,
    setCount
  ];
}

export const useTodoItems = () => {
  const [state, set] = useStore(state => state.todoItems);

  const setTodoItems = useCallback((todoItems) => {
    set({ todoItems });
  }, [set]);

  return [
    state,
    setTodoItems
  ];
}
