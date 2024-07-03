export function createHooks(callback) {
  let index = 0;
  const state = [];
  let nextFrameCallback;

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
      cancelAnimationFrame(nextFrameCallback);
      nextFrameCallback = requestAnimationFrame(callback);
    };

    return [currentState, setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    index = 0;
  };

  return { useState, useMemo, resetContext };
}
