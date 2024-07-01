export function isObject(target) {
  if (target == null) return false;
  return Object.getPrototypeOf(target).constructor === Object;
}

export function shallowEquals(target1, target2) {
  if (target1 === target2) return true;
  if (typeof target1 !== typeof target2) return false;
  if (target1 == null || target2 == null) {
    return false;
  }
  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;
    for (let i = 0; i < target1.length; i++) {
      if (target1[i] !== target2[i]) return false;
    }
    return true;
  }
  if (isObject(target1) && isObject(target2)) {
    const isKeyEqual = shallowEquals(
      Object.keys(target1),
      Object.keys(target2)
    );
    const isValueEqual = shallowEquals(
      Object.values(target1),
      Object.values(target2)
    );

    return isKeyEqual && isValueEqual;
  }
  return false;
}

export function deepEquals(target1, target2) {
  if (target1 === target2) return true;
  if (typeof target1 !== typeof target2) return false;
  if (target1 == null || target2 == null) {
    return false;
  }
  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;
    const trueSet = new Set();
    for (let i = 0; i < target1.length; i++) {
      if (Array.isArray(target1[i]) && Array.isArray(target2[i])) {
        trueSet.add(deepEquals(target1[i], target2[i]));
        continue;
      }
      if (isObject(target1[i]) && isObject(target2[i])) {
        const isKeyEqual = deepEquals(
          Object.keys(target1[i]),
          Object.keys(target2[i])
        );
        const isValueEqual = deepEquals(
          Object.values(target1[i]),
          Object.values(target2[i])
        );

        trueSet.add(isKeyEqual && isValueEqual);
        continue;
      }
      if (target1[i] !== target2[i]) {
        trueSet.add(false);
        return false;
      }
    }
    return !trueSet.has(false);
  }
  if (isObject(target1) && isObject(target2)) {
    const isKeyEqual = deepEquals(Object.keys(target1), Object.keys(target2));
    const isValueEqual = deepEquals(
      Object.values(target1),
      Object.values(target2)
    );

    return isKeyEqual && isValueEqual;
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
    valueOf() {
      return n;
    },
    toString() {
      return n;
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    },
  };
}

const customNumberCache = new Map();

export class CustomNumber {
  constructor(n) {
    if (customNumberCache.has(n)) return customNumberCache.get(n);
    this.n = n;
    customNumberCache.set(n, this);
  }

  valueOf() {
    return this.n;
  }

  toString() {
    return this.n;
  }

  toJSON() {
    return `${this.n}`;
  }
}

function isIterable(target) {
  return Array.isArray(target) || typeof target[Symbol.iterator] === "function";
}

export function createUnenumerableObject(target) {
  const newObj = {};

  Object.setPrototypeOf(newObj, target);

  // for (const key in target) {
  //   Object.defineProperty(newObj, key, {
  //     value: target[key],
  //     enumerable: false,
  //     writable: true,
  //     configurable: true,
  //   });
  // }

  return newObj;
}

export function forEach(target, callback) {
  if (isObject(target)) {
    for (const key in target) {
      callback(target[key], key || key, target);
    }
    return;
    // const keys = Object.getOwnPropertyNames(target);
    // for (let i = 0; i < keys.length; i++) {
    //   callback(target[keys[i]], keys[i]);
    // }
  }
  if (isIterable(target)) {
    Array.from(target).forEach(callback);
    // for (let i = 0; i < target.length; i++) {
    //   callback(target[i], i);
    // }
  }
}

export function map(target, callback) {
  if (isObject(target)) {
    const newTarget = {};
    for (const key in target) {
      newTarget[key] = callback(target[key], key);
    }
    return newTarget;
    // const newTarget = {};
    // const keys = Object.getOwnPropertyNames(target);
    // for (let i = 0; i < keys.length; i++) {
    //   newTarget[keys[i]] = callback(target[keys[i]]);
    // }
    // return newTarget;
  }
  if (isIterable(target)) {
    return Array.from(target).map(callback);
    // const newTarget = [];
    // for (let i = 0; i < target.length; i++) {
    //   newTarget.push(callback(target[i]));
    // }
    // return newTarget;
  }
}

export function filter(target, callback) {
  if (isObject(target)) {
    const newTarget = {};
    for (const key in target) {
      if (callback(target[key], key)) {
        newTarget[key] = target[key];
      }
    }
    return newTarget;
    // const keys = Object.getOwnPropertyNames(target);
    // for (let i = 0; i < keys.length; i++) {
    //   if (callback(target[keys[i]])) {
    //     newTarget[keys[i]] = target[keys[i]];
    //   }
    // }
  }
  if (isIterable(target)) return Array.from(target).filter(callback);
  // const newTarget = [];
  // for (let i = 0; i < target.length; i++) {
  //   if (callback(target[i])) {
  //     newTarget.push(target[i]);
  //   }
  // }
  // return newTarget;
}

export function every(target, callback) {
  if (isObject(target)) {
    for (const key in target) {
      if (!callback(target[key], key)) return false;
    }
    return true;
    // const keys = Object.getOwnPropertyNames(target);
    // for (let i = 0; i < keys.length; i++) {
    //   if (!callback(target[keys[i]])) return false;
    // }
    // return true;
  }

  if (isIterable(target)) return Array.from(target).every(callback);

  // for (let i = 0; i < target.length; i++) {
  //   if (!callback(target[i])) return false;
  // }

  // return true;
}

export function some(target, callback) {
  if (isObject(target)) {
    for (const key in target) {
      if (callback(target[(key, key)])) return true;
    }
    return false;
    // const keys = Object.getOwnPropertyNames(target);
    // for (let i = 0; i < keys.length; i++) {
    //   if (callback(target[keys[i]])) return true;
    // }
    // return false;
  }

  if (isIterable(target)) return Array.from(target).some(callback);
  // for (let i = 0; i < target.length; i++) {
  //   if (callback(target[i])) return true;
  // }
  // return false;
}
