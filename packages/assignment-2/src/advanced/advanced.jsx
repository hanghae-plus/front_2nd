import { createContext, useContext, useState } from "react";


// 데이터를 캐싱하기위한 저장공간
const cache = new Map();

export const memo1 = (fn) => {
  // 넘어온 함수로 키값생성
  const key = fn.toString();

  if (!cache.has(key)) {
    const result = fn();
    cache.set(key, result);
  }

  return cache.get(key);
};

export const memo2 = (fn, arr) => {
  // 넘어온 함수와 배열로 고유한 키값 생성
  const key = `${fn.toString()}_${JSON.stringify(arr)}`;

  if (!cache.has(key)) {
    const result = fn();
    cache.set(key, result);
  }

  return cache.get(key);
};


export const useCustomState = (initValue) => {
  return useState(initValue);
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
