export function shallowEquals(target1, target2) {
  if(target1 === target2) return true;

  if(!(target1 instanceof Number) 
      && !(target1 instanceof String) 
      && !(target1.constructor.toString().includes('class'))) {
    const key1 = Object.keys(target1);
    const key2 = Object.keys(target2);

    if(key1.length !== key2.length) return false;

    for(let k of key1) {
      if(target1[k] !== target2[k]) return false;
    }
    return true;
  } 
  
  return target1 === target2;
}

export function deepEquals(target1, target2) {
  if(target1 === target2) return true;

  if(!(target1 instanceof Number) 
      && !(target1 instanceof String) 
      && !(target1.constructor.toString().includes('class'))) {
    const key1 = Object.keys(target1);
    const key2 = Object.keys(target2);

    if(key1.length !== key2.length) return false;

    for(let k of key1) {
      if(typeof target1[k] === 'object' && typeof target2[k] === 'object') {
        if(!deepEquals(target1[k], target2[k])) {
          return false;
        }
      } else if(target1[k] !== target2[k]) {
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
  const result = {
    valueOf: () => {
      return n;
    },
    toJSON: () => {
      return `this is createNumber3 => ${n}`;
    },
    toString: () => { 
      return n; 
    }
  }

  return result
}

export class CustomNumber {
  static cache = new Map();

  constructor(num) {
    if(CustomNumber.cache.has(num)) {
      return CustomNumber.cache.get(num);
    }
    this.value = num;
    CustomNumber.cache.set(num, this);
  }
  toJSON() {
    return new String(this.value);
  }
  toString() {
    return this.value; 
  }
}

export function createUnenumerableObject(target) {
  return Object.create(target);
}

export function forEach(target, callback) {
  const isArray = target instanceof Array || target instanceof NodeList;
  const newTarget = isArray ? Array.from(target) : target;

  for(let key in newTarget) {
    const numKey = Number(key);
    key = isNaN(numKey) ? key : numKey;
    callback(target[key], key)
  }
}

export function map(target, callback) {
  const isArray = target instanceof Array || target instanceof NodeList;
  const newTarget = isArray ? Array.from(target) : target;
  const result = isArray ? [] : {};

  if(isArray) {
    for(let key in newTarget) {
      result.push(callback(newTarget[key]));
    }
  } else {
    for(let key in newTarget) {
      result[key] = callback(newTarget[key]);
    }
  }
  return result;
}

export function filter(target, callback) {
  const isArray = target instanceof Array || target instanceof NodeList;
  const newTarget = isArray ? Array.from(target) : target;
  const result = isArray ? [] : {};
  
  if(isArray) {
    for(let key in newTarget) {
      if(callback(newTarget[key])) {
        result.push(newTarget[key]);
      }
    }
  } else {
    for(let key in newTarget) {
      if(callback(newTarget[key])) {
        result[key] = newTarget[key];
      }
    }
  }
  return result;  
}


export function every(target, callback) {
  const arr = Array.from(target);
  const newTarget = arr.length>0 ? arr : target;
  for(let key in newTarget) {
    if(!callback(newTarget[key])) {
      return false;
    }
  }
  return true;
}

export function some(target, callback) {
  const arr = Array.from(target);
  const newTarget = arr.length>0 ? arr : target;
  for(let key in newTarget) {
    if(callback(newTarget[key])) {
      return true;
    }
  }
  return false;
}



