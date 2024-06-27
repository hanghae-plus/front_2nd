import { createContext, useContext, useReducer, useRef, useState } from "react";

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
// INFO: 컨텍스트를 분리하는 방법을 생각했으나, 컨텍스트가 더 많아질 경우를 생각해 useReducer를 사용해 해결

// /** 상태 타입 */
// interface State {
//   user: { name: string } | null;
//   todoItems: { id: number; content: string; completed: boolean }[];
//   count: number;
// }

// /** 액션 타입 */
// type Action =
//   | { type: "SET_USER"; payload: { name: string } | null }
//   | {
//       type: "SET_TODO_ITEMS";
//       payload: { id: number; content: string; completed: boolean }[];
//     }
//   | { type: "SET_COUNT"; payload: number };

// /** 리듀서 타입 */
// type Reducer = (state: State, action: Action) => State;

// /** provider prop 타입 */
// interface ProviderProps {
//   children: ReactNode;
// }

//

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

// INFO: state와 dispatch 중 하나만 사용하는 컴포넌트가 불필요하게 리렌더링 되지 않도록 분리 (현재 테스트 코드엔 없지만..)

/** 상태 값(state) 컨텍스트 */
// const StateContext = createContext<State | undefined>(undefined);
const StateContext = createContext(undefined);

/** 상태 값 변경 함수(dispatch) 컨텍스트 */
// const DispatchContext = createContext<Dispatch<Action> | undefined>(undefined);
const DispatchContext = createContext(undefined);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_TODO_ITEMS":
      return { ...state, todoItems: action.payload };
    case "SET_COUNT":
      return { ...state, count: action.payload };
    default:
      throw new Error(`Unhandled action type`);
  }
};

export const TestContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, textContextDefaultValue);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("There is no context!");
  }
  return context;
};

export const useDispatchContext = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error("There is no context!");
  }
  return context;
};

export const useUser = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const setUser = (user) => {
    console.log("here user!");
    return dispatch({ type: "SET_USER", payload: user });
  };
  return [state.user, setUser];
};

export const useTodoItems = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const setTodoItems = (items) =>
    dispatch({ type: "SET_TODO_ITEMS", payload: items });
  return [state.todoItems, setTodoItems];
};

export const useCounter = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const setCount = (count) => {
    console.log("here count...");
    return dispatch({ type: "SET_COUNT", payload: count });
  };
  return [state.count, setCount];
};

// #endregion
