import { createContext, useContext, useState } from "react";
import { deepEquals } from "../basic/basic";

const memo1_record = new Map();

export const memo1 = (fn) => {
  // 테스트 코드를 보니 함수결과값이 참조형으로 === 비교시 false가 되는데
  // memo1 로 랩핑할 경우 ture가 되고 있다.
  // 이 말은 함수결과값을 어딘가에 담아두었다가 동일한 함수 호출 시 담아둔 것을 다시 빼쓰는 것.
  // 키 값은 함수인데 일반 object는 키값에 객체를 넣을 수 없다.
  // 참고 : https://maxkim-j.github.io/posts/js-map/
  // test code의 18-19라인은 a의 값을 변경했을때 memo1로 감싸지 않으면 변경된 a가 적용되서 length가 1이지만
  // memo1로 감쌀경우 저장한 곳에서 빼오기 때문에 a값이 변경되지 않는다.
  const key = fn;
  if (memo1_record.has(key)) {
    return memo1_record.get(key);
  }
  const result = fn();
  memo1_record.set(key, result);
  return result;
};


const memo2_record = new Map();

export const memo2 = (fn, arg) => {
  // 앞에 내용과 비슷하지만 함수외에 두번째 매개변수가 바뀌면 매개변수로 받은 함수를 다시 실행해야한다.
  // 키 값의 조건이 함수명 뿐만 아니라 두번째 매개변수도 들어가야해서 object로 선언했다.
  // object 경우 참조형으로 key의 일치 여부확인에서 같아도 다른 것으로 인식하니 string화 해주었다.
  const key = JSON.stringify({'fun':fn, 'arg':arg});
  if (memo2_record.has(key)) {
    return memo2_record.get(key);
  }
  const result = fn();
  memo2_record.set(key, result);
  return result;
}



export const useCustomState = (initValue) => {
  // 테스트 코드에서 컴포넌트를 클릭하면 setState가 실행되서 state가 변경되었다고 인지가 된다.
  // 초기 값을 저장해 둔 다음 setState를 하게 되면 저장한 값과 비교해서 변경이 있는지 판단해야한다.
  // 컴포넌트 내에서 setState 함수의 동작을 변경하기 위해 여기에서 setState를 만들어서 return 시켜준다
  const [ initState , setCustomState ] = useState(initValue);

  const checkChangeValue = (value) =>{
    if (!deepEquals(initState, value)){
      setCustomState(value)
    }
  }
  return [initState, checkChangeValue];
}

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

// UserContext 생성
export const UserContext = createContext({
  user: null,
  setUser: () => {},
});

// TodoContext 생성
export const TodoContext = createContext({
  todoItems: [],
  setTodoItems: () => {},
});

export const TestContext = createContext({
  // createContext를 통해 전역 상태를 공유할 수 있는 컨텍스트 객체를 생성
  // User, Counter, TodoItems 컴포넌트가 TestContext.Provider에 의해 textContextDefaultValue가 공유된다.

  value: textContextDefaultValue,
  setValue: () => null,
});

export const TestContextProvider = ({ children }) => {
  // 공유받은 textContextDefaultValue 에서 변경이 일어나면 useState가 인지하고
  // TestContectProvider를 렌더링한다.
  // 이때 children에 User, Counter, TodoItems 컴포넌트가 존재하기 때문에 같이 렌더링 된다.
 
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