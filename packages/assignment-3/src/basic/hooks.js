export const createHooks = (callback) => {
  let index = 0;
  const state = [];

  const useState = (initState) => {
    if (state.length === index) {
      state.push(initState);
    }

    const currentIndex = index;
    const currentState = state[currentIndex];

    index += 1;

    const setState = (value) => {
      if (state[currentIndex] === value) return;

      state[currentIndex] = value;
      callback();
    };

    return [currentState, setState];
  };

  const resetContext = () => {
    index = 0;
  };

  const useMemo = (() => {
    let cache = {};
    let ref = [];
    return (fn, refs) => {
      if (refs.every((v, i) => v === ref[i])) {
        return cache[refs];
      } else {
        ref = refs;
        cache[refs] = fn();
        return cache[refs];
      }
    };
  })();

  return { useState, useMemo, resetContext };
};
