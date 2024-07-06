export function createHooks(callback) {
  let index = 0;
  const states = [];

  const useState = (initState) => {
    const currentIndex = index;
    index += 1;

    // [] -> 길이가 0일 때, 0번쨰를 초기화
    // ['foo'] -> 길이가 1일 때, 1번째를 초기화
    // ['foo','bar'] -> 길이가 2일 때, 0번째에다가 초기 값을 넣으려고 시도하면,
    // 초기화가 되지 않도록 한다
    if (states.length === currentIndex) {
      states[currentIndex] = initState;
    }
    //console.log("currentIndex", currentIndex, states);
    const setState = (newState) => {
      //console.log("setState 실행!", states, currentIndex, newState);
      if (states[currentIndex] !== newState) {
        states[currentIndex] = newState;
        //console.log("콜백실행!", states);
        callback();
      }
    };

    return [states[currentIndex], setState];
  };

  const useMemo = (() => {
    let cache = {};
    return (fn, refs) => {
      if (!refs[0]) refs[0] = "init";
      // useMemo 최초 수행 또는 키 값으로 캐싱되지 않은 값이 들어온 경우 캐싱
      if (
        Object.keys(cache).length === 0 ||
        !Object.keys(cache).includes(refs[0].toString())
      ) {
        cache[refs[0]] = fn;
      }
      return cache[refs[0]];
    };
  })();

  const resetContext = () => {
    index = 0;
  };

  return { useState, useMemo, resetContext };
}
