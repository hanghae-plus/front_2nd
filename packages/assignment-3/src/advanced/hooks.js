export function createHooks(callback) {
  let states = [];
  let stateIndex = -1;

  let memoCache = [];
  let memoCacheIndex = -1;

  let nextFrameCallback;

  const useState = (initState) => {
    if (states.length === stateIndex) {
      states.push(initState);
    }

    const currentIndex = stateIndex;
    const currentState = states[currentIndex];

    stateIndex += 1;

    const setState = (newState) => {
      if (states[currentIndex] === newState) return;

      states[currentIndex] = newState;
      cancelAnimationFrame(nextFrameCallback);
      nextFrameCallback = requestAnimationFrame(callback);
    };

    return [currentState, setState];
  };

  const useMemo = (fn, refs) => {
    memoCache.push({ fn: fn(), refs: refs });

    memoCacheIndex += 1;
    const currentMemoIndex = memoCacheIndex;

    if (memoCache[currentMemoIndex].refs === refs) {
      memoCache[currentMemoIndex] = { fn: fn(), refs: refs };
    }

    return memoCache[currentMemoIndex].fn;
  };

  const resetContext = () => {
    stateIndex = -1;
    memoCacheIndex = -1;
  };

  return { useState, useMemo, resetContext };
}
