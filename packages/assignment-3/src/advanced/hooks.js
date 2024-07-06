// https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Make-useSate-hook/

// frame을 그리기 직전에 실행할 callback을 등록하는 debounce 함수
// 호출될 때마다 이전에 등록한 요청을 무효화하고 새로운 callback을 등록
function debounceFrame (callback) {
  let frameRequestId = -1;
  return () => {
    cancelAnimationFrame(frameRequestId);
    frameRequestId = requestAnimationFrame(callback)
  }
};

// basics에서 사용한 로직을 활용
export function createHooks(callback) {
  let stateList = [];
  let currStateIndex = 0;

  const debouncedCallback = debounceFrame(callback);

  const useState = (initState) => {
    const key = currStateIndex;

    if (stateList.length === key) {
      stateList.push(initState);
    }

    const state = stateList[key];

    const setState = (upadateValue) => {
      if (stateList[key] !== upadateValue) {
        stateList[key] = upadateValue;
        debouncedCallback();
      }
    } 

    currStateIndex += 1;

    return [state, setState];
  };

  const resetContext = () => {
    currStateIndex = 0;
  }

  return { useState, resetContext };
}
