export function createHooks(callback) {
  const states = [];
  const memos = [];
  let currentIndex = 0;

  const useState = (initState) => {
    const index = currentIndex++;

    if (states[index] === undefined) {
      states[index] = initState;
    }

    const setState = (newState) => {
      if (typeof newState !== 'object') {
        if (states[index] === newState) return;
      } else {
        if (Object.is(states[index], newState)) return;
      }
      states[index] = newState;
      currentIndex = 0;
      callback();
    };

    return [states[index], setState];
  };

  const useMemo = (fn, deps = []) => {
    const index = currentIndex++;
    const oldDependencies = memos[index]?.dependencies;

    if (
      !oldDependencies ||
      oldDependencies.some((dependency, i) => !Object.is(deps[i], dependency))
    ) {
      memos[index] = {
        value: fn(),
        dependencies: deps,
      };
    }

    return memos[index].value;
  };

  const resetContext = () => {
    currentIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
