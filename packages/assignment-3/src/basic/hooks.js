import { depsEqual } from './utils';

export function createHooks(callback) {
  const states = [];
  const memos = [];
  let currentStateId = 0;
  let currentMemoId = 0;

  const useState = (initState) => {
    const stateId = currentStateId;
    currentStateId++;

    if (states.length === stateId) {
      states.push(typeof initState === 'function' ? initState() : initState);
    }

    const setState = (newState) => {
      const newStateValue = typeof newState === 'function' ? newState(states[stateId]) : newState;
      if (states[stateId] === newStateValue) return;
      states[stateId] = newStateValue;
      callback();
    };

    return [states[stateId], setState];
  };

  const useMemo = (fn, deps) => {
    const memoId = currentMemoId;
    currentMemoId++;

    const cacheResult = memos[memoId];
    const hasDepsChanged = !cacheResult || !depsEqual(cacheResult.deps, deps);

    if (hasDepsChanged) {
      const value = fn();
      memos[memoId] = { value, deps };
      return value;
    }

    return cacheResult.value;
  };

  const resetContext = () => {
    currentStateId = 0;
    currentMemoId = 0;
  };

  return { useState, useMemo, resetContext };
}
