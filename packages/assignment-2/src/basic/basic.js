export function shallowEquals(target1, target2) {
  // null 또는 undefined 체크
  if (target1 == null || target2 == null) return target1 === target2;

  // 두 값의 타입이 동일한지 체크
  if (typeof target1 !== typeof target2) return false;

  // 원시 값을 가진 객체들 처리 (Number, String, Boolean)
  if (
    (target1 instanceof Number && target2 instanceof Number) ||
    (target1 instanceof String && target2 instanceof String) ||
    (target1 instanceof Boolean && target2 instanceof Boolean)
  ) {
    return target1 === target2;
  }

  // 객체 / 배열 처리
  if (typeof target1 === "object" && typeof target2 === "object") {
    // 두 객체의 생성자가 동일한지 체크 (클래스 인스턴스 처리)
    if (target1.constructor !== target2.constructor) return false;

    // 배열 비교
    if (Array.isArray(target1) && Array.isArray(target2)) {
      return (
        target1.length === target2.length &&
        target1.every((el, i) => el === target2[i])
      );
    }

    // 일반 객체 처리
    if (!Array.isArray(target1) && !Array.isArray(target2)) {
      const keys1 = Object.keys(target1);
      const keys2 = Object.keys(target2);
      return (
        keys1.length === keys2.length &&
        keys1.every((key) => target1[key] === target2[key])
      );
    }

    // 하나는 배열이고 다른 하나는 배열이 아닌 경우
    return false;
  }

  // 객체가 아니거나 타입이 다른 경우
  return target1 === target2;
}

export function deepEquals(target1, target2) {
  // null 또는 undefined 체크
  if (target1 == null || target2 == null) return target1 === target2;

  // 두 값의 타입이 동일한지 체크
  if (typeof target1 !== typeof target2) return false;

  // 원시 값을 가진 객체들 처리 (Number, String, Boolean)
  if (
    (target1 instanceof Number && target2 instanceof Number) ||
    (target1 instanceof String && target2 instanceof String) ||
    (target1 instanceof Boolean && target2 instanceof Boolean)
  ) {
    return target1 === target2;
  }

  // 객체 / 배열 처리
  if (typeof target1 === "object" && typeof target2 === "object") {
    if (target1.constructor !== target2.constructor) return false;
    if (JSON.stringify(target1) === JSON.stringify(target2)) return true;

    // 배열 비교
    if (Array.isArray(target1) && Array.isArray(target2)) {
      return (
        target1.length === target2.length &&
        target1.every((el, i) => el === target2[i])
      );
    }

    // 일반 객체 처리
    if (!Array.isArray(target1) && !Array.isArray(target2)) {
      const keys1 = Object.keys(target1);
      const keys2 = Object.keys(target2);
      return (
        keys1.length === keys2.length &&
        keys1.every((key) => target1[key] === target2[key])
      );
    }

    // 하나는 배열이고 다른 하나는 배열이 아닌 경우
    return false;
  }

  // 객체가 아니거나 타입이 다른 경우
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

export class CustomNumber {}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {}

export function map(target, callback) {}

export function filter(target, callback) {}

export function every(target, callback) {}

export function some(target, callback) {}
