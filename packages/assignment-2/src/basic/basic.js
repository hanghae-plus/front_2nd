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
  /** 아래 조건을 만족하기 위해서는 래퍼 객체여야 함
   *
   * expect(num1 === 1).toBe(false);
   * expect(num1 == 1).toBe(true);
   * expect(typeof num1 === 'number').toBe(false);
   * expect(typeof num1 === 'object').toBe(true);
   */
  return new Number(n);
}

export function createNumber2(n) {
  /** 아래 조건을 만족하기 위해서는 래퍼 객체여야 함
   *
   * expect(num1 === "1").toBe(false);
   * expect(num1 == "1").toBe(true);
   * expect(typeof num1 === 'string').toBe(false);
   * expect(typeof num1 === 'object').toBe(true);
   * expect(num1 instanceof Number).toBe(false);
   */
  return new String(n);
}

export function createNumber3(n) {
  /** 객체에 커스텀 메소드를 정의, 기존 메소드에 오버라이드 함 */
  return {
    valueOf() {
      return n;
    },
    toString() {
      return String(n);
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    },
  };
}

export class CustomNumber {
  /** 아래 조건을 만족시키기 위해 생성자를 싱글톤 패턴으로 사용하도록 함
   *
   * expect(num1).toBe(num3);
   * expect(num2).toBe(num4);
   */
  constructor(n) {
    // 만약 n에 대한 생성자가 있다면 같은 참조 값을 가지도록 함
    if (CustomNumber.instanceMap.has(n)) {
      return CustomNumber.instanceMap.get(n);
    }
    this.n = n;
    CustomNumber.instanceMap.set(n, this);
  }

  valueOf() {
    return this.n;
  }

  toString() {
    return String(this.n);
  }

  toJSON() {
    return `${this.n}`;
  }

  static instanceMap = new Map();
}

/** 불변 객체로 만드는 함수
 *
 * @link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 */
export function createUnenumerableObject(target) {
  const result = {};

  for (const key in target) {
    Object.defineProperty(result, key, {
      value: target[key],
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }

  return result;
}

/** 유사배열 확인 함수 */
function isArrayLike(obj) {
  if (obj == null) return false; // null 또는 undefined 인지 확인
  if (typeof obj !== 'object' && typeof obj !== 'function') return false; // 객체나 함수인지 확인
  if (isNaN(obj.length)) return false; // length 속성이 숫자인지 확인
  if (obj.length < 0) return false; // length 속성이 0 이상인지 확인
  if (!Number.isInteger(obj.length)) return false; // length 속성이 정수인지 확인

  return true;
}

export function forEach(target, callback) {
  // 1) 진짜 배열이거나 유사배열이면
  if (Array.isArray(target) || isArrayLike(target)) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  } else {
    // 2) 객체일 경우, 불변의 객체의 키를 가져오기 위해 getOwnPropertyNames 사용
    const keys = Object.getOwnPropertyNames(target);
    keys.forEach((key) => callback(target[key], key));
  }
}

export function map(target, callback) {
  // 1) 진짜 배열이거나 유사배열이면
  if (Array.isArray(target) || isArrayLike(target)) {
    const arr = Array.from(target);
    return arr.map((v) => callback(v));
  } else {
    // 2) 객체일 경우, 불변의 객체의 키를 가져오기 위해 getOwnPropertyNames 사용
    const keys = Object.getOwnPropertyNames(target);
    const result = {};
    keys.forEach((key) => {
      result[key] = callback(target[key]);
    });
    return result;
  }
}

export function filter(target, callback) {
  // 1) 진짜 배열이거나 유사배열이면
  if (Array.isArray(target) || isArrayLike(target)) {
    const arr = Array.from(target);
    return arr.filter((v) => callback(v));
  } else {
    // 2) 객체일 경우, 불변의 객체의 키를 가져오기 위해 getOwnPropertyNames 사용
    const keys = Object.getOwnPropertyNames(target);
    const result = {};
    keys.forEach((key) => {
      if (callback(target[key])) {
        result[key] = target[key];
      }
    });
    return result;
  }
}

export function every(target, callback) {
  // 1) 진짜 배열이거나 유사배열이면
  if (Array.isArray(target) || isArrayLike(target)) {
    const arr = Array.from(target);
    return arr.every((v) => callback(v));
  } else {
    // 2) 객체일 경우, 불변의 객체의 키를 가져오기 위해 getOwnPropertyNames 사용
    const keys = Object.getOwnPropertyNames(target);
    return keys.every((key) => callback(target[key]));
  }
}

export function some(target, callback) {
  // 1) 진짜 배열이거나 유사배열이면
  if (Array.isArray(target) || isArrayLike(target)) {
    const arr = Array.from(target);
    return arr.some((v) => callback(v));
  } else {
    // 2) 객체일 경우, 불변의 객체의 키를 가져오기 위해 getOwnPropertyNames 사용
    const keys = Object.getOwnPropertyNames(target);
    return keys.some((key) => callback(target[key]));
  }
}
