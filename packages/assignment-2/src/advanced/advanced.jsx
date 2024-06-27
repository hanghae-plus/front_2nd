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

export const useCustomState = (initialState) => {
  const [value, setValue] = useState(initialState);

  const setVal = useCallback(
    (val) => {
      if (JSON.stringify(value) !== JSON.stringify(val)) {
        setValue(val);
      }
    },
    [value]
  );

  return [value, setVal];
};

//deepEqual을 import해서와 쓰는 방법의 대안으로 찾은 JSON.stringify
//한계: 상태 객체가 크거나 중첩 구조가 깊은 경우 성능 저하가 발생하여, lodash를 사용하거나.
// fast-deep-equal, react-fast-compare를 활용하는 방법도

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};
const UserContext = createContext(null);
const CountContext = createContext(null);
const TodoItemsContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(textContextDefaultValue.user);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const TodoProvider = ({ children }) => {
  const [todoItems, setTodoItems] = useState(textContextDefaultValue.todoItems);
  return (
    <TodoItemsContext.Provider value={{ todoItems, setTodoItems }}>
      {children}
    </TodoItemsContext.Provider>
  );
};

const CountProvider = ({ children }) => {
  const [count, setCount] = useState(textContextDefaultValue.count);
  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
};

export const TestContextProvider = ({ children }) => {
  return (
    <UserProvider>
      <TodoProvider>
        <CountProvider>{children}</CountProvider>
      </TodoProvider>
    </UserProvider>
  );
};

export const TestContext = createContext({
  value: textContextDefaultValue,
  setValue: () => null,
});

export const useUser = () => {
  const context = useContext(UserContext);
  return [context.user, context.setUser];
};

export const useCounter = () => {
  const context = useContext(CountContext);
  return [context.count, context.setCount];
};

export const useTodoItems = () => {
  const context = useContext(TodoItemsContext);
  return [context.todoItems, context.setTodoItems];
};
