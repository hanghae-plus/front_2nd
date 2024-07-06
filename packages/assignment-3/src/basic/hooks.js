// [출제 의도]
// 상태 유지 : 이전 상태를 기억, 새로운 상태와 비교 필요
// 클로저 사용 필요 : 현재 상태 캡쳐
export function createHooks(callback) {
  // state를 클로저로 관리
  // 여러개이기 때문에 배열로 관리
  // 여러개의 state를 사용 할 수 있도록 index 추가
  let states = [];
  let currentIndex = 0;

  const useState = (initState) => {
    // 각 useState 호출에 대해 고유한 인덱스 값 고정
    // 주의) 캡쳐 기능을 위해서는 currentIndex를 바로 사용해선 안됩니다.
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
      callback();
    };

    currentIndex++;
    return [state, setState];
  };

  const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    return arr1.every((value, index) => value === arr2[index]);
  };

  const useMemo = (() => {
    let cache;
    let lastDeps;

    return (fn, deps) => {
      if (!cache || !lastDeps || !areArraysEqual(lastDeps, deps)) {
        // 새로운 계산 결과 저장
        cache = fn();
        // 업데이트
        lastDeps = deps;
      }

      // 계산 결과 반환
      return cache;
    };
  })();

  const resetContext = () => {
    // 싱태값은 유지하면서 새로운 렌더링
    currentIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
