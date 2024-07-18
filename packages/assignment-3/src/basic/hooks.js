import { deepEqual } from './equal';

export function createHooks(callback) {
  let currentIndex = 0;
  const states = [];

  const useState = (initState) => {
    const index = currentIndex++;

    if (states[index] === undefined) {
      states[index] = initState;
    }

    const setState = (newState) => {
      if (typeof newState !== 'object') {
        if (states[index] === newState) return;
      } else {
        if (deepEqual(states[index], newState)) return;
      }
      states[index] = newState;
      currentIndex = 0;
      callback();
    };

    return [states[index], setState];
  };

  const memos = [];

  const useMemo = (fn, deps = []) => {
    const index = currentIndex++;
    const oldDependencies = memos[index]?.dependencies;

    if (
      !oldDependencies ||
      oldDependencies.some((dependency, i) => !Object.is(deps[i], dependency))
    ) {
      memos[index] = {
        value: fn(),
        dependencies: deps,
      };
    }

    return memos[index].value;
  };

  // useRef
  const refs = [];

  const useRef = (initialValue) => {
    const index = currentIndex++;
    if (refs[index] === undefined) {
      refs[index] = { current: initialValue };
    }
    return refs[index];
  };

  // useCallback with useMemo
  const useCallback = (fn, deps = []) => useMemo(() => fn, deps);

  // useEffect
  const effects = [];

  const useEffect = (effect, deps = []) => {
    const index = currentIndex++;
    // rewrite with array.some the below line
    const isDepsChanged = effects[index]?.deps
      ? deps.some((dep, i) => !deepEqual(dep, effects[index].deps[i]))
      : true;

    if (isDepsChanged) {
      if (effects[index]?.cleanup) {
        effects[index].cleanup();
      }
      effects[index] = {
        // effect의 반환값이 클린업 함수 - setInterval과 같은 사이드 이펙트 실행 시 해당 함수를 클리어하는 함수를 반환
        cleanup: effect(),
        deps,
      };
    }
  };

  const resetContext = () => {
    currentIndex = 0;
    effects.forEach((effect) => {
      if (effect?.cleanup) {
        effect.cleanup();
      }
    });
  };

  return { useState, useMemo, useRef, useCallback, useEffect, resetContext };
}
