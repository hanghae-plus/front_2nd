import { createContext, useContext, useState } from "react"; 
 
const cache = {};

export const memo1 = (fn) => {
  const key = fn.toString();
  if (!cache[key]) {
    cache[key] = fn();
  }
  return cache[key];
};

export const memo2 = (fn, args) => {
  const key = fn.toString() + JSON.stringify(args);
  if (!cache[key]) {
    cache[key] = fn(...args);
  }
  return cache[key];
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
  const setCustomState = (newState) => {
    if (!deepEqual(state, newState)) {
      setState(newState);
    }
  };

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
 

