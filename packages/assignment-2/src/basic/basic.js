export function shallowEquals(target1, target2) {
  // === 는 메모리 주소를 비교, 주소가 다르면 false를 반환.
  if (target1 === target2) return true;

  // 메모리 주소가 다른 Object들은 다 얕은 비교에서 false.
  if (
    target1 instanceof Number ||
    target2 instanceof Number ||
    target1 instanceof String ||
    target2 instanceof String
  )
    return false;

  // 같은 생성자에서 생성 됐는가 비교.
  if (target1.constructor !== target2.constructor) return false;

  // 객체 안의 가장 겉에 있는 값들을 모두 비교.
  const keyListTarget1 = Object.keys(target1);
  const keyListTarget2 = Object.keys(target2);

  if (keyListTarget1.length !== keyListTarget2.length) return false;

  for (const key of keyListTarget1) {
    if (target1[key] !== target2[key]) {
      return false;
    }
  }

  return true;
}

export function deepEquals(target1, target2) {
  if (target1 === target2) return true;
  
  if (
    target1 instanceof Number ||
    target2 instanceof Number ||
    target1 instanceof String ||
    target2 instanceof String
  )
    return false;

  if (target1.constructor !== target2.constructor) return false;

  // 두 객체가 같은 값들을 가지고 있는지 비교.
  const jsonTaget1 = JSON.stringify(target1);
  const jsonTaget2 = JSON.stringify(target2);

  if (jsonTaget1 !== jsonTaget2) return false;

  const keyListTarget1 = Object.keys(target1);
  const keyListTarget2 = Object.keys(target2);

  // 각 키와 그 값들을 재귀적으로 비교.
  for (const key of keyListTarget1) {
    if (
      !keyListTarget2.includes(key) ||
      !deepEquals(target1[key], target2[key])
    ) {
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
  class CustomNumber {
    constructor(number) {
      this.value = number;
    }
    toJSON() {
      return `this is createNumber3 => ${this.value}`;
    }
    toString() {
      return this.value.toString();
    }
    valueOf() {
      return this.value;
    }
  }

  const num = new CustomNumber(n);

  return num;
}

// expect(num1).toBe(num3);
// expect(num2).toBe(num4);
// toBe는 객체의 참조값을 비교 -> 같은 객체를 참조해야한다.
const store = {};

export class CustomNumber {
  constructor(number) {
    if (store[number]) {
      return store[number];
    }
    this.value = number;
    store[number] = this;
  }
  toJSON() {
    return `${this.value}`;
  }
  toString() {
    return this.value.toString();
  }
  valueOf() {
    return this.value;
  }
}

export function createUnenumerableObject(target) {
  const unenumerableObject = {};
  for (const key in target) {
    Object.defineProperty(unenumerableObject, key, {
      value: target[key],
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }

  return unenumerableObject;
}

export function forEach(target, callback) {
  if (target instanceof Array) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  } else if (target instanceof NodeList) {
    const targetCopy = Array.from(target);
    for (let i = 0; i < targetCopy.length; i++) {
      callback(targetCopy[i], i);
    }
  } else if (target instanceof Object) {
    const propertyNames = Object.getOwnPropertyNames(target);
    for (const key of propertyNames) {
      callback(target[key], key);
    }
  }
}

export function map(target, callback) {
  if (target instanceof Array) {
    const result = [];
    for (let i = 0; i < target.length; i++) {
      const modifiedValue = callback(target[i]);
      result[i] = modifiedValue;
    }
    return result;
  } else if (target instanceof NodeList) {
    const result = [];
    const targetCopy = Array.from(target);
    for (let i = 0; i < targetCopy.length; i++) {
      const modifiedValue = callback(target[i]);
      result[i] = modifiedValue;
    }
    return result;
  } else if (target instanceof Object) {
    const result = {};
    const propertyNames = Object.getOwnPropertyNames(target);
    for (const key of propertyNames) {
      const modifiedValue = callback(target[key]);
      result[key] = modifiedValue;
    }
    return result;
  }
}

export function filter(target, callback) {
  if (target instanceof Array) {
    const result = [];
    for (let i = 0; i < target.length; i++) {
      const evalValue = callback(target[i]);
      if (evalValue) result.push(target[i]);
    }
    return result;
  } else if (target instanceof NodeList) {
    const result = [];
    const targetCopy = Array.from(target);
    for (let i = 0; i < targetCopy.length; i++) {
      const evalValue = callback(target[i]);
      if (evalValue) result.push(target[i]);
    }
    return result;
  } else if (target instanceof Object) {
    const result = {};
    const propertyNames = Object.getOwnPropertyNames(target);
    for (const key of propertyNames) {
      const evalValue = callback(target[key]);
      if (evalValue) result[key] = target[key];
    }
    return result;
  }
}

export function every(target, callback) {
  if (target instanceof Array) {
    for (let i = 0; i < target.length; i++) {
      const evalValue = callback(target[i]);
      if (!evalValue) return false;
    }
    return true;
  } else if (target instanceof NodeList) {
    const targetCopy = Array.from(target);
    for (let i = 0; i < targetCopy.length; i++) {
      const evalValue = callback(target[i]);
      if (!evalValue) return false;
    }
    return true;
  } else if (target instanceof Object) {
    const propertyNames = Object.getOwnPropertyNames(target);
    for (const key of propertyNames) {
      const evalValue = callback(target[key]);
      if (!evalValue) return false;
    }
    return true;
  }
}

export function some(target, callback) {
  if (target instanceof Array) {
    for (let i = 0; i < target.length; i++) {
      const evalValue = callback(target[i]);
      if (evalValue) return true;
    }
    return false;
  } else if (target instanceof NodeList) {
    const targetCopy = Array.from(target);
    for (let i = 0; i < targetCopy.length; i++) {
      const evalValue = callback(target[i]);
      if (evalValue) return true;
    }
    return false;
  } else if (target instanceof Object) {
    const propertyNames = Object.getOwnPropertyNames(target);
    for (const key of propertyNames) {
      const evalValue = callback(target[key]);
      if (evalValue) return true;
    }
    return false;
  }
}
