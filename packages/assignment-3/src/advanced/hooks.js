export function createHooks(callback) {
  // 모든 상태와 메모이제이션된 값을 저장하는 배열
  let states = [];
  // 현재 처리 중인 훅의 인덱스
  let stateIndex = 0;
  // 대기 중인 콜백을 추적하는 변수
  let pendingCallback = null;

  const useState = (initState) => {
    // 현재 훅의 인덱스 저장
    const currentIndex = stateIndex;

    // 첫 렌더링 시 상태 초기화
    if (states[currentIndex] === undefined) {
      // 초기 상태가 함수인 경우 실행 결과를 사용
      states[currentIndex] =
        typeof initState === "function" ? initState() : initState;
    }

    const setState = (newState) => {
      // 새 상태가 함수인 경우, 이전 상태를 인자로 실행
      const nextState =
        typeof newState === "function"
          ? newState(states[currentIndex])
          : newState;

      // 상태가 실제로 변경되었는지 확인 (Object.is로 정확한 비교)
      if (!Object.is(states[currentIndex], nextState)) {
        // 상태 업데이트
        states[currentIndex] = nextState;

        // 상태 변경 시 비동기적으로 callback 실행
        // 이미 대기 중인 콜백이 없을 때만 새로운 콜백 예약
        if (!pendingCallback) {
          pendingCallback = requestAnimationFrame(() => {
            callback();
            // 콜백 실행 후 pendingCallback 초기화
            pendingCallback = null;
          });
        }
      }
    };

    // 다음 훅을 위해 인덱스 증가
    stateIndex++;
    // 현재 상태와 상태 설정 함수 반환
    return [states[currentIndex], setState];
  };

  const useMemo = (fn, deps) => {
    const currentIndex = stateIndex;
    // 이전에 저장된 의존성 배열 가져오기
    const oldDeps = states[currentIndex];

    // 의존성 배열 변경 여부 확인
    const depsChanged =
      !oldDeps ||
      !deps ||
      deps.length !== oldDeps.length ||
      deps.some((dep, i) => !Object.is(dep, oldDeps[i]));

    if (depsChanged) {
      // 의존성이 변경되었으면 함수 재실행
      const value = fn();
      // 계산된 값과 의존성 배열 저장
      states[currentIndex] = [value, deps];
      stateIndex++;
      return value;
    }

    // 의존성이 변경되지 않았으면 이전 값 반환
    stateIndex++;
    return states[currentIndex][0];
  };

  // 훅 컨텍스트 초기화 함수
  const resetContext = () => {
    // 상태 인덱스를 0으로 리셋하여 새로운 렌더링 사이클 시작
    stateIndex = 0;
  };

  // 훅 함수들 반환
  return { useState, useMemo, resetContext };
}
