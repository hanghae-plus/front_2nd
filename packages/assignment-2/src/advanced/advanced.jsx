import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { deepEquals } from "../basic/basic";  // deepEquals 함수 import
const cache = new Map(); // 캐시를 위한 Map 객체 생성

export const memo1 = (fn) => {
  // 캐시 키를 fn.toString()을 사용하여 생성
  const key = fn.toString();
  if (cache.has(key)) {
    // 값이 캐시에 존재하면 캐시된 인스턴스 반환
    return cache.get(key);
  } else {
    // 값이 캐시에 존재하지 않으면 새로운 인스턴스 생성
    const result = fn();
    cache.set(key, result);
    return result;
  }
};

export const memo2 = (fn, args) => {
  // 캐시 키를 fn.toString()과 args를 사용하여 생성
  const key = fn.toString() + JSON.stringify(args);
  if (cache.has(key)) {
    return cache.get(key);
  } else {
    const result = fn();
    cache.set(key, result);
    return result;
  }
};

// useCustomState 훅: deepEquals를 사용하여 상태 변경을 조건부로 수행
export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);

  const customSetState = (newState) => {
    // deepEquals 이용하여 비교
    if (!deepEquals(state, newState)) {
      setState(newState);
    }
  };

  return [state, customSetState];
};

// 초기 컨텍스트 값 정의
const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

// 컨텍스트 생성
export const TestContext = createContext({
  value: textContextDefaultValue,
  setValue: () => null,
});

// 컨텍스트 제공자 컴포넌트
export const TestContextProvider = ({ children }) => {
  const ref = useRef(textContextDefaultValue);
  const setValue = useCallback(
    (key, newValue) => {
      ref.current = { ...ref.current, [key]: newValue };
    },
    [ref]
  );

  return (
    <TestContext.Provider value={{ value: ref.current, setValue }}>
      {children}
    </TestContext.Provider>
  );
};

// 컨텍스트 값을 사용하는 커스텀 훅
const useTestContext = (key) => {
  const { value, setValue } = useContext(TestContext);
  const [state, setState] = useState(value[key]); // 초기 상태 설정

  useEffect(() => {
    setValue(key, state); // 상태가 변경될 때마다 컨텍스트 값 업데이트
  }, [state]);

  return [state, setState];
};

// 특정 컨텍스트 값을 사용하는 커스텀 훅들
export const useUser = () => useTestContext("user");

export const useCounter = () => useTestContext("count");

export const useTodoItems = () => useTestContext("todoItems");
