import { deepEquals } from "../../../assignment-2/src/basic/basic";

/**
 * 훅 생성 함수
 * 
 * @param {Function} callback 여기서는 렌더 함수
 * @returns 
 * 
 * - 상태값을 관리하는 배열 stats는 인덱스로 접근
 * - 한 컴포넌트에서 useState를 여러 개 사용할 경우, 배열에 순서대로 쌓임
 * > 예를 들어, 아래와 같이 있다면...
 *    const [size, setSize] = react.useState(1);
 *    const [text, setText] = react.useState('hello');
 *    ==> states: [1, 'hello']
 * - 따라서 렌더링 시, 값을 찾아가는 인덱스를 초기화 해줘야 함
 * > 이 역할을 하는 함수가 resetContext()
 */
export function createHooks(callback) {
  let states = [];
  let currentIndex = 0;

  const useState = (initState) => {
    const stateIndex = currentIndex;
    currentIndex += 1;

    if (states[stateIndex] === undefined) {
      states[stateIndex] = initState;
    }

    function setState(newValue) {
      console.log('new Value : ', newValue);

      if (!deepEquals(states[stateIndex], newValue)) {
        console.log('here??');
        states[stateIndex] = newValue;
        console.log ('state : ', states);
        callback(); // 얘가 렌더 함수
      }
    }

    return [states[stateIndex], setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    currentIndex = 0;
  }

  return { useState, useMemo, resetContext };
}
