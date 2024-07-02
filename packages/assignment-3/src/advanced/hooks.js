export function createHooks(callback) {
  const states = [];
  let currentStateId = 0;

  const useState = (initState) => {
    const stateId = currentStateId;
    currentStateId++;

    if (states[stateId] === undefined) {
      states[stateId] = initState;
    }

    const setState = (newState) => {
      if (states[stateId] === newState) return;
      states[stateId] = newState;

      // 상태 변경을 다음 애니메이션 프레임에 동기화하여 UI 업데이트
      requestAnimationFrame(() => {
        callback();
      });
    };

    return [states[stateId], setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {};

  return { useState, useMemo, resetContext };
}
