import { shallowEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  let states = [];
  let key = 0;
  const useState = (initState) => {
    const currentKey = key;
    if (currentKey === states.length) {
      states[currentKey] = initState;
    }

    key++;

    const setState = (newState) => {
      if (shallowEquals(states[currentKey], newState)) return;
      states[currentKey] = newState;
      callback();
    };
    return [states[currentKey], setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    key = 0;
  };

  return { useState, useMemo, resetContext };
}
