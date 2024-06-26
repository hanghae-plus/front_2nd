export function shallowEquals(target1, target2) {
  const typeOf = (target) => {
    const targetType =
      target?.constructor.name ?? Object.prototype.toString.call(target);
    return targetType;
  };

  if (typeOf(target1) !== typeOf(target2)) {
    return false;
  }

  if (typeOf(target1) === "Array") {
    if (target1.length !== target2.length) {
      return false;
    }
    return target1.every((el, index) => el === target2[index]);
  } else if (typeOf(target1) === "Object") {
    return Object.keys(target1).every((key) => target1[key] === target2[key]);
  }

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  const typeOf = (target) => {
    const targetType =
      target?.constructor.name ?? Object.prototype.toString.call(target);
    return targetType;
  };

  if (typeOf(target1) !== typeOf(target2)) {
    return false;
  }

  if (typeOf(target1) === "Array") {
    if (target1.length !== target2.length) {
      return false;
    }
    return target1.every((el, index) => deepEquals(el, target2[index]));
  } else if (typeOf(target1) === "Object") {
    if (Object.keys(target1).length !== Object.keys(target2).length) {
      return false;
    }

    return Object.keys(target1).every((key) =>
      deepEquals(target1[key], target2[key]),
    );
  }

  return target1 === target2;
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  const createObject = Object.create(Object.prototype);

  createObject.valueOf = () => n;
  createObject.toJSON = () => `this is createNumber3 => ${n}`;
  createObject.toString = () => String(n);

  return createObject;
}

export class CustomNumber {
  static instanceMap = new Map();

  constructor(value) {
    if (CustomNumber.instanceMap.has(value)) {
      return CustomNumber.instanceMap.get(value);
    }

    this.value = value;
    CustomNumber.instanceMap.set(value, this);
  }

  valueOf() {
    return this.value;
  }

  toJSON() {
    return `${this.value}`;
  }

  toString() {
    return String(this.value);
  }
}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {}

export function map(target, callback) {}

export function filter(target, callback) {}

export function every(target, callback) {}

export function some(target, callback) {}
