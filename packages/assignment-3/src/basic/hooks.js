export function createHooks(callback) {
  let index = 0;
  const hooks = [];

  const useState = (initState) => {
    if (hooks[index] == null) {
      if (typeof initState === 'function') {
        hooks[index] = initState();
      } else {
        hooks[index] = initState;
      }
    }

    const currentIndex = index;
    function setState(nextState) {
      if (typeof nextState === 'function') {
        hooks[currentIndex] = nextState(hooks[currentIndex]);
        callback();
        resetContext();
        return;
      }

      if (!Object.is(nextState, hooks[currentIndex])) {
        hooks[currentIndex] = nextState;
        callback();
        resetContext();
        return;
      }
    }

    index++;

    return [hooks[currentIndex], setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    index = 0;
  };

  return { useState, useMemo, resetContext };
}
