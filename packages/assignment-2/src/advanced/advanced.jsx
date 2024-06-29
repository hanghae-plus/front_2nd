import { createContext, useContext, useMemo, useState } from 'react';
import { deepEquals } from '../basic/basic';

const memoMap = new Map();

export const memo1 = (fn) => {
  const key = fn;

  if (!memoMap.has(key)) {
    memoMap.set(key, fn());
  }

  return memoMap.get(key);
};

export const memo2 = (fn, arr) => {
  const key = arr.join('');

  if (!memoMap.has(key)) {
    memoMap.set(key, fn());
  }

  return memoMap.get(key);
};

export const useCustomState = (initValue) => {
  const [value, setValue] = useState(initValue);

  const setState = (newValue) => {
    if (deepEquals(value, newValue)) return;

    setValue(newValue);
  };

  return [value, setState];
};

const contextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

const UserContext = createContext(contextDefaultValue.user);

const TodoItemsContext = createContext(contextDefaultValue.todoItems);

const CountContext = createContext(contextDefaultValue.count);

export const TestContextProvider = ({ children }) => {
  const [user, setUser] = useState(contextDefaultValue.user);
  const [todoItems, setTodoItems] = useState(contextDefaultValue.todoItems);
  const [count, setCount] = useState(contextDefaultValue.count);

  const userContextValue = useMemo(() => [user, setUser], [user, setUser]);
  const todoItemsContextValue = useMemo(
    () => [todoItems, setTodoItems],
    [todoItems, setTodoItems]
  );
  const countContextValue = useMemo(() => [count, setCount], [count, setCount]);

  return (
    <UserContext.Provider value={userContextValue}>
      <TodoItemsContext.Provider value={todoItemsContextValue}>
        <CountContext.Provider value={countContextValue}>
          {children}
        </CountContext.Provider>
      </TodoItemsContext.Provider>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export const useCounter = () => {
  return useContext(CountContext);
};

export const useTodoItems = () => {
  return useContext(TodoItemsContext);
};
