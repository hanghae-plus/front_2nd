export function createHooks(callback) {
  //index를 바탕으로 globalState접근
  const globalState = [];
  let stateIdx = 0;
  let isFirstRequest = true;

  //메모이제이션을 위한 공간
  const globalMemo = [];
  let memoIdx = 0;

  const useState = (initState) => {
    const tempIdx = stateIdx;

    //게으른 초기화일시 함수 실행 리턴값 넣어주기
    const initialState =
      typeof initState === "function" ? initState() : initState;

    const tempState = globalState[tempIdx] || initialState;

    globalState[tempIdx] = tempState;

    const setState = (newState) => {
      //만약 얕은 비교를 통해 기존 값과 새로운 값에 차이가 있으면 새로운 값으로 교체 후 리렌더링

      // useState선언 시점 idx내부적으로 지정 값이 바뀌더라도 같은 index참조
      let setStateIdx = tempIdx;

      // setState를 호출하기 때문에 굳이 기명함수로 표현할 필요가 있을까ㅏ...?
      const settingNewState = () => {
        if (!Object.is(globalState[setStateIdx], newState)) {
          // 지속적으로 들어오는 요청에 값은 변경되지만 리렌더링은 마지막만 되어야함.
          globalState[setStateIdx] = newState;

          //첫 요청이 아니라면 callback요청 하지 않음.
          if (!isFirstRequest) {
            return;
          }

          //첫 요청이라면 다음 요청에 대해 False처리 이후, requestAnimationFrame예약

          isFirstRequest = false;

          return requestAnimationFrame(() => callback());
        }
      };

      return settingNewState();
    };

    return [tempState, setState];
  };

  const useMemo = (fn, refs) => {
    //현재 메모 인덱스
    const currentIdx = memoIdx;
    const previousMemo = globalMemo[currentIdx];

    //이전 메모와 비교
    if (previousMemo) {
      const { refs: prevRefs, value } = previousMemo;

      // 의존성 배열에는 여러 값이 올 수 있기 때문에 모두 비교
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
    isFirstRequest = true;
  };

  return { useState, useMemo, resetContext };
}
