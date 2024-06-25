function isPrimitive(target) {
  // null, undefined, string, number, boolean, symbol, bigint
  return target !== Object(target);
}

// 생성자가 class로 시작하는 지 확인하여 클래스 인스턴스를 object와 구분하기 위함
function isClassInstance(target) {
  if (isPrimitive(target)) {
    return false;
  }

  let proto = Object.getPrototypeOf(target);

  while (proto) {
    const constructor = proto.constructor;

    if (constructor && typeof constructor === "function") {
      const constructorString = constructor.toString();
      if (/^class/.test(constructorString)) {
        return true;
      }
    }

    proto = Object.getPrototypeOf(proto);
  }

  return false;
}

export function shallowEquals(target1, target2) {
  // Primitive type은 === 사용
  if (isPrimitive(target1) || isPrimitive(target2)) {
    return target1 === target2;
  }

  // 내장 래퍼 객체 (String, Number, Boolean, Symbol, BigInt)
  if (
    [String, Number, Boolean, Symbol, BigInt].some(
      (type) => target1 instanceof type || target2 instanceof type
    )
  ) {
    return target1 === target2;
  }

  // 클래스 인스턴스의 경우 typeof, instanceof로 구분할 수 없어 별도 확인
  if (isClassInstance(target1) || isClassInstance(target2)) {
    return target1 === target2;
  }

  // object와 array
  if (
    Object.prototype.toString.call(target1).split(" ")[1].includes("Object") ||
    Object.prototype.toString.call(target1).split(" ")[1].includes("Array")
  ) {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let i = 0; i < keys1.length; i++) {
      const currentKey = keys1[i];
      if (target1[currentKey] !== target2[currentKey]) {
        return false;
      }
    }

    return true;
  }
}

export function deepEquals(target1, target2) {
  // Primitive type은 === 사용
  if (isPrimitive(target1) || isPrimitive(target2)) {
    return target1 === target2;
  }

  // 내장 래퍼 객체 (String, Number, Boolean, Symbol, BigInt)
  if (
    [String, Number, Boolean, Symbol, BigInt].some(
      (type) => target1 instanceof type || target2 instanceof type
    )
  ) {
    return target1 === target2;
  }

  // 클래스 인스턴스의 경우 typeof, instanceof로 구분할 수 없어 별도 확인
  if (isClassInstance(target1) || isClassInstance(target2)) {
    return target1 === target2;
  }

  // object와 array
  if (
    target1.toString() === "[object Object]" ||
    target2.toString() === "[object Object]" ||
    Array.isArray(target1) ||
    Array.isArray(target2)
  ) {
    const keys1 = Object.keys(target1);
    const keys2 = Object.keys(target2);

    // 동일 depth에서 key의 개수가 다른 경우 false
    if (keys1.length !== keys2.length) {
      return false;
    }

    // 동일 depth에서 key의 개수가 같은 경우, 각 key에 대해 재귀 호출
    for (let i = 0; i < keys1.length; i++) {
      const currentKey = keys1[i];
      // object / array 내에 다시 object, array가 존재하는 경우 해당 object, array를 다시 비교하기 위해 재귀 호출
      if (!deepEquals(target1[currentKey], target2[currentKey])) {
        return false;
      }
    }

    return true;
  }
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

// https://ko.javascript.info/object-toprimitive
export function createNumber3(n) {
  return {
    valueOf() {
      return n;
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    },
    [Symbol.toPrimitive](hint) {
      if (hint === "number") return n;
      if (hint === "string") return String(n);
      return n;
    },
  };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive
export class CustomNumber {
  static instances = new Map();

  constructor(value) {
    if (CustomNumber.instances.has(value)) {
      return CustomNumber.instances.get(value);
    }
    this.value = value;
    CustomNumber.instances.set(value, this);
  }

  toJSON() {
    return String(this.value);
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      return this.value;
    }
    if (hint === "string") {
      return String(this.value);
    }
    return this.value;
  }
}

/**
 *
 * @param {*} target {key: value}
 * @return {} target의 key, value를 그대로 가지되, 열거되지 않는 프로퍼티를 가진 객체를 반환
 */
export function createUnenumerableObject(target) {
  const unenumerableObject = structuredClone(target);
  for (const key in target) {
    Object.defineProperty(unenumerableObject, key, {
      enumerable: false,
    });
  }
  return unenumerableObject;
}

// below 5 functions will take target - object or array, callback - function
export function forEach(target, callback) {
  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i, target);
    }
  } else if (target !== null && typeof target === "object") {
    // unenumberalbe이기 때문에, length 프로퍼티를 제외한 key값을 추출
    const keys = Object.getOwnPropertyNames(target).filter(
      (key) => key !== "length"
    );
    for (let i = 0; i < keys.length; i++) {
      // key값이 숫자로 변환이 가능한 경우, 해당 key값을 숫자로 변환하여 callback 호출
      if (Number.isInteger(Number(keys[i]))) {
        callback(target[keys[i]], Number(keys[i]), target);
      } else {
        callback(target[keys[i]], keys[i]);
      }
    }
  }
}

export function map(target, callback) {
  const result = Array.isArray(target) || target instanceof NodeList ? [] : {};
  if (Array.isArray(result)) {
    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i], i, target));
    }
  } else {
    const keys = Object.getOwnPropertyNames(target).filter(
      (key) => key !== "length"
    );
    for (const key of keys) {
      result[key] = callback(target[key], key, target);
    }
  }

  return result;
}

export function filter(target, callback) {
  const result = Array.isArray(target) || target instanceof NodeList ? [] : {};
  if (Array.isArray(result)) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i, target)) {
        result.push(target[i]);
      }
    }
  } else {
    const keys = Object.getOwnPropertyNames(target).filter(
      (key) => key !== "length"
    );
    for (const key of keys) {
      if (callback(target[key], key, target)) {
        result[key] = target[key];
      }
    }
  }
  return result;
}

export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (!callback(target[i], i, target)) {
        return false;
      }
    }
  } else {
    const keys = Object.getOwnPropertyNames(target).filter(
      (key) => key !== "length"
    );
    for (const key of keys) {
      if (!callback(target[key], key, target)) {
        return false;
      }
    }
  }
  return true;
}

export function some(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i], i, target)) {
        return true;
      }
    }
  } else {
    const keys = Object.getOwnPropertyNames(target).filter(
      (key) => key !== "length"
    );
    for (const key of keys) {
      if (callback(target[key], key, target)) {
        return true;
      }
    }
  }
  return false;
}
