// [ 얕은 비교 ]
export function shallowEquals(target1, target2) {
  if(typeof target1 === 'object' && typeof target2 === 'object' && target1.length === target2.length){
    let result = []

    for(let i in target1) {
      result.push( target1[i] === target2[i])
    }
  }
  return target1 === target2;
}

// [ 깊은 비교 ]
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



