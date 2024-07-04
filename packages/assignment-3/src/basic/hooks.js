export function createHooks(callback) {
  let index = 0;
  const hooks = [];

  const useState = (initState) => {
    const currentIndex = index;

    if (hooks[currentIndex] == null) {
      if (typeof initState === 'function') {
        hooks[currentIndex] = initState();
      } else {
        hooks[currentIndex] = initState;
      }
    }

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

  const useMemo = (fn, newDependencies) => {
    const currentIndex = index;

    if (hooks[currentIndex] == null) {
      hooks[currentIndex] = [newDependencies, fn()];
    }

    const [oldDependencies] = hooks[currentIndex];

    let isChanged = true;
    if (oldDependencies) {
      isChanged = newDependencies.some(
        (dependency, index) => !Object.is(dependency, oldDependencies[index])
      );
    }

    if (isChanged) {
      hooks[currentIndex] = [newDependencies, fn()];
    }

    index++;
    return hooks[currentIndex][0];
  };

  const resetContext = () => {
    index = 0;
  };

  return { useState, useMemo, resetContext };
}
