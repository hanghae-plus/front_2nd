export function createHooks(callback) {
  // [ state, memo를 저장하기 위한 자료구조 ]
  const stateVal = {
    key: '',
    states: {},
  };

  const memoVal = {
    key: '',
    memos: {},
  };

  // [ useState ]
  const useState = (initState) => {
    stateVal.key = JSON.stringify(initState);
    const { key, states } = stateVal;

    if (!states[key]) states[key] = initState;

    const setState = (newState) => {
      if (newState === states[key]) return;
      states[key] = newState;
      callback();
    };

    return [states[key], setState];
  };

  // [ useMemo ]
  const useMemo = (fn, deps) => {
    memoVal.key = JSON.stringify(deps);
    const { key, memos } = memoVal;

    const resetAndReturn = () => {
      const value = fn();
      memos[key] = {
        value,
        deps,
      };
      return value;
    };

    if (!memos[key]) return resetAndReturn();

    if (deps.length > 0 && deps.some((dep, index) => dep !== memos[key].deps[index])) return resetAndReturn();

    return memos[key].value;
  };

  // [ useState, useMemo의 key값 초기화 ]
  // 내부 값 전체를 지우지 않는이유는 캐싱을 위함
  const resetContext = () => {
    stateVal.key = '';
    memoVal.key = '';
  }

  return { useState, useMemo, resetContext };
}