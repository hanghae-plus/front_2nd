import { deepEquals } from '../../../assignment-2/src/basic/basic';

// state 불변성 유지
const createProxyState = (state) => {
  if (state === null || typeof state !== 'object') {
    return state;
  }
  return new Proxy(state, {
    set() {
      console.warn('setState를 사용해 주세요.');
      return true;
    },
    deleteProperty() {
      console.warn('setState를 사용해 주세요.');
      return true;
    },
  });
};

export function createHooks(callback) {
  //global 변수 정의
  const global = {
    state: [],
    stateIndex: 0,
    memo: [],
    memoIndex: 0,
    setStateScheduledId: -1,
  };

  const useState = (initState) => {
    const currentIndex = global.stateIndex;

    //리렌더링 시 저장된 state값 가져오기
    if (global.state[currentIndex] === undefined) {
      global.state[currentIndex] = createProxyState(initState);
    }
    global.stateIndex++;

    const setState = (newState) => {
      cancelAnimationFrame(global.setStateScheduledId);
      global.setStateScheduledId = requestAnimationFrame(() => {
        if (deepEquals(newState, global.state[currentIndex])) return;
        global.state[currentIndex] = createProxyState(newState);
        callback();
      });
    };

    return [global.state[currentIndex], setState];
  };

  /**
   *
   * @param {Function} fn
   * @param {Array} refs
   * @returns {*}
   */
  const useMemo = (fn, refs) => {
    const currentIndex = global.memoIndex;
    global.memoIndex++;

    //초기값 세팅
    if (global.memo[currentIndex] === undefined) {
      global.memo[currentIndex] = { value: fn(), refs };
    } else {
      const { refs: memoRefs } = global.memo[currentIndex];
      //의존성 배열이 바뀐게 있는지 확인
      const isChanged = refs.some((v, i) => !deepEquals(v, memoRefs[i]));

      if (isChanged) global.memo[currentIndex] = { value: fn(), refs };
    }

    return global.memo[currentIndex].value;
  };

  const resetContext = () => {
    global.stateIndex = 0;
    global.memoIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
