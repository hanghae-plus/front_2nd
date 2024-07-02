import { deepEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  const mems = [];
  let lastCurrentIndex = -1;

  const useState = (initState) => {
    mems.push(initState);
    const memKey = ++lastCurrentIndex;

    const state = mems[memKey];

    const setState = function (newValue) {
      if (deepEquals(mems[memKey], newValue)) return;
      mems[memKey] = newValue;
      callback();
    };

    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    mems.push({ value: fn(), deps: refs });
    const memKey = ++lastCurrentIndex;

    if (deepEquals(mems[memKey].deps, refs)) return mems[memKey].value;

    mems[memKey].deps = refs;
    return (mems[memKey].value = fn());
  };

  const resetContext = () => {
    lastCurrentIndex = -1;
  };

  return { useState, useMemo, resetContext };
}
