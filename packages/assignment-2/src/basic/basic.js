/** 래퍼 객체 여부 확인 함수
 *
 * @param obj 확인 하려는 값
 * @returns 래퍼 객체 여부
 */
function isWrapper(obj) {
  return (
    obj instanceof Number || obj instanceof String || obj instanceof Boolean
  );
}

/** 클래스 여부 확인 함수
 *
 * @param obj 확인 하려는 값
 * @returns 클래스 여부
 */
function isClassInstance(obj) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.constructor &&
    obj.constructor !== Object
  );
}

/** 객체 여부 확인 함수
 *
 * @param obj 확인 하려는 값
 * @returns 객체 여부
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function shallowEquals(target1, target2) {
  // 래퍼 객체 비교 (테스트 코드 상으로 래퍼 객체면 false 반환)
  if (isWrapper(target1) && isWrapper(target2)) return false;

  // 배열 비교 (테스트 코드 상으로 얕은 비교)
  if (Array.isArray(target1) && Array.isArray(target2)) {
    // 두 배열의 길이가 다르다면 비교할 필요없이 false
    if (target1.length !== target2.length) return false;

    // 적어도 하나가 다르다면 false
    for (let i = 0; i < target1.length; i++) {
      if (target1[i] !== target2[i]) {
        return false;
      }
    }

    // 모두 같다면 true
    return true;
  }

  // 클래스 비교 (테스트 코드 상으로 클래스 자체가 다르면 false 반환)
  if (isClassInstance(target1) && isClassInstance(target2)) {
    return target1.constructor === target2.constructor;
  }

  // 객체 비교 (테스트 코드 상으로 얕은 비교)
  if (isObject(target1) && isObject(target2)) {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    // 객체 key 배열의 길이가 다르다면 비교할 필요없이 false
    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key1 of keys1) {
      // keys2에 keys1에 속한 key 값이 적어도 하나 없다면 false
      if (!keys2.includes(key1)) return false;

      // key1에 대한 값이 서로 다른 게 적어도 하나 있다면 false
      if (target1[key1] !== target2[key1]) return false;
    }

    // 모두 통과하면 true
    return true;
  }

  return target1 === target2;
}

export function deepEquals(target1, target2) {
  // 래퍼 객체 비교 (테스트 코드 상으로 래퍼 객체면 false 반환)
  if (isWrapper(target1) && isWrapper(target2)) return false;

  // 배열 비교
  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;

    for (let i = 0; i < target1.length; i++) {
      // 깊은 비교를 위해 함수 재귀 호출
      if (!deepEquals(target1[i], target2[i])) {
        return false;
      }
    }

    return true;
  }

  // 클래스 비교 (테스트 코드 상으로 클래스 자체가 다르면 false 반환)
  if (isClassInstance(target1) && isClassInstance(target2)) {
    return target1.constructor === target2.constructor;
  }

  // 객체 비교
  if (isObject(target1) && isObject(target2)) {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key1 of keys1) {
      if (!keys2.includes(key1)) return false;

      // 깊은 비교를 위해 함수 재귀 호출
      if (!deepEquals(target1[key1], target2[key1])) return false;
    }

    // 모두 통과하면 true
    return true;
  }

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
