import { deepEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  //useMemo, useState를 관리
  const hooks = [];
  let currentHookIdx = 0;

  /**
   * @NOTE
   * 1.useState를 만들때 현재 index에 초기값 세팅
   * 2.setState호출 시, 기존값이랑 다르면 변경하고, callback()호출
   * 3.stateIdx를 하나 늘려준다. => 다음 useState값 사용
   * @param {*} initState
   * @returns
   */
  const useState = (initState) => {
    let stateIdx = currentHookIdx; //현재 useState의 idx
    hooks[stateIdx] = hooks[stateIdx] || initState; //기존 state가 사용중이면 초기화 하지 않는다.

    //state값은 불변
    const state =
      typeof hooks[stateIdx] === "object" ? Object.freeze(hooks[stateIdx]) : hooks[stateIdx];

    function setState(updatedState) {
      if (deepEquals(hooks[stateIdx], updatedState)) return;
      hooks[stateIdx] = updatedState;
      callback();
    }

    currentHookIdx++;
    return [state, setState];
  };

  /**
   * @NOTE
   * 1.useMemo를 만들때 값이 없으면 [memoization값, dependency]를 세팅
   * 2.dependency값 변경되었는지 DeepEquals로 확인
   * 2-1.바뀌었다면, memo값과 ref값을 변경하고, Object는 읽기 전용으로 만든뒤 반납
   * 2-2.변경이 안되었다면 Object freeze만 처리하고 반납.
   * @param {*} fn
   * @param {*} refs
   * @returns
   */
  const useMemo = (fn, refs) => {
    let memoIdx = currentHookIdx;
    hooks[memoIdx] = hooks[memoIdx] || [fn(), refs];

    const [memoizedValue, prevDeps] = hooks[memoIdx];

    //DeepEquals
    if (deepEquals(prevDeps, refs)) {
      return typeof memoizedValue === "object" ? Object.freeze(memoizedValue) : memoizedValue;
    }

    const newValue = fn();
    hooks[memoIdx] = [newValue, refs];

    currentHookIdx++;
    return typeof newValue === "object" ? Object.freeze(newValue) : newValue;
  };

  /**
   * @NOTE
   * 현재 hooks에서 관리중인 인덱스를 초기화 한다.
   * 새로운 hooks가 만들어지는 것을 방지
   */
  const resetContext = () => {
    currentHookIdx = 0;
  };

  return { useState, useMemo, resetContext };
}
