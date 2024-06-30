import { shallowEquals } from "../../../assignment-2/src/basic/basic";
import { render } from "./render";

export function createHooks(callback) {
  const useState = (initState) => {
    const [globalState, stateIndex, reactRoot, reactRootComponent] = callback();

    globalState.set(stateIndex, initState);

    const setState = (newValue) => {
      const setNewData = () => {
        if (!shallowEquals(state, newValue)) {
          globalState.set(stateIndex, newValue);

          //리렌더링을 해야함..
          // render(reactRoot, reactRootComponent());
        }
      };

      return setNewData;
    };

    const state = globalState.get(stateIndex);

    return [state, setState()];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {};

  return { useState, useMemo, resetContext };
}
