import { createContext, useContext, useState } from "react";
export const memo1 = (() => {
  let store = null;
  return (fn) => {
    if (store === null) {
      store = fn();
    }
    return store;
  };
})();

// b 값이 바뀌더라도 key 값이 [a]로 동일함으로 store에 저장된 값을 반환해야함.
export const memo2 = (() => {
  let store = {};
  return (fn, key) => {
    if (store[key] === undefined) {
      store[key] = fn();
    }
    return store[key];
  };
})();

export const useCustomState = (initValue) => {
  // useState를 호출한다고 해서 리렌더링이 발생하는건 아니다.
  const [value, setValue] = useState(initValue);

  const proxySetValue = (arg) => {
    const deepEqualArg = JSON.stringify(arg);
    const deepEqualExistingValue = JSON.stringify(value);

    if (deepEqualArg === deepEqualExistingValue) return;
    setValue(arg);
  };
  return [value, proxySetValue];
};

/**
 * Try 1
 * 
 * state들이 한 컴포넌트에 있어서, setxxx로 TestContextProvider 리렌더링시 다른 컴포넌트들이 리렌더링 된다.
 * 영향을 받지 않도록 분리 시켜주어야함.
 * 
  export const TestContextProvider = ({ children }) => {
    const [counter, setCounter] = useState(0);
    const [user, setUser] = useState(null);
    const [todo, setTodo] = useState([]);
    return (
      <TestUserContext.Provider value={{ user, setUser }}>
        <TestTodoContext.Provider value={{ todo, setTodo }}>
          <TestCounterContext.Provider value={{ counter, setCounter }}>
            {children}
          </TestCounterContext.Provider>
        </TestTodoContext.Provider>
      </TestUserContext.Provider>
    );
  };
 */

// Try 2

const TestUserContext = createContext();
const TestTodoContext = createContext();
const TestCounterContext = createContext();

export const TestContextProvider = ({ children }) => {
  return (
    <TestUserContextProvider>
      <TestTodoContextProvider>
        <TestCounterContextProvider>{children}</TestCounterContextProvider>
      </TestTodoContextProvider>
    </TestUserContextProvider>
  );
};

const TestUserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <TestUserContext.Provider value={{ user, setUser }}>
      {children}
    </TestUserContext.Provider>
  );
};

const TestCounterContextProvider = ({ children }) => {
  const [counter, setCounter] = useState(0);
  return (
    <TestCounterContext.Provider value={{ counter, setCounter }}>
      {children}
    </TestCounterContext.Provider>
  );
};

const TestTodoContextProvider = ({ children }) => {
  const [todo, setTodo] = useState([]);
  return (
    <TestTodoContext.Provider value={{ todo, setTodo }}>
      {children}
    </TestTodoContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(TestUserContext);
  return [user, setUser];
};

export const useCounter = () => {
  const { counter, setCounter } = useContext(TestCounterContext);
  return [counter, setCounter];
};

export const useTodoItems = () => {
  const { todo, setTodo } = useContext(TestTodoContext);
  return [todo, setTodo];
};
