export function shallowEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (typeof target1 !== 'object' || typeof target2 !== 'object' || 
      target1 === null || target2 === null) {
    return false;
  }

  if ((target1 instanceof Number && target2 instanceof Number) ||
      (target1 instanceof String && target2 instanceof String)) {
    return false;
  }

  if (Array.isArray(target1) && Array.isArray(target2)) {
    return target1.length === target2.length && target1.every((value, index) => value === target2[index]);
  }

  if (target1.constructor !== Object || target2.constructor !== Object) {
    return target1.constructor === target2.constructor;
  }

  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);

  if (target1Keys.length !== target2Keys.length) {
    return false;
  }

  return target1Keys.every(key => target1[key] === target2[key]);
}

export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (typeof target1 !== 'object' || typeof target2 !== 'object' || 
      target1 === null || target2 === null) {
    return false;
  }

  if ((target1 instanceof Number && target2 instanceof Number) ||
      (target1 instanceof String && target2 instanceof String)) {
    return false;
  }

  if (Array.isArray(target1) && Array.isArray(target2)) {
    return target1.length === target2.length && target1.every((value, index) => deepEquals(value, target2[index]));
  }

  if (target1.constructor !== Object || target2.constructor !== Object) {
    return target1.constructor === target2.constructor;
  }

  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);

  if (target1Keys.length !== target2Keys.length) {
    return false;
  }

  return target1Keys.every(key => deepEquals(target1[key], target2[key]));
}


export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  return {
    value:n,
    valueOf() {
      return this.value;
    },
    toJSON() {
      return `this is createNumber3 => ${this.value}`;
    },
    toString(){
      return this.value
    },
    get() {
      return this.value;
    }
  };
}

const cache = new Map();

export class CustomNumber {
  constructor(n){
    if (cache.has(n)) {
      return cache.get(n);
    }
    this.value = n;
    cache.set(n, this);
  }

  valueOf() {
    return this.value;
  }

  toJSON(){
    return String(this.value);
  }

  toString(){
    return String(this.value);
  }

  get() {
    return this.value;
  }
}

export function createUnenumerableObject(target) {
  const result = {};
  
  for (const key in target) {  
    Object.defineProperty(result, key, {
      value: target[key],
      enumerable: false,
      writable:true,
      configurable:true
    });
  }

  return result
}

export function forEach(target, callback) {
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i, target);
    }
    return;
  } 

  if (target[Symbol.iterator]) {
    const iterator = Array.from(target);
    for (let i = 0; i < iterator.length; i++) {
      callback(iterator[i], i);
    }
    return;
  }
  
  if (typeof target === 'object') {
    const properties = Object.getOwnPropertyNames(target);

    for (let i = 0; i < properties.length; i++) {
      callback(target[properties[i]], properties[i]);
    }
  }
}

export function map(target, callback) {
  let result;

  if (Array.isArray(target)) {
    result = [];
    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i], i, target));
    }
  } 

  if (target[Symbol.iterator]) {
    result = [];
    const iterator = Array.from(target);
    for (const item of iterator) {
      result.push(callback(item));
    }
    return result;
  }
  
  if (typeof target === 'object') {
    result = {};
    const properties = Object.getOwnPropertyNames(target);
    for (let i = 0; i < properties.length; i++) {
      result[properties[i]] = callback(target[properties[i]]);
    }
  }

  return result;
}

export function filter(target, callback) {
  let result;

  if (Array.isArray(target)) {
    result = [];
    for (let i = 0; i < target.length; i++){
      if (callback(target[i], i, target)) {
        result.push(target[i]);
      }
    }
    return result;
  } 

  if (target[Symbol.iterator]) {
    result = [];
    const iterator = Array.from(target);
    for (const item of iterator) {
      if (callback(item)) {
        result.push(item);
      }
    }
    return result;
  }

  if (typeof target === 'object') {
    result = {};
    const properties = Object.getOwnPropertyNames(target);

    for (let i = 0; i < properties.length; i++){
      if (callback(target[properties[i]])) {
        result[properties[i]] = target[properties[i]];
      }
    }
  }

  return result;
}


export function every(target, callback) {
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i], i, target)) {
        return false;
      }
    }
    return true;
  }

  if (target[Symbol.iterator]) {
    const iterator = Array.from(target);
    for (const item of iterator) {
      if (!callback(item)) {
        return false;
      }
    }
    return true;
  }
  
  if (typeof target === 'object') {
    const properties = Object.getOwnPropertyNames(target);

    for (let i = 0; i < properties.length; i++) {
      if (!callback(target[properties[i]])) {
        return false;
      }
    }
    return true;
  }

  return true;
}

export function some(target, callback) {
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i])) {
        return true;
      }
    }
    return false;
  } 

  if (target[Symbol.iterator]) {
    const iterator = Array.from(target);
    for (const item of iterator) {
      if (callback(item)) {
        return true;
      }
    }
    return false;
  }
  
  if (typeof target === 'object') {
    const properties = Object.getOwnPropertyNames(target);

    for (let i = 0; i < properties.length; i++) {
      if (callback(target[properties[i]])) {
        return true;
      }
    }
  }

  return false;
}



