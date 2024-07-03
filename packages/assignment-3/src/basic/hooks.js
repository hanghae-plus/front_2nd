export function createHooks(callback) {
  let currentIndex = 0;
  const hooks = [];

  const useState = (initState) => {
    if (hooks[currentIndex] == null) {
      if (typeof initState === 'function') {
        hooks[currentIndex] = initState();
      } else {
        hooks[currentIndex] = initState;
      }
    }

    const state = hooks[currentIndex];
    currentIndex++;

    function setState(nextState) {
      if (typeof nextState === 'function') {
        nextState(state);
        callback();
        resetContext();
      }

      if (!Object.is(nextState, state)) {
        hooks[currentIndex] = nextState;
        callback();
        resetContext();
      }
    }

    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    currentIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
