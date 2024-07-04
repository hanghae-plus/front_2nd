// createHooks : callback을 인자로 받아 내부 훅 상태를 관리하는 훅 생성 함수를 반환
export function createHooks(callback) {
  // context 배열은 훅의 상태 값을 저장
  let context = [];
  // index는 현재 훅의 위치를 추적
  let index = 0;

  // useState 훅을 정의 초기 상태 initState를 인자로 받음
  const useState = (initState) => {
    // 현재 훅의 인덱스를 저장
    const currentIndex = index;
    // context[currentIndex]가 정의되지 않았으면 초기 상태를 설정
    if (context[currentIndex] === undefined) {
      context[currentIndex] = initState;
    }
    // 상태를 변경하는 함수 setState를 정의
    const setState = (newState) => {
      // 현재 상태와 새로운 상태가 다를 때만 상태를 변경
      if (context[currentIndex] !== newState) {
        context[currentIndex] = newState;
        // context를 리셋하고 callback을 호출
        resetContext();
        callback();
      }
    };
    // 다음 훅을 위해 인덱스를 증가시킴
    index++;
    // 현재 상태와 상태 변경 함수를 반환
    return [context[currentIndex], setState];
  };

  // useMemo 훅을 정의 메모이제이션할 함수 fn과 의존성 배열 refs를 인자로 받음
  const useMemo = (fn, refs) => {
    // 현재 훅의 인덱스를 저장
    const currentIndex = index;
    // context[currentIndex]가 정의되지 않았으면 초기 값을 설정
    if (!context[currentIndex]) {
      context[currentIndex] = { value: fn(), refs };
    } else {
      // 이전 의존성 배열을 가져옵니다.
      const prevRefs = context[currentIndex].refs;
      // 의존성 배열 중 하나라도 변경되었는지 확인
      const hasChanged = refs.some((ref, i) => ref !== prevRefs[i]);
      // 변경되었으면 새로운 값을 설정
      if (hasChanged) {
        context[currentIndex] = { value: fn(), refs };
      }
    }
    // 다음 훅을 위해 인덱스를 증가시킴
    index++;
    // 메모이제이션된 값을 반환
    return context[currentIndex].value;
  };

  // resetContext 함수는 index를 0으로 초기화
  const resetContext = () => {
    index = 0;
  };

  // useState, useMemo, resetContext 함수를 반환
  return { useState, useMemo, resetContext };
}
