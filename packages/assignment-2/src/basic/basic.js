export function shallowEquals(target1, target2) {
  // 참조가 동일한 경우 true 반환
  if (target1 === target2) {
    return true;
  }

  // 하나라도 객체가 아닌 경우 false 반환
  if (
    typeof target1 !== "object" ||
    target1 === null ||
    typeof target2 !== "object" ||
    target2 === null
  ) {
    return false;
  }

  // 원시 래퍼 객체의 경우 false 반환
  if (
    target1 instanceof Number ||
    target1 instanceof String ||
    target2 instanceof Number ||
    target2 instanceof String
  ) {
    return false;
  }

  // 서로 다른 생성자의 인스턴스인 경우 false 반환
  if (target1.constructor !== target2.constructor) {
    return false;
  }

  // 객체의 키를 배열로 변환
  const keys1 = Object.keys(target1);
  const keys2 = Object.keys(target2);

  // 키의 길이가 다르면 false 반환
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 각 키와 그 값을 비교
  for (let key of keys1) {
    if (
      !Object.prototype.hasOwnProperty.call(target2, key) ||
      target1[key] !== target2[key]
    ) {
      return false;
    }
  }
  return true;
}

export function deepEquals(target1, target2) {
  // 두 값이 엄격하게 같은 경우 (원시 타입과 참조 동일성 처리)
  if (target1 === target2) return true;

  // NaN 동등성 검사
  if (Number.isNaN(target1) && Number.isNaN(target2)) return true;

  // null 또는 undefined 확인
  if (target1 == null || target2 == null) return target1 === target2;

  // 원시 래퍼 객체의 경우 false 반환
  if (
    target1 instanceof Number ||
    target1 instanceof String ||
    target2 instanceof Number ||
    target2 instanceof String
  ) {
    return false;
  }

  // 같은 클래스의 인스턴스이지만 단순 객체가 아닌 경우 확인
  if (target1.constructor !== target2.constructor) {
    return false;
  }

  if (typeof target1 !== "object" && typeof b !== "object") {
    return target1 === target2;
  }

  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;
    for (let i = 0; i < target1.length; i++) {
      if (!deepEquals(target1[i], target2[i])) return false;
    }
    return true;
  }

  if (typeof target1 === "object" && typeof target2 === "object") {
    const aKeys = Object.keys(target1);
    const bKeys = Object.keys(target2);
    if (aKeys.length !== bKeys.length) return false;
    for (let key of aKeys) {
      if (
        !Object.prototype.hasOwnProperty.call(target2, key) ||
        !deepEquals(target1[key], target2[key])
      )
        return false;
    }
    return true;
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
    value: n,
    valueOf() {
      return this.value;
    },
    toString() {
      return String(this.value);
    },
    toJSON() {
      return `this is createNumber3 => ${this.value}`;
    },
  };
}

// 값을 캐싱하기 위한 Map 객체 생성
const cache = new Map();

export class CustomNumber {
  constructor(value) {
    // 값이 캐시에 존재하면 캐시된 인스턴스를 반환
    if (cache.has(value)) {
      return cache.get(value);
    }

    // 값이 캐시에 존재하지 않으면 새로운 인스턴스를 생성
    this.value = value;

    // 새로운 인스턴스를 캐시에 저장
    cache.set(value, this);
  }

  // 숫자 값으로 변환될 때 내부 숫자 값을 반환
  valueOf() {
    return this.value;
  }

  // 문자열로 변환될 때 내부 숫자 값을 문자열로 반환
  toString() {
    return String(this.value);
  }

  // JSON.stringify 호출 시 내부 숫자 값을 문자열로 반환
  toJSON() {
    return String(this.value);
  }
}

export function createUnenumerableObject(target) {
  const newTarget = {};
  for (const key in target) {
    Object.defineProperty(newTarget, key, {
      value: target[key],
      enumerable: false, // 비열거하도록 설정
      writable: true,
      configurable: true,
    });
  }
  return newTarget;
}

// JavaScript의 forEach 메소드는 배열의 각 요소에 대해 제공된 콜백 함수를 한 번씩 호출하는 함수
export function forEach(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 NodeList의 경우
    for (let i = 0; i < target.length; i++) {
      if (i in target) {
        callback(target[i], i, target);
      }
    }
  } else if (typeof target === "object" && target !== null) {
    // 객체의 경우 (열거 불가능한 속성 포함)
    // enumerable: false 속성을 가진 객체의 속성들은 일반적인 for...in 루프나 Object.keys 메서드로는 접근할 수 없다.
    // 하지만, Object.getOwnPropertyNames 메서드를 사용하면 객체의 모든 속성(열거 가능한 것과 불가능한 것 모두)에 접근할 수 있습니다.
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      callback(target[key], key, target);
    }
  } else {
    throw new TypeError("First argument must be an array, NodeList, or object");
  }
}

export function map(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 NodeList의 경우
    const result = [];
    for (let i = 0; i < target.length; i++) {
      if (i in target) {
        result.push(callback(target[i], i, target));
      }
    }
    return result;
  } else if (typeof target === "object" && target !== null) {
    // 객체의 경우 (열거 불가능한 속성 포함)
    const result = {};
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      result[key] = callback(target[key], key, target);
    }
    return result;
  } else {
    throw new TypeError("First argument must be an array, NodeList, or object");
  }
}

export function filter(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 NodeList의 경우
    const result = [];
    for (let i = 0; i < target.length; i++) {
      if (i in target && callback(target[i], i, target)) {
        result.push(target[i]);
      }
    }
    return result;
  } else if (typeof target === "object" && target !== null) {
    // 객체의 경우 (열거 불가능한 속성 포함)
    const result = {};
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      if (callback(target[key], key, target)) {
        result[key] = target[key];
      }
    }
    return result;
  } else {
    throw new TypeError("First argument must be an array, NodeList, or object");
  }
}

export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 NodeList의 경우
    for (let i = 0; i < target.length; i++) {
      if (i in target && !callback(target[i], i, target)) {
        return false;
      }
    }
    return true;
  } else if (typeof target === "object" && target !== null) {
    // 객체의 경우 (열거 불가능한 속성 포함)
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      if (!callback(target[key], key, target)) {
        return false;
      }
    }
    return true;
  } else {
    throw new TypeError("First argument must be an array, NodeList, or object");
  }
}

export function some(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    // 배열 또는 NodeList의 경우
    for (let i = 0; i < target.length; i++) {
      if (i in target && callback(target[i], i, target)) {
        return true;
      }
    }
    return false;
  } else if (typeof target === "object" && target !== null) {
    // 객체의 경우 (열거 불가능한 속성 포함)
    const keys = Object.getOwnPropertyNames(target);
    for (const key of keys) {
      if (callback(target[key], key, target)) {
        return true;
      }
    }
    return false;
  } else {
    throw new TypeError("First argument must be an array, NodeList, or object");
  }
}
