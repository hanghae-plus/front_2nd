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

  const map = new Map();
  const useMemo = (fn, refs) => {
    const key = JSON.stringify([fn(), refs]);
    if (map.has(key)) return map.get(key);
    map.set(key, fn());
    return map.get(key);
  };

  const resetContext = () => {
    key = 0;
  };

  return { useState, useMemo, resetContext };
}
