import { deepEquals } from "../../../assignment-2/src/basic/basic.js";

export function createHooks(callback) {
  /*
      배열을 사용하는 이유
        1. 다수의 훅 지원: 각 훅의 상태를 배열의 다른 인덱스에 저장
        2. 순서 보장
        3. 독립성
   */
  let hookStates = [];
  let hookIndex = 0;

  // 훅 인덱스를 기반으로 상태 저장
  function useState(initialValue) {
    const currentIndex = hookIndex;
    if (!hookStates[currentIndex]) {
      hookStates[currentIndex] = initialValue;
    }

    hookIndex++;

    const setState = function (newValue) {
      if (!deepEquals(hookStates[currentIndex], newValue)) {
        hookStates[currentIndex] = newValue;
        callback();
      }
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
