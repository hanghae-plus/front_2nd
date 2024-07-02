export function createHooks(callback) {
  let state = []; //같은 useState 여러번 호출. 그러므로 각각의 다른 상태 관리 위해 배열 사용 (테스트코드 [a],[b])
  let memoState = []; // useMemo 상태 배열

  let currentIndex = 0; //인덱스로 현재 상태 추적위해 currentIndex 변수 만듬
  let currentMemoIndex = 0; // useMemo 인덱스

  const useState = (initState) => {
    const index = currentIndex; //현재 인덱스 저장
    currentIndex++; //다음 인덱스로 이동

    if (state[index] === undefined) {
      state[index] = initState; //해당 인덱스에 해당하는 상태에 초기 값 설정
    }

    //setState 함수
    const setState = (newValue) => {
      if (state[index] !== newValue) {
        state[index] = newValue; // 새로운 값으로 상태 변경
        resetContext(); //인덱스 초기화 //hook의 callback이 실행 되기 이전에 resetContext를 실행해야 값이 정상적으로 반영된다
        callback(); //화면 재렌더링(render함수 내에 useState가 모두 순서대로 다시 실행됨)
      }
    };
    return [state[index], setState]; // 현재 상태와 상태 변경 함수 반환
  };

  const useMemo = (fn, refs) => {
    const index = currentMemoIndex; // 현재 메모 인덱스를 저장
    currentMemoIndex++; // 다음 호출을 위해 인덱스를 증가

    // 현재 인덱스에 해당하는 메모 상태가 없는 경우 (초기 실행)
    if (!memoState[index]) {
      memoState[index] = {
        value: fn(), // fn()을 호출하여 결과 값을 저장
        refs, // 의존성 배열을 저장
      };
    } else {
      // 현재 인덱스에 해당하는 메모 상태가 이미 있는 경우
      const prevRefs = memoState[index].refs; // 이전 의존성 배열을 가져옴
      // 새로운 의존성 배열과 이전 의존성 배열을 비교하여 변경 여부를 확인
      const hasChanged = refs.some((ref, i) => ref !== prevRefs[i]);
      if (hasChanged) {
        // 의존성 배열 중 하나라도 변경된 경우
        memoState[index] = {
          value: fn(), // fn()을 호출하여 새로운 결과 값을 저장
          refs, // 새로운 의존성 배열을 저장
        };
      }
    }

    return memoState[index].value; // 현재 인덱스의 메모 값을 반환
  };

  const resetContext = () => {
    currentIndex = 0; // 인덱스 초기화
    //currentIndex가 초기화되지 않으면, 다음 렌더링 시
    //currentIndex가 계속 증가하여 잘못된 인덱스에 접근하게 됨
    currentMemoIndex = 0; //이렇게 currentIndex랑 같이 초기화되어도 되는건가요?
  };

  return { useState, useMemo, resetContext };
}
