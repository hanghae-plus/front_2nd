export function shallowEquals(target1, target2) {
  // 원시값 비교
  if (target1 === target2) {
    return true;
  }

  // null 처리
  if (typeof target1 !== 'object' || typeof target2 !== 'object' || 
      target1 === null || target2 === null) {
    return false;
  }

  // 생성자로 만들어진 객체 처리
  if ((target1 instanceof Number && target2 instanceof Number) ||
      (target1 instanceof String && target2 instanceof String)) {
    return false;
  }

  // 배열 비교
  if (Array.isArray(target1) && Array.isArray(target2)) {
    return target1.length === target2.length && target1.every((value, index) => value === target2[index]);
  }

  // 클래스 비교
  if (target1.constructor !== Object || target2.constructor !== Object) {
    return target1.constructor === target2.constructor;
  }

  // 객체 비교
  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);

  if (target1Keys.length !== target2Keys.length) {
    return false;
  }

  return target1Keys.every(key => target1[key] === target2[key]);
}

export function deepEquals(target1, target2) {
  // 원시값 비교
  if (target1 === target2) {
    return true;
  }

  // null 처리
  if (typeof target1 !== 'object' || typeof target2 !== 'object' || 
      target1 === null || target2 === null) {
    return false;
  }

  // 생성자로 만들어진 객체 처리
  if ((target1 instanceof Number && target2 instanceof Number) ||
      (target1 instanceof String && target2 instanceof String)) {
    return false;
  }

  // 배열 비교, 배열 내부 값 비교
  if (Array.isArray(target1) && Array.isArray(target2)) {
    return target1.length === target2.length && target1.every((value, index) => deepEquals(value, target2[index]));
  }

  // 클래스 비교
  if (target1.constructor !== Object || target2.constructor !== Object) {
    return target1.constructor === target2.constructor;
  }

  // 객체 비교
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

  // 이터레이터를 정의하여 객체 내부의 값들을 순회할 수 있게 함
  result[Symbol.iterator] = function *() {
    const properties = Object.getOwnPropertyNames(this);
    for (let i = 0; i < properties.length; i++) {
      yield [properties[i], this[properties[i]]];
    }
  };

  Object.defineProperty(result, Symbol.iterator, {
    enumerable: false,
    writable: false,
    configurable: false
  });

  return result
}

function isArrayLike(target){
  return (
    target !== null &&
    typeof(target[Symbol.iterator]) === 'function' &&
    typeof(target.length) === 'number' &&
    typeof(target) !== 'string'
  );
}

export function forEach(target, callback) {
  if (Array.isArray(target) || isArrayLike(target)) {
    const iterator = Array.from(target);
    for (let i = 0; i < iterator.length; i++) {
      callback(iterator[i], i);
    }
    return;
  }
  
  if (typeof target === 'object') {
    for (const [key, value] of target) {
      callback(value, key);
    }
  }
}

export function map(target, callback) {
  let result = [];

  if (Array.isArray(target) || isArrayLike(target)) {
    result = [];
    const iterator = Array.from(target);
    for (const item of iterator) {
      result.push(callback(item));
    }
    return result;
  }
  
  if (typeof target === 'object') {
    result = {};
    for (const [key, value] of target) {
      result[key] = callback(value);
    }
  }

  return result;
}

export function filter(target, callback) {
  let result = [];

  if (Array.isArray(target) || isArrayLike(target)) {
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

    for (const [key, value] of target) {
      if (callback(value)) {
        result[key] = value;
      }
    }
  }

  return result;
}


export function every(target, callback) {
  if (Array.isArray(target) || isArrayLike(target)) {
    const iterator = Array.from(target);
    for (const item of iterator) {
      if (!callback(item)) {
        return false;
      }
    }
    return true;
  }
  
  if (typeof target === 'object') {
    for (const [, value] of target) {
      if (!callback(value)) {
        return false;
      }
    }
    return true;
  }

  return true;
}

export function some(target, callback) {
  if (Array.isArray(target) || isArrayLike(target)) {
    const iterator = Array.from(target);
    for (const item of iterator) {
      if (callback(item)) {
        return true;
      }
    }
    return false;
  } 
  
  if (typeof target === 'object') {
    for (const [, value] of target) {
      if (callback(value)) {
        return true;
      }
    }
    return false;
  }

  return false;
}



