export function createHooks(triggerUpdate) {
  // 모든 상태값을 저장하는 배열
  // 컴포넌트의 여러 훅 호출에 대한 상태를 순서대로 저장
  const stateStore = [];
  // 현재 처리 중인 훅의 인덱스
  // 렌더링 사이클마다 0으로 초기화되어 훅 호출 순서를 추적
  let stateIndex = 0;

  function useState(initialState) {
    // 현재 훅의 인덱스를 저장하고, 다음 훅을 위해 증가
    const currentIndex = stateIndex++;

    // 초기 렌더링 시 상태 초기화
    // 함수형 초기 상태도 지원 (예: useState(() => expensiveComputation()))
    if (stateStore[currentIndex] === undefined) {
      stateStore[currentIndex] =
        typeof initialState === "function" ? initialState() : initialState;
    }

    const setState = (newState) => {
      // 새 상태가 함수라면 이전 상태를 인자로 호출
      // 이를 통해 이전 상태를 기반으로 한 업데이트 가능 (예: setCount(prevCount => prevCount + 1))
      const nextState =
        typeof newState === "function"
          ? newState(stateStore[currentIndex])
          : newState;

      // Object.is를 사용해 정확한 동등성 검사
      // NaN === NaN과 같은 엣지 케이스도 올바르게 처리
      if (!Object.is(stateStore[currentIndex], nextState)) {
        stateStore[currentIndex] = nextState;
        // 상태 변경 시 리렌더링 트리거
        triggerUpdate();
      }
    };

    // 현재 상태와 상태 설정 함수를 반환
    return [stateStore[currentIndex], setState];
  }

  // 메모이제이션된 값과 의존성 배열을 저장
  let memoizedValue = null;
  let memoizedDeps = null;

  function useMemo(computeFunc, dependencies) {
    // 의존성 배열 변경 여부 확인
    // memoizedDeps가 null일 때(첫 호출 시)도 처리
    const depsChanged =
      !memoizedDeps ||
      dependencies.length !== memoizedDeps.length ||
      dependencies.some((dep, i) => !Object.is(dep, memoizedDeps[i]));

    // 의존성이 변경되었거나 첫 호출 시 값 계산
    if (depsChanged) {
      memoizedValue = computeFunc();
      memoizedDeps = dependencies;
    }

    // 메모이제이션된 값 반환
    return memoizedValue;
  }

  // 훅 컨텍스트 초기화 함수
  // 매 렌더링 사이클 시작 시 호출되어 훅의 상태를 리셋
  function resetContext() {
    // 상태 인덱스를 0으로 초기화
    // 이를 통해 다음 렌더링에서 훅 호출 순서가 올바르게 유지됨
    stateIndex = 0;
  }

  // 훅 함수들을 객체로 반환
  return { useState, useMemo, resetContext };
}
