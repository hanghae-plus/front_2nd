import { createContext, useContext, useState } from "react";
import {deepEquals} from "../basic/basic.js";


/* [ 데이터 캐싱 ] */
const cache = new Map();
const checkCache = (key, func) => {
  if (!cache.has(key)) {
    const result = func();
    cache.set(key, result);
  }

  return cache.get(key);
}
export const memo1 = (fn) => checkCache(fn, fn);
export const memo2 = (fn, arr) => checkCache(`${fn.toString()}_${JSON.stringify(arr)}`, fn);


// [useState를 이용한 캐싱]
export const useCustomState = (initValue) => {
  const [state, setState] = useState(initValue);
  const setCustomState = (val) => {
    if (!deepEquals(state, val)) setState(val)
  };
  return [state, setCustomState];
}


// const textContextDefaultValue = {
//   user: null,
//   todoItems: [],
//   count: 0,
// };


// export const TestContext = createContext({
//   value: textContextDefaultValue,
//   setValue: () => null,
// });

const userContext = createContext({});
const todoItemsContext = createContext({});
const countContext = createContext({});


export const TestContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [todoItems, setTodoItems] = useState([
    { id: 1, content: 'PT 받기', completed: false },
    { id: 2, content: '회사일', completed: false },
    { id: 3, content: '멘토링', completed: false },
    { id: 4, content: '과제 만들기', completed: false },
    { id: 5, content: '발제자료 만들기', completed: false },
    { id: 6, content: '고양이 밥주기', completed: false },
  ]);
  const [count, setCount] = useState(0);


  return (
    <userContext.Provider value={{ user, setUser }}>
      <todoItemsContext.Provider value={{ todoItems, setTodoItems }}>
        <countContext.Provider value={{ count, setCount }}>
          {children}
        </countContext.Provider>
      </todoItemsContext.Provider>
    </userContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(userContext);
  const { user, setUser } = context;
  return [user, setUser];
}

export const useCounter = () => {
  const context = useContext(countContext);
  const { count, setCount } = context;
  return [count, setCount];
}

export const useTodoItems = () => {
  const context = useContext(todoItemsContext);
  const { count, setCount } = context;
  return [count, setCount];
}
