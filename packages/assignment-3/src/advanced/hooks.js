export function createHooks(callback) {
  let index = 0;
  let pendingUpdate = false;
  const hooks = [];

  function useState(initState) {
    const currentIndex = index;

    function setState(nextState) {
      hooks[currentIndex][0] = nextState;

      if (!pendingUpdate) {
        pendingUpdate = true;
        requestAnimationFrame(() => {
          pendingUpdate = false;
          callback();
        });
      }
    }

    if (hooks[currentIndex] == null) {
      hooks[currentIndex] = [initState, setState];
    }

    index++;
    return hooks[currentIndex];
  }

  function resetContext() {
    index = 0;
  }

  return { useState, resetContext };
}
