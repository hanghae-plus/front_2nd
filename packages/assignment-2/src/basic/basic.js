export function shallowEquals(target1, target2) {
  if (typeof target1 !== typeof target2) return false;

  if (typeof target1 === "object") {
    if (target1 === null && target2 === null) return true;

    if (
      target1.constructor.name !== "Object" &&
      target1.constructor.name !== "Array"
    ) {
      return Object.is(target1, target2);
    }

    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) return false;

    for (let i = 0; i < keys1.length; i++) {
      if (keys1[i] !== keys2[i]) return false;
      if (target1[keys1[i]] !== target2[keys2[i]]) return false;
    }

    return true;
  }

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  if (typeof target1 !== typeof target2) return false;

  if (typeof target1 !== "object") return target1 === target2;

  if (target1 === null && target2 === null) return true;
  if (target1 === null || target2 === null) return false;

  if (
    target1.constructor.name !== "Object" &&
    target1.constructor.name !== "Array"
  ) {
    return Object.is(target1, target2);
  }

  const keys1 = Object.keys(target1);
  const keys2 = Object.keys(target2);

  if (keys1.length !== keys2.length) return false;

  const isKeyEquals = new Array(keys1.length).fill(0).every((e, i) => {
    return keys1[i] === keys2[i];
  });
  if (!isKeyEquals) return false;

  const isValueEquals = new Array(keys1.length).fill(0).every((e, i) => {
    return deepEquals(target1[keys1[i]], target2[keys2[i]]);
  });
  if (!isValueEquals) return false;

  return true;
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  return new (class {
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
      return `this is createNumber3 => ${this.valueOf()}`;
    }
  })(n);
}

export class CustomNumber {
  static cache = new Map();

  constructor(value) {
    if (CustomNumber.cache.has(value)) {
      return CustomNumber.cache.get(value);
    }

    this.value = value;
    CustomNumber.cache.set(value, this);
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

export function createUnenumerableObject(target) {
  class MyObj extends Object {
    #value = {};
    constructor(target) {
      super();
      this.#value = { ...target };

      return new Proxy(this, {
        get(_, prop) {
          if (prop === "keys") return Object.keys(target);
          if (prop === "values") return Object.values(target);

          const keys = Object.keys(target);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = target[key];

            if (prop === key) {
              return value;
            }
          }
          return Reflect.get(...arguments);
        },
      });
      // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    }
  }
  return new MyObj(target);
}

export function forEach(target, callback) {
  let keys, values;

  if (target.constructor.name === "MyObj") {
    keys = target.keys;
    values = target.values;
  } else {
    keys = Object.keys(target).map((e) => {
      return parseInt(e).isNaN ? e : parseInt(e);
    });
    values = Object.values(target);
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i];

    callback(value, key);
  }
}

export function map(target, callback) {
  let keys, values, ret;

  if (target.constructor.name === "MyObj") {
    keys = target.keys;
    values = target.values;
    ret = {};
  } else {
    keys = Object.keys(target).map((e) => {
      return parseInt(e).isNaN ? e : parseInt(e);
    });
    values = Object.values(target);
    ret = new Array(keys.length).fill(0);
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i];

    ret[key] = callback(value);
  }

  return ret;
}

export function filter(target, callback) {
  let keys, values, ret;

  if (target.constructor.name === "MyObj") {
    keys = target.keys;
    values = target.values;
    ret = {};
  } else {
    keys = Object.keys(target).map((e) => {
      return parseInt(e).isNaN ? e : parseInt(e);
    });
    values = Object.values(target);
    ret = [];
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i];

    if (callback(value)) {
      if (target.constructor.name === "MyObj") {
        ret[key] = value;
      } else {
        ret.push(value);
      }
    }
  }

  return ret;
}

export function every(target, callback) {
  const keys =
    target.constructor.name === "MyObj"
      ? target.keys
      : Object.keys(target).map((e) => {
          return parseInt(e).isNaN ? e : parseInt(e);
        });

  const ret = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = target[key];

    console.log(key, value);
    ret.push(callback(value));
  }

  return !ret.includes(false);
}

export function some(target, callback) {
  const keys =
    target.constructor.name === "MyObj"
      ? target.keys
      : Object.keys(target).map((e) => {
          return parseInt(e).isNaN ? e : parseInt(e);
        });

  const ret = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = target[key];

    console.log(key, value);
    ret.push(callback(value));
  }

  return ret.includes(true);
}
