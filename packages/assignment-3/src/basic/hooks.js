export function createHooks(callback) {
  //useState가 호출될 때마다 초기 상태값 저장
  let _initialState = []; //초기 상태값 저장
  //현재 상태값 별도 저장 - setState에 의해서 변경됨
  let _currentState = []; //현재 상태값 저장
  let _index =0;

  const useState = (initState) => {
    const currentIndex = _index;

    if (_initialState.length <= currentIndex) {
      _initialState.push(initState);
      _currentState.push(initState);
    }

    _index++;

    //현재 상태값을 저장
    const state = _currentState[currentIndex];

    // 초기 상태값을 저장하고, 현재 상태값을 관리
    const setState = (newState) => {
      if (_currentState[currentIndex] === newState) return;
      _currentState[currentIndex] = newState;
      _index = 0;
      callback();
    };
    return [state, setState];
  }

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    //현재 상태값을 초기 상태값으로 되돌리는 역할
    _index = 0;
  }

  return {useState, useMemo, resetContext};
}
