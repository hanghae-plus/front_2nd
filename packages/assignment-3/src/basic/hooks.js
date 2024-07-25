export function createHooks(callback) {
  let index = 0;
  let state = [];
  let setters = [];
  let memoizedValues = [];
  let memoizedDependencies = [];

  const setState = (index) => (newState) => {
    if (state[index] !== newState) {
      state[index] = newState;
      resetContext();
      callback();
    }
  };

  const useState = (initState) => {
    if (state.length === index) {
      state.push(initState);
      setters.push(setState(index));
    }
    const value = state[index];
    const setter = setters[index];
    index++;
    return [value, setter];
  };

  const useMemo = (fn, refs) => {
    if (memoizedValues.length === index) {
      memoizedValues.push(fn());
      memoizedDependencies.push(refs);
    } else {
      const isDependenciesChanged = refs.some(
        (ref, i) => ref !== memoizedDependencies[index][i]
      );
      if (isDependenciesChanged) {
        memoizedValues[index] = fn();
        memoizedDependencies[index] = refs;
      }
    }
    const value = memoizedValues[index];
    index++;
    return value;
  };

  const resetContext = () => {
    index = 0;
  };

  return { useState, useMemo, resetContext };
}
