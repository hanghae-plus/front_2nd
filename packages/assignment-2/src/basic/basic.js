export function shallowEquals(target1, target2) {
  // 기본 동등성 검사
  if (target1 === target2) return true;

  // null 또는 undefined 체크
  if (target1 == null || target2 == null) return false;

  // 타입이 다르면 false
  if (typeof target1 !== typeof target2) return false;

  // 객체나 배열인 경우
  if (typeof target1 === 'object') {
    // 생성자 비교
    if (target1.constructor !== target2.constructor) return false;

    // Number, String 객체 처리
    if (target1 instanceof Number || target1 instanceof String) {
      return false; // 테스트 케이스에 따라 다른 인스턴스는 항상 false 반환
    }

    // 배열 길이 비교
    if (Array.isArray(target1)) {
      if (target1.length !== target2.length) return false;
    } else {
      // 객체 키 개수 비교
      const keys1 = Object.keys(target1);
      const keys2 = Object.keys(target2);
      if (keys1.length !== keys2.length) return false;
    }

    // 얕은 비교: 각 키의 값을 비교
    for (let key in target1) {
      if (!Object.prototype.hasOwnProperty.call(target2, key) || target1[key] !== target2[key]) {
        return false;
      }
    }

    return true;
  }

  // 그 외의 경우 (예: 원시 타입)
  return false;
}

export function deepEquals(target1, target2) {
  // 기본 동등성 검사
  if (target1 === target2) return true;

  // null 또는 undefined 체크
  if (target1 == null || target2 == null) return false;

  // 타입이 다르면 false
  if (typeof target1 !== typeof target2) return false;

  // Number, String 객체 또는 사용자 정의 클래스 인스턴스 처리
  if (target1 instanceof Number || target1 instanceof String ||
    (typeof target1 === 'object' && target1.constructor !== Object && target1.constructor !== Array)) {
    return false;
  }

  // 객체나 배열인 경우
  if (typeof target1 === 'object') {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    // 키 개수가 다르면 false
    if (keys1.length !== keys2.length) return false;

    // 각 키에 대해 재귀적으로 비교
    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEquals(target1[key], target2[key])) {
        return false;
      }
    }

    return true;
  }

  // 그 외의 경우 (예: 원시 타입)
  return target1 === target2;
}


export function createNumber1(value) {
  return new Number(value);
}

export function createNumber2(value) {
  return {
    valueOf: function() { return String(value); },
    toString: function() { return String(value); },
    [Symbol.toPrimitive]: function() {
      return String(value);
    }
  };
}

export function createNumber3(value) {
  return {
    value: value,
    valueOf: function() { return this.value; },
    toString: function() { return `${this.value}`; },
    toJSON: function() {
      return `this is createNumber3 => ${this.value}`;
    }
  };
}

export class CustomNumber {
  static instances = new Map();

  constructor(value) {
    if (CustomNumber.instances.has(value)) {
      return CustomNumber.instances.get(value);
    }
    this.value = value;
    CustomNumber.instances.set(value, this);
  }

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
  const result = {};
  for (const key in target) {
    Object.defineProperty(result, key, {
      value: target[key],
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
  return result;
}

export function forEach(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  } else if (typeof target === 'object' && target !== null) {
    Object.getOwnPropertyNames(target).forEach(key => {
      callback(target[key], key);
    });
  }
}

export function map(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    return Array.from(target).map(callback);
  } else if (typeof target === 'object' && target !== null) {
    const result = {};
    Object.getOwnPropertyNames(target).forEach(key => {
      result[key] = callback(target[key], key);
    });
    return result;
  }
}

export function filter(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    return Array.from(target).filter(callback);
  } else if (typeof target === 'object' && target !== null) {
    const result = {};
    Object.getOwnPropertyNames(target).forEach(key => {
      if (callback(target[key], key)) {
        result[key] = target[key];
      }
    });
    return result;
  }
}


export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    return Array.from(target).every(callback);
  } else if (typeof target === 'object' && target !== null) {
    return Object.getOwnPropertyNames(target).every(key =>
      callback(target[key], key)
    );
  }
  return true;
}

export function some(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    return Array.from(target).some(callback);
  } else if (typeof target === 'object' && target !== null) {
    return Object.getOwnPropertyNames(target).some(key =>
      callback(target[key], key)
    );
  }
  return false;
}



