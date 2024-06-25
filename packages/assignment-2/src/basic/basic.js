export function shallowEquals(target1, target2) {
  target1 === target2;
}

export function deepEquals(target1, target2) {
  return target1 === target2;
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
