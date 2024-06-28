export function shallowEquals(target1, target2) {
  // null 또는 undefined 체크
  if (target1 == null || target2 == null) return target1 === target2;

  // 두 값의 타입이 동일한지 체크
  if (typeof target1 !== typeof target2) return false;

  // 원시 값을 가진 객체들 처리 (Number, String, Boolean)
  if (
    (target1 instanceof Number && target2 instanceof Number) ||
    (target1 instanceof String && target2 instanceof String) ||
    (target1 instanceof Boolean && target2 instanceof Boolean)
  ) {
    return target1 === target2;
  }

  // 객체 / 배열 처리
  if (typeof target1 === "object" && typeof target2 === "object") {
    // 두 객체의 생성자가 동일한지 체크 (클래스 인스턴스 처리)
    if (target1.constructor !== target2.constructor) return false;

    // 배열 비교
    if (Array.isArray(target1) && Array.isArray(target2)) {
      return (
        target1.length === target2.length &&
        target1.every((el, i) => el === target2[i])
      );
    }

    // 일반 객체 처리
    if (!Array.isArray(target1) && !Array.isArray(target2)) {
      const keys1 = Object.keys(target1);
      const keys2 = Object.keys(target2);
      return (
        keys1.length === keys2.length &&
        keys1.every((key) => target1[key] === target2[key])
      );
    }

    // 하나는 배열이고 다른 하나는 배열이 아닌 경우
    return false;
  }

  // 객체가 아니거나 타입이 다른 경우
  return target1 === target2;
}
export function deepEquals(target1, target2) {
  // null 또는 undefined 체크
  if (target1 == null || target2 == null) return target1 === target2;

  // 두 값의 타입이 동일한지 체크
  if (typeof target1 !== typeof target2) return false;

  // 원시 값을 가진 객체들 처리 (Number, String, Boolean)
  if (
    (target1 instanceof Number && target2 instanceof Number) ||
    (target1 instanceof String && target2 instanceof String) ||
    (target1 instanceof Boolean && target2 instanceof Boolean)
  ) {
    return target1 === target2;
  }

  // 객체 / 배열 처리
  if (typeof target1 === "object" && typeof target2 === "object") {
    if (target1.constructor !== target2.constructor) return false;
    if (JSON.stringify(target1) === JSON.stringify(target2)) return true;

    // 배열 비교
    if (Array.isArray(target1) && Array.isArray(target2)) {
      return (
        target1.length === target2.length &&
        target1.every((el, i) => el === target2[i])
      );
    }

    // 일반 객체 처리
    if (!Array.isArray(target1) && !Array.isArray(target2)) {
      const keys1 = Object.keys(target1);
      const keys2 = Object.keys(target2);
      return (
        keys1.length === keys2.length &&
        keys1.every((key) => target1[key] === target2[key])
      );
    }

    // 하나는 배열이고 다른 하나는 배열이 아닌 경우
    return false;
  }

  // 객체가 아니거나 타입이 다른 경우
  return target1 === target2;
}

export function createNumber1(n) {
  const number = new Number(n);
  return number;
}

export function createNumber2(n) {
  const number = new String(Number(n).toString());
  return number;
}

export function createNumber3(n) {
  const number = {
    valueOf() {
      return n;
    },
    toString() {
      return `${n}`;
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    },
  };
  return Object.create(number);
}

export class CustomNumber {
  static instances = new Map();
  constructor(value) {
    if (CustomNumber.instances.has(value)) {
      return CustomNumber.instances.get(value);
    }

    this.value = value;
    CustomNumber.instances.set(value, this);

    return this;
  }

  valueOf() {
    return this.value;
  }
  toString() {
    return String(this.value);
  }
  toJSON() {
    return String(this.value);
  }
}

export function createUnenumerableObject(target) {
  const keys = Object.keys(target);
  keys.forEach((key) => {
    Object.defineProperty(target, key, {
      value: target[key],
      enumerable: false,
      writable: true,
      configurable: true,
    });
  });
  return target;
}

export function forEach(target, callback) {
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    const result = [];

    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i], i));
    }

    return result;
  }

  const propertyArray = Object.getOwnPropertyNames(target);

  for (let i = 0; i < propertyArray.length; i++) {
    callback(target[propertyArray[i]], propertyArray[i]);
  }
}

export function map(target, callback) {
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    const result = [];

    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i], i));
    }

    return result;
  }

  const propertyArray = Object.getOwnPropertyNames(target);

  const resultObject = {};
  for (let i = 0; i < propertyArray.length; i++) {
    resultObject[propertyArray[i]] = callback(target[propertyArray[i]]);
  }

  return resultObject;
}

export function filter(target, callback) {
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    const result = [];

    for (let i = 0; i < target.length; i++) {
      const value = callback(target[i]);
      if (value) {
        result.push(target[i]);
      }
    }

    return result;
  }

  const propertyArray = Object.getOwnPropertyNames(target);

  const resultObject = {};
  for (let i = 0; i < propertyArray.length; i++) {
    const result = callback(target[propertyArray[i]]);
    if (result) {
      resultObject[propertyArray[i]] = target[propertyArray[i]];
    }
  }

  return resultObject;
}

export function every(target, callback) {
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    for (let i = 0; i < target.length; i++) {
      const value = callback(target[i]);
      if (!value) {
        return false;
      }
    }

    return true;
  }

  const propertyArray = Object.getOwnPropertyNames(target);

  for (let i = 0; i < propertyArray.length; i++) {
    const value = callback(target[propertyArray[i]]);
    if (!value) {
      return false;
    }
  }

  return true;
}

export function some(target, callback) {
  if (
    Array.isArray(target) ||
    target instanceof NodeList ||
    target instanceof HTMLCollection
  ) {
    for (let i = 0; i < target.length; i++) {
      const value = callback(target[i]);
      if (value) {
        return true;
      }
    }

    return false;
  }

  const propertyArray = Object.getOwnPropertyNames(target);

  for (let i = 0; i < propertyArray.length; i++) {
    const value = callback(target[propertyArray[i]]);
    if (value) {
      return true;
    }
  }

  return false;
}
