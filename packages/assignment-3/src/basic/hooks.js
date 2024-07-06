export function createHooks(callback) {
  let curStateKey = 0;
  const states = [];

  const useState = (initState) => {
    const key = curStateKey;
    
    if(states[key] === undefined) {
      states.push(initState);
    }

    const setState = (newVal) => {
      if(states[key] === newVal) {
        return;
      }

      states[key] = newVal;
      callback();
    }

    curStateKey += 1; // 새로운 state가 선언될 때마다 key를 +1한 주소에 저장
    // 호출될 때마다 계속 증가하며 states[index]에 저장된 state들 반환
    return [states[key], setState];
  };

  let curMemoKey = 0;
  const memos = [];

  const useMemo = (fn, refs=[]) => {
    const key = curMemoKey;
    const memo = memos[key];
    
    if(memo && memo.dependencies.every((dep, idx) => dep === refs[idx])) {
      return memo.value;
    }
    
    const newValue = fn();

    memos[key] = {dependencies: refs, value: newValue};
    curMemoKey += 1;

    return newValue;
  }

  const resetContext = () => {
    // state를 참조하는 context 초기화
    // 초기화 안하면 key값이 계속 증가해 실제 state가 저장된 저장소가 아닌 곳을 가리키게 될 것)
    curStateKey = 0;
    curMemoKey = 0;
  }

  return { useState, useMemo, resetContext };
}
