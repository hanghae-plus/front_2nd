import { deepEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  /**
  const useState = (initState) => {
    // useState로 state를 만들 수 있다.
    let state;
    if (state === undefined) state = initState;
    // if (!state) state = initState;
    // 기존 값이 null일 수 있으니까 조건문에 undefined 사용

    const setState = (newState) => {
      // setState를 실행할 경우, callback이 다시 실행된다.
      // callback();

      // state의 값이 이전과 동일할 경우, 다시 실행되지 않는다.

      // 얕은 비교 -> obj 비교 불가능 -> X
      // if (state !== newState) callback();

      if (!deepEquals(state, newState)) {
        state = newState;
        callback();
      }
    };

    return [state, setState];
  };
   **/

  const states = [];
  let stateIndex = 0;

  const useState = (initState) => {
    const index = stateIndex;
    // states의 내부 데이터 초기값 설정
    if (states.length === index) {
      states.push(initState);
    }
    // state : 초기값을 담은 변수
    const state = states[index];

    const setState = (newState) => {
      // setState 내부에서는 newState가 변환이 없는 경우 실행 중지
      if (deepEquals(states[index], newState)) {
        return;
      }
      // 새로운 값으로 변경되는 경우 newState로 업데이트하고 callback() 실행
      states[index] = newState;

      callback();
    };

    stateIndex += 1;

    return [state, setState];
  };

  const memoCaches = [];
  const memoDependencies = [];
  let memoIndex = 0;

  const useMemo = (fn, deps) => {
    // fn: 콜백함수
    // deps: 의존성 배열
    // 값이 있으면 해당 값이 변경될 때 콜백 함수 실행
    // 빈 배열일 경우 Mount 시 실행, 이후 memorization 된 값 사용
    const index = memoIndex;

    if (memoCaches.length === index) {
      memoCaches.push(fn());
      memoDependencies.push(deps);
    } else {
      const prevDeps = memoDependencies[index];

      let isChanged = true;
      if (prevDeps && deps) {
        isChanged = !deepEquals(deps, prevDeps);
      }

      if (isChanged) {
        memoCaches[index] = fn();
        memoDependencies[index] = deps;
      }
    }
    memoIndex += 1;
    return memoCaches[index];
  };

  const resetContext = () => {
    // 다시 0부터 접근할 수 있도록 값을 초기화 해야 한다.
    stateIndex = 0;
    memoIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
