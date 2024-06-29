import { createContext, useContext, useState } from "react";

const cache = new Map();

export const memo1 = (fn) => {
  const key = fn.toString();
  return (() => {
    if(cache.has(key)) {
      return cache.get(key);
    } else {
      const result = fn();
      cache.set(key, result);
      return result;
    }
  })();
};

const cache2 = new Map();

export const memo2 = (fn, arr) => {
  const key = fn.toString();
  
  return (() => {
    let returnArr;
    
    if(cache2.has(key)) {
      returnArr = cache2.get(key);
    } else {
      const result = fn();
      cache2.set(key, result);
      returnArr = result;
    }
    if(!cache2.has(`arr${key}`)) {
      cache2.set(`arr${key}`, arr[0]);
      returnArr.length = arr[0];
    } else {
      returnArr.length = cache2.get(`arr${key}`);
    }
    return returnArr
  })();
};


export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);

  const isEqual = (curVal, newVal) => {
    if(!curVal && !newVal) return true;
    else if(!curVal || !newVal) return false;
    if(curVal instanceof NodeList) curVal = Array.from(curVal)
    if(newVal instanceof NodeList) newVal = Array.from(newVal)

    const key1 = Object.keys(curVal);
    const key2 = Object.keys(newVal);
    if(key1.length !== key2.length) return false;
    for(let k of key1) {
      if(curVal[k] !== newVal[k]) return false;
    }
    return true;
  }

  const customSetState = (newVal) => {
    if(!isEqual(state, newVal)) {
      return setState(newVal);
    }
  }
  return [state, customSetState]
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
