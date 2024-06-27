import { createContext, useContext, useState } from "react";
import { deepEquals } from "../basic/basic";

const cache = {};
export const memo1 = (fn) => {
  const key = fn.toString();
  if (cache[key]) return cache[key];
  const result = fn();
  cache[key] = result;
  return result;
};

const cache2 = {};
export const memo2 = (fn, arr) => {
  const key = arr.toString();
  if (cache2[key]) return cache2[key];
  const result = fn();
  cache2[key] = result;
  return result;
};

export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);
  const setValue = (newState) => {
    if (state === newState || deepEquals(state, newState)) return;
    setState(newState);
  };
  return [state, setValue];
};

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

const createProvider =
  (Context, useCustomState) =>
  ({ children }) => {
    const [state, setState] = useCustomState();
    return (
      <Context.Provider value={{ state, setState }}>
        {children}
      </Context.Provider>
    );
  };

const UserContext = createContext();
const CounterContext = createContext();
const TodoContext = createContext();

export const UserProvider = createProvider(UserContext, () =>
  useCustomState(textContextDefaultValue.user)
);
export const CounterProvider = createProvider(CounterContext, () =>
  useCustomState(textContextDefaultValue.count)
);
export const TodoProvider = createProvider(TodoContext, () =>
  useCustomState(textContextDefaultValue.todoItems)
);

const createStateHook = (Context) => () => {
  const context = useContext(Context);
  return [context.state, context.setState];
};

export const useUser = createStateHook(UserContext);
export const useCounter = createStateHook(CounterContext);
export const useTodoItems = createStateHook(TodoContext);

export const TestContextProvider = ({ children }) => {
  return (
    <UserProvider>
      <CounterProvider>
        <TodoProvider>{children}</TodoProvider>
      </CounterProvider>
    </UserProvider>
  );
};
