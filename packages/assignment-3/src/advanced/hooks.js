export function createHooks(callback) {
  let states = [];
  let currentStateIndex = 0;
  let effectList = new Map();
  let isBatching = false;

  const useState = (initState) => {
    const stateIndex = currentStateIndex++;
    if (states[stateIndex] === undefined) {
      states[stateIndex] = initState;
    }

    const setState = (newState) => {
      if (states[stateIndex] !== newState) {
        effectList.set(stateIndex, newState);
        requestBatch();
      }
    };

    return [states[stateIndex], setState];
  };

  const useMemo = (fn, deps) => {
    return fn();
  };

  const resetContext = () => {
    currentStateIndex = 0;
  };

  const requestBatch = () => {
    if (!isBatching) {
      isBatching = true;
      requestAnimationFrame(batching);
    }
  };

  const batching = () => {
    if (effectList.size > 0) {
      effectList.forEach((newState, stateIndex) => {
        states[stateIndex] = newState;
      });
      effectList.clear();
      callback();
    }
    isBatching = false;
  };

  return { useState, useMemo, resetContext };
}
