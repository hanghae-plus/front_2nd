export function createHooks(callback) {
  // 현재 렌더 콜백을 callback으로 초기화
  let currentRenderCallback = callback;
  // 상태를 저장할 배열
  let state = [];
  // 상태 변경 후 호출할 콜백을 저장할 배열
  let setStateCallbacks = [];
  // 현재 상태의 인덱스를 추적하기 위한 변수
  let stateIndex = 0;
  // 메모이제이션된 값을 저장할 배열
  let memoizedValues = [];
  // 메모이제이션된 종속성 배열을 저장할 배열
  let memoizedRefs = [];
  // 현재 메모이제이션된 값의 인덱스를 추적하기 위한 변수
  let memoIndex = 0;

  const useState = (initState) => {
    // 현재 상태의 인덱스를 저장
    const currentIndex = stateIndex;
    // 다음 상태를 위해 인덱스를 증가
    stateIndex++;

    // 현재 인덱스에 상태가 없으면 초기 상태를 설정
    if (state[currentIndex] === undefined) {
      state[currentIndex] = initState;
    }

    const setState = (newState) => {
      // 새로운 상태를 현재 인덱스에 저장
      state[currentIndex] = newState;

      // 다음 애니메이션 프레임에서 렌더 콜백을 호출하도록 큐에 추가
      if (setStateCallbacks.length === 0) {
        requestAnimationFrame(() => {
          // 큐에 있는 모든 콜백을 호출
          setStateCallbacks.forEach(callback => callback());
          // 콜백 배열을 비움
          setStateCallbacks = [];
        });
      }

      // 현재 렌더 콜백이 콜백 배열에 없으면 추가
      if (!setStateCallbacks.includes(currentRenderCallback)) {
        setStateCallbacks.push(currentRenderCallback);
      }
    };

    // 현재 상태와 상태를 업데이트하는 함수를 반환
    return [state[currentIndex], setState];
  };

  const useMemo = (fn, refs) => {
    // 현재 메모이제이션된 값의 인덱스를 저장
    const currentIndex = memoIndex;
    // 다음 메모이제이션된 값을 위해 인덱스를 증가
    memoIndex++;

    // 이전 종속성 배열을 가져옴
    const prevRefs = memoizedRefs[currentIndex];

    // 이전 종속성 배열이 없거나 현재 종속성 배열과 다르면
    // 메모이제이션된 값을 재계산
    if (!prevRefs || !areRefsEqual(prevRefs, refs)) {
      memoizedValues[currentIndex] = fn();
      memoizedRefs[currentIndex] = refs;
    }

    // 메모이제이션된 값을 반환
    return memoizedValues[currentIndex];
  };

  // 두 종속성 배열이 동일한지 비교하는 함수
  const areRefsEqual = (prevRefs, nextRefs) => {
    // 배열 길이가 다르면 다르다고 판단
    if (prevRefs.length !== nextRefs.length) {
      return false;
    }

    // 배열의 각 요소를 비교
    for (let i = 0; i < prevRefs.length; i++) {
      if (prevRefs[i] !== nextRefs[i]) {
        return false;
      }
    }

    // 모든 요소가 같으면 동일하다고 판단
    return true;
  };

  // 상태와 메모이제이션 인덱스를 리셋하는 함수
  const resetContext = () => {
    stateIndex = 0;
    memoIndex = 0;
  };

  // 현재 렌더 콜백을 래핑하여 리셋 컨텍스트를 호출한 후 콜백을 실행
  const wrappedCallback = () => {
    resetContext();
    return currentRenderCallback();
  };

  // useState, useMemo, resetContext, wrappedCallback를 반환
  return { useState, useMemo, resetContext, wrappedCallback };
}
