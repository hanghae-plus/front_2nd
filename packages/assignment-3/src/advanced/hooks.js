import deepEqual from "../util/deepEqual";

export function createHooks(callback) {
  let stateIndex = 0;
  const stateStoreArray = [];

  let timerKey;

  function _callback() {
    resetContext();
    setTimeout(() => {
      callback();
    }, 0);
  }
  /**
   * setState가 여러번 호출되면 redering 작업을 Web API에 줄을 세우고
   * 이전 비동기 작업을 지운다. 때문에 이벤트 루프가 콜스택이 비었을 때 '마지막 남은 비동기 작업만' 올려준다.
   */
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

      // debouncing
      clearTimeout(timerKey);
      timerKey = setTimeout(_callback, 0);
    };
    stateIndex += 1;
    return [stateStoreArray[snapshot], setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    stateIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
