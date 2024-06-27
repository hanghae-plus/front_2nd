export function shallowEquals(target1, target2) {
  if (typeof target1 !== typeof target2) {
    return false;
  }

  if (target1 == null || target2 == null) {
    return target1 === target2;
  }

  if (typeof target1 === 'object') {
    if (Array.isArray(target1)) {
      if (!Array.isArray(target2) || target1.length !== target2.length) {
        return false;
      }

      for (let i = 0; i < target1.length; i++) {
        if (target1[i] !== target2[i]) {
          return false;
        }
      }
      return true;
    }

    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (target1[key] !== target2[key]) {
        return false;
      }
    }

    if (Object.getPrototypeOf(target1) !== Object.getPrototypeOf(target2)) {
      return false;
    }

    if (
      (target1 instanceof Number && target2 instanceof Number) ||
      (target1 instanceof String && target2 instanceof String)
    ) {
      return target1 === target2;
    }

    return true;
  }

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  if (target1 == null || target2 == null) {
    return target1 === target2;
  }

  if (typeof target1 === 'object') {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEquals(target1[key], target2[key])) {
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
    valueOf() {
      return n;
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    },
    [Symbol.toPrimitive](hint) {
      if (hint === 'number') return n;
      if (hint === 'string') return String(n);
      return n;
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
  }

  toJSON() {
    return String(this.value);
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.value;
    }
    if (hint === 'string') {
      return String(this.value);
    }
    return this.value;
  }
}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  } else {
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        callback(target[key], key);
      }
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
  } else {
    const result = {};
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        result[key] = callback(target[key], key);
      }
    }
    return result;
  }
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
  } else {
    const result = {};
    for (const key in target) {
      if (target.hasOwnProperty(key) && callback(target[key], key)) {
        result[key] = target[key];
      }
    }
    return result;
  }
}

export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i], i)) {
        return false;
      }
    }
  } else {
    for (const key in target) {
      if (target.hasOwnProperty(key) && !callback(target[key], key)) {
        return false;
      }
    }
  }
  return true;
}

export function some(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i)) {
        return true;
      }
    }
  } else {
    for (const key in target) {
      if (target.hasOwnProperty(key) && callback(target[key], key)) {
        return true;
      }
    }
  }
  return false;
}
