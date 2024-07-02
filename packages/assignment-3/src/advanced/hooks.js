import { depsEqual } from '../basic/utils';

export function createHooks(callback) {
  const states = [];
  const memos = [];
  let currentStateId = 0;
  let currentMemoId = 0;
  let requestAnimationFrameId = null;
  let isUpdating = false;

  const useState = (initState) => {
    const stateId = currentStateId;
    currentStateId++;

    if (states[stateId] === undefined) {
      states[stateId] = initState;
    }

    const setState = (newState) => {
      if (states[stateId] === newState) return;
      states[stateId] = newState;

      // 이미 업데이트가 예약되어 있다면 추가 예약 방지
      if (isUpdating) {
        return;
      }

      isUpdating = true;
      // 상태 변경을 다음 애니메이션 프레임에 동기화하여 UI 업데이트 스케줄링
      requestAnimationFrameId = requestAnimationFrame(() => {
        callback();
        isUpdating = false;
      });
    };

    return [states[stateId], setState];
  };

  const useMemo = (fn, refs) => {
    const memoId = currentMemoId;
    currentMemoId++;

    const cacheResult = memos[memoId];
    const hasDepsChanged = !cacheResult || !depsEqual(cacheResult.deps, refs);

    if (hasDepsChanged) {
      const value = fn();
      memos[memoId] = { value, deps: refs };
      return value;
    }

    return cacheResult.value;
  };

  const resetContext = () => {
    // 예약된 애니메이션 프레임 콜백 취소
    if (requestAnimationFrameId) {
      cancelAnimationFrame(requestAnimationFrameId);
      requestAnimationFrameId = null;
    }
    currentStateId = 0;
  };

  return { useState, useMemo, resetContext };
}
