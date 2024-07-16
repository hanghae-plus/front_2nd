import { createContext, useContext, useState, useCallback } from "react";

/** reference: https://velog.io/@sarang_daddy/React-Data-Caching
 * const ONE_MINUTE_MS = 60 * 1000;

const cacheManager = (cacheExpirationDuration: number = ONE_MINUTE_MS * 10) => {
  const cache: Record<string, { data: any; expireTime: number }> = {};

  return {
    cacheData: (key: string, data?: any) => {
      if (cache[key]) {
        const { data: cachedData, expireTime } = cache[key];
        if (expireTime > Date.now()) {
          return cachedData;
        }
      }
      cache[key] = { data, expireTime: Date.now() + cacheExpirationDuration };
      return data;
    },
    isDataValid: (key: string) => {
      if (!cache[key]) return false;
      const { expireTime } = cache[key];
      return expireTime > Date.now();
    },
  };
};

export default cacheManager;

 */
const cacheManager = (cacheExpirationDuration = 60 * 1000 * 10) => {
  const cache = new Map();

  return {
    get: (key) => {
      if (cache.has(key)) {
        const { data, expireTime } = cache.get(key);
        if (expireTime > Date.now()) {
          return data;
        } else {
          cache.delete(key); // 만료된 데이터 삭제
        }
      }
      return null;
    },
    set: (key, data) => {
      cache.set(key, {
        data,
        expireTime: Date.now() + cacheExpirationDuration,
      });
    }
  };
};

// const cache = new Map();
const memo1Cache = cacheManager();

export const memo1 = (fn) => {
  const cachedData = memo1Cache.get(fn);
  if (cachedData !== null) {
    return cachedData;
  }
  const result = fn();
  memo1Cache.set(fn, result);
  return result;
};


const memo2Cache = cacheManager();
export const memo2 = (fn, args) => {
  const key = JSON.stringify(args);
  const cachedData = memo2Cache.get(key);
  if (cachedData !== null) {
    return cachedData;
  }
  const result = fn();
  memo2Cache.set(key, result);
  return result;
}; 


const deepEqual = (a, b) => {
  if (a === b) return true;

  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
};

export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);

  const setCustomState = useCallback((newState) => {
    setState((prevState) => {
      if (!deepEqual(prevState, newState)) {
        return newState;
      }
      return prevState;
    });
  }, []);

  return [state, setCustomState];
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

 
const UserContext = createContext({
  user: null,
  setUser: () => null,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);
  return [user, setUser];
};
 
const CountContext = createContext({
  count: 0,
  setCount: () => null,
});

export const CountProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
};

export const useCounter = () => {
  const { count, setCount } = useContext(CountContext);
  return [count, setCount];
};
 
const TodoItemsContext = createContext({
  todoItems: [],
  setTodoItems: () => null,
});

export const TodoItemsProvider = ({ children }) => {
  const [todoItems, setTodoItems] = useState([]);
  return (
    <TodoItemsContext.Provider value={{ todoItems, setTodoItems }}>
      {children}
    </TodoItemsContext.Provider>
  );
};

export const useTodoItems = () => {
  const { todoItems, setTodoItems } = useContext(TodoItemsContext);
  return [todoItems, setTodoItems];
};
 
export const TestContextProvider = ({ children }) => {
  return (
    <UserProvider>
      <CountProvider>
        <TodoItemsProvider>{children}</TodoItemsProvider>
      </CountProvider>
    </UserProvider>
  );
};
  
