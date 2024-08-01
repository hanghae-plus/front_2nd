export function shallowEquals(target1, target2) {
  // 리터럴 값이 같으면 true return
  if (target1 === target2) return true;

  // 생성자로 생성한 instance가 같으면 해당 값은 같지 않기 때문에 false return
  if (
    (target1 instanceof Number ||
      target1 instanceof String ||
      target1 instanceof Boolean) &&
    (target2 instanceof Number ||
      target2 instanceof String ||
      target2 instanceof Boolean)
  ) {
    return false;
  }

  // class 생성자가 다르면 해당 값은 같지 않기 때문에 false return
  if (target1.constructor !== target2.constructor) {
    return false;
  }

  if (Array.isArray(target1) && Array.isArray(target2)) {
    // 배열의 길이가 같지 않으면 false return
    if (target1.length !== target2.length) return false;
    // 값을 전부 순회하며 값이 같은지 확인
    // 2차원 배열이 있다면 [value] === [value]는 false return
    for (let i = 0; i < target1.length; i++) {
      if (target1[i] !== target2[i]) return false;
    }
    return true;
  }

  if (typeof target1 === "object" && typeof target2 === "object") {
    const keysA = Object.keys(target1);

    // target1 key를 순회하면서 target2[key]와 값이 동일한지 확인
    for (let key of keysA) {
      if (!target2.hasOwnProperty(key) || target1[key] !== target2[key]) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function deepEquals(target1, target2) {
  // 리터럴 값이 같으면 true return
  if (target1 === target2) return true;

  // 생성자로 생성한 instance가 같으면 해당 값은 같지 않기 때문에 false return
  if (
    (target1 instanceof Number ||
      target1 instanceof String ||
      target1 instanceof Boolean) &&
    (target2 instanceof Number ||
      target2 instanceof String ||
      target2 instanceof Boolean)
  ) {
    return false;
  }

  // class 생성자가 다르면 해당 값은 같지 않기 때문에 false return
  if (target1.constructor !== target2.constructor) {
    return false;
  }

  if (Array.isArray(target1) && Array.isArray(target2)) {
    // 배열의 길이가 같지 않으면 false return
    if (target1.length !== target2.length) return false;

    // 값을 전부 순회하며 값이 같은지 확인
    // 2차원 배열 값이 있으면 다시한번 순회해야 하기 때문에 재귀형태로 deepEquals 함수 호출
    for (let i = 0; i < target1.length; i++) {
      if (!deepEquals(target1[i], target2[i])) {
        return false;
      }
    }
    return true;
  }

  if (typeof target1 === "object" && typeof target2 === "object") {
    const keysA = Object.keys(target1);

    // 값을 전부 순회하며 값이 같은지 확인
    // 객체 안에 또다른 객체가 있다면 다시한번 순회해야 하기 때문에 재귀형태로 deepEquals 함수 호출
    for (let key of keysA) {
      if (
        !target2.hasOwnProperty(key) ||
        !deepEquals(target1[key], target2[key])
      ) {
        return false;
      }
    }
    return true;
  }

  return false;
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
    toString: () => String(n),
    toJSON: () => `this is createNumber3 => ${n}`,
  };
}

export class CustomNumber {
  static instances = new Map();

  constructor(number) {
    if (CustomNumber.instances.has(number)) {
      return CustomNumber.instances.get(number);
    }

    this.number = number;
    CustomNumber.instances.set(number, this);

    return this;
  }

  valueOf() {
    return this.number;
  }

  toString() {
    return String(this.number);
  }

  toJSON() {
    return String(this.number);
  }
}

export function createUnenumerableObject(target) {
  const keyArray = Object.keys(target);
  keyArray.forEach((value) => {
    Object.defineProperty(target, value, {
      value: target[value],
      enumerable: false,
    });
  });

  return target;
}

export function forEach(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const returnValue = [];
    for (let i = 0; i < target.length; i++) {
      returnValue.push(callback(target[i], i));
    }
    return returnValue;
  }

  const propertyArray = Object.getOwnPropertyNames(target);

  const returnObject = {};
  for (let i = 0; i < propertyArray.length; i++) {
    returnObject[propertyArray[i]] = callback(
      target[propertyArray[i]],
      propertyArray[i]
    );
  }

  return returnObject;
}

export function map(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const returnValue = [];
    for (let i = 0; i < target.length; i++) {
      returnValue.push(callback(target[i]));
    }
    return returnValue;
  }

  const propertyArray = Object.getOwnPropertyNames(target);

  const returnObject = {};
  for (let i = 0; i < propertyArray.length; i++) {
    returnObject[propertyArray[i]] = callback(target[propertyArray[i]]);
  }

  return returnObject;
}

export function filter(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const returnValue = [];
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i])) returnValue.push(target[i]);
    }
    return returnValue;
  }

  const propertyArray = Object.getOwnPropertyNames(target);
  const returnObject = {};
  for (let i = 0; i < propertyArray.length; i++) {
    if (callback(target[propertyArray[i]]))
      returnObject[propertyArray[i]] = target[propertyArray[i]];
  }

  return returnObject;
}

export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i])) return false;
    }
    return true;
  }

  const propertyArray = Object.getOwnPropertyNames(target);
  for (let i = 0; i < propertyArray.length; i++) {
    if (!callback(target[propertyArray[i]])) return false;
  }

  return true;
}

export function some(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i])) return true;
    }
    return false;
  }

  const propertyArray = Object.getOwnPropertyNames(target);
  for (let i = 0; i < propertyArray.length; i++) {
    if (callback(target[propertyArray[i]])) return true;
  }

  return false;
}
