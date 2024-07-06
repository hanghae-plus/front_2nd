export function createHooks(callback) {
  let curStateKey = 0;
  const states = [];
  let raf;

  const useState = (initState) => {
    const key = curStateKey;
    
    if(states[key] === undefined) {
      states.push(initState);
    }

    const setState = (newVal) => {
      cancelAnimationFrame(raf);

      if(states[key] === newVal) {
        return;
      }

      states[key] = newVal;
      raf = requestAnimationFrame(callback);
    }

    curStateKey += 1;
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
    curStateKey = 0;
    curMemoKey = 0;
  }

  return { useState, useMemo, resetContext };
}
