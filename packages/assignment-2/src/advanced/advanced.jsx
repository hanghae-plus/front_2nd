import { createContext, useContext, useState } from "react";

/**
 * 의존성배열 없이, 실행 결과값만을 메모이제이션하는 함수
 * @param {function} fn
 * @returns {*}
 */
const memo1Map = new Map();

export const memo1 = (fn) => {
  const fnToString = fn.toString();
  if (!memo1Map.has(fnToString)) {
    memo1Map.set(fnToString, fn());
  }
  return memo1Map.get(fnToString);
};

const memo2Map = new Map();
const memo2DependenciesMap = new Map();

/**
 * @param {function} fn
 * @param {array} dependencies
 * @returns {*}
 */
export const memo2 = (fn, dependencies = []) => {
  const fnToString = fn.toString();
  const dependenciesString = JSON.stringify(dependencies.toSorted());

  if (!memo2Map.has(fnToString)) {
    memo2Map.set(fnToString, fn());
    memo2DependenciesMap.set(fnToString, dependenciesString);
  }

  // 의존성 배열의 값 중 어느 하나가 변경되었을 경우 다시 계산 - 단, 순서는 무시
  if (
    memo2DependenciesMap.get(fnToString) !==
    JSON.stringify(dependencies.toSorted())
  ) {
    memo2Map.set(fnToString, fn());
    memo2DependenciesMap.set(
      fnToString,
      JSON.stringify(dependencies.toSorted())
    );
  }

  return memo2Map.get(fnToString);
};

export const useCustomState = (initValue) => {
  return useState(initValue);
}

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
  )
}

const useTestContext = () => {
  return useContext(TestContext);
}

export const useUser = () => {
  const { value, setValue } = useTestContext();

  return [
    value.user,
    (user) => setValue({ ...value, user })
  ];
}

export const useCounter = () => {
  const { value, setValue } = useTestContext();

  return [
    value.count,
    (count) => setValue({ ...value, count })
  ];
}

export const useTodoItems = () => {
  const { value, setValue } = useTestContext();

  return [
    value.todoItems,
    (todoItems) => setValue({ ...value, todoItems })
  ];
}
