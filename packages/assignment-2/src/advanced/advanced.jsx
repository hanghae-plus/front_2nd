import { createContext, useContext, useRef, useState } from "react";

// #region Q1, Q2) 메모
/** 함수 객체를 키로 하여 함수 실행 결과를 저장하는 맵
 *
 * @link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 */
const cache = new WeakMap();

// type Fn = () => unknown;

// type Memo1 = (fn: Fn) => unknown;
// type Memo2 = (fn: Fn, dependencies: unknown[]) => unknown;

/**
 * memo1
 *
 * 함수가 달라지지 않으면 새로 생성하지 않음
 */
export const memo1 = (fn) => {
  if (!cache.has(fn)) {
    cache.set(fn, fn());
  }

  return cache.get(fn);
};

/**
 * memo2
 *
 * 함수 또는 의존성 배열이 달라지지 않으면 새로 생성하지 않음
 */
export const memo2 = (fn, dependencies) => {
  if (!cache.has(fn)) {
    cache.set(fn, { result: fn(), dependencies });
  }

  const cached = cache.get(fn);
  const isSame =
    dependencies.length === cached.dependencies.length &&
    dependencies.every((newDep, i) => newDep === cached.dependencies[i]);

  if (!isSame) {
    const result = fn();
    cache.set(fn, { result, dependencies });
    return result;
  }

  return cached.result;
};
// #endregion

// #region Q3) 커스텀 상태
export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);
  const cacheRef = useRef(JSON.stringify(initValue));

  /** 커스텀 상태 변경 함수 */
  const setCustomState = (newState) => {
    const newStateStr = JSON.stringify(newState);

    // 캐싱 되어 있는 상태와 새로운 상태가 같다면
    if (cacheRef.current === newStateStr) {
      return;
    }

    // 상태가 다르다면
    cacheRef.current = newStateStr;
    setState(newState);
  };

  return [state, setCustomState];
};
// #endregion

// #region Q4) 전역 상태 참조
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
// #endregion
