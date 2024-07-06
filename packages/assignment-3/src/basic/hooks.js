export function createHooks(callback) {
  let index = 0;
  const hooks = [];

  function useState(initState) {
    const currentIndex = index;

    if (hooks[currentIndex] == null) {
      hooks[currentIndex] = isFunction(initState) ? initState() : initState;
    }

    function setState(nextState) {
      if (!Object.is(nextState, hooks[currentIndex])) {
        hooks[currentIndex] = isFunction(nextState)
          ? nextState(hooks[currentIndex])
          : nextState;
        callback();
        resetContext();
      }
    }

    index++;
    return [hooks[currentIndex], setState];
  }

  function useMemo(fn, newDependencies) {
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
  }

  function resetContext() {
    index = 0;
  }

  return { useState, useMemo, resetContext };
}

function isFunction(fn) {
  return typeof fn === 'function';
}
