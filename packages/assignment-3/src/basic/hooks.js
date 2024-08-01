import { shallowEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  const stateHooks = [];
  const memoHooks = [];
  let currentStateHookIdx = 0;
  let currentMemoHookIdx = 0;

  /**
   * @NOTE
   * 1.useState를 만들때 현재 index에 초기값 세팅
   * 2.setState호출 시, 기존값이랑 다르면 변경하고, callback()호출
   * 3.stateIdx를 하나 늘려준다. => 다음 useState값 사용
   * @param {*} initState
   * @returns
   */
  const useState = (initState) => {
    return [];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    currentStateHookIdx = 0;
    currentMemoHookIdx = 0;
  };

  return { useState, useMemo, resetContext };
}
