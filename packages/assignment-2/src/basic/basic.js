// 이 문제는 얕게 비교할 수 있는 함수를 제작하는 것입니다.
// 객체 혹은 배열에서 1차로 돌렸을때 값이 동일하다면 성립합니다.
// 다만 예외로 new로 제작된 객체는 항상 다른 것으로 인식합니다.
// 그 외에는 같지 않습니다.
export function shallowEquals(target1, target2) {
  // 원시값 비교
  if (target1 === target2) {
    return true;
  }

  // 배열 비교
  const isArray1 = Array.isArray(target1);
  const isArray2 = Array.isArray(target2);

  if (isArray1 && isArray2) {
    if (target1.length !== target2.length) {
      return false;
    }

    for (let i = 0; i < target1.length; i++) {
      if (target1[i] !== target2[i]) {
        return false;
      }
    }
    return true;
  }

  // 객체 비교
  // new 생성자, 객체로 구분 비교
  const isObject1 = typeof target1 === "object";
  const isObject2 = typeof target2 === "object";

  if (isObject1 && isObject2) {
    // new 생성자 비교
    // 일반 객체 리터럴은 constructor 속성이 Object.prototype.constructor를 가리킴
    // new로 생성된 객체는 해당 생성자 함수의 prototype.constructor를 가리킴
    const isCreateWithNew1 = target1.constructor !== Object;
    const isCreatedWithNew2 = target2.constructor !== Object;

    if (isCreateWithNew1 || isCreatedWithNew2) {
      return false;
    }

    // 객체 비교
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

    return true;
  }

  return false;
}

// 이 문제는 깊게 비교할 수 있는 함수를 제작하는 것입니다.
// 객체 혹은 배열에서 인간의 시각으로 형태가 동일하다면 성립합니다.
// 다만 예외로 new로 제작된 객체는 항상 다른 것으로 인식합니다.
// 그 외에는 같지 않습니다.

// 내부를 재귀로 비교 합니다.
export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }

  const isArray1 = Array.isArray(target1);
  const isArray2 = Array.isArray(target2);

  if (isArray1 && isArray2) {
    if (target1.length !== target2.length) {
      return false;
    }

    for (let i = 0; i < target1.length; i++) {
      if (!deepEquals(target1[i], target2[i])) {
        return false;
      }
    }
    return true;
  }

  const isObject1 = typeof target1 === "object";
  const isObject2 = typeof target2 === "object";

  if (isObject1 && isObject2) {
    const isCreatedWithNew1 = target1.constructor !== Object;
    const isCreatedWithNew2 = target2.constructor !== Object;

    if (isCreatedWithNew1 || isCreatedWithNew2) {
      return false;
    }

    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!deepEquals(target1[key], target2[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
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



