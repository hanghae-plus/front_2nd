export const createHooks = (callback) => {
  let index = 0;
  const state = [];

  const useState = (initState) => {
    if (state.length === index) {
      state.push(initState);
    }

    const currentIndex = index;
    const currentState = state[currentIndex];

    const setState = (() => {
      let currentIndex = index;
      return (value) => {
        if (state[currentIndex] === value) return;

        state[currentIndex] = value;
        callback();
      };
    })();

    index += 1;
    return [currentState, setState];
  };

  const resetContext = () => {
    index = 0;
  };

  const useMemo = (() => {
    let cache = {};
    let ref = [];
    return (fn, refs) => {
      if (refs.every((v, k) => v === ref[k])) {
        return cache[refs];
      } else {
        ref = refs;
        cache[refs] = fn;
        return cache[refs];
      }
    };
  })();

  return { useState, useMemo, resetContext };
};
