export function createHooks(callback) {
  let index = 0;
  const states = [];
  let nextFrameCallback;
  const useState = (initState) => {
    const currentIndex = index;
    index += 1;

    if (states.length === currentIndex) {
      states[currentIndex] = initState;
    }
    const setState = (newState) => {
      if (states[currentIndex] !== newState) {
        states[currentIndex] = newState;
        cancelAnimationFrame(nextFrameCallback);
        nextFrameCallback = requestAnimationFrame(callback);
      }
    };

    return [states[currentIndex], setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    index = 0;
  };

  return { useState, useMemo, resetContext };
}
