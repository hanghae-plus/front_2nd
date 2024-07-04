// [출제 의도]
// 여러번 setState가 호출 되더라도 마지막 상태만 반영
export function createHooks(callback) {
  let states = [];
  let currentIndex = 0;
  // 플래그를 통해 관리
  let pendingUpdate = false;

  const useState = (initState) => {
    const stateIndex = currentIndex;
    if (states.length === stateIndex) {
      states.push(initState);
    }

    const state = states[stateIndex];

    const setState = (newState) => {
      if (states[stateIndex] === newState) {
        return;
      }
      states[stateIndex] = newState;

      // queueMicrotask
      // 현재 자바스크립트 작업이 완료된 직후, 그러나 다음 이벤트 루프의 태스크 전에 실행
      // 짧고 빠른 비동기 작업을 위해 설계
      pendingUpdate = true;

      queueMicrotask(() => {
        if (pendingUpdate) {
          pendingUpdate = false;
          callback();
        }
      });
    };

    currentIndex++;
    return [state, setState];
  };

  const areArraysEqual = (arr1, arr2) => {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };

  const useMemo = (fn, deps) => {
    const memoIndex = currentIndex++;
    const lastMemo = memos[memoIndex];

    if (!lastMemo || !deps || !areArraysEqual(lastMemo.deps, deps)) {
      const newValue = fn();
      memos[memoIndex] = { value: newValue, deps };

      return newValue;
    }

    return lastMemo.value;
  };

  const resetContext = () => {
    currentIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
