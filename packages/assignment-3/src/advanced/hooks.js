import { deepEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  const hooks = [];
  let currentHookIdx = 0;

  /**
   * @NOTE
   * requestAnimation : window에서 사용가능한 메소드
   * 페인팅할 준비가 되었을 때 지연 & 블로킹 현상 없이 부드럽게 애니메이션을 실행
   * 주사율에 맞게 1프레임에 한번 호출된다.
   * 1.작업을 batch 처리할 callStack에 변경 값을 push하고
   * 2.1프레임에 한번씩 callStack에 작업 내용이 쌓여있는지 확인후
   * 3.작업 내용이 있다면 마지막 변경사항만 반영하고, reRender()를 호출한다.
   * @param {*} initState
   * @returns
   */
  const useState = (initState) => {
    let stateIdx = currentHookIdx;
    hooks[stateIdx] = hooks[stateIdx] || initState;

    const state =
      typeof hooks[stateIdx] === "object" ? Object.freeze(hooks[stateIdx]) : hooks[stateIdx];

    let callStack = [];
    function setState(updatedState) {
      if (hooks[stateIdx] === updatedState) return;
      updatedState;
      callStack.push(updatedState);
      requestAnimationFrame(() => {
        if (callStack.length > 0) {
          hooks[stateIdx] = callStack.pop();
          callStack = [];
          callback();
        }
      });
    }

    currentHookIdx++;
    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    let memoIdx = currentHookIdx;
    hooks[memoIdx] = hooks[memoIdx] || [fn(), refs];

    const [memoizedValue, prevDeps] = hooks[memoIdx];

    if (deepEquals(prevDeps, refs)) {
      return typeof memoizedValue === "object" ? Object.freeze(memoizedValue) : memoizedValue;
    }

    const newValue = fn();
    hooks[memoIdx] = [newValue, refs];

    currentHookIdx++;
    return typeof newValue === "object" ? Object.freeze(newValue) : newValue;
  };

  const resetContext = () => {
    currentHookIdx = 0;
  };

  return { useState, useMemo, resetContext };
}
