import { createContext, useCallback, useContext, useState } from "react";

const cached = {};

export const memo1 = (fn) => {
  if (!cached.fn) {
    cached.fn = fn();
    return cached.fn;
  } else {
    return cached.fn;
  }
};

const cached2 = {};
export const memo2 = (fn, dep) => {
  if (!cached2.fn) {
    cached2.fn = fn();
    cached2.fn.dependency = [...dep];
    return cached2.fn;
  } else {
    if (!cached2.fn.dependency) return cached2.fn;
    for (let i = 0; i < dep.length; i++) {
      if (cached2.fn.dependency[i] !== dep[i]) {
        cached2.fn.dependency[i] = dep[i];
        cached2.fn = fn();
      }
    }
    return cached2.fn;
  }
};

export const useCustomState = (initValue) => {
  const [value, setValue] = useState(initValue);

  const setVal = useCallback(
    (newVal) => {
      setValue(newVal);
    },
    [value]
  );
  return [value, setVal];
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
  );
};

const useTestContext = () => {
  return useContext(TestContext);
};

export const useUser = () => {
  const { value, setValue } = useTestContext();

  return [value.user, (user) => setValue({ ...value, user })];
};

export const useCounter = () => {
  const { value, setValue } = useTestContext();

  return [value.count, (count) => setValue({ ...value, count })];
};

export const useTodoItems = () => {
  const { value, setValue } = useTestContext();

  return [value.todoItems, (todoItems) => setValue({ ...value, todoItems })];
};
