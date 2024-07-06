export function createHooks(callback) {
  // react에서 hook들은 배열로 관리
  let hooks = [];
  let currentHook = 0;
  const useState = (initState) => {
    // useState는 새로고침하면 휘발되는 임시저장소.
    const hookIndex = currentHook;
    if (!hooks[hookIndex]){ // 초기상태 설정(hookIndex번째의 hooks가 없을때)
      hooks[hookIndex] = [
        initState,
        (newState) => {
          if(hooks[hookIndex][0] !== newState){
            hooks[hookIndex][0] = newState;
            resetContext();
            callback();
          }
        }
      ]
    }
    currentHook++;
    return hooks[hookIndex];
  };

  const useMemo = (fn, refs) => {
    const hookIndex = currentHook;
    const hasNoRefs = !refs;
    const prevRefs = hooks[hookIndex] ? hooks[hookIndex][1] : undefined;
    const hasChangedRefs = prevRefs
      ? !refs.every((ref, i) => Object.is(ref, prevRefs[i]))
      : true;
    
    if (hasNoRefs || hasChangedRefs) {
      hooks[hookIndex] = [fn(), refs];
    }
    currentHook++;
    return hooks[hookIndex][0];
  };

  const resetContext = () => {
    currentHook = 0;
  }

  return { useState, useMemo, resetContext };
}