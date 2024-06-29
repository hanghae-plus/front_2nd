export function shallowEquals(target1, target2) {
  // 얕은 비교 구현하기

  // 원시 타입 : 같음
  if (target1 == target2) return true;

  // 원시 타입 : 다름
  if (typeof target1 !== "object" || typeof target2 !== "object") return false;

  // 참조 타입 : 길이가 다름
  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);
  if (target1Keys.length !== target2Keys.length) return false;

  // 참조 타입 : 내부 값 비교
  for (let i = 0; i < target1Keys.length; i++) {
    const currentKey = target1Keys[i];
    if (
      !target2Keys.includes(currentKey) ||
      target1[currentKey] !== target2[currentKey]
    )
      return false;
  }

  // 생성자 함수로 만든 값은 객체 -> 객체는 참조 타입이므로 false
  if (
    (target1 instanceof Number || target1 instanceof String) &&
    (target2 instanceof Number || target2 instanceof String)
  )
    return false;

  // class의 property가 다르면 해당 값은 같지 않음
  if (Object.getPrototypeOf(target1) !== Object.getPrototypeOf(target2))
    return false;

  return true;
}

export function deepEquals(target1, target2) {
  // 깊은 비교 구현하기
  console.log("target 1", target1, typeof target1);
  console.log("target 2", target2, typeof target2);

  // 원시 타입 : 같음
  if (target1 === target2) return true;

  // 원시 타입 : 다름
  if (typeof target1 !== "object" || typeof target2 !== "object") return false;

  // 참조 타입 : 길이가 다름
  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);
  if (target1Keys.length !== target2Keys.length) return false;

  // 참조 타입 : 내부 값 비교
  for (let i = 0; i < target1Keys.length; i++) {
    const currentKey = target1Keys[i];

    // 키 값이 서로 같지 않거나 내부 값이 같지 않은 경우 false
    if (
      !target2Keys.includes(currentKey) ||
      !deepEquals(target1[currentKey], target2[currentKey])
    )
      return false;
  }

  // 생성자 함수로 만든 값은 객체 -> 객체는 참조 타입이므로 false
  if (
    (target1 instanceof Number || target1 instanceof String) &&
    (target2 instanceof Number || target2 instanceof String)
  )
    return false;

  // class의 property가 다르면 해당 값은 같지 않음
  if (Object.getPrototypeOf(target1) !== Object.getPrototypeOf(target2))
    return false;

  // 이 외 값이 모두 같음
  return true;
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  return {
    valueOf: () => n,
    toString: () => new String(n),
    toJSON: () => `this is createNumber3 => ${n}`,
  };
}

export class CustomNumber {
  static instances = new Map();

  constructor(n) {
    if (CustomNumber.instances.has(n)) return CustomNumber.instances.get(n);

    this.n = n;
    CustomNumber.instances.set(n, this);
  }

  valueOf() {
    return this.n;
  }
  toString() {
    return String(this.n);
  }
  toJSON() {
    return String(this.n);
  }
}

export function createUnenumerableObject(target) {
  const keys = Object.keys(target);
  keys.forEach((key) => {
    Object.defineProperty(target, key, {
      value: target[key],
      enumerable: false,
    });
  });
  return target;
}

export function forEach(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const targetLength = target.length;
    const resultArray = [];
    for (let i = 0; i < targetLength; i++) {
      resultArray.push(callback(target[i], i));
    }
    return;
  }

  const propertyList = Object.getOwnPropertyNames(target);
  const propertyLength = propertyList.length;
  const returnObject = {};
  for (let i = 0; i < propertyLength; i++) {
    returnObject[propertyList[i]] = callback(
      target[propertyList[i]],
      propertyList[i],
    );
  }
  return;
}

export function map(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const targetLength = target.length;
    const resultArray = [];
    for (let i = 0; i < targetLength; i++) {
      resultArray.push(callback(target[i], i));
    }
    return resultArray;
  }

  const propertyList = Object.getOwnPropertyNames(target);
  const propertyLength = propertyList.length;
  const returnObject = {};
  for (let i = 0; i < propertyLength; i++) {
    returnObject[propertyList[i]] = callback(
      target[propertyList[i]],
      propertyList[i],
    );
  }
  return returnObject;
}

export function filter(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const targetLength = target.length;
    const resultArray = [];
    for (let i = 0; i < targetLength; i++) {
      if (callback(target[i])) resultArray.push(target[i]);
    }
    return resultArray;
  }

  const propertyList = Object.getOwnPropertyNames(target);
  const propertyLength = propertyList.length;
  const returnObject = {};
  for (let i = 0; i < propertyLength; i++) {
    if (callback(target[propertyList[i]]))
      returnObject[propertyList[i]] = target[propertyList[i]];
  }
  return returnObject;
}

export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const targetLength = target.length;
    for (let i = 0; i < targetLength; i++) {
      if (!callback(target[i])) return false;
    }
    return true;
  }

  const propertyList = Object.getOwnPropertyNames(target);
  const propertyLength = propertyList.length;
  for (let i = 0; i < propertyLength; i++) {
    if (!callback(target[propertyList[i]])) return false;
  }
  return true;
}

export function some(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const targetLength = target.length;
    for (let i = 0; i < targetLength; i++) {
      if (callback(target[i])) return true;
    }
    return false;
  }

  const propertyList = Object.getOwnPropertyNames(target);
  const propertyLength = propertyList.length;
  for (let i = 0; i < propertyLength; i++) {
    if (callback(target[propertyList[i]])) return true;
  }
  return false;
}
