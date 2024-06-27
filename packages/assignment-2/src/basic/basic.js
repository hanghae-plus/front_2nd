export function shallowEquals(target1, target2) {
  if (target1 === target2) return true;

  if (typeof target1 === 'object') {
    if (target1 instanceof Array) {
      if (target1.length !== target2.length) return false;
      return target1.every((item, index) => item === target2[index]);
    }

    if (
      target1 instanceof Number ||
      target1 instanceof String ||
      Object.getPrototypeOf(target1) !== Object.prototype
    ) {
      return target1 === target2;
    }

    const keys = Object.keys(target1);

    return keys.every((key) => target1[key] === target2[key]);
  }

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  if (target1 === target2) return true;

  if (typeof target1 === 'object') {
    if (target1 instanceof Array) {
      if (target1.length !== target2.length) return false;
      return target1.every((item, index) => deepEquals(item, target2[index]));
    }

    if (
      target1 instanceof Number ||
      target1 instanceof String ||
      Object.getPrototypeOf(target1) !== Object.prototype
    ) {
      return target1 === target2;
    }

    const keys = Object.keys(target1);

    return keys.every((key) => deepEquals(target1[key], target2[key]));
  }

  return target1 === target2;
}

export function createNumber1(n) {
  return {
    valueOf() {
      return n;
    },
  };
}

export function createNumber2(n) {
  return {
    valueOf() {
      return n + '';
    },
  };
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
      return n + '';
    },
  };
}

export class CustomNumber {
  constructor(number) {
    this.number = number;
    // this.valueOf = () => this.number;
    // this.toJSON = () => this.number;
    // this.toString = () => this.number;
  }
  valueOf() {
    return this.number + '';
  }
}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {
  if (typeof target === 'object') {
    if (target instanceof Array) {
      for (let i = 0; i < target.length; i++) {
        callback(target[i], i);
      }
    } else {
      const keys = Object.keys(target);
      for (let i = 0; i < keys.length; i++) {
        callback(target[keys[i]], keys[i]);
      }
    }
  }
}

export function map(target, callback) {}

export function filter(target, callback) {}

export function every(target, callback) {}

export function some(target, callback) {}
