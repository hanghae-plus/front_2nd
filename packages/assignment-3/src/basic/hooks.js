import { shallowEquals } from "../../../assignment-2/src/basic/basic";
import { render } from "./render";

export function createHooks(callback) {
  let globalState = [];
  let stateIdx = 0;

  const useState = (initState) => {
    const tempIdx = stateIdx;

    //게으른 초기화일시 함수 실행
    const initialState =
      typeof initState === "function" ? initState() : initState;

    const tempState = globalState[tempIdx] || initialState;

    globalState[tempIdx] = tempState;

    const setState = (newState) => {
      //만약 얕은 비교를 통해 기존 값과 새로운 값에 차이가 있으면 새로운 값으로 교체 후 리렌더링

      // useState선언 시점 idx내부적으로 지정 값이 바뀌더라도 같은 index참조
      let setStateIdx = tempIdx;
      const settingNewState = () => {
        if (!globalState[setStateIdx]) {
          globalState[setStateIdx] = newState;
          return callback();
        }

        if (!shallowEquals(globalState[setStateIdx], newState)) {
          globalState[setStateIdx] = newState;

          return callback();
        }
      };
      return settingNewState();
    };

    //state를 새로 만들 때마다 다른 인덱스를 주기 위해 고유한 idx를 만들기
    stateIdx++;

    return [tempState, setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    stateIdx = 0;
  };

  return { useState, useMemo, resetContext };
}
