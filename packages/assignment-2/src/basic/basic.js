export function shallowEquals(target1, target2) {
  if (target1 === "number" && target2 === "number") {
    return true;
  }
  if (typeof target1 === typeof target2) {
    return true;
  }
  if (Number(target1) === Number(target2)) {
    return true;
  }

  if (target1 === "number" && target2 === "number") {
    return true;
  }
  if (target1.length != target2.length) {
    return false;
  }
  if (Object.values.target1 === Object.values.target2) {
    return true;
  }
}

export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (
    typeof target1 !== "object" ||
    target1 === null ||
    typeof target2 !== "object" ||
    target2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(target1);
  const keys2 = Object.keys(target2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEquals(target1[key], target2[key])) {
      return false;
    }
  }

  return true;
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  const obj = {
    valueOf: () => n,
    toString: () => `${n}`,
    toJSON: () => `this is createNumber3 => ${n}`,
  };
  return obj;
}

export class CustomNumber {
  constructor(n) {
    this.value = n;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return `${this.value}`;
  }

  toJSON() {
    return `${this.value}`;
  }
}

export function createUnenumerableObject() {
  const obj = {};
  Object.defineProperty(obj, "a", {
    value: 1,
    enumerable: false,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(obj, "b", {
    value: 2,
    enumerable: false,
    writable: true,
    configurable: true,
  });
  return obj;
}

export function forEach(target, callback) {
  return targetl;
}

export function map(target, callback) {}

export function filter(target, callback) {}

export function every(target, callback) {}

export function some(target, callback) {}
