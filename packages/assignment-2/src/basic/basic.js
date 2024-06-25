export function shallowEquals(target1, target2) {
  // 객체가 서로 다른 메모리를 참조하고 있어서 값이 같아도 false가 되는게 문제.
  // 어떻게 객체의 값이 같다면 얕은 비교로 true을 반환하게 할 수 있을까?

  // 원시 데이터 타입 비교
  if(Object.is(target1,target2)) return true;

  // 익명 class 조건
  // 익명 class는 이름을 가지지 않는다. 
  if ((typeof target1 === 'object' && !target1.constructor.name)
    || (typeof target2 === 'object' && !target2.constructor.name)) {
    return false;
  }

  // new 생성자 객체 조건
  if ((target1 instanceof Number && target2 instanceof Number) ||
      (target1 instanceof String && target2 instanceof String)) {
    return false;
  }

  // 값이 있는 두 배열([1,2,3]) 타입 비교 - 배열은 값 비교가 필요.
  if(Array.isArray(target1) && Array.isArray(target2)){
    if (target1.length !== target2.length) {
      return false;
    }

    for(let i=0; i<target1.length; i++){
      if(!Object.is(target1[i], target2[i])) return false;
    }

    return true;
  }

  // 참조 데이터({},[]) 타입 비교
  const target1Keys = Object.keys(target1);
  const target2Keys = Object.keys(target2);

  if (target1Keys.length !== target2Keys.length) {
    return false;
  }

  for(let i=0; i<target1Keys.length; i++){
    const currentKey = target1Keys[i];

    // 만약에 target2에 i번째 target1Key 속성이 없거나,
    // target1 currentKey의 값과 target2 currentKey의 값이 같지 않으면 false
    if(!Object.hasOwnProperty.call(target2, currentKey) || !Object.is(target1[currentKey], target2[currentKey])){
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



