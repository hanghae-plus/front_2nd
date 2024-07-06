import { deepEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  const hooks = [];
  let currentHookIdx = 0;

  /**
   * @NOTE
   * requestAnimation : window에서 제공하는 메소드
   * 리페인팅하기 전에 브라우저가 호출할 인수로 콜백을 받는다.
   * 브라우저에서 탭 이동시, 백그라운드 탭이 되는데 배터리 성능을 위해 requestAnimation은 중단된다.
   * iframe이 display: none, visibility: hidden으로 숨겨질때도 실행 멈춤.
   * 주사율에 맞게 1프레임에 한번 호출된다.(60Hz => 1초 60번 호출)
   *
   * 1.작업을 batch 처리할 callStack에 변경 값을 push하고
   * 2.1프레임에 한번씩 callStack에 작업 내용이 쌓여있는지 확인후
   * 3.작업 내용이 있다면 마지막 변경사항만 반영하고, reRender()를 호출한다.
   * @param {*} initState
   * @returns
   */
  const useState = (initState) => {
    let stateIdx = currentHookIdx;
    let callStack = [];

    hooks[stateIdx] = hooks[stateIdx] || initState;

    const state =
      typeof hooks[stateIdx] === "object" ? Object.freeze(hooks[stateIdx]) : hooks[stateIdx];

    function setState(updatedState) {
      if (hooks[stateIdx] === updatedState) return;

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
