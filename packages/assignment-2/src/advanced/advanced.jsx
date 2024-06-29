import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

// cache라는 Map 객체를 생성하여 함수의 결과를 저장 (키-값 쌍을 저장)
const memo1Cache = new Map();

export const memo1 = (fn) => {
  // 함수가 이미 호출되었는지 확인
  if (memo1Cache.has(fn)) {
    return memo1Cache.get(fn);
  }
  const result = fn();
  // 함수의 결과를 캐시에 저장
  memo1Cache.set(fn, result);
  return result;
};

// memo1과 비슷하지만, deps라는 배열을 추가로 받아서 이 배열의 값이 변경되었을 때만 캐시를 사용하지 않음
const memo2Cache = new Map();

export const memo2 = (fn, deps) => {
  // deps 배열을 문자열로 변환하여 키로 사용
  const key = deps.join(",");
  const entry = memo2Cache.get(key);
  if (entry && deps.every((dep, index) => Object.is(dep, entry.deps[index]))) {
    return entry.result;
  }
  const result = fn();
  memo2Cache.set(key, { deps, result });
  return result;
};

// 새 값이 이전 값과 다를 때만 상태를 업데이트
export const useCustomState = (initValue) => {
  const [value, setValue] = useState(initValue);
  const prevValueRef = useRef();

  const setCustomValue = (newValue) => {
    if (JSON.stringify(prevValueRef.current) !== JSON.stringify(newValue)) {
      setValue(newValue);
      prevValueRef.current = newValue;
    }
  };

  if (!prevValueRef.current) {
    prevValueRef.current = initValue;
  }

  return [value, setCustomValue];
};

// 새로운 Context 생성
// 한 상태의 변경이 다른 상태를 사용하는 컴포넌트에 영향을 주지 않도록 분리
const UserContext = createContext();
const CounterContext = createContext();
const TodoItemsContext = createContext();

export const TestContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [todoItems, setTodoItems] = useState([]);

  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const counterValue = useMemo(() => ({ count, setCount }), [count]);
  // todoItems 배열이 변경될 때만 컴포넌트가 리렌더링
  const todoItemsValue = useMemo(
    () => ({ todoItems, setTodoItems }),
    [todoItems]
  );

  return (
    <UserContext.Provider value={userValue}>
      <CounterContext.Provider value={counterValue}>
        <TodoItemsContext.Provider value={todoItemsValue}>
          {children}
        </TodoItemsContext.Provider>
      </CounterContext.Provider>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);
  // 메모제이션
  const setUserCallback = useCallback(
    (newUser) => {
      setUser((prevUser) => (prevUser !== newUser ? newUser : prevUser));
    },
    [setUser]
  );

  return [user, setUserCallback];
};

export const useCounter = () => {
  const { count, setCount } = useContext(CounterContext);
  // 메모이제이션
  const setCountCallback = useCallback(
    (newCount) => {
      setCount((prevCount) => (prevCount !== newCount ? newCount : prevCount));
    },
    [setCount]
  );

  return [count, setCountCallback];
};

export const useTodoItems = () => {
  const { todoItems, setTodoItems } = useContext(TodoItemsContext);
  // stringify로 깊은 비교
  const setTodoItemsCallback = useCallback(
    (newTodoItems) => {
      setTodoItems((prevTodoItems) =>
        JSON.stringify(prevTodoItems) !== JSON.stringify(newTodoItems)
          ? newTodoItems
          : prevTodoItems
      );
    },
    [setTodoItems]
  );

  return [todoItems, setTodoItemsCallback];
};
