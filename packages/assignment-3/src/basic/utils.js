/**
 * 두 배열의 내용이 같은지 비교
 * @param {Array} prevDeps
 * @param {Array} nextDeps
 * @returns {boolean}
 */
export const depsEqual = (prevDeps, nextDeps) => {
  if (prevDeps === nextDeps) return true;
  if (prevDeps.length !== nextDeps.length) return false;
  return prevDeps.every((dep, i) => dep === nextDeps[i]);
};
