import { deepEquals } from '../../../assignment-2/src/basic/basic';

/**
 * 훅 생성 함수
 *
 * @param {Function} callback
 * @returns
 *
 * - 상태값을 관리하는 배열 stats는 인덱스(key)로 접근
 * - 한 컴포넌트에서 useState를 여러 개 사용할 경우, 배열에 순서대로 쌓임
 * > 예를 들어, 아래와 같이 있다면...
 *    const [size, setSize] = react.useState(1);
 *    const [text, setText] = react.useState('hello');
 *    ==> states: [1, 'hello']
 *    ==> state: 1 > key: 2 / state: 'hello' > key: 1
 * - 따라서 렌더링 시, 값을 찾아가는 인덱스(key)를 초기화 해줘야 함
 * > 이 역할을 하는 함수가 resetContext()
 */
export function createHooks(callback) {
  /** useState에서 쓰이는 상태 배열 */
  let states = [];
  /** useMemo에서 쓰이는 상태 배열 */
  let memos = [];
  /** useState 상태 배열 접근 키 */
  let currentStateKey = 0;
  /** useMemo 상태 배열 접근 키 */
  let currentMemoKey = 0;

  //

  const useState = (initState) => {
    const stateKey = currentStateKey;
    currentStateKey += 1;

    if (states[stateKey] === undefined) {
      states[stateKey] = initState;
    }

    function setState(newValue) {
      if (!deepEquals(states[stateKey], newValue)) {
        states[stateKey] = newValue;
        callback(); // 얘가 렌더 함수
      }
    }

    return [states[stateKey], setState];
  };

  //

  const useMemo = (fn, refs) => {
    const memoKey = currentMemoKey;
    currentMemoKey += 1;

    if (memos[memoKey] === undefined) {
      memos[memoKey] = { value: fn(), refs };
    } else {
      const prevRefs = memos[memoKey].refs;
      const isChanged = refs.some((newRef, i) => newRef !== prevRefs[i]);

      // 의존성 배열이 변했는지 확인
      if (isChanged) {
        // 변했다면 값을 변경
        memos[memoKey] = { value: fn(), refs };
      }
    }

    return memos[memoKey].value;
  };

  //

  const resetContext = () => {
    currentStateKey = 0;
    currentMemoKey = 0;
  };

  return { useState, useMemo, resetContext };
}
