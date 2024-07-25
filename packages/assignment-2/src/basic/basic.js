export function shallowEquals(target1, target2) {
  // (null, null)
  if (target1 === null && target2 === null) return true;

  // (1, 1)
  // ('abc', 'abc')
  // (undefined, undefined)
  if (typeof target1 !== 'object') return target1 === target2;

  // (new Number(1), new Number(1))
  // (new String(1), new String(1))
  // (new (class{})(), new (class{})())
  if (
    target1.constructor.name !== 'Object' &&
    target1.constructor.name !== 'Array'
  ) {
    return Object.is(target1, target2);
  }

  const keys1 = Object.keys(target1);
  const keys2 = Object.keys(target2);

  // ([1, 2], [1, 2, 3])
  if (keys1.length !== keys2.length) return false;

  // ([1, 2, 3, [4]], [1, 2, 3, [4]])
  // ( [1, 2, 3, { foo: 1 }], [1, 2, 3, { foo: 1 }])
  // ({a: 1}, {a: 2})
  // ({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}})
  for (let key of keys1) {
    if (
      !Object.hasOwnProperty.call(target2, key) ||
      target1[key] !== target2[key]
    ) {
      return false;
    }
  }

  // ({}, {})
  // ([], [])
  // ([1, 2, 3], [1, 2, 3])
  // ({a: 1}, {a: 1})
  return true;
}

export function deepEquals(target1, target2) {
  // shallowEquals가 비슷하되, target의 child element들의 비교가 필요
  // target의 child element들까지 shallowEquals로 true면 true
  // 재귀 형식으로 계속 들어가기

  if (shallowEquals(target1, target2)) return true;

  if (typeof target1 !== 'object') return target1 === target2;

  if (
    target1.constructor.name !== 'Object' &&
    target1.constructor.name !== 'Array'
  ) {
    return Object.is(target1, target2);
  }

  const keys1 = Object.keys(target1);
  const keys2 = Object.keys(target2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (
      !Object.hasOwnProperty.call(target2, key) ||
      !deepEquals(target1[key], target2[key])
    ) {
      return false;
    }
  }

  return true;
}

export function createNumber1(n) {
  return new Object(n);
}

export function createNumber2(n) {
  return new Object(String(n));
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
      return n;
    },
  };
}

export class CustomNumber {
  // map으로 값, 객체 저장해서
  // 새로운 객체 생성 시 값이 중복되는지 확인
  static usedNumbers = new Map();

  constructor(n) {
    if (CustomNumber.usedNumbers.has(n)) {
      return CustomNumber.usedNumbers.get(n);
    }

    this.n = n;
    CustomNumber.usedNumbers.set(n, this);
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
  for (const key in target) {
    Object.defineProperty(target, key, {
      value: target[key],
      enumerable: false,
    });
  }
  return target;
}

export function forEach(target, callback) {
  function toNumber(value) {
    if (isFinite(value)) return Number(value);
    return value;
  }

  const checkedTarget = Array.isArray(target)
    ? createUnenumerableObject(Object.assign({}, target))
    : target;

  for (const key in Object.getOwnPropertyDescriptors(checkedTarget)) {
    const value = Object.getOwnPropertyDescriptor(checkedTarget, key).value;
    callback(toNumber(value), toNumber(key));
  }
}

export function map(target, callback) {
  if (Array.isArray(target)) {
    return target.map(callback);
  }

  if (target instanceof NodeList) {
    return Array.from(target).map(callback);
  }

  const newObj = {};
  const keys = Object.getOwnPropertyNames(target);

  keys.forEach((key) => {
    newObj[key] = callback(target[key]);
  });

  return newObj;
}

export function filter(target, callback) {
  if (Array.isArray(target)) {
    return target.filter(callback);
  }

  if (target instanceof NodeList) {
    return Array.from(target).filter(callback);
  }

  const newObj = {};
  const keys = Object.getOwnPropertyNames(target);

  keys.forEach((key) => {
    if (callback(target[key])) {
      newObj[key] = target[key];
    }
  });

  return newObj;
}

export function every(target, callback) {
  if (filter(target, callback).length !== target.length) {
    return false;
  }
  return true;
}

export function some(target, callback) {
  if (filter(target, callback).length !== 0) {
    return true;
  }
  return false;
}
