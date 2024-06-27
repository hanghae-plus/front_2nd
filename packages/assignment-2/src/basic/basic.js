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
  return {
    valueOf() {
      return n;
    },
  };
}

export function createNumber2(n) {
  return {
    valueOf() {
      return `${n}`;
    },
  };
}

export function createNumber3(n) {
  return {
    valueOf() {
      return n;
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    },
    toString() {
      return `${n}`;
    },
  };
}

export class CustomNumber {
  static instanceMap = new Map();

  constructor(n) {
    if (CustomNumber.instanceMap.has(n)) {
      return CustomNumber.instanceMap.get(n);
    }

    this.value = n;
    CustomNumber.instanceMap.set(n, this);
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

export function createUnenumerableObject(target) {
  const unenumerableTarget = {};

  for (const key in target) {
    Object.defineProperty(unenumerableTarget, key, {
      value: target[key],
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }

  return unenumerableTarget;
}

export function forEach(target, callback) {
  if (Array.isArray(target) || target[Symbol.iterator]) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }

    return;
  }

  const properties = Object.getOwnPropertyNames(target);
  for (let i = 0; i < properties.length; i++) {
    const key = properties[i];
    callback(target[key], key);
  }
}

export function map(target, callback) {
  let result = [];

  if (Array.isArray(target) || target[Symbol.iterator]) {
    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i]));
    }

    return result;
  }

  result = {};
  const properties = Object.getOwnPropertyNames(target);
  for (let i = 0; i < properties.length; i++) {
    const key = properties[i];

    result[key] = callback(target[key]);
  }

  return result;
}

export function filter(target, callback) {
  let result = [];

  if (Array.isArray(target) || target[Symbol.iterator]) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i])) result.push(target[i]);
    }

    return result;
  }

  result = {};
  const properties = Object.getOwnPropertyNames(target);
  for (let i = 0; i < properties.length; i++) {
    const key = properties[i];

    if (callback(target[key])) result[key] = target[key];
  }

  return result;
}

export function every(target, callback) {
  if (Array.isArray(target) || target[Symbol.iterator]) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i])) return false;
    }

    return true;
  }

  const properties = Object.getOwnPropertyNames(target);

  for (let i = 0; i < properties.length; i++) {
    const key = properties[i];

    if (!callback(target[key])) return false;
  }

  return true;
}

export function some(target, callback) {
  if (Array.isArray(target) || target[Symbol.iterator]) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i])) return true;
    }

    return false;
  }

  const properties = Object.getOwnPropertyNames(target);

  for (let i = 0; i < properties.length; i++) {
    const key = properties[i];

    if (!callback(target[key])) return true;
  }

  return false;
}
