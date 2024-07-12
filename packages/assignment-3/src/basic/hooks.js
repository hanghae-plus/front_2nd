export function createHooks(callback) {
  const useState = (initState) => {
    let state = initState;

    //왜 resetContext가 작동안하는지 모르겠어요..

    const setState = (newState) => {
      if (state !== newState) {
        state = newState;
        resetContext();
        callback();
      }
    };

    return [state, setState];
  };
  //fn은 캐시하려는 값을 계산하는함수

  const useMemo = (fn, refs) => {
    return fn();
  };

  let resetContext = () => {};

  return { useState, useMemo, resetContext };
}
