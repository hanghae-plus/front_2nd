import { shallowEquals } from "../../../assignment-2/src/basic/basic";

const rebounceOneFrame = (callback) => {
  let currentReRenderPromiseIdx = -1;

  return (...args) => {
    cancelAnimationFrame(currentReRenderPromiseIdx);
    currentReRenderPromiseIdx = requestAnimationFrame(() => callback(...args));
  };
};

export function createHooks(callback) {
  const stateHooks = [];
  const memoHooks = [];
  let currentStateHookIdx = 0;
  let currentMemoHookIdx = 0;

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
    let stateIdx = currentStateHookIdx;
    const rebounceCallback = rebounceOneFrame(callback);

    stateHooks[stateIdx] = stateHooks[stateIdx] || initState;

    const state =
      typeof stateHooks[stateIdx] === "object"
        ? Object.freeze(stateHooks[stateIdx])
        : stateHooks[stateIdx];

    function setState(updatedState) {
      if (shallowEquals(stateHooks[stateIdx], updatedState)) return;
      stateHooks[stateIdx] = updatedState;
      rebounceCallback();
    }

    currentStateHookIdx++;
    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    let memoIdx = currentMemoHookIdx;
    memoHooks[memoIdx] = memoHooks[memoIdx] || { memoizedValue: fn(), dependency: refs };

    const { memoizedValue, dependency } = memoHooks[memoIdx];

    if (shallowEquals(dependency, refs)) {
      return typeof memoizedValue === "object" ? Object.freeze(memoizedValue) : memoizedValue;
    }

    const newValue = fn();
    memoHooks[memoIdx] = { memoizedValue: newValue, dependency: refs };

    currentMemoHookIdx++;
    return typeof newValue === "object" ? Object.freeze(newValue) : newValue;
  };

  const resetContext = () => {
    currentStateHookIdx = 0;
    currentMemoHookIdx = 0;
  };

  return { useState, useMemo, resetContext };
}
