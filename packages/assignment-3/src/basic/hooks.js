export function createHooks(callback) {
  let context = [];
  let index = 0;

  const useState = (initState) => {
    const currentIndex = index;
    if (context[currentIndex] === undefined) {
      context[currentIndex] = initState;
    }
    const setState = (newState) => {
      if (context[currentIndex] !== newState) {
        context[currentIndex] = newState;
        resetContext();
        callback();
      }
    };
    index++;
    return [context[currentIndex], setState];
  };

  const useMemo = (fn, refs) => {
    const currentIndex = index;
    if (!context[currentIndex]) {
      context[currentIndex] = { value: fn(), refs };
    } else {
      const prevRefs = context[currentIndex].refs;
      const hasChanged = refs.some((ref, i) => ref !== prevRefs[i]);
      if (hasChanged) {
        context[currentIndex] = { value: fn(), refs };
      }
    }
    index++;
    return context[currentIndex].value;
  };

  const resetContext = () => {
    index = 0;
  };

  return { useState, useMemo, resetContext };
}
