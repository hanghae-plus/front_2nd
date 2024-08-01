import { createContext, useCallback, useContext, useState } from "react";

export const memo1 = (() => {
  let cache;

  return (fn) => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
})();

export const memo2 = (() => {
  const cache = new Map();
  return (fn, args) => {
    return (function () {
      const key = JSON.stringify(args);

      if (!cache.has(key)) {
        cache.set(key, fn(...args));
      }

      return cache.get(key);
    })();
  };
})();

export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);

  // setState를 실행할 때 현재 state와 다른 값이면 변경하기,
  // 똑같은 값으로 변경하려고 한다면 setState를 실행하지 않게하여 렌더링
  const setCustomState = (newState) => {
    if (JSON.stringify(state) !== JSON.stringify(newState)) {
      setState(newState);
    }
  };

  return [state, setCustomState];
};

const UserContext = createContext({
  user: null,
  setUser: () => null,
});

const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const setUserCallback = useCallback((user) => setUser(user), []);

  return (
    <UserContext.Provider value={{ user, setUser: setUserCallback }}>
      {children}
    </UserContext.Provider>
  );
};

const CountContext = createContext({
  count: 0,
  setCount: () => null,
});

const useCountContext = () => {
  return useContext(CountContext);
};

export const CountProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const setCountCallback = useCallback((count) => setCount(count), []);

  return (
    <CountContext.Provider value={{ count, setCount: setCountCallback }}>
      {children}
    </CountContext.Provider>
  );
};

const TodoItemsContext = createContext({
  todoItems: [],
  setTodoItems: () => null,
});

const useTodoItemsContext = () => {
  return useContext(TodoItemsContext);
};

export const TodoItemsProvider = ({ children }) => {
  const [todoItems, setTodoItems] = useState([]);
  const setTodoItemsCallback = useCallback((items) => setTodoItems(items), []);

  return (
    <TodoItemsContext.Provider
      value={{ todoItems, setTodoItems: setTodoItemsCallback }}
    >
      {children}
    </TodoItemsContext.Provider>
  );
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

export const useUser = () => {
  const { user, setUser } = useUserContext();
  return [user, setUser];
};

export const useCounter = () => {
  const { count, setCount } = useCountContext();
  return [count, setCount];
};

export const useTodoItems = () => {
  const { todoItems, setTodoItems } = useTodoItemsContext();
  return [todoItems, setTodoItems];
};
