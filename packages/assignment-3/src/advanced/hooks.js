import { shallowEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  let states = [];
  let key = 0;
  let scheduled = false;

  const useState = (initState) => {
    const currentKey = key;
    if (currentKey === states.length) {
      states[currentKey] = initState;
    }

    key++;

    const setState = async (newState) => {
      if (shallowEquals(states[currentKey], newState)) return;
      states[currentKey] = newState;

      // scheduled 변수를 추가하여 requestAnimationFrame을 통해 callback이 이미 예약 되어 있는지 추적합니다.
      // setState 함수 내에서 상태가 변경될 때마다 requestAnimationFrame을 통해 callback을 예약하지만 이미 예약된 경우 추가로 예약되지 않습니다.
      // 따라서 상태가 여러번 변경되더라도 마지막 상태 변경 후 한 번만 callback이 호출됩니다.
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          callback();
          scheduled = false;
        });
      }
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
