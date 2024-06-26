import { createContext, useContext, useState } from "react";

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
  return useState(initValue);
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

const useTestContext = () => {
  return useContext(TestContext);
};

export const useUser = () => {
  const { value, setValue } = useTestContext();

  return [value.user, (user) => setValue({ ...value, user })];
};

export const useCounter = () => {
  const { value, setValue } = useTestContext();

  return [value.count, (count) => setValue({ ...value, count })];
};

export const useTodoItems = () => {
  const { value, setValue } = useTestContext();

  return [value.todoItems, (todoItems) => setValue({ ...value, todoItems })];
};
