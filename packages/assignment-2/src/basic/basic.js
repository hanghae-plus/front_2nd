export function shallowEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  if (typeof target1 !== 'object' || typeof target2 !== 'object') {
    return false;
  }

  if (target1 instanceof Number && target2 instanceof Number ||
     target1 instanceof String && target2 instanceof String) {
    return false;
  }

  if (Array.isArray(target1) && Array.isArray(target2)) {
    return target1.length === target2.length && target1.every((value, index) => value === target2[index]);
  }

  if (target1.constructor !== Object && target2.constructor !== Object) {
    return target1.constructor === target2.constructor;
  }

  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);

  if (target1Keys.length !== target2Keys.length) {
    return false;
  }

  for (let i = 0; i < target1Keys.length; i++) {
    if (target1[target1Keys[i]] !== target2[target2Keys[i]]) {
      return false;
    }
  }

  return true;
}

export function deepEquals(target1, target2) {
  return target1 === target2;
}


export function createNumber1(n) {
  return n;
}

export function createNumber2(n) {
  return n;
}

export function createNumber3(n) {
  return n;
}

export class CustomNumber {

}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {

}

export function map(target, callback) {

}

export function filter(target, callback) {

}


export function every(target, callback) {

}

export function some(target, callback) {

}



