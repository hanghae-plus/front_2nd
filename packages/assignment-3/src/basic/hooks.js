// https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Make-useSate-hook/

export function createHooks(callback) {
  // useState가 호출된 순서대로 state를 저장
  let stateList = [];
  let currStateIndex = 0;

  // useMemo가 호출된 순서대로 memoized value(이하 memo)를 저장
  let memoList = [];
  // 개별 memo의 dependency 배열을 순서대로 저장
  let memoRefsList = [];
  let currMemoIndex = 0;

  const useState = (initState) => {
    // 호출될 당시 stateList 내의 index 따로 저장
    const key = currStateIndex;

    // 첫 렌더링인 경우 stateList에 추가
    if (stateList.length === key) {
      stateList.push(initState);
    }

    const state = stateList[key];

    const setState = (upadateValue) => {
      // 클로져에 의해서 useState를 호출했을 때 당시 key값을 참조
      if (stateList[key] !== upadateValue) {
        stateList[key] = upadateValue;
        callback();
      }
    } 

    // 다음 useState에서 올바른 state를 참조할 수 있도록 currStateIndex를 1씩 증가
    currStateIndex += 1;

    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    // useState의 원리를 그대로 활용
    const key = currStateIndex;

    if (memoList.length === key) {
      memoList.push(fn());
      memoRefsList.push(refs);
    }

    // 호출될 때마다 refs 내부 값들의 변화를 확인
    // 렌더링 전후로 refs의 길이와 요소 내 순서는 변하지 않는 특징을 활용
    if (memoRefsList[key].some((item, index) => item !== refs[index])) {
      memoList[key] = fn();
      memoRefsList[key] = refs;
    }

    currMemoIndex += 1;

    return memoList[key];
  };

  const resetContext = () => {
    // 리렌더링이 일어나면 첫 state, memo부터 참조하도록 currStateIndex, currMemoIndex 초기화
    currStateIndex = 0;
    currMemoIndex = 0;
  }

  const resetState = () => {
    stateList = [];
  }

  const resetMemo = () => {
    memoList = [];
    memoRefsList = [];
  }

  // hook에서 관리하는 값들을 초기화
  const resetValues = () => {
    resetState();
    resetMemo();
  }

  return { useState, useMemo, resetContext, resetValues };
}
