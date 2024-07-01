// 원시값, Array, Object만 대상으로 한다 - Date객체, RegExp객체 등은 고려하지 않는다. 함수는 고려하지 않는다.
export const deepEqual = (a, b) => {
  if (a === b) return true;

  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    return a.every((v, i) => deepEqual(v, b[i]));
  }

  if (
    Object.prototype.toString.call(a) === '[object Object]' &&
    Object.prototype.toString.call(b) === '[object Object]'
  ) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => deepEqual(a[key], b[key]));
  }

  return false;
};
