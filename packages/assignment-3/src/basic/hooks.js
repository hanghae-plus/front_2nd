export function createHooks(callback) {
  //useState가 호출될 때마다 초기 상태값 저장
  const _initialState = []; //초기 상태값 저장
  //현재 상태값 별도 저장 - setState에 의해서 변경됨
  const _currentState = []; //현재 상태값 저장

  const useState = (initState) => {
    // 초기 상태값을 저장하고, 현재 상태값을 관리
    const state = initState;
    _initialState.push(state);
    const setState = (newState) => {
      if (state === newState) {
        //값이 동일하면 렌더링을 하지 않음
        return;
      }

      callback();
    };

    return [state, setState];
  }

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    //현재 상태값을 초기 상태값으로 되돌리는 역할
    _currentState.length = 0;
  }

  return {useState, useMemo, resetContext};
}
