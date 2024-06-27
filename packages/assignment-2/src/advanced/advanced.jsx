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