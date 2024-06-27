import { createContext, useContext, useState } from "react";

/**
 * (즉시실행함수 + 클로저)
 * 즉시 실행함수(IIFE)는 정의됨과 동시에 실행되는 함수
 * 외부함수에 있는 cache는 즉시실행함수로 인해 정의되었을 때 곧바로 실행되며 생성되고
 * 이후에는 실행되지 않으므로 주소값이 바뀌지 않음.(불변)
 * 실행된 결과값인 내부함수 return function(fn){...}이 memo1에 할당 된다.
 * cache는 내부함수 function(fn){...}에서 참조하고 있으므로 가비지 컬렉터에 의해 사라지지 않고 유지됨.
 * memo1이 여러번 호출되어도 cache 주소값도 바뀌지 않음
 * memo1에 파라미터로 전달된 fn이 function(fn){...} 함수에 fn으로 전달되어 함수가 실행된다.
 */
/**
 * WeakMap WeakSet
 * 일반 Map의 경우, key로 객체를 할당하면 주소값이 복사되어 들어간다.
 * 따라서 해당 객체를 원래 가지고 있던 변수를 null로 초기화 해도 Map이 해당 객체 주소값을
 * 바라보고 있으므로 가비지 컬렉터에 의해 초기화 되지 않음.
 * 하지만 보통 원래 객체를 할당했던 변수를 초기화 한다는 것은, 해당 객체에 대한 map, set 정보가
 * 필요없어졌다는 뜻이므로 가비지 컬렉터가 초기화 하지 않는 것은 메모리상 문제가 될 수 있다.
 * WeakMap, WeakSet의 경우, map, set과 다르게 key로 원시값을 할당할 수 없고 객체만 할당가능
 * 다만 map, set과 다르게 key로 사용하는 객체를 아무도 참조하지 않는다면, 
 * 가비지 컬렉터가 해당 객체 주소값을 지워버림(key가 사라짐)
 * 가비지 컬렉터가 언제 지울지 모르므로 map에서 제공되는 keys, values, entries를 
 * weakMap(set)에서는 호출할 수 없음.
 */
export const memo1 = (function() {
  const cache = new WeakMap();
  return function (fn) {
    if (!cache.has(fn)) {
      const result = fn();
      cache.set(fn, result);
    }
    return cache.get(fn);
  }
})();

/**
 * 두번째 파라미터로 오는 [a]값이 달라지면? 다른 값을 얻고,
 * 같을 경우, 같은 값을 얻어야한다.
 * 따라서 객체 fn을 key로 같는 WeakMap을 만들고,
 * 각각에 Map을 넣어서, array를 string으로 바꾼 값을 key로한 결과값을 담는다.
 */
export const memo2 = (function () {
  const cache = new WeakMap();

  return (fn, array) => {
    if (!cache.has(fn)) {
      cache.set(fn, new Map());
    }
    const key = `${array}`

    const fnMap = cache.get(fn);
    if (!fnMap.has(key)) {
      fnMap.set(key, fn());
    }
    return fnMap.get(key);
  }
})();

/**
 * 값이 기존state값과 않았다면 리렌더링이 일어나지 말아야함.(obj, arr)
 * 테스트케이스 통과를 위해 deep비교할 필요가 없으므로 shallowEquals로 비교함.
 * @param {*} initState 
 * @returns 
 */
export const useCustomState = (initState) => {
  const [state, setState] = useState(initState);

  const setCustomState = (changedState) => {
    let isStateChanged;
    //if(changedState instanceof Array)
    if (Array.isArray(changedState)) {
      isStateChanged = JSON.stringify(state) !== JSON.stringify(changedState);
    }else{
      isStateChanged = Object
        .entries(state)
        .some(([key, value]) => changedState[key] !== value);
    }
    if (!isStateChanged) return;

    setState(changedState);
  };

  return [state, setCustomState];
};



export const UserValueContext = createContext(null);
export const UserActionContext = createContext(() => null);
export const TodoItemValueContext = createContext([]);
export const TodoItemActionContext = createContext(() => null);
export const CountValueContext = createContext(0);
export const CountActionContext = createContext(() => null);


export const TestContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [todoItems, setTodoItems] = useState([]);
  const [count, setCount] = useState(0);

  return (
    <UserValueContext.Provider value={user}>
      <UserActionContext.Provider value={setUser}>
        <TodoItemValueContext.Provider value={todoItems}>
          <TodoItemActionContext.Provider value={setTodoItems}>
            <CountValueContext.Provider value={count}>
              <CountActionContext.Provider value={setCount}>
                {children}
              </CountActionContext.Provider>
            </CountValueContext.Provider>
          </TodoItemActionContext.Provider>
        </TodoItemValueContext.Provider>
      </UserActionContext.Provider>
    </UserValueContext.Provider>
  )
}


export const useUser = () => {
  const user = useContext(UserValueContext);
  const setUser = useContext(UserActionContext);

  return [
    user,
    (user) => setUser(user)
  ];
}

export const useCounter = () => {
  const count = useContext(CountValueContext);
  const setCount = useContext(CountActionContext);

  return [
    count,
    (count) => setCount(count)
  ];
}

export const useTodoItems = () => {
  const todoItems = useContext(TodoItemValueContext);
  const setTodoItems = useContext(TodoItemActionContext);

  return [
    todoItems,
    (todoItems) => setTodoItems(todoItems)
  ];
}
