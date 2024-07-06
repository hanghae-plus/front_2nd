export function createHooks(callback) {
  const state = [];
  const setters = [];
  let stateIndex = 0;
  let isBatching = false;
  let pendingUpdates = [];

  const scheduleRender = () => {
    if (!isBatching) {
      isBatching = true;
      requestAnimationFrame(() => {
        pendingUpdates.forEach((update) => update());
        pendingUpdates = [];
        callback();
        isBatching = false;
      });
    }
  };

  const useState = (initialState) => {
    const currentIndex = stateIndex;
    stateIndex++;

    if (state[currentIndex] === undefined) {
      state[currentIndex] = initialState;
    }

    const setState = (newState) => {
      state[currentIndex] = newState;
      if (!isBatching) {
        scheduleRender();
      } else {
        pendingUpdates.push(() => {
          state[currentIndex] = newState;
        });
      }
    };

    return [state[currentIndex], setState];
  };

  const useMemo = (fn, refs) => {
    const currentIndex = stateIndex;
    stateIndex++;

    if (state[currentIndex] === undefined) {
      state[currentIndex] = fn();
      setters[currentIndex] = refs;
    } else {
      const prevRefs = setters[currentIndex];
      if (!refs.every((ref, i) => ref === prevRefs[i])) {
        state[currentIndex] = fn();
        setters[currentIndex] = refs;
      }
    }

    return state[currentIndex];
  };

  const resetContext = () => {
    stateIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
