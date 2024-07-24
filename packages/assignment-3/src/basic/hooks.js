import deepEqual from "../util/deepEqual";

export function createHooks(callback) {
  /**
   * useState
   * 하나의 useState 함수로 여러 state를 관리하기 때문에, 상태를 저장할
   * 저장소가 필요하다.
   *
   * 초기값은 렌더링시 초기화에 쓰고 쓰이지 않는다.
   */
  let stateIndex = 0;
  const stateStoreArray = [];

  // setState가 변경시킬 상태의 snapshot이 필요
  const useState = (initState) => {
    const snapshot = stateIndex;

    if (stateStoreArray[snapshot] === undefined) {
      stateStoreArray.push(initState);
    }

    const setState = (newValue) => {
      if (deepEqual(stateStoreArray[snapshot], newValue)) {
        return;
      }
      stateStoreArray[snapshot] = newValue;
      callback();
    };
    stateIndex += 1;
    return [stateStoreArray[snapshot], setState];
  };

  /**
   * useState와 저장 방식은 동일한 메커니즘
   */
  let memoIndex = 0;
  const memoStoreArray = [];

  const useMemo = (fn, refs) => {
    const snapshot = memoIndex;

    let { memoizedValue, lastDependencies } = memoStoreArray[snapshot] || {};

    // 의존성이 변경되었을 경우 함수를 실행하고 결과를 저장
    if (!deepEqual(refs, lastDependencies)) {
      memoizedValue = fn();
      lastDependencies = refs;
    }

    memoStoreArray[snapshot] = { memoizedValue, lastDependencies };

    memoIndex += 1;

    return memoizedValue;
  };

  // hook이 순서대로 실행되도록 보장
  const resetContext = () => {
    stateIndex = 0;
    memoIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
