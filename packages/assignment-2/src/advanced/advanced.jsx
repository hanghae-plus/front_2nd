import { createContext, useContext, useState } from "react";
import { deepEquals } from "../basic/basic";

//함수가 사용하는 캐시 객체를 Map 객체를 사용해서 설정
const memo1Cache = new Map();
export const memo1 = (fn) => {
  //캐시 객체에 fn 함수의 결과가 이미 저장되어 있는지 확인
  if (memo1Cache.has(fn)) {
    //있다면 캐시에서 fn 함수의 결과를 가져와 반환
    return memo1Cache.get(fn);
  }

  //fn 함수 실행하여 결과를 얻음
  const result = fn();

  //fn 함수 결과를 캐시에 저장
  memo1Cache.set(fn, result);

  // fn 함수 결과를 반환
  return result;
};

const memo2Cache = new Map(); //WeakMap() => 참조한 애들만 가능 //전역변수보다는 클로저 이용해서 안에서 사용하는게좋음~
//Map하면 안되는 이유: fn1.tostring() === fn2.toString() 일 때 다르게 나올 수 있음
export const memo2 = (fn, array) => {
  //인수 배열을 JSON 문자열로 변환하여 고유한 키로 사용
  //인수가 [a] 배열이므로 배열의 참조가 다르면 같은 배열 내용이라도 다른 키로 인식
  //JSON.stringify(args)와 같은 문자열 변환을 통해 키를 만드는 것이 필요
  const key = JSON.stringify(array);

  //캐시에서 해당 키가 있는지 확인
  if (memo2Cache.has(key)) {
    //캐시에 저장된 결과가 있으면 반환
    return memo2Cache.get(key);
  }

  //없다면 함수 실행 결과 result에 담기 (바뀐 값 반영) //이렇게 하는게 맞을까요..
  const result = fn(...array);

  //결과를 캐시에 저장
  memo2Cache.set(key, result);

  return result;
};

export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);

  const customSetState = (newState) => {
    // 기존 상태와 새로운 상태를 깊이 비교하여 다를 경우에만 상태를 업데이트
    if (!deepEquals(state, newState)) {
      setState(newState);
    }
  };

  return [state, customSetState];
};

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

const UserContext = createContext(null);
const CountContext = createContext(null);
const TodoItemsContext = createContext(null);

// export const TestContext = createContext({
//   value: textContextDefaultValue,
//   setValue: () => null,
// });

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(textContextDefaultValue.user);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const TodoProvider = ({ children }) => {
  const [todoItems, setTodoItems] = useState(textContextDefaultValue.todoItems);
  return (
    <TodoItemsContext.Provider value={{ todoItems, setTodoItems }}>
      {children}
    </TodoItemsContext.Provider>
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

// const useTestContext = () => {
//   return useContext(TestContext);
// };

export const TestContextProvider = ({ children }) => {
  return (
    <UserProvider>
      <TodoProvider>
        <CountProvider>{children}</CountProvider>
      </TodoProvider>
    </UserProvider>
  );
};

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
