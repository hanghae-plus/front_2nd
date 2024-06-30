import { createContext, useContext, useState, useMemo, useCallback } from "react";
import {deepEquals} from "../basic/basic.js";


/* [ 데이터 캐싱 ] */
const cache = new Map();
const checkCache = (key, func) => {
  if (!cache.has(key)) {
    const result = func();
    cache.set(key, result);
  }

  return cache.get(key);
}
export const memo1 = (fn) => checkCache(fn, fn);
export const memo2 = (fn, arr) => checkCache(`${fn.toString()}_${JSON.stringify(arr)}`, fn);


// [useState를 이용한 캐싱]
export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);
  const setCustomState = (val) => {
    if (!deepEquals(state, val)) setState(val)
  };
  return [state, setCustomState];
}


// [ Provider를 여러개로 나누어 제공 ]
const UserContext = createContext();
const TodoItemsContext = createContext();
const CountContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

const TodoItemsProvider = ({ children }) => {
  const [todoItems, setTodoItems] = useState([
    { id: 1, content: 'PT 받기', completed: false },
    { id: 2, content: '회사일', completed: false },
    { id: 3, content: '멘토링', completed: false },
  ]);
  const [externalItems, setExternalItems] = useState([
    { id: 4, content: '과제 만들기', completed: false },
    { id: 5, content: '발제자료 만들기', completed: false },
    { id: 6, content: '고양이 밥주기', completed: false },
  ]);

  const value = useMemo(() => ({
    todoItems,
    setTodoItems,
    externalItems,
    setExternalItems
  }), [todoItems, externalItems]);

  return <TodoItemsContext.Provider value={value}>{children}</TodoItemsContext.Provider>;
};

const CountProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  return <CountContext.Provider value={{ count, setCount }}>{children}</CountContext.Provider>;
};

export const TestContextProvider = ({ children }) => {
  return (
      <UserProvider>
        <TodoItemsProvider>
          <CountProvider>
            {children}
          </CountProvider>
        </TodoItemsProvider>
      </UserProvider>
  );
};

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
  const addTodoItem = useCallback(() => {
    context.setTodoItems(prev => {
      if (context.externalItems.length === 0) return prev;
      const [newItem, ...rest] = context.externalItems;
      context.setExternalItems(rest);
      return [...prev, newItem];
    });
  }, [context]);

  return [context.todoItems, addTodoItem];
};