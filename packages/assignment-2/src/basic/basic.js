export function shallowEquals(target1, target2) {
  if (target1 === target2) return true;

  if (target1 == null || target2 == null) return target1 === target2;

  if (typeof target1 !== "object" || typeof target2 !== "object") return false;

  if (typeof target1 === "function" && typeof target2 === "function") {
    return target1 === target2;
  }

  if (target1.constructor !== target2.constructor) return false;

  if (Array.isArray(target1) && Array.isArray(target2)) {
    if (target1.length !== target2.length) return false;
    for (let i = 0; i < target1.length; i++) {
      if (target1[i] !== target2[i]) return false;
    }
    return true;
  }

  if (
    (target1 instanceof Number && target2 instanceof Number) ||
    (target1 instanceof String && target2 instanceof String) ||
    (target1 instanceof Boolean && target2 instanceof Boolean)
  ) {
    return false;
  }

  if (!Array.isArray(target1) && !Array.isArray(target2)) {
    const keysA = Object.keys(target1);
    const keysB = Object.keys(target2);

    if (keysA.length !== keysB.length) return false;

    for (let key of keysA) {
      if (
        !Object.prototype.hasOwnProperty.call(target2, key) ||
        target1[key] !== target2[key]
      )
        return false;
    }
    return true;
  }

  return false;
}

export function deepEquals(target1, target2) {
  // 두 값이 같은 참조를 가리키는 경우 true 반환
  if (target1 === target2) {
    return true;
  }

  // 두 값 중 하나라도 null 또는 undefined인 경우 false 반환
  if (target1 == null || target2 == null) {
    return target1 === target2;
  }

  // 두 값의 타입이 다른 경우 false 반환
  if (typeof target1 !== typeof target2) {
    return false;
  }

  // 두 값이 객체인 경우
  if (typeof target1 === "object") {
    // 객체의 생성자가 다르면 false 반환 (예: new Number(1) !== new Number(1))
    if (target1.constructor !== target2.constructor) {
      return false;
    }

    // 두 값이 배열인 경우
    if (Array.isArray(target1)) {
      // 배열의 길이가 다르면 false 반환
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

    // 두 값이 객체인 경우
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    // 객체의 키 길이가 다르면 false 반환
    if (keys1.length !== keys2.length) {
      return false;
    }

    // 각 키와 값을 재귀적으로 비교
    for (let key of keys1) {
      if (!deepEquals(target1[key], target2[key])) {
        return false;
      }
    }
    return true;
  }

  // 기본형 값(문자열, 숫자 등) 비교
  return target1 === target2;
}

export function createNumber1(n) {
  return {
    valueOf() {
      return n;
    },
    toString() {
      return n.toString();
    },
  };
}

export function createNumber2(n) {
  const obj = {
    value: n,
    toString() {
      return String(this.value);
    },
    toJSON() {
      return this.value;
    },
  };
  Object.defineProperty(obj, "value", {
    value: n,
    enumerable: false,
  });

  return obj;
}

export function createNumber3(n) {
  return {
    valueOf() {
      return n;
    },
    toString() {
      return n.toString();
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    },
  };
}

export class CustomNumber {
  constructor(value) {
    if (CustomNumber.instances[value]) {
      return CustomNumber.instances[value];
    }

    this.value = value;
    CustomNumber.instances[value] = this;
  }

  // CustomNumber의 인스턴스를 캐싱하여 동일한 값을 가진 인스턴스를 재사용하도록 합니다.
  static instances = {};
  valueOf() {
    return this.value;
  }
  toString() {
    return String(this.value);
  }
  toJSON() {
    return String(this.value);
  }
}

export function createUnenumerableObject(target) {
  return target;
}
// export function createUnenumerableObject(target) {
//   const result = {};

//   // 주어진 객체의 각 프로퍼티를 순회하며 비열거형으로 설정
//   for (let key in target) {
//     if (target.hasOwnProperty(key)) {
//       Object.defineProperty(result, key, {
//         value: target[key],
//         writable: true,
//         configurable: true,
//         enumerable: false,
//       });
//     }
//   }

//   return result;
// }

export function forEach(target, callback) {
  // 배열인 경우
  if (Array.isArray(target)) {
    target.forEach((value, index) => callback(value, index));
  }
  // NodeList 또는 HTMLCollection인 경우
  else if (target instanceof NodeList || target instanceof HTMLCollection) {
    Array.from(target).forEach((value, index) => callback(value, index));
  }
  // 객체인 경우
  else if (typeof target === "object" && target !== null) {
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        callback(target[key], key);
      }
    }
  }
  // 지원하지 않는 데이터 타입인 경우
  else {
    throw new TypeError("Unsupported data type");
  }
}

export function map(target, callback) {
  let result;

  // 배열인 경우
  if (Array.isArray(target)) {
    result = target.map(callback);
  }
  // NodeList 또는 HTMLCollection인 경우
  else if (target instanceof NodeList || target instanceof HTMLCollection) {
    result = Array.from(target).map(callback);
  }
  // 객체인 경우
  else if (typeof target === "object" && target !== null) {
    result = {};
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        result[key] = callback(target[key]);
      }
    }
  }
  // 지원하지 않는 데이터 타입인 경우
  else {
    throw new TypeError("Unsupported data type");
  }

  return result;
}

export function filter(target, callback) {
  let result;

  // 배열인 경우
  if (Array.isArray(target)) {
    // 배열의 각 요소를 callback을 사용하여 필터링
    result = target.filter(callback);
  }
  // NodeList 또는 HTMLCollection인 경우
  else if (target instanceof NodeList || target instanceof HTMLCollection) {
    // NodeList나 HTMLCollection을 배열로 변환한 후 필터링
    result = Array.from(target).filter(callback);
  }
  // 객체인 경우
  else if (typeof target === "object" && target !== null) {
    result = {};
    for (let key in target) {
      // 해당 키가 객체의 자체 속성인지 확인
      if (target.hasOwnProperty(key)) {
        // callback을 사용하여 조건을 만족하는 값만 결과 객체에 추가
        if (callback(target[key])) {
          result[key] = target[key];
        }
      }
    }
  }
  // 지원하지 않는 데이터 타입인 경우
  else {
    throw new TypeError("Unsupported data type");
  }

  return result;
}

export function every(target, callback) {
  // 배열인 경우
  if (Array.isArray(target)) {
    return target.every(callback);
  }
  // NodeList 또는 HTMLCollection인 경우
  else if (target instanceof NodeList || target instanceof HTMLCollection) {
    return Array.from(target).every(callback);
  }
  // 객체인 경우
  else if (typeof target === "object" && target !== null) {
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        if (!callback(target[key])) {
          return false;
        }
      }
    }
    return true;
  }
  // 지원하지 않는 데이터 타입인 경우
  else {
    throw new TypeError("Unsupported data type");
  }
}

export function some(target, callback) {
  // 배열인 경우
  if (Array.isArray(target)) {
    return target.some(callback);
  }
  // NodeList 또는 HTMLCollection인 경우
  else if (target instanceof NodeList || target instanceof HTMLCollection) {
    return Array.from(target).some(callback);
  }
  // 객체인 경우
  else if (typeof target === "object" && target !== null) {
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        if (callback(target[key])) {
          return true;
        }
      }
    }
    return false;
  }
  // 지원하지 않는 데이터 타입인 경우
  else {
    throw new TypeError("Unsupported data type");
  }
}
