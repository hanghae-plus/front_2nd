export function createHooks(callback) {
  const states = {};
  const memos = {};
  let currentStateId = 0;
  let currentMemoId = 0;

  const useState = (initState) => {
    const stateId = currentStateId;
    currentStateId++;

    if (states[stateId] === undefined) {
      states[stateId] = initState;
    }

    const setState = (newState) => {
      if (states[stateId] === newState) return;
      states[stateId] = newState;
      resetContext();
      callback();
    };

    return [states[stateId], setState];
  };

  const useMemo = (fn, deps) => {
    const memoId = currentMemoId;
    currentMemoId++;

    const memoized = memos[memoId];
    const areDepsChanged = !memoized || !depsEqual(memoized.deps, deps);

    if (areDepsChanged) {
      const value = fn();
      memos[memoId] = { value, deps };
      return value;
    }

    return memoized.value;
  };

  const depsEqual = (prevDeps, nextDeps) => {
    if (prevDeps === nextDeps) return true;
    if (prevDeps.length !== nextDeps.length) return false;
    return prevDeps.every((dep, i) => dep === nextDeps[i]);
  };

  const resetContext = () => {
    currentStateId = 0;
    currentMemoId = 0;
  };

  return { useState, useMemo, resetContext };
}
