export function createHooks(callback) {
  const useState = (initState) => {
    return [];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {

  }

  return { useState, useMemo, resetContext };
}
