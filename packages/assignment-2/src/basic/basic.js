export function shallowEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (typeof target1 !== "object" && typeof target2 !== "object") {
    return false;
  }

  if (
    (target1 instanceof Number && target2 instanceof Number) ||
    (target1 instanceof String && target2 instanceof String)
  ) {
    // Number 객체의 원시 값을 비교하여 값이 동일한지 확인 || String 객체의 원시 값을 비교하여 값이 동일한지 확인
    return false;
  }

  if (target1.constructor !== target2.constructor) {
    // new Class 로 생성된 object 선별
    return false;
  }

  if (
    typeof target1 === "object" &&
    typeof target2 === "object" &&
    target1 !== null &&
    target2 !== null
  ) {
    if (
      Object.keys(target1).length === 0 &&
      Object.keys(target2).length === 0
    ) {
      return true;
    }

    if (Array.isArray(target1) && Array.isArray(target2)) {
      if (target1.length !== target2.length) {
        return false;
      }
      return target1.every((val, index) => val === target2[index]);
    }

    if (!Array.isArray(target1) && !Array.isArray(target2)) {
      const keys1 = Object.keys(target1);
      const keys2 = Object.keys(target2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      return keys1.every((key) => target1[key] === target2[key]);
    }

    return false;
  }

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (
    (target1 instanceof Number && target2 instanceof Number) ||
    (target1 instanceof String && target2 instanceof String)
  ) {
    return false;
  }

  if (target1.constructor !== target2.constructor) {
    return false;
  }

  if (typeof target1 === "object" && typeof target2 === "object") {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!deepEquals(target1[key], target2[key])) {
        return false;
      }
    }

    return true;
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
  return {
    value: n,
    valueOf: function() {
      return this.value;
    },
    toString: function() {
      return new String(this.value);
    },
    toJSON: function() {
      return `this is createNumber3 => ${this.value}`;
    },
  };
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
  let newObj = {};
  for (const key in target) {
    Object.defineProperty(newObj, key, {
      value: target[key],
      enumerable: false,
    });
  }
  return newObj;
}

export function forEach(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  } else if (typeof target === "object" && target !== null) {
    const keys = Object.getOwnPropertyNames(target);

    for (const key of keys) {
      callback(target[key], key);
    }
  }
}

export function map(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const result = [];
    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i], i));
    }
    return result;
  } else if (typeof target === "object" && target !== null) {
    const result = {};

    const keys = Object.getOwnPropertyNames(target);

    for (const key of keys) {
      result[key] = callback(target[key], key);
    }
    return result;
  }
  return null;
}

export function filter(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    const result = [];
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i)) {
        result.push(target[i]);
      }
    }
    return result;
  } else if (typeof target === "object" && target !== null) {
    const result = {};
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      if (callback(target[key], key)) {
        result[key] = target[key];
      }
    }
    return result;
  }
  return null;
}

export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i], i)) {
        return false;
      }
    }
    return true;
  } else if (typeof target === "object" && target !== null) {
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      if (!callback(target[key], key)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export function some(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i)) {
        return true;
      }
    }
    return false;
  } else if (typeof target === "object" && target !== null) {
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      if (callback(target[key], key)) {
        return true;
      }
    }
    return false;
  }
  return false;
}
