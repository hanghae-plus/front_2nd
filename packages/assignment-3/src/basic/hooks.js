import { shallowEquals } from "../../../assignment-2/src/basic/basic";
import { render } from "./render";

export function createHooks(callback) {
  //index를 바탕으로 globalState접근
  const globalState = [];
  let stateIdx = 0;

  //메모이제이션을 위한 공간
  const globalMemo = [];
  let memoIdx = 0;

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
    // 무기명 함수라서 map으로 set할시 구분을 못함.

    // const currentDependency = memoDependency.get(fn);

    // const isNotChange = currentDependency?.every(
    //   (ele, idx) => ele === refs[idx]
    // );

    // console.log(memo.has(fn), memo);
    // if (memo.has(fn) && isNotChange) {
    //   return memo.get(fn);
    // }

    // const result = fn();
    // memo.set(fn, result);
    // memoDependency.set(fn, refs);

    //현재 메모 인덱스
    const currentIdx = memoIdx;
    const previousMemo = globalMemo[currentIdx];

    //이전 메모와 모든 의존성 배열 비교
    if (previousMemo) {
      const { refs: prevRefs, value } = previousMemo;
      const isNotChanged = prevRefs.every((ref, idx) =>
        Object.is(ref, refs[idx])
      );

      // 기존 value 리턴
      if (isNotChanged) {
        memoIdx++;
        return value;
      }
    }

    // 새롭게 만들기
    const newValue = fn();
    globalMemo[currentIdx] = { refs, value: newValue };
    memoIdx++;

    return newValue;
  };

  const resetContext = () => {
    stateIdx = 0;
    memoIdx = 0;
  };

  return { useState, useMemo, resetContext };
}
