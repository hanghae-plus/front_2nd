import { createContext, useContext, useState, useCallback } from "react";

/* 값을 캐시하기 ----------------------------------------------------------------- */

// 캐시를 위해 클로저를 사용하여 이전 결과를 저장
const cachingMemo1 = () => {
  let cache;
  
  return (fn) => {
    if (!cache) cache = fn();
    return cache;
  };
};

const cachingMemo2 = () => {
  let cache;
  let prevDeps = [];
  return (fn, deps) => {
    const depsChanged = deps.some((dep, i) => dep !== prevDeps[i]);
    if (!cache || depsChanged) {
      cache = fn();
      prevDeps = deps;
    }
    return cache;
  };
};

export const memo1 = cachingMemo1();
export const memo2 = cachingMemo2();


/* 실제로 값이 달라졌을 때 렌더링하기 ------------------------------------------------------ */

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

/* 전역 상태를 참조할 때, 불필요한 렌더링 방지하기 ------------------------------------------------------ */
// 컨텍스트를 각각 분리해버리기 !

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

// test code를 보면 각각 user, count ,todoItems로 나뉨
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

const CountProvider = ({ children }) => {
  const [count, setCount] = useState(textContextDefaultValue.count);
  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
};

const TodoItemsProvider = ({ children }) => {
  const [todoItems, setTodoItems] = useState(textContextDefaultValue.todoItems);
  return (
    <TodoItemsContext.Provider value={{ todoItems, setTodoItems }}>
      {children}
    </TodoItemsContext.Provider>
  );
};


export const TestContextProvider = ({ children }) => {
  return (
    <UserProvider>
      <TodoItemsProvider>
        <CountProvider>{children}</CountProvider>
      </TodoItemsProvider>
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