import { createContext, useContext, useState } from "react";

const memoCache = new Map();

export const memo1 = (fn) => {
    // 함수의 소스코드를 문자열로 변환하여 동일한 함수 정의를 가진 함수에 대해 동일한 키를 생성
    //"() => Array.from({ length: a }).map((_, k) => k + 1)"
    const key = fn.toString();
    //캐시값에 해당 키가 있으면 캐시값을 반환
    if (memoCache.has(key)) {
        return memoCache.get(key);
    }
    //캐시값에 해당 키가 없으면 함수를 실행하고 결과값을 캐시에 저장
    const result = fn();
    memoCache.set(key, result);
    return result;
};

export const memo2 = (fn) => fn();

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

    return <TestContext.Provider value={{ value, setValue }}>{children}</TestContext.Provider>;
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
