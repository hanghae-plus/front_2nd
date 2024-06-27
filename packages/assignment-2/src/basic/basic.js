const isClass = (target) => target.constructor.toString().startsWith("class");
const isNumber = (target) => target instanceof Number;
const isString = (target) => target instanceof String;
const isBoolean = (target) => target instanceof Boolean;
const isSymbol = (target) => target instanceof Symbol;
const isObject = (target) => typeof target === "object" && target !== null;

const isPrimitive = (target) =>
  isClass(target) ||
  isNumber(target) ||
  isString(target) ||
  isBoolean(target) ||
  isSymbol(target);

export function shallowEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (!isObject(target1) || !isObject(target2)) {
    return false;
  }

  if (isPrimitive(target1) || isPrimitive(target2)) {
    return false;
  }

  const keys1 = Object.keys(target1);
  const keys2 = Object.keys(target2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => target1[key] === target2[key]);
}

export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (typeof target1 !== "object" || typeof target2 !== "object") {
    return false;
  }

  if (isPrimitive(target1) || isPrimitive(target2)) {
    return false;
  }

  const keys1 = Object.keys(target1);
  const keys2 = Object.keys(target2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => deepEquals(target1[key], target2[key]));
}

export function createNumber1(n) {
  return new Number1(n);
}

export function createNumber2(n) {
  return new Number2(n);
}

export function createNumber3(n) {
  return new Number3(n);
}

class CustomObject {
  constructor(value) {
    this.value = value;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value.toString();
  }

  toJSON() {
    return this.value.toString();
  }
}

class Number1 extends CustomObject {
  constructor(value) {
    super(value);
  }
}

class Number2 extends CustomObject {
  constructor(value) {
    super(value);
  }

  valueOf() {
    return this.value.toString();
  }
}

class Number3 extends CustomObject {
  constructor(value) {
    super(value);
  }

  toJSON() {
    return `this is createNumber3 => ${this.value}`;
  }
}

export class CustomNumber extends CustomObject {
  static cache = {};

  constructor(value) {
    if (CustomNumber.cache.hasOwnProperty(value)) {
      return CustomNumber.cache[value];
    }
    super(value);
    CustomNumber.cache[value] = this;
  }

  toJSON() {
    return this.value.toString();
  }
}

const isArrayLike = (target) => {
  if (target == null) {
    return false;
  }

  if (Array.isArray(target)) {
    return true;
  }

  const length = target.length;
  if (typeof length === "number" && length >= 0 && Number.isFinite(length)) {
    return true;
  }

  return false;
};

export function createUnenumerableObject(target) {
  const newObj = {};
  for (const key in target) {
    Object.defineProperty(newObj, key, {
      value: target[key],
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }
  return newObj;
}

export function forEach(target, callback) {
  if (isArrayLike(target)) {
    const length = Array.from(target).length;
    for (let i = 0; i < length; i++) {
      callback(target[i], i);
    }
  } else if (typeof target === "object") {
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      callback(target[key], key);
    }
  } else {
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        callback(target[key], key);
      }
    }
  }
}

export function map(target, callback) {
  if (isArrayLike(target)) {
    const result = [];
    for (const item of Array.from(target)) {
      result.push(callback(item));
    }
    return result;
  } else if (typeof target === "object") {
    const result = {};
    for (const key of Object.getOwnPropertyNames(target)) {
      result[key] = callback(target[key]);
    }
    return result;
  }
  return [];
}

export function filter(target, callback) {
  if (isArrayLike(target)) {
    const result = [];
    for (const item of Array.from(target)) {
      if (callback(item)) {
        result.push(item);
      }
    }
    return result;
  } else if (typeof target === "object") {
    const result = {};
    for (const key of Object.getOwnPropertyNames(target)) {
      if (callback(target[key])) {
        result[key] = target[key];
      }
    }
    return result;
  }
  return [];
}

export function every(target, callback) {
  if (isArrayLike(target)) {
    for (const item of Array.from(target)) {
      if (!callback(item)) {
        return false;
      }
    }
    return true;
  } else if (typeof target === "object") {
    for (const key of Object.getOwnPropertyNames(target)) {
      if (!callback(target[key])) {
        return false;
      }
    }
    return true;
  } else {
    return true;
  }
}

export function some(target, callback) {
  if (isArrayLike(target)) {
    for (const item of Array.from(target)) {
      if (callback(item)) {
        return true;
      }
    }
    return false;
  } else if (typeof target === "object") {
    for (const key of Object.getOwnPropertyNames(target)) {
      if (callback(target[key])) {
        return true;
      }
    }
    return false;
  }
  return true;
}
