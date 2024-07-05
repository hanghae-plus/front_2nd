export function createHooks(callback) {
  //useState가 호출될 때마다 초기 상태값 저장
  let _initialState = []; //초기 상태값 저장
  //현재 상태값 별도 저장 - setState에 의해서 변경됨
  let _currentState = []; //현재 상태값 저장
  let _index =0; //렌더링 사이클 -  useState가 호출될 때마다 증가

  //useMemo를 위한 변수
  let _memoizedState = [];
  let _memoIndex = 0;

  const useState = (initState) => {
    const currentIndex = _index++;

    if (_initialState.length <= currentIndex) {
      _initialState.push(initState);
      _currentState.push(initState);
    }

    //현재 상태값을 저장
    const state = _currentState[currentIndex];

    // 초기 상태값을 저장하고, 현재 상태값을 관리
    const setState = (newState) => {
      if (_currentState[currentIndex] === newState) return;
      _currentState[currentIndex] = newState;
      _index = 0; //
      _memoIndex = 0;
      callback();
    };
    return [state, setState];
  }

  const useMemo = (fn, refs) => {
    //현재 상태값을 기준으로 의존성 배열을 만들어서, 의존성 배열이 변경되었을 때만 새로운 값을 계산
    const currentIndex = _memoIndex++;
    const prevState = _memoizedState[currentIndex];
    if (!prevState || !refs.every((ref, i) => Object.is(ref, prevState[0][i]))) {
      // 의존성이 변경되었거나 처음 호출된 경우
      const newState = fn();
      _memoizedState[currentIndex] = [refs, newState];
      return newState;
    }

    return prevState[1];
  };

  const resetContext = () => {
    //현재 상태값을 초기 상태값으로 되돌리는 역할
    _index = 0;
    _memoIndex = 0;
  }

  return {useState, useMemo, resetContext};
}
