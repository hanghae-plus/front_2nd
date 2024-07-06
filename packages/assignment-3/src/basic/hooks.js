export function createHooks(callback) {
    const state = [];
    let stateIdx = 0;

    const useState = (initState) => {
        const idx = stateIdx;
        stateIdx++;

        //초기값이 없을경우 초기값 설정
        if (!state[idx]) {
            state[idx] = initState;
        }

        //같은값일경우 return, 새로운값이면 업데이트
        const setState = (newState) => {
            if (state[idx] === newState) return;
            state[idx] = newState;
            resetContext();
            callback();
        };

        return [state[idx], setState];
    };

    const memo = [];
    let memoIdx = 0;

    const useMemo = (fn, deps) => {
        const target = memoIdx;
        memoIdx++;

        //저장된 값 확인
        const memoized = memo[target];
        const depsChanged = !memoized || !depsEqual(memoized.deps, deps);

        if (depsChanged) {
            const value = fn();
            memo[target] = { value, deps };
            return value;
        }

        return memoized.value;
    };

    //deps 비교
    const depsEqual = (prevDeps, nextDeps) => {
        if (prevDeps === nextDeps) return true;
        if (prevDeps.length !== nextDeps.length) return false;
        return prevDeps.every((dep, i) => dep === nextDeps[i]);
    };

    const resetContext = () => {
        stateIdx = 0;
        memoIdx = 0;
    };

    return { useState, useMemo, resetContext };
}
