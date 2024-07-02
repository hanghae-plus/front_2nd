import { deepEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  const mems = [];
  let lastMemKey = -1;
  let waitingFrameCnt = 0;

  function waitForNextFrame() {
    if (waitingFrameCnt === 0) {
      waitingFrameCnt = requestAnimationFrame(() => {
        callback();
        waitingFrameCnt = 0;
      });
    }
  }

  const useState = (initState) => {
    mems.push(initState);
    const memKey = ++lastMemKey;

    const state = mems[memKey];

    const setState = function (newValue) {
      if (deepEquals(mems[memKey], newValue)) return;
      mems[memKey] = newValue;

      waitForNextFrame();
    };

    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    mems.push({ value: fn(), deps: refs });
    const memKey = ++lastMemKey;

    if (deepEquals(mems[memKey].deps, refs)) return mems[memKey].value;

    mems[memKey].deps = refs;
    return (mems[memKey].value = fn());
  };

  const resetContext = () => {
    lastMemKey = -1;
  };

  return { useState, useMemo, resetContext };
}
