export function shallowEquals(target1, target2) {
  // 원시 타입이나 함수의 경우 엄격한 동등 비교
  if (
    typeof target1 !== "object" ||
    typeof target2 !== "object" ||
    target1 === null ||
    target2 === null
  ) {
    return Object.is(target1, target2);
  }

  // 참조가 같은 경우 (동일한 객체인 경우)
  if (target1 === target2) {
    return true;
  }

  // 생성자가 다른 경우
  if (target1.constructor !== target2.constructor) {
    return false;
  }

  if (Array.isArray(target1)) {
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

  if (target1.constructor === Object) {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);
    if (keys1.length !== keys2.length) {
      return false;
    }
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

  // 다른 모든 객체 타입의 경우
  return false;
}

export function deepEquals(target1, target2) {
  // 기본 비교
  if (target1 === target2) return true;

  // null 또는 undefined 체크
  if (target1 == null || target2 == null) return false;

  // 타입 체크
  if (typeof target1 !== typeof target2) return false;

  // 객체 또는 배열인 경우
  if (typeof target1 === "object") {
    // new Number(), new String(), new 커스텀 클래스 등의 경우
    if (target1.constructor !== Object && target1.constructor !== Array) {
      return false;
    }

    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!deepEquals(target1[key], target2[key])) return false;
    }

    return true;
  }

  // 기본 타입(문자열, 숫자 등)의 경우
  return target1 === target2;
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
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

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {}

export function map(target, callback) {}

export function filter(target, callback) {}

export function every(target, callback) {}

export function some(target, callback) {}
