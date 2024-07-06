import { deepEquals } from '../../../assignment-2/src/basic/basic';

/**
 * 훅 생성 함수
 *
 * @param {Function} callback
 * @returns
 *
 * @link https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame
 * @link https://developer.mozilla.org/ko/docs/Web/API/Window/cancelAnimationFrame
 *
 * [requestAnimationFrame]
 * - 다음 리페인트 바로 전에 브라우저가 애니메이션을 업데이트할 지정된 함수를 호출하도록 요청
 * - setTimeout()과 유사하게 콜백을 식별하는 값을 반환
 *
 * [cancelAnimationFrame]
 * - 스케줄된 애니메이션 프레임 요청을 취소
 * - clearTimeout()과 유사하게 requestAnimationFrame에서 반환된 식별값을 사용
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
    let frameCallbackId = -1;

    currentStateKey += 1;

    if (states[stateKey] === undefined) {
      states[stateKey] = initState;
    }

    function setState(newValue) {
      if (!deepEquals(states[stateKey], newValue)) {
        states[stateKey] = newValue;

        // setState가 동시에 여러 번 실행되면 마지막 setState에 대해서만 render를 호출하기 위해서
        cancelAnimationFrame(frameCallbackId);
        // 1frame 후에 콜백 다시 실행 시키기 위해서
        frameCallbackId = requestAnimationFrame(callback);
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
