export function createHooks(callback) {
  let states = [];
  let stateIndex = 0;

  const useState = (initState) => {
    const currentIndex = stateIndex;

    if (states[currentIndex] === undefined) {
      states[currentIndex] = initState;
    }

    const setState = (newState) => {
      // 상태값이 변해야만 setState 실행
      if (states[currentIndex] !== newState) {
        states[currentIndex] = newState;
        resetContext();  // 상태를 변경하기 전에 resetContext 호출 => stateIndex가 0이 됨
        callback(); // setState를 실행할 경우 callback이 다시 실행됨
      }
    }

    const state = states[currentIndex];
    stateIndex++;
    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    const currentIndex = stateIndex; // 현재 상태 인덱스를 저장

    // 현재 인덱스의 상태가 undefined이면 초기값 설정
    if (states[currentIndex] === undefined) {
      // 함수 실행 결과와 종속성 배열을 상태에 저장
      states[currentIndex] = { value: fn(), refs };
    } else {
      // 현재 인덱스에 저장된 마지막 종속성 배열을 가져옴
      const { refs: lastRefs } = states[currentIndex];

      // 종속성 배열이 변경되었는지 확인
      const refsChanged = !refs.every((ref, i) => ref === lastRefs[i]);

      // 종속성 배열이 변경되었으면 새로운 값을 생성하여 상태에 저장
      if (refsChanged) {
        states[currentIndex] = { value: fn(), refs };
      }
    }

    const memo = states[currentIndex].value; // 메모이제이션된 값을 가져옴
    stateIndex++; // 상태 인덱스를 증가시켜 다음 훅 호출 준비
    return memo;
  };

  const resetContext = () => {
    stateIndex = 0;
  }

  return { useState, useMemo, resetContext };
}
