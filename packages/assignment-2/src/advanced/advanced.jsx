import { createContext, useContext, useState } from "react";
import { deepEquals } from "../basic/basic";

const map = new Map();
const dependencyMap = new Map();

/**map에 함수 명 Mapping하여 있는 값이면 기존 값 반환하는 함수 */
export const memo1 = (fn) => {
  const key = fn.name;

  if (map.get(key)) {
    return map.get(key);
  }

  map.set(key, fn());

  return map.get(key);
};

/**의존성 배열?에 따라 값 반환하는 함수 */
export const memo2 = (fn, dependencyArr) => {
  const mapKey = fn.name;

  const currentDependency = dependencyMap.get(mapKey);

  /**
   * 기존 map의 의존성 배열 요소들과 현재 들어온 의존성 배열 요소가
   * 하나라도 바뀌었는지 체크
   */
  const isNotChange = currentDependency?.every(
    (ele, idx) => ele === dependencyArr[idx]
  );

  //바뀌지 않고 값이 이미 있다면 기존 값 리턴
  if (map.get(mapKey) && isNotChange) {
    return map.get(mapKey);
  }

  //아니라면 새로 값을 set
  map.set(mapKey, fn());
  dependencyMap.set(mapKey, dependencyArr);

  return map.get(mapKey);
};

export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);

  const setValue = (newValue) => {
    //기존 값과 새로 들어온 값을 깊은 비교를 해 다르다면 리렌더링
    if (!deepEquals(state, newValue)) {
      return setState(newValue);
    }
  };

  return [state, setValue];
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

export const TestContextProvider = ({ children }) => {
  const [value, setValue] = useState(textContextDefaultValue);

  return (
    <TestContext.Provider value={{ value, setValue }}>
      {children}
    </TestContext.Provider>
  );
};

/**
 * useContext를 구독하고 있는 컴포넌트는 그 값이 변경됨에 따라,
 * 리렌더링이 되기때문에 실제 그 값이 사용되는 컴포넌트만 리렌더링하게
 * 해주어야함.
 * index를 key로 접근해 보려 했으나.. textContextDefaultValue에
 * 정의된 key를 매핑해야 실제 어느 컴포넌트에서 사용되는지 확인이 가능함.
 */
const useTestContext = (key) => {
  // console.log(key);
  // console.log(useContext(TestContext).value[key]);
  const { value, setValue } = useContext(TestContext);

  return { value, setValue };
};

export const useUser = () => {
  const { value, setValue } = useTestContext("user");

  const setNewContext = (user) => {
    if (!value["user"]) {
      return setValue({ ...value, user });
    }

    if (deepEquals(value["user"], user)) {
      return setValue({ ...value, user });
    }

    return setValue(value);
  };

  // return [value.user, (user) => setValue({ ...value, user })];
  return [value.user, (user) => setNewContext(user)];
};

export const useCounter = () => {
  const { value, setValue } = useTestContext("counter");

  const setNewContext = (count) => {
    if (!value["user"]) {
      return setValue({ ...value, count });
    }

    if (deepEquals(value["count"], count)) {
      return setValue({ ...value, count });
    }

    return setValue(value);
  };

  return [value.count, (count) => setNewContext(count)];
};

export const useTodoItems = () => {
  const { value, setValue } = useTestContext("todoItems");

  return [value.todoItems, (todoItems) => setValue({ ...value, todoItems })];
};
