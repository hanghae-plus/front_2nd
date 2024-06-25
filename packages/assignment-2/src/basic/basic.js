//얖은 복사 지원,

export function shallowEquals(target1, target2) {
  if (target1 === target2) return true;
  if (typeof target1 !== typeof target2) return false;
  if (target1 === null || target2 === null) return false;

  const wrapperTypes = [Number, String, Boolean, Symbol, BigInt];
  if (wrapperTypes.some(type => target1 instanceof type && target2 instanceof type)) return false;

  const isObjectType = [typeof target1, typeof target2].every(type => type === 'object');
  if (isObjectType) {
    if (target1.constructor !== target2.constructor) return false;
    const key1 = Object.keys(target1);
    const key2 = Object.keys(target2);

    if (key1.length !== key2.length) return false;

    for (let key in target1) {
      if (target1[key] !== target2[key]) return false;
    }
    return true;
  }

  return false;
}

export function createNumber1(n) {
  return n;
}

export function createNumber2(n) {
  return n;
}

export function createNumber3(n) {
  return n;
}

export class CustomNumber {}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {}

export function map(target, callback) {}

export function filter(target, callback) {}

export function every(target, callback) {}

export function some(target, callback) {}
