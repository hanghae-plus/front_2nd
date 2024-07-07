import { shallowEquals } from '../../../assignment-2/src/basic/basic';

export function createHooks(callback) {
  let states = [];
  let key = 0;
  const useState = (initState) => {
    const currentKey = key;
    if (currentKey === states.length) {
      states[currentKey] = initState;
    }

    key++;

    const setState = (newState) => {
      if (shallowEquals(states[currentKey], newState)) return;
      states[currentKey] = newState;
      callback();
    };
    return [states[currentKey], setState];
  };

  let memoKey = 0;
  const memos = [];

  const useMemo = (fn, refs) => {
    const currentKey = memoKey;
    const memo = memos[currentKey];

    memoKey++;

    const resetAndReturn = () => {
      const value = fn();
      memos[currentKey] = { value, refs };
      return value;
    };

    if (!memo) return resetAndReturn();

    if (refs.length > 0 && memo.refs.find((v, k) => !shallowEquals(v, refs[k])))
      return resetAndReturn();

    return memo.value;
  };

  // 코치님 코드
  // const useMemo = (fn, refs) => {
  //   const { current, memos } = memoContext;
  //   memoContext.current += 1;

  //   const memo = memos[current];

  //   const resetAndReturn = () => {
  //     const value = fn();
  //     memos[current] = {
  //       value,
  //       refs,
  //     };
  //     return value;
  //   };

  //   if (!memo) {
  //     return resetAndReturn();
  //   }

  //   if (refs.length > 0 && memo.refs.find((v, k) => v !== refs[k])) {
  //     return resetAndReturn();
  //   }
  //   return memo.value;
  // };

  const resetContext = () => {
    key = 0;
    memoKey = 0;
  };

  return { useState, useMemo, resetContext };
}
