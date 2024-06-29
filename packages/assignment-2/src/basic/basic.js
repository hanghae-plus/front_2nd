export function shallowEquals(target1, target2) {
  if(target1 == target2) return true;
  // 원시 타입(Number, BigInt, String, Null, Undefined, Boolean, Symbol)
  // 참조타입(Object)
  if(typeof target1 !== typeof target2) return false;
  if(target1 == null || target2 == null) return false;

  if(Array.isArray(target1) && Array.isArray(target2)){
    if(target1.length !== target2.length) return false;
    for(let i = 0; i < target1.length; i++){
      if(target1[i] !== target2[i]) return false;
    }
    return true;
  }
  if(
    target1.__proto__.constructor === Object &&
    target2.__proto__.constructor === Object
  ){
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
  if(target1 === target2) return true;
  if(typeof target1 !== typeof target2) return false;
  if(target1 == null || target2 == null){
     return false;
  }

  if(Array.isArray(target1) && Array.isArray(target2)){
    if(target1.length !== target2.length) return false;
    const trueSet = new Set();
    for(let i = 0; i < target1.length; i++){
      if(Array.isArray(target1[i]) && Array.isArray(target2[i])){
        trueSet.add(deepEquals(target1[i], target2[i]));
        continue;
      }
      if(
        target1[i].__proto__.constructor === Object &&
        target2[i].__proto__.constructor === Object
      ){
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
if (
  target1.__proto__.constructor === Object &&
  target2.__proto__.constructor === Object
) {
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
    valueOf(){
      return n;
    },
    toString(){
      return n;
    },
    toJSON(){
      return `this is createNumber3 => ${n}`;
    },
  };
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
  const newObj = {};

  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      Object.defineProperty(newObj, key, {
        value: target[key],
        enumerable: false,
        writable: true,
        configurable: true,
      });
    }
  }

  return newObj;
}

export function forEach(target, callback) {
  if (target.__proto__.constructor === Object) {
    const keys = Object.getOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      callback(target[keys[i]], keys[i]);
    }
    return;
  }

  for (let i = 0; i < target.length; i++) {
    callback(target[i], i);
  }

}

export function map(target, callback) {
  if (target.__proto__.constructor === Object) {
    const newTarget = {};
    const keys = Object.getOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      newTarget[keys[i]] = callback(target[keys[i]]);
    }
    return newTarget;
  }
  const newTarget = [];
  for (let i = 0; i < target.length; i++) {
    newTarget.push(callback(target[i]));
  }

  return newTarget;
}

export function filter(target, callback) {
  if (target.__proto__.constructor === Object) {
    const newTarget = {};
    const keys = Object.getOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      if (callback(target[keys[i]])) {
        newTarget[keys[i]] = target[keys[i]];
      }
    }
    return newTarget;
  }
  const newTarget = [];
  for (let i = 0; i < target.length; i++) {
    if (callback(target[i])) {
      newTarget.push(target[i]);
    }
  }
  return newTarget;
}


export function every(target, callback) {
  if (target.__proto__.constructor === Object) {
    const keys = Object.getOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      if (!callback(target[keys[i]])) return false;
    }
    return true;
  }

  for (let i = 0; i < target.length; i++) {
    if (!callback(target[i])) return false;
  }

  return true;
}

export function some(target, callback) {
  if (target.__proto__.constructor === Object) {
    const keys = Object.getOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      if (callback(target[keys[i]])) return true;
    }
    return false;
  }

  for (let i = 0; i < target.length; i++) {
    if (callback(target[i])) return true;
  }
  return false;
}



