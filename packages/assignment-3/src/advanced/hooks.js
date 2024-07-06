export function createHooks(callback) {
  let state = []; // 상태를 저장
  let setters = []; // 상태를 변경하는 setter 함수들을 저장
  let currentIdx = 0; // 현재 상태의 인덱스
  let pendingState = []; // 다음 상태를 저장
  let isFramePending = false; // requestAnimationFrame 호출 여부

  const runCallback = () => {
    currentIdx = 0;
    isFramePending = false;
    callback();
  };

  const useState = (initState) => {
    const idx = currentIdx;

    if (state.length === idx) {
      state.push(initState);
      pendingState.push(initState);
    }

    const setState = (newState) => {
      pendingState[idx] = newState;

      // 프레임 대기 상태가 아니면 requestAnimationFrame 호출
      if (!isFramePending) {
        isFramePending = true;
        requestAnimationFrame(() => {
          for (let i = 0; i < pendingState.length; i++) {
            state[i] = pendingState[i];
          }
          runCallback();
        });
      }
    };

    if (setters.length === idx) {
      setters.push(setState);
    }

    currentIdx++;
    return [state[idx], setters[idx]];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {};

  return { useState, useMemo, resetContext };
}
