import { deepEquals } from '../../../assignment-2/src/basic/basic';

export function createHooks(callback) {
  let states = [];
  let stateIndex = -1;

  let memoCache = [];
  let memoCacheIndex = -1;

  const useState = (initState) => {
    states.push(initState);

    stateIndex += 1;
    const currentStateIndex = stateIndex;
    const currentState = states[currentStateIndex];

    const setState = (newState) => {
      if (!deepEquals(states[currentStateIndex], newState)) {
        states[currentStateIndex] = newState;
        callback();
      }
    };

    return [currentState, setState];
  };

  const useMemo = (fn, refs) => {
    memoCache.push({ fn: fn, refs: refs });
    memoCacheIndex += 1;
    const currentMemoIndex = memoCacheIndex;

    if (!deepEquals(memoCache[currentMemoIndex].refs, refs)) {
      memoCache[currentMemoIndex] = { fn: fn, refs: refs };
    }

    return memoCache[currentMemoIndex].fn;
  };

  const resetContext = () => {
    stateIndex = -1;
    memoCacheIndex = -1;
  };

  return { useState, useMemo, resetContext };
}
