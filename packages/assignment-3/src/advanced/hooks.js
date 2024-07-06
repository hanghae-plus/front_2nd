import { deepEquals } from "../../../assignment-2/src/basic/basic.js";

export function createHooks(callback) {
  let hookStates = [];
  let hookIndex = 0;
  let nextCallback = null;

  function useState(initialValue) {
    const currentIndex = hookIndex;
    if (!hookStates[currentIndex]) {
      hookStates[currentIndex] = initialValue;
    }

    hookIndex++;

    const setState = (newValue) => {
      if (deepEquals(hookStates[currentIndex], newValue)) return;

      // 매번 콜백을 즉시 실행 ==>> 프레임 이후에 콜백 실행으로 변경.
      // >> 비동기적으로 상태 업데이트를 수행하도록 수정
      if (!nextCallback) {
        nextCallback = requestAnimationFrame(() => {
          callback();
          nextCallback = null;
        });
      }
      hookStates[currentIndex] = newValue;
    };

    return [hookStates[currentIndex], setState];
  }

  const cachedDependencies = [];
  const useMemo = (fn, refs) => {
    const currentIndex = hookIndex;

    // 의존성 배열이 변경되지 않은 경우 이전 메모이제이션된 값을 반환
    if (deepEquals(cachedDependencies[currentIndex], refs)) {
      return hookStates[currentIndex];
    }

    cachedDependencies[currentIndex] = refs;

    const result = fn();
    hookStates[currentIndex] = result;

    hookIndex++;

    return result;
  };

  // 훅의 콜백이 실행되기 전에 컨텍스트를 초기화
  const resetContext = () => {
    hookIndex = 0; // 호출마다 증가하는 index 초기화
  };

  return { useState, useMemo, resetContext };
}
