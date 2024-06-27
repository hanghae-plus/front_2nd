export function shallowEquals(target1, target2) {
  if (target1 instanceof Number && target2 instanceof Number) return false;
  if (target2 instanceof String && target2 instanceof String) return false;
  if (target1?.constructor?.name === '' && target2?.constructor?.name === '')
    return false;

  if (target1 === null && target2 === null) return true;
  if (target1 === undefined && target2 === undefined) return true;

  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;

    for (let i = 0; i < target1.length; i++) {
      if (target1[i] !== target2[i]) return false;
    }

    return true;
  }

  if (typeof target1 === 'object' && typeof target2 === 'object') {
    for (const key in target1) {
      if (!Object.hasOwn(target2, key) || target1[key] !== target2[key])
        return false;
    }

    return true;
  }

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  if (target1 instanceof Number && target2 instanceof Number) return false;
  if (target2 instanceof String && target2 instanceof String) return false;
  if (target1?.constructor?.name === '' && target2?.constructor?.name === '')
    return false;

  if (target1 === null && target2 === null) return true;
  if (target1 === undefined && target2 === undefined) return true;

  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;

    for (let i = 0; i < target1.length; i++) {
      if (target1[i] !== target2[i] && !deepEquals(target1[i], target2[i]))
        return false;
    }

    return true;
  }

  if (typeof target1 === 'object' && typeof target2 === 'object') {
    for (const key in target1) {
      if (
        target1[key] !== target2[key] &&
        !deepEquals(target1[key], target2[key])
      )
        return false;

      continue;
    }

    return true;
  }

  return target1 === target2;
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
